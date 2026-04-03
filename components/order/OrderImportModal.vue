<script setup lang="ts">
import { useApi } from '~/composables/useApi'

const props = defineProps<{ storeId: string }>()
const emit  = defineEmits<{ close: []; imported: [] }>()

const { fetchWithAuth } = useApi()

// ── State ─────────────────────────────────────────────────────────────────────
type Step = 'pick' | 'preview' | 'result'
const step          = ref<Step>('pick')
const fileInput     = ref<HTMLInputElement | null>(null)
const selectedFile  = ref<File | null>(null)
const dragOver      = ref(false)
const parseError    = ref<string | null>(null)
const importing     = ref(false)

interface PreviewOrder {
  orderId:    string
  status:     string
  customer:   string
  itemCount:  number
  total:      number
  shippingFee: number
}
const previewOrders = ref<PreviewOrder[]>([])

interface ImportResult {
  imported: number
  skipped:  number
  total:    number
  errors:   string[]
}
const result = ref<ImportResult | null>(null)

// TikTok status → label mapping (client-side preview only)
const STATUS_LABEL: Record<string, string> = {
  'Selesai': 'Selesai', 'Completed': 'Selesai',
  'Dibatalkan': 'Dibatalkan', 'Cancelled': 'Dibatalkan',
  'Dalam Pengiriman': 'Dikirim', 'In Transit': 'Dikirim',
  'Siap Dikirim': 'Pending', 'Ready to Ship': 'Pending',
}

// Column indexes (mirrors server)
const C = {
  ORDER_ID: 0, STATUS: 1, SKU_ID: 5, QTY: 9, PRICE: 11,
  SELLER_DISCOUNT: 14, SHIPPING_FEE: 18,
  BUYER_USERNAME: 43, RECIPIENT: 44,
}

// ── File handling ───────────────────────────────────────────────────────────
function onFileChange(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (f) processFile(f)
}

function onDrop(e: DragEvent) {
  dragOver.value = false
  const f = e.dataTransfer?.files?.[0]
  if (f) processFile(f)
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
    const allRows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, defval: '' }) as unknown[][]

    const dataRows = allRows.slice(2).filter(r => String(r[C.ORDER_ID] ?? '').trim())

    // Group by Order ID
    const orderMap = new Map<string, unknown[][]>()
    for (const row of dataRows) {
      const id = String(row[C.ORDER_ID]).trim()
      if (!orderMap.has(id)) orderMap.set(id, [])
      orderMap.get(id)!.push(row)
    }

    previewOrders.value = [...orderMap.entries()].map(([orderId, rows]) => {
      const first   = rows[0]
      let subtotal  = 0
      let discount  = 0
      for (const row of rows) {
        const qty = Number(row[C.QTY]) || 1
        subtotal += (Number(row[C.PRICE]) || 0) * qty
        discount += Number(row[C.SELLER_DISCOUNT]) || 0
      }
      const shippingFee = Number(first[C.SHIPPING_FEE]) || 0
      return {
        orderId,
        status:      STATUS_LABEL[String(first[C.STATUS])] ?? String(first[C.STATUS]),
        customer:    String(first[C.RECIPIENT] || first[C.BUYER_USERNAME] || '-').trim(),
        itemCount:   rows.length,
        total:       subtotal - discount,
        shippingFee,
      }
    })

    if (previewOrders.value.length === 0) {
      parseError.value = 'Tidak ada data order ditemukan di file ini'
      return
    }
    step.value = 'preview'
  } catch (e) {
    parseError.value = 'Gagal membaca file: ' + (e as Error).message
  }
}

// ── Import ────────────────────────────────────────────────────────────────────
async function doImport() {
  if (!selectedFile.value) return
  importing.value = true
  try {
    const fd = new FormData()
    fd.append('storeId', props.storeId)
    fd.append('file', selectedFile.value)

    const res = await fetchWithAuth<ImportResult>('/api/orders/import', {
      method: 'POST',
      body: fd as unknown as Record<string, unknown>,
    })
    result.value = res
    step.value = 'result'
  } catch (e: unknown) {
    parseError.value = (e as { data?: { message?: string } })?.data?.message ?? 'Gagal import'
  } finally {
    importing.value = false
  }
}

function reset() {
  step.value      = 'pick'
  selectedFile.value = null
  previewOrders.value = []
  parseError.value = null
  result.value    = null
  if (fileInput.value) fileInput.value.value = ''
}

function handleDone() {
  emit('imported')
  emit('close')
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)
</script>

