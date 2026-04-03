<script setup lang="ts">
import type { Product } from '~/types'
import { useApi } from '~/composables/useApi'
import { useProducts } from '~/composables/useProducts'

const props = defineProps<{ storeId: string }>()
const emit = defineEmits<{ close: []; updated: [] }>()

const { fetchWithAuth, downloadWithAuth } = useApi()
const { getProducts } = useProducts()

// ── State ────────────────────────────────────────────────────────────────────
type Step = 'select' | 'upload' | 'preview' | 'result'
const step = ref<Step>('select')

// Step 1: product selection
const products = ref<Product[]>([])
const loadingProducts = ref(false)
const selectedIds = ref<Set<string>>(new Set())
const productSearch = ref('')
const downloading = ref(false)
const downloadError = ref<string | null>(null)

// Step 2-3: file upload + preview
const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const dragOver = ref(false)
const parseError = ref<string | null>(null)

interface PreviewRow {
  skuId: string
  namaProduk: string
  sku: string
  variasi: string
  hpp: number
}

const previewRows = ref<PreviewRow[]>([])
const uploading = ref(false)

// Step 4: result
interface ImportResult {
  updated: number
  skipped: number
  total: number
  errors: string[]
}
const result = ref<ImportResult | null>(null)

// ── Step 1: Load products ────────────────────────────────────────────────────
onMounted(async () => {
  loadingProducts.value = true
  const res = await getProducts({ storeId: props.storeId, limit: 200 })
  if (res) products.value = res.data
  loadingProducts.value = false
})

const filteredProducts = computed(() => {
  const q = productSearch.value.toLowerCase().trim()
  if (!q) return products.value
  return products.value.filter((p) => p.name.toLowerCase().includes(q))
})

function toggleAll() {
  if (selectedIds.value.size === filteredProducts.value.length) {
    filteredProducts.value.forEach((p) => selectedIds.value.delete(p.id))
  } else {
    filteredProducts.value.forEach((p) => selectedIds.value.add(p.id))
  }
}

const allSelected = computed(
  () => filteredProducts.value.length > 0 && filteredProducts.value.every((p) => selectedIds.value.has(p.id)),
)

async function downloadTemplate() {
  downloadError.value = null
  downloading.value = true
  try {
    const params: Record<string, unknown> = { storeId: props.storeId }
    if (selectedIds.value.size > 0) {
      params.productIds = Array.from(selectedIds.value).join(',')
    }
    await downloadWithAuth('/api/products/hpp-export', 'hpp_template.xlsx', params)
  } catch (err: unknown) {
    const e = err as { message?: string }
    downloadError.value = e.message ?? 'Gagal mengunduh template'
  } finally {
    downloading.value = false
  }
}

// ── Step 2: File handling ─────────────────────────────────────────────────────
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
  await parsePreview(file)
}

async function parsePreview(file: File) {
  try {
    const XLSX = await import('xlsx')
    const buffer = await file.arrayBuffer()
    const wb = XLSX.read(buffer, { type: 'array' })
    const ws = wb.Sheets[wb.SheetNames[0]]
    const rawRows = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1, defval: '' }) as string[][]

    if (rawRows.length < 2) {
      parseError.value = 'File tidak memiliki data'
      return
    }

    const headers = rawRows[0].map((h) => String(h).trim().toLowerCase())
    const colSkuId = headers.indexOf('sku_id')
    const colNama = headers.indexOf('nama_produk')
    const colSku = headers.indexOf('sku')
    const colVariasi = headers.indexOf('variasi')
    const colHpp = headers.indexOf('harga_hpp')

    if (colSkuId === -1 || colHpp === -1) {
      parseError.value = 'Format file tidak valid. Pastikan menggunakan template yang diunduh dari sistem.'
      return
    }

    const rows = rawRows
      .slice(1)
      .filter((row) => row[colSkuId] && String(row[colSkuId]).trim() !== '')
      .map((row) => ({
        skuId: String(row[colSkuId]).trim(),
        namaProduk: colNama !== -1 ? String(row[colNama] ?? '') : '',
        sku: colSku !== -1 ? String(row[colSku] ?? '') : '',
        variasi: colVariasi !== -1 ? String(row[colVariasi] ?? '') : '',
        hpp: parseFloat(String(row[colHpp] ?? '0')) || 0,
      }))

    if (rows.length === 0) {
      parseError.value = 'File tidak memiliki data SKU'
      return
    }

    previewRows.value = rows
    step.value = 'preview'
  } catch {
    parseError.value = 'Gagal membaca file. Pastikan file tidak rusak.'
  }
}

