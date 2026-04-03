<script setup lang="ts">
const props = defineProps<{ storeId: string }>()
const emit  = defineEmits<{ close: []; imported: [] }>()

const { importAds } = useShopeeAds()

type Step = 'pick' | 'importing' | 'result'
const step    = ref<Step>('pick')
const fileInputRef = ref<HTMLInputElement | null>(null)
const files   = ref<File[]>([])
const error   = ref<string | null>(null)
const dragging = ref(false)

const result = ref<{
  imported: number; skipped: number; total: number; errors: string[]
} | null>(null)

type PreviewRow = {
  date: string; adName: string; adType: string; cost: string;
  impressions: string; clicks: string; conversions: string; revenue: string
}

const previewData = ref<{ fileName: string; date: string; rows: PreviewRow[] }[]>([])
const previewLoading = ref(false)

// ── File handling ─────────────────────────────────────────────────────────────
function addFiles(newFiles: FileList | File[]) {
  const list = Array.from(newFiles).filter(
    f => /\.(csv|xlsx|xls)$/i.test(f.name) && !files.value.find(e => e.name === f.name)
  )
  files.value = [...files.value, ...list]
  error.value = null
  if (files.value.length) loadPreview()
}

function removeFile(i: number) {
  files.value = files.value.filter((_, idx) => idx !== i)
  previewData.value = previewData.value.filter((_, idx) => idx !== i)
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files) addFiles(input.files)
  input.value = ''
}

function onDrop(e: DragEvent) {
  dragging.value = false
  if (e.dataTransfer?.files) addFiles(e.dataTransfer.files)
}

// ── Preview ───────────────────────────────────────────────────────────────────
async function loadPreview() {
  previewLoading.value = true
  previewData.value    = []
  try {
    const XLSX = await import('xlsx').then(m => m.default ?? m)
    for (const file of files.value) {
      const buffer = await file.arrayBuffer()
      const wb     = XLSX.read(buffer, { type: 'array' })
      const ws     = wb.Sheets[wb.SheetNames[0]]
      const all    = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' }) as string[][]

      // Extract period date
      const periodeRow = all.find(r => String(r[0]).trim().toLowerCase() === 'periode')
      const periodeStr = periodeRow ? String(periodeRow[1]).trim() : '?'
      const dateLabel  = periodeStr.split(' - ')[0].trim()

      // Find header row
      const hIdx = all.findIndex(r => String(r[0]).trim().toLowerCase() === 'urutan')
      if (hIdx < 0) continue

      const headers = all[hIdx].map(h => String(h).trim())
      const col     = (name: string) => headers.findIndex(h => h === name)

      const C = {
        AD_NAME:     col('Nama Iklan'),
        AD_TYPE:     col('Jenis Iklan'),
        IMPRESSIONS: col('Dilihat'),
        CLICKS:      col('Jumlah Klik'),
        CONVERSIONS: col('Konversi'),
        REVENUE:     col('Omzet Penjualan'),
        COST:        col('Biaya'),
      }

      const fmt = (v: unknown) => {
        const n = Number(String(v).replace(/[^0-9.]/g, '') || 0)
        return new Intl.NumberFormat('id-ID').format(n)
      }

      const rows: PreviewRow[] = all
        .slice(hIdx + 1)
        .filter(r => r[0] !== '' && r[0] !== null && r[0] !== undefined)
        .slice(0, 8)
        .map(r => ({
          date:        dateLabel,
          adName:      String(r[C.AD_NAME]     ?? '').trim(),
          adType:      String(r[C.AD_TYPE]     ?? '').trim(),
          cost:        fmt(r[C.COST]),
          impressions: fmt(r[C.IMPRESSIONS]),
          clicks:      fmt(r[C.CLICKS]),
          conversions: String(r[C.CONVERSIONS] ?? '0'),
          revenue:     fmt(r[C.REVENUE]),
        }))

      previewData.value.push({ fileName: file.name, date: dateLabel, rows })
    }
  } catch {
    error.value = 'Gagal membaca file.'
  } finally {
    previewLoading.value = false
  }
}

// ── Import ────────────────────────────────────────────────────────────────────
async function doImport() {
  if (!files.value.length) { error.value = 'Pilih minimal satu file'; return }
  step.value = 'importing'
  try {
    const res  = await importAds(props.storeId, files.value)
    result.value = res
    step.value   = 'result'
  } catch (e: unknown) {
    error.value = (e as { data?: { message?: string } }).data?.message ?? 'Import gagal'
    step.value  = 'pick'
  }
}

