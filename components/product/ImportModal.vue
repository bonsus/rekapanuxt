<script setup lang="ts">
import { useApi } from '~/composables/useApi'

const props = defineProps<{ storeId: string }>()
const emit = defineEmits<{ close: []; imported: [] }>()

const { fetchWithAuth } = useApi()

// ── State ────────────────────────────────────────────────────────────────────
type Step = 'pick' | 'preview' | 'result'
const step = ref<Step>('pick')
const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const dragOver = ref(false)

interface PreviewRow {
  product_id: string
  product_name: string
  category: string
  sku_id: string
  variation_value: string
  price: number
  seller_sku: string
}

const previewRows = ref<PreviewRow[]>([])
const parseError = ref<string | null>(null)
const importing = ref(false)

interface ImportResult {
  imported: number
  updated: number
  total: number
  skuCount: number
  errors: string[]
}
const result = ref<ImportResult | null>(null)

// ── File handling ─────────────────────────────────────────────────────────────
function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) processFile(file)
}

function onDrop(e: DragEvent) {
  dragOver.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) processFile(file)
}

async function processFile(file: File) {
  const ext = file.name.split('.').pop()?.toLowerCase()
  if (!['xlsx', 'xls'].includes(ext ?? '')) {
    parseError.value = 'Hanya file .xlsx atau .xls yang didukung'
    return
  }
  selectedFile.value = file
  parseError.value = null
  await previewFile(file)
}

async function previewFile(file: File) {
  try {
    const XLSX = await import('xlsx')
    const buffer = await file.arrayBuffer()
    const wb = XLSX.read(buffer, { type: 'array' })
    const ws = wb.Sheets[wb.SheetNames[0]]
    const rawRows = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1, defval: '' }) as string[][]

    const keys = rawRows[0]
    const colIndex = {
      product_id: keys.indexOf('product_id'),
      category: keys.indexOf('category'),
      product_name: keys.indexOf('product_name'),
      sku_id: keys.indexOf('sku_id'),
      variation_value: keys.indexOf('variation_value'),
      price: keys.indexOf('price'),
      seller_sku: keys.indexOf('seller_sku'),
    }

    if (colIndex.product_id === -1 || colIndex.product_name === -1) {
      parseError.value = 'Format file tidak sesuai template TikTok Shop. Pastikan menggunakan file ekspor produk TikTok.'
      return
    }

    const dataRows = rawRows.slice(5).filter((row) => row[colIndex.product_id])

    previewRows.value = dataRows.map((row) => ({
      product_id: String(row[colIndex.product_id] ?? '').trim(),
      category: String(row[colIndex.category] ?? '').replace(/\s*\(\d+\)\s*$/, '').trim(),
      product_name: String(row[colIndex.product_name] ?? '').trim(),
      sku_id: String(row[colIndex.sku_id] ?? '').trim(),
      variation_value: String(row[colIndex.variation_value] ?? '').trim(),
      price: parseFloat(String(row[colIndex.price] ?? '0')) || 0,
      seller_sku: String(row[colIndex.seller_sku] ?? '').trim(),
    }))

    if (previewRows.value.length === 0) {
      parseError.value = 'File tidak memiliki data produk'
      return
    }

    step.value = 'preview'
  } catch {
    parseError.value = 'Gagal membaca file. Pastikan file tidak rusak.'
  }
}

// Unique product count from preview
const productCount = computed(() => {
  const ids = new Set(previewRows.value.map((r) => r.product_id))
  return ids.size
})

// ── Import ────────────────────────────────────────────────────────────────────
async function doImport() {
  if (!selectedFile.value) return
  importing.value = true

  try {
    const form = new FormData()
    form.append('storeId', props.storeId)
    form.append('file', selectedFile.value)

    const res = await fetchWithAuth<ImportResult>('/api/products/import', {
      method: 'POST',
      body: form as unknown as Record<string, unknown>,
    })

    if (res) {
      result.value = res
      step.value = 'result'
    }
  } catch (err: unknown) {
    const e = err as { data?: { message?: string }; message?: string }
    parseError.value = e.data?.message ?? e.message ?? 'Import gagal'
  } finally {
    importing.value = false
  }
}

function reset() {
  step.value = 'pick'
  selectedFile.value = null
  previewRows.value = []
  parseError.value = null
  result.value = null
  if (fileInput.value) fileInput.value.value = ''
}

function finish() {
  emit('imported')
  emit('close')
}
</script>

