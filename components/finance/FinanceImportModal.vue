<script setup lang="ts">
const props = defineProps<{ storeId: string }>()
const emit = defineEmits<{ close: []; imported: [] }>()

const { importFinance } = useFinance()

// ── State ────────────────────────────────────────────────────────────────────
type Step = 'pick' | 'importing' | 'result'
const step    = ref<Step>('pick')
const fileRef = ref<HTMLInputElement | null>(null)
const file    = ref<File | null>(null)
const error   = ref<string | null>(null)

const result = ref<{
  imported: number
  skipped: number
  updated: number
  total: number
  errors: string[]
} | null>(null)

// ── File pick ─────────────────────────────────────────────────────────────────
function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  file.value = input.files?.[0] ?? null
  error.value = null
}

// ── Preview data from file ────────────────────────────────────────────────────
const previewRows = ref<{ refId: string; type: string; date: string; net: string; source: string }[]>([])
const previewLoading = ref(false)

async function loadPreview() {
  if (!file.value) return
  previewLoading.value = true
  previewRows.value = []
  try {
    const XLSX = await import('xlsx').then(m => m.default ?? m)
    const buffer = await file.value.arrayBuffer()
    const wb = XLSX.read(buffer, { type: 'array' })
    const sheetName = wb.SheetNames.includes('Order details') ? 'Order details' : wb.SheetNames[0]
    const ws = wb.Sheets[sheetName]
    const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, defval: '' }) as unknown[][]

    const headers = (rows[0] as string[]).map(h => String(h).trim().toLowerCase())
    const col = (name: string) => headers.findIndex(h => h.includes(name.toLowerCase()))

    const cRefId      = col('order/adjustment id')
    const cType       = col('type')
    const cSettled    = col('order settled time')
    const cNet        = col('total settlement amount')
    const cSource     = col('order source')

    previewRows.value = rows.slice(1)
      .filter(r => r && String((r as unknown[])[0] ?? '').trim())
      .slice(0, 10)
      .map(r => {
        const row = r as unknown[]
        return {
          refId:  String(row[cRefId] ?? '').trim(),
          type:   String(row[cType]  ?? '').trim(),
          date:   String(row[cSettled] ?? '').trim(),
          net:    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })
            .format(Number(row[cNet] ?? 0)),
          source: cSource >= 0 ? String(row[cSource] ?? '').trim() || 'TikTok' : 'TikTok',
        }
      })
  } catch {
    error.value = 'Gagal membaca file'
  } finally {
    previewLoading.value = false
  }
}

watch(file, (f) => { if (f) loadPreview() })

// ── Import ────────────────────────────────────────────────────────────────────
async function handleImport() {
  if (!file.value) { error.value = 'Pilih file terlebih dahulu'; return }
  error.value = null
  step.value = 'importing'
  try {
    const res = await importFinance(props.storeId, file.value)
    result.value = res ?? { imported: 0, skipped: 0, updated: 0, total: 0, errors: [] }
    step.value = 'result'
  } catch (e: unknown) {
    error.value = (e as { data?: { message?: string } })?.data?.message ?? 'Import gagal'
    step.value = 'pick'
  }
}

function reset() {
  file.value = null
  previewRows.value = []
  result.value = null
  error.value = null
  step.value = 'pick'
  if (fileRef.value) fileRef.value.value = ''
}

function done() {
  emit('imported')
  emit('close')
}
</script>