function handleDone() { emit('imported'); emit('close') }
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col">

      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div>
          <h2 class="text-base font-bold text-gray-900">Import Ads Shopee</h2>
          <p class="text-xs text-gray-400 mt-0.5">Upload satu atau beberapa file CSV/Excel dari Shopee Seller Centre</p>
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
            :class="dragging ? 'border-orange-400 bg-orange-50' : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'"
            @dragover.prevent="dragging = true"
            @dragleave="dragging = false"
            @drop.prevent="onDrop"
            @click="fileInputRef?.click()"
          >
            <svg class="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <div class="text-center">
              <p class="text-sm font-medium text-gray-700">Drag & drop atau klik untuk pilih file</p>
              <p class="text-xs text-gray-400 mt-0.5">CSV / Excel (.xlsx) dari Shopee Seller Centre · Bisa pilih banyak sekaligus</p>
            </div>
            <input ref="fileInputRef" type="file" accept=".csv,.xlsx,.xls" multiple class="hidden" @change="onFileChange">
          </div>

          <!-- File list -->
          <div v-if="files.length" class="space-y-1.5">
            <div
              v-for="(f, i) in files"
              :key="f.name"
              class="flex items-center gap-3 px-3 py-2 bg-orange-50 rounded-lg border border-orange-100"
            >
              <svg class="w-4 h-4 text-orange-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
              </svg>
              <span class="text-sm text-gray-700 flex-1 truncate">{{ f.name }}</span>
              <span class="text-xs text-gray-400">{{ (f.size / 1024).toFixed(0) }} KB</span>
              <button class="p-1 text-gray-400 hover:text-red-500 transition-colors" @click.stop="removeFile(i)">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Error -->
          <p v-if="error" class="text-sm text-red-500 text-center">{{ error }}</p>

          <!-- Preview loading -->
          <div v-if="previewLoading" class="flex justify-center py-4">
            <svg class="animate-spin h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          </div>

          <!-- Preview tables -->
          <div v-else-if="previewData.length" class="space-y-4">
            <div v-for="pf in previewData" :key="pf.fileName" class="space-y-1.5">
              <div class="flex items-center gap-2">
                <p class="text-xs font-semibold text-gray-600 truncate">{{ pf.fileName }}</p>
                <span class="text-xs text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">{{ pf.date }}</span>
              </div>
              <div class="overflow-x-auto rounded-xl border border-gray-100">
                <table class="w-full text-xs min-w-[640px]">
                  <thead class="bg-gray-50">
                    <tr class="text-gray-500">
                      <th class="px-3 py-2 text-left font-medium">Nama Iklan</th>
                      <th class="px-3 py-2 text-left font-medium">Jenis</th>
                      <th class="px-3 py-2 text-right font-medium">Biaya</th>
                      <th class="px-3 py-2 text-right font-medium">Dilihat</th>
                      <th class="px-3 py-2 text-right font-medium">Klik</th>
                      <th class="px-3 py-2 text-right font-medium">Konversi</th>
                      <th class="px-3 py-2 text-right font-medium">Omzet</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-50">
                    <tr v-for="(r, i) in pf.rows" :key="i" class="hover:bg-gray-50">
                      <td class="px-3 py-2 text-gray-700 max-w-[160px] truncate" :title="r.adName">{{ r.adName }}</td>
                      <td class="px-3 py-2 text-gray-500">{{ r.adType || '-' }}</td>
                      <td class="px-3 py-2 text-right text-red-500">{{ r.cost }}</td>
                      <td class="px-3 py-2 text-right text-gray-600">{{ r.impressions }}</td>
                      <td class="px-3 py-2 text-right text-gray-600">{{ r.clicks }}</td>
                      <td class="px-3 py-2 text-right text-gray-700">{{ r.conversions }}</td>
                      <td class="px-3 py-2 text-right text-green-600 font-medium">{{ r.revenue }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </template>

        <!-- Step: importing -->
        <template v-else-if="step === 'importing'">
          <div class="flex flex-col items-center justify-center py-12 gap-4">
            <svg class="animate-spin h-10 w-10 text-orange-400" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <p class="text-sm text-gray-500">Sedang mengimport {{ files.length }} file...</p>
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
        >Tutup</button>

        <button
          v-if="step === 'pick'"
          :disabled="!files.length"
          class="px-5 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          @click="doImport"
        >Import {{ files.length ? `(${files.length} file)` : '' }}</button>

        <button
          v-else-if="step === 'result'"
          class="px-5 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors"
          @click="handleDone"
        >Selesai</button>
      </div>
    </div>
  </div>
</template>