<template>
  <!-- Step: Pick file -->
  <div v-if="step === 'pick'" class="space-y-4">
    <p class="text-sm text-gray-500">
      Upload file <span class="font-medium text-gray-700">.xlsx</span> hasil ekspor produk dari
      <span class="font-medium text-gray-700">TikTok Shop Seller Center</span>.
    </p>

    <!-- Drop zone -->
    <div
      class="relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer"
      :class="dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'"
      @click="fileInput?.click()"
      @dragover.prevent="dragOver = true"
      @dragleave="dragOver = false"
      @drop.prevent="onDrop"
    >
      <svg class="w-10 h-10 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
      </svg>
      <p class="text-sm font-medium text-gray-700">Klik untuk pilih file atau drag & drop</p>
      <p class="text-xs text-gray-400 mt-1">Format: .xlsx, .xls (max 10 MB)</p>
      <input ref="fileInput" type="file" accept=".xlsx,.xls" class="hidden" @change="onFileChange" />
    </div>

    <!-- Error -->
    <p v-if="parseError" class="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{{ parseError }}</p>

    <div class="flex justify-end gap-3 pt-1">
      <button
        class="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
        @click="emit('close')"
      >Batal</button>
    </div>
  </div>

  <!-- Step: Preview -->
  <div v-else-if="step === 'preview'" class="space-y-4">
    <div class="flex items-center gap-3 text-sm">
      <span class="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6M4 21h16" />
        </svg>
        {{ productCount }} produk
      </span>
      <span class="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
        {{ previewRows.length }} SKU
      </span>
      <span class="text-gray-400 truncate max-w-[180px]">{{ selectedFile?.name }}</span>
    </div>

    <!-- Preview table -->
    <div class="overflow-auto max-h-72 rounded-lg border border-gray-200">
      <table class="min-w-full text-xs">
        <thead class="bg-gray-50 sticky top-0">
          <tr>
            <th class="px-3 py-2 text-left font-medium text-gray-500 whitespace-nowrap">Nama Produk</th>
            <th class="px-3 py-2 text-left font-medium text-gray-500 whitespace-nowrap">Kategori</th>
            <th class="px-3 py-2 text-left font-medium text-gray-500 whitespace-nowrap">Variasi</th>
            <th class="px-3 py-2 text-right font-medium text-gray-500 whitespace-nowrap">Harga</th>
            <th class="px-3 py-2 text-left font-medium text-gray-500 whitespace-nowrap">SKU</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            v-for="(row, i) in previewRows"
            :key="i"
            class="hover:bg-gray-50"
          >
            <td class="px-3 py-2 text-gray-800 max-w-[200px] truncate">{{ row.product_name }}</td>
            <td class="px-3 py-2 text-gray-500 whitespace-nowrap">{{ row.category || '-' }}</td>
            <td class="px-3 py-2 text-gray-600 whitespace-nowrap">{{ row.variation_value || '-' }}</td>
            <td class="px-3 py-2 text-right text-gray-800 whitespace-nowrap">
              {{ row.price.toLocaleString('id-ID') }}
            </td>
            <td class="px-3 py-2 text-gray-500 font-mono whitespace-nowrap">{{ row.seller_sku || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-if="parseError" class="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{{ parseError }}</p>

    <p class="text-xs text-gray-500">
      Produk yang sudah ada akan diperbarui (nama, kategori, harga). HPP tidak akan berubah.
    </p>

    <div class="flex justify-between gap-3 pt-1">
      <button
        class="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
        @click="reset"
      >Ganti File</button>
      <div class="flex gap-2">
        <button
          class="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
          @click="emit('close')"
        >Batal</button>
        <button
          class="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition"
          :disabled="importing"
          @click="doImport"
        >
          <svg v-if="importing" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          {{ importing ? 'Mengimpor...' : 'Import Sekarang' }}
        </button>
      </div>
    </div>
  </div>

  <!-- Step: Result -->
  <div v-else-if="step === 'result' && result" class="space-y-4">
    <div class="rounded-xl bg-green-50 border border-green-200 p-4 space-y-2">
      <div class="flex items-center gap-2 text-green-700 font-semibold">
        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        Import selesai
      </div>
      <div class="grid grid-cols-3 gap-3 text-sm">
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600">{{ result.imported }}</div>
          <div class="text-gray-500 text-xs">Produk baru</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600">{{ result.updated }}</div>
          <div class="text-gray-500 text-xs">Diperbarui</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-gray-600">{{ result.skuCount }}</div>
          <div class="text-gray-500 text-xs">Total SKU</div>
        </div>
      </div>
    </div>

    <!-- Errors if any -->
    <div v-if="result.errors.length > 0" class="rounded-xl bg-red-50 border border-red-200 p-3">
      <p class="text-sm font-medium text-red-700 mb-1">{{ result.errors.length }} produk gagal diimport:</p>
      <ul class="text-xs text-red-600 space-y-0.5 max-h-28 overflow-y-auto">
        <li v-for="(err, i) in result.errors" :key="i">• {{ err }}</li>
      </ul>
    </div>

    <div class="flex justify-end gap-3">
      <button
        class="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
        @click="reset"
      >Import Lagi</button>
      <button
        class="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        @click="finish"
      >Selesai</button>
    </div>
  </div>
</template>