<template>
  <AppModal
    :is-open="true"
    title="Import Finance TikTok"
    size="lg"
    @close="emit('close')"
  >
    <!-- Step: Pick file -->
    <div v-if="step === 'pick'" class="space-y-4">
      <div class="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 text-sm text-blue-700 space-y-1">
        <p class="font-medium">Format file yang didukung:</p>
        <ul class="list-disc list-inside text-xs space-y-0.5 text-blue-600">
          <li>File Excel TikTok Seller Center → Finance → Income / Settlement</li>
          <li>Sheet: <b>Order details</b></li>
          <li>Kolom wajib: Order/Adjustment ID, Type, Order settled time, Total settlement amount</li>
        </ul>
      </div>

      <!-- Drop zone -->
      <label
        class="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-8 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors"
        @dragover.prevent
        @drop.prevent="(e) => { const f = e.dataTransfer?.files?.[0]; if (f) { file = f; error = null; } }"
      >
        <svg class="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
        <span class="text-sm text-gray-500">
          {{ file ? file.name : 'Klik atau drag & drop file Excel TikTok' }}
        </span>
        <span class="text-xs text-gray-400">.xlsx / .xls</span>
        <input ref="fileRef" type="file" accept=".xlsx,.xls" class="hidden" @change="onFileChange">
      </label>

      <!-- Preview -->
      <div v-if="previewLoading" class="text-center text-sm text-gray-400 py-2">Membaca file...</div>
      <div v-else-if="previewRows.length > 0">
        <p class="text-xs text-gray-500 mb-2 font-medium">Preview (10 baris pertama):</p>
        <div class="overflow-x-auto rounded-xl border border-gray-100">
          <table class="w-full text-xs min-w-[500px]">
            <thead class="bg-gray-50 text-gray-500">
              <tr>
                <th class="px-3 py-2 text-left font-medium">Ref ID</th>
                <th class="px-3 py-2 text-left font-medium">Tipe</th>
                <th class="px-3 py-2 text-left font-medium">Tanggal</th>
                <th class="px-3 py-2 text-right font-medium">Net Settlement</th>
                <th class="px-3 py-2 text-left font-medium">Source</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="r in previewRows" :key="r.refId" class="hover:bg-gray-50/50">
                <td class="px-3 py-2 font-mono text-gray-600 max-w-[120px] truncate">{{ r.refId }}</td>
                <td class="px-3 py-2 text-gray-600">{{ r.type }}</td>
                <td class="px-3 py-2 text-gray-500">{{ r.date }}</td>
                <td class="px-3 py-2 text-right text-gray-700 font-medium">{{ r.net }}</td>
                <td class="px-3 py-2 text-gray-500">{{ r.source }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <p v-if="error" class="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{{ error }}</p>
    </div>

    <!-- Step: Importing -->
    <div v-else-if="step === 'importing'" class="flex flex-col items-center justify-center py-12 gap-4">
      <svg class="animate-spin h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
      <p class="text-sm text-gray-500">Mengimport data finance...</p>
    </div>

    <!-- Step: Result -->
    <div v-else-if="step === 'result' && result" class="space-y-4">
      <div class="grid grid-cols-4 gap-3">
        <div class="bg-blue-50 rounded-xl p-3 text-center">
          <p class="text-2xl font-bold text-blue-700">{{ result.total }}</p>
          <p class="text-xs text-blue-500 mt-0.5">Total Baris</p>
        </div>
        <div class="bg-green-50 rounded-xl p-3 text-center">
          <p class="text-2xl font-bold text-green-700">{{ result.imported }}</p>
          <p class="text-xs text-green-500 mt-0.5">Berhasil Import</p>
        </div>
        <div class="bg-purple-50 rounded-xl p-3 text-center">
          <p class="text-2xl font-bold text-purple-700">{{ result.updated }}</p>
          <p class="text-xs text-purple-500 mt-0.5">Order Diupdate</p>
        </div>
        <div class="bg-gray-50 rounded-xl p-3 text-center">
          <p class="text-2xl font-bold text-gray-500">{{ result.skipped }}</p>
          <p class="text-xs text-gray-400 mt-0.5">Dilewati (duplikat)</p>
        </div>
      </div>

      <div v-if="result.errors.length > 0" class="rounded-xl bg-red-50 border border-red-100 p-3">
        <p class="text-xs font-medium text-red-600 mb-1">Error ({{ result.errors.length }}):</p>
        <ul class="space-y-0.5 max-h-32 overflow-y-auto">
          <li v-for="err in result.errors" :key="err" class="text-xs text-red-500">{{ err }}</li>
        </ul>
      </div>

      <div v-if="result.imported > 0 || result.updated > 0" class="rounded-xl bg-green-50 border border-green-100 px-4 py-3 flex items-center gap-2 text-sm text-green-700">
        <svg class="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        Import selesai! {{ result.imported }} transaksi berhasil ditambahkan{{ result.updated > 0 ? `, ${result.updated} order diperbarui` : '' }}.
      </div>
    </div>

    <template #footer>
      <div class="flex gap-3 justify-end">
        <button
          class="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          @click="step === 'result' ? done() : emit('close')"
        >
          {{ step === 'result' ? 'Tutup' : 'Batal' }}
        </button>
        <button
          v-if="step === 'pick'"
          :disabled="!file"
          class="px-4 py-2 text-sm rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-50"
          @click="handleImport"
        >
          Import Finance
        </button>
        <button
          v-if="step === 'result'"
          class="px-4 py-2 text-sm rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
          @click="reset"
        >
          Import Lagi
        </button>
      </div>
    </template>
  </AppModal>
</template>
