<script setup lang="ts">
const props = defineProps<{ storeId: string }>()
const emit  = defineEmits<{ close: []; imported: [] }>()

const { importAds } = useTikTokAds()

type Step = 'pick' | 'importing' | 'result'
const step    = ref<Step>('pick')
const fileRef = ref<HTMLInputElement | null>(null)
const file    = ref<File | null>(null)
const error   = ref<string | null>(null)
const dragging = ref(false)

const result = ref<{
  imported: number
  skipped: number
  total: number
  errors: string[]
} | null>(null)

// ── Preview ───────────────────────────────────────────────────────────────────
type PreviewRow = { date: string; campaign: string; adGroup: string; cost: string; impressions: string; clicks: string; conversions: string; revenue: string }
const previewRows    = ref<PreviewRow[]>([])
const previewLoading = ref(false)

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  file.value  = input.files?.[0] ?? null
  error.value = null
  if (file.value) loadPreview()
}

function onDrop(e: DragEvent) {
  dragging.value = false
  const f = e.dataTransfer?.files?.[0]
  if (f) { file.value = f; error.value = null; loadPreview() }
}

async function loadPreview() {
  if (!file.value) return
  previewLoading.value = true
  previewRows.value = []
  try {
    const XLSX = await import('xlsx').then(m => m.default ?? m)
    const buffer = await file.value.arrayBuffer()
    const wb     = XLSX.read(buffer, { type: 'array' })
    const ws     = wb.Sheets[wb.SheetNames[0]]
    const rows   = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' }) as unknown[][]

    const headers = (rows[0] as string[]).map((h: unknown) => String(h).trim().toLowerCase())
    const col = (name: string) => headers.findIndex((h: string) => h.includes(name.toLowerCase()))

    const cDate     = col('by day')
    const cCampaign = col('campaign name')
    const cAdGroup  = col('ad group name')
    const cCost     = col('cost')
    const cImpr     = col('impressions')
    const cClicks   = col('clicks')
    const cConv     = col('conversions')
    const cRevenue  = col('gross revenue')

    previewRows.value = rows.slice(1)
      .filter(r => (r as unknown[])[cDate >= 0 ? cDate : 0])
      .slice(0, 10)
      .map(r => {
        const row = r as unknown[]
        const fmt = (n: unknown) => Number(n || 0).toLocaleString('id-ID')
        return {
          date:        String(row[cDate]     ?? '').trim(),
          campaign:    String(row[cCampaign] ?? '').trim(),
          adGroup:     String(row[cAdGroup]  ?? '').trim(),
          cost:        fmt(row[cCost]),
          impressions: fmt(row[cImpr]),
          clicks:      fmt(row[cClicks]),
          conversions: fmt(row[cConv]),
          revenue:     fmt(row[cRevenue]),
        }
      })
  } catch {
    error.value = 'Gagal membaca file. Pastikan format file benar.'
  } finally {
    previewLoading.value = false
  }
}

// ── Import ────────────────────────────────────────────────────────────────────
async function doImport() {
  if (!file.value) { error.value = 'Pilih file terlebih dahulu'; return }
  step.value = 'importing'
  try {
    const res = await importAds(props.storeId, file.value)
    result.value = res
    step.value   = 'result'
  } catch (e: unknown) {
    error.value = (e as { data?: { message?: string } }).data?.message ?? 'Import gagal'
    step.value  = 'pick'
  }
}