// ── Step 3: Upload ───────────────────────────────────────────────────────────
async function doImport() {
  if (!selectedFile.value) return
  uploading.value = true
  parseError.value = null

  try {
    const form = new FormData()
    form.append('storeId', props.storeId)
    form.append('file', selectedFile.value)

    const res = await fetchWithAuth<ImportResult>('/api/products/hpp-import', {
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
    uploading.value = false
  }
}

function backToUpload() {
  step.value = 'upload'
  selectedFile.value = null
  previewRows.value = []
  parseError.value = null
  if (fileInput.value) fileInput.value.value = ''
}

function finish() {
  emit('updated')
  emit('close')
}
</script>

<template>
  <!-- ── Step 1: Pilih produk + download ─────────────────────────────────── -->
  <div v-if="step === 'select'" class="space-y-4">
    <p class="text-sm text-gray-500">
      Pilih produk yang ingin diperbarui HPP-nya, lalu unduh template Excel. Edit kolom
      <span class="font-medium text-gray-700">harga_hpp</span>, kemudian upload kembali.
    </p>

    <!-- Search -->
    <div class="relative">
      <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
      </svg>
      <input v-model="productSearch" type="text" placeholder="Cari produk..." class="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>

    <!-- Product list -->
    <div class="border border-gray-200 rounded-lg overflow-hidden">
      <!-- Select all -->
      <div class="flex items-center gap-3 px-3 py-2 bg-gray-50 border-b border-gray-200">
        <input
          type="checkbox"
          :checked="allSelected"
          class="rounded text-blue-600"
          @change="toggleAll"
        />
        <span class="text-xs font-medium text-gray-600">
          {{ selectedIds.size === 0 ? 'Pilih semua (semua produk akan diunduh)' : `${selectedIds.size} produk dipilih` }}
        </span>
      </div>

      <div v-if="loadingProducts" class="py-8 text-center text-sm text-gray-400">Memuat produk...</div>
      <div v-else-if="filteredProducts.length === 0" class="py-8 text-center text-sm text-gray-400">Tidak ada produk</div>
      <ul v-else class="divide-y divide-gray-100 max-h-52 overflow-y-auto">
        <li
          v-for="product in filteredProducts"
          :key="product.id"
          class="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 cursor-pointer"
          @click="selectedIds.has(product.id) ? selectedIds.delete(product.id) : selectedIds.add(product.id)"
        >
          <input
            type="checkbox"
            :checked="selectedIds.has(product.id)"
            class="rounded text-blue-600 pointer-events-none"
          />
          <span class="text-sm text-gray-800 flex-1 truncate">{{ product.name }}</span>
          <span class="text-xs text-gray-400">{{ product._count?.skus ?? 0 }} SKU</span>
        </li>
      </ul>
    </div>

    <p v-if="downloadError" class="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{{ downloadError }}</p>

    <div class="flex justify-between gap-3 pt-1">
      <button
        class="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
        @click="emit('close')"
      >Batal</button>
      <div class="flex gap-2">
        <button
          class="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-50 disabled:opacity-60 transition"
          :disabled="downloading"
          @click="downloadTemplate"
        >
          <svg v-if="downloading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          {{ downloading ? 'Mengunduh...' : 'Unduh Template' }}
        </button>
        <button
          class="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          @click="step = 'upload'"
        >
          Upload File
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>

  <!-- ── Step 2: Upload file ──────────────────────────────────────────────── -->
  <div v-else-if="step === 'upload'" class="space-y-4">
    <p class="text-sm text-gray-500">
      Upload file Excel yang sudah diperbarui nilainya pada kolom
      <span class="font-medium text-gray-700">harga_hpp</span>.
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
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
      </svg>
      <p class="text-sm font-medium text-gray-700">Klik untuk pilih file atau drag & drop</p>
      <p class="text-xs text-gray-400 mt-1">Format: .xlsx, .xls</p>
      <input ref="fileInput" type="file" accept=".xlsx,.xls" class="hidden" @change="onFileChange" />
    </div>

    <p v-if="parseError" class="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{{ parseError }}</p>

    <div class="flex justify-between gap-3 pt-1">
      <button
        class="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
        @click="step = 'select'"
      >Kembali</button>
      <button
        class="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
        @click="emit('close')"
      >Batal</button>
    </div>
  </div>

  <!-- ── Step 3: Preview ──────────────────────────────────────────────────── -->
  <div v-else-if="step === 'preview'" class="space-y-4">
    <div class="flex items-center gap-3 text-sm">
      <span class="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
        {{ previewRows.length }} SKU
      </span>
      <span class="text-gray-400 truncate max-w-[240px]">{{ selectedFile?.name }}</span>
    </div>

    <!-- Preview table -->
    <div class="overflow-auto max-h-64 rounded-lg border border-gray-200">
      <table class="min-w-full text-xs">
        <thead class="bg-gray-50 sticky top-0">
          <tr>
            <th class="px-3 py-2 text-left font-medium text-gray-500 whitespace-nowrap">Nama Produk</th>
            <th class="px-3 py-2 text-left font-medium text-gray-500 whitespace-nowrap">SKU</th>
            <th class="px-3 py-2 text-left font-medium text-gray-500 whitespace-nowrap">Variasi</th>
            <th class="px-3 py-2 text-right font-medium text-gray-500 whitespace-nowrap">HPP Baru</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="(row, i) in previewRows" :key="i" class="hover:bg-gray-50">
            <td class="px-3 py-2 text-gray-800 max-w-[180px] truncate">{{ row.namaProduk }}</td>
            <td class="px-3 py-2 text-gray-500 font-mono">{{ row.sku || '-' }}</td>
            <td class="px-3 py-2 text-gray-600 whitespace-nowrap">{{ row.variasi || '-' }}</td>
            <td class="px-3 py-2 text-right font-semibold text-green-700 whitespace-nowrap">
              Rp {{ row.hpp.toLocaleString('id-ID') }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-if="parseError" class="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{{ parseError }}</p>

    <div class="flex justify-between gap-3 pt-1">
      <button
        class="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
        @click="backToUpload"
      >Ganti File</button>
      <div class="flex gap-2">
        <button
          class="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
          @click="emit('close')"
        >Batal</button>
        <button
          class="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-60 transition"
          :disabled="uploading"
          @click="doImport"
        >
          <svg v-if="uploading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          {{ uploading ? 'Menyimpan...' : 'Simpan HPP' }}
        </button>
      </div>
    </div>
  </div>

  <!-- ── Step 4: Result ───────────────────────────────────────────────────── -->
  <div v-else-if="step === 'result' && result" class="space-y-4">
    <div class="rounded-xl bg-green-50 border border-green-200 p-4 space-y-3">
      <div class="flex items-center gap-2 text-green-700 font-semibold">
        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        HPP berhasil diperbarui
      </div>
      <div class="grid grid-cols-3 gap-3 text-sm">
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600">{{ result.updated }}</div>
          <div class="text-gray-500 text-xs">SKU diperbarui</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-gray-400">{{ result.skipped }}</div>
          <div class="text-gray-500 text-xs">Dilewati</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-gray-600">{{ result.total }}</div>
          <div class="text-gray-500 text-xs">Total baris</div>
        </div>
      </div>
    </div>

    <div v-if="result.errors.length > 0" class="rounded-xl bg-red-50 border border-red-200 p-3">
      <p class="text-sm font-medium text-red-700 mb-1">{{ result.errors.length }} error:</p>
      <ul class="text-xs text-red-600 space-y-0.5 max-h-24 overflow-y-auto">
        <li v-for="(err, i) in result.errors" :key="i">• {{ err }}</li>
      </ul>
    </div>

    <div class="flex justify-end gap-3">
      <button
        class="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        @click="finish"
      >Selesai</button>
    </div>
  </div>
</template>