<template>
  <AppModal :is-open="true" title="Import Order TikTok" size="lg" @close="emit('close')">
    <!-- Step indicator -->
    <div class="flex items-center gap-0 mb-5 text-xs">
      <div
        v-for="(label, i) in ['Pilih File', 'Preview', 'Hasil']"
        :key="i"
        class="flex items-center"
      >
        <div class="flex items-center gap-1.5">
          <div
            :class="[
              'w-5 h-5 rounded-full flex items-center justify-center font-semibold transition-colors',
              (step === 'pick' && i === 0) || (step === 'preview' && i === 1) || (step === 'result' && i === 2)
                ? 'bg-blue-600 text-white'
                : i < (['pick','preview','result'].indexOf(step)) ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
            ]"
          >{{ i + 1 }}</div>
          <span :class="step === (['pick','preview','result'][i] as Step) ? 'text-blue-600 font-medium' : 'text-gray-400'">{{ label }}</span>
        </div>
        <div v-if="i < 2" class="w-8 h-px bg-gray-200 mx-1" />
      </div>
    </div>

    <!-- Step 1: Pick file -->
    <div v-if="step === 'pick'" class="space-y-4">
      <p class="text-sm text-gray-500">Upload file Excel export order dari TikTok Seller Center</p>

      <div
        class="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors"
        :class="dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300'"
        @click="fileInput?.click()"
        @dragover.prevent="dragOver = true"
        @dragleave="dragOver = false"
        @drop.prevent="onDrop"
      >
        <svg class="h-10 w-10 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-sm text-gray-500">Drag & drop atau <span class="text-blue-600 font-medium">klik untuk pilih file</span></p>
        <p class="text-xs text-gray-400 mt-1">.xlsx / .xls</p>
      </div>
      <input ref="fileInput" type="file" accept=".xlsx,.xls" class="hidden" @change="onFileChange">

      <p v-if="parseError" class="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{{ parseError }}</p>
    </div>

    <!-- Step 2: Preview -->
    <div v-else-if="step === 'preview'" class="space-y-4">
      <div class="flex items-center justify-between">
        <p class="text-sm text-gray-600">
          <span class="font-semibold text-gray-900">{{ previewOrders.length }}</span> order ditemukan dari
          <span class="font-medium">{{ selectedFile?.name }}</span>
        </p>
        <button class="text-xs text-gray-400 hover:text-gray-600" @click="reset">Ganti file</button>
      </div>

      <div class="overflow-auto rounded-xl border border-gray-100 max-h-80">
        <table class="w-full text-sm min-w-[600px]">
          <thead class="bg-gray-50 text-xs text-gray-500 sticky top-0">
            <tr>
              <th class="px-3 py-2.5 text-left font-medium">Order ID</th>
              <th class="px-3 py-2.5 text-left font-medium">Status</th>
              <th class="px-3 py-2.5 text-left font-medium">Pelanggan</th>
              <th class="px-3 py-2.5 text-center font-medium">Item</th>
              <th class="px-3 py-2.5 text-right font-medium">Total</th>
              <th class="px-3 py-2.5 text-right font-medium">Ongkir</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="o in previewOrders" :key="o.orderId" class="hover:bg-gray-50/50">
              <td class="px-3 py-2 font-mono text-xs text-gray-600">{{ o.orderId }}</td>
              <td class="px-3 py-2">
                <span
                  :class="[
                    'text-xs px-2 py-0.5 rounded-full font-medium',
                    o.status === 'Selesai' ? 'bg-green-100 text-green-700' :
                    o.status === 'Dibatalkan' ? 'bg-red-100 text-red-600' :
                    o.status === 'Dikirim' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  ]"
                >{{ o.status }}</span>
              </td>
              <td class="px-3 py-2 text-gray-700 max-w-[140px] truncate">{{ o.customer }}</td>
              <td class="px-3 py-2 text-center text-gray-600">{{ o.itemCount }}</td>
              <td class="px-3 py-2 text-right text-gray-700">{{ formatCurrency(o.total) }}</td>
              <td class="px-3 py-2 text-right text-gray-700">{{ formatCurrency(o.shippingFee) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-if="parseError" class="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{{ parseError }}</p>
    </div>

    <!-- Step 3: Result -->
    <div v-else-if="step === 'result' && result" class="space-y-4">
      <div class="grid grid-cols-3 gap-3">
        <div class="bg-green-50 rounded-xl p-4 text-center">
          <p class="text-2xl font-bold text-green-600">{{ result.imported }}</p>
          <p class="text-xs text-green-700 mt-0.5">Berhasil diimport</p>
        </div>
        <div class="bg-yellow-50 rounded-xl p-4 text-center">
          <p class="text-2xl font-bold text-yellow-600">{{ result.skipped }}</p>
          <p class="text-xs text-yellow-700 mt-0.5">Dilewati (duplikat)</p>
        </div>
        <div class="bg-gray-50 rounded-xl p-4 text-center">
          <p class="text-2xl font-bold text-gray-700">{{ result.total }}</p>
          <p class="text-xs text-gray-500 mt-0.5">Total order</p>
        </div>
      </div>

      <div v-if="result.errors.length > 0" class="bg-red-50 rounded-xl p-3 space-y-1 max-h-36 overflow-auto">
        <p class="text-xs font-semibold text-red-600 mb-1">
          {{ result.errors.length }} order gagal diimport:
        </p>
        <p v-for="(err, i) in result.errors" :key="i" class="text-xs text-red-500">{{ err }}</p>
      </div>
    </div>

    <!-- Footer -->
    <template #footer>
      <div class="flex gap-3 justify-end">
        <button
          class="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          @click="step === 'result' ? handleDone() : emit('close')"
        >
          {{ step === 'result' ? 'Tutup' : 'Batal' }}
        </button>

        <button
          v-if="step === 'preview'"
          :disabled="importing"
          class="px-4 py-2 text-sm rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-60 flex items-center gap-2"
          @click="doImport"
        >
          <svg v-if="importing" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          {{ importing ? 'Mengimport...' : `Import ${previewOrders.length} Order` }}
        </button>

        <button
          v-if="step === 'result' && result && result.imported > 0"
          class="px-4 py-2 text-sm rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium transition-colors"
          @click="handleDone"
        >
          Selesai
        </button>
      </div>
    </template>
  </AppModal>
</template>