function handleDone() {
  emit('imported')
  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div>
          <h2 class="text-base font-bold text-gray-900">Import Ads TikTok</h2>
          <p class="text-xs text-gray-400 mt-0.5">Upload file Excel dari TikTok Ads Manager</p>
        </div>
        <button class="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors" @click="emit('close')">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="flex-1 overflow-y-auto px-6 py-5 space-y-4">

        <!-- Step: pick -->
        <template v-if="step === 'pick'">
          <!-- Drop zone -->
          <div
            class="border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 transition-colors cursor-pointer"
            :class="dragging ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'"
            @dragover.prevent="dragging = true"
            @dragleave="dragging = false"
            @drop.prevent="onDrop"
            @click="fileRef?.click()"
          >
            <svg class="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <div class="text-center">
              <p class="text-sm font-medium text-gray-700">
                {{ file ? file.name : 'Drag & drop atau klik untuk pilih file' }}
              </p>
              <p class="text-xs text-gray-400 mt-0.5">Excel (.xlsx / .xls) dari TikTok Ads Manager</p>
            </div>
            <input ref="fileRef" type="file" accept=".xlsx,.xls,.csv" class="hidden" @change="onFileChange">
          </div>

          <!-- Error -->
          <p v-if="error" class="text-sm text-red-500 text-center">{{ error }}</p>

          <!-- Preview -->
          <div v-if="previewLoading" class="flex justify-center py-4">
            <svg class="animate-spin h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          </div>

          <div v-else-if="previewRows.length" class="space-y-2">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Preview (10 baris pertama)</p>
            <div class="overflow-x-auto rounded-xl border border-gray-100">
              <table class="w-full text-xs min-w-[640px]">
                <thead class="bg-gray-50">
                  <tr class="text-gray-500">
                    <th class="px-3 py-2 text-left font-medium">Tanggal</th>
                    <th class="px-3 py-2 text-left font-medium">Campaign</th>
                    <th class="px-3 py-2 text-left font-medium">Ad Group</th>
                    <th class="px-3 py-2 text-right font-medium">Cost</th>
                    <th class="px-3 py-2 text-right font-medium">Impresi</th>
                    <th class="px-3 py-2 text-right font-medium">Klik</th>
                    <th class="px-3 py-2 text-right font-medium">Konversi</th>
                    <th class="px-3 py-2 text-right font-medium">Revenue</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                  <tr v-for="(r, i) in previewRows" :key="i" class="hover:bg-gray-50">
                    <td class="px-3 py-2 text-gray-600">{{ r.date }}</td>
                    <td class="px-3 py-2 text-gray-700 max-w-[120px] truncate">{{ r.campaign }}</td>
                    <td class="px-3 py-2 text-gray-700 max-w-[120px] truncate">{{ r.adGroup }}</td>
                    <td class="px-3 py-2 text-right text-gray-800">{{ r.cost }}</td>
                    <td class="px-3 py-2 text-right text-gray-600">{{ r.impressions }}</td>
                    <td class="px-3 py-2 text-right text-gray-600">{{ r.clicks }}</td>
                    <td class="px-3 py-2 text-right text-gray-600">{{ r.conversions }}</td>
                    <td class="px-3 py-2 text-right text-green-600 font-medium">{{ r.revenue }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>

        <!-- Step: importing -->
        <template v-else-if="step === 'importing'">
          <div class="flex flex-col items-center justify-center py-12 gap-4">
            <svg class="animate-spin h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <p class="text-sm text-gray-500">Sedang mengimport data ads...</p>
          </div>
        </template>

        <!-- Step: result -->
        <template v-else-if="step === 'result' && result">
          <div class="grid grid-cols-3 gap-3">
            <div class="bg-blue-50 rounded-xl p-4 text-center">
              <p class="text-2xl font-bold text-blue-600">{{ result.total }}</p>
              <p class="text-xs text-blue-500 mt-1">Total Baris</p>
            </div>
            <div class="bg-green-50 rounded-xl p-4 text-center">
              <p class="text-2xl font-bold text-green-600">{{ result.imported }}</p>
              <p class="text-xs text-green-500 mt-1">Berhasil Diimport</p>
            </div>
            <div class="bg-gray-50 rounded-xl p-4 text-center">
              <p class="text-2xl font-bold text-gray-500">{{ result.skipped }}</p>
              <p class="text-xs text-gray-400 mt-1">Diperbarui</p>
            </div>
          </div>
          <div v-if="result.errors.length" class="space-y-1">
            <p class="text-xs font-semibold text-red-500">{{ result.errors.length }} error:</p>
            <div class="bg-red-50 rounded-lg p-3 max-h-32 overflow-y-auto space-y-0.5">
              <p v-for="(e, i) in result.errors" :key="i" class="text-xs text-red-600">{{ e }}</p>
            </div>
          </div>
        </template>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
        <button
          class="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          @click="emit('close')"
        >
          Tutup
        </button>
        <button
          v-if="step === 'pick'"
          :disabled="!file"
          class="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          @click="doImport"
        >
          Import
        </button>
        <button
          v-else-if="step === 'result'"
          class="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          @click="handleDone"
        >
          Selesai
        </button>
      </div>
    </div>
  </div>
</template>
