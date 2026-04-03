<script setup lang="ts">
import type { FinanceTransaction, FinanceSummary, TransactionType, CashFlow } from '~/types'

definePageMeta({ layout: 'store', middleware: ['auth'] })

const activeStoreStore = useActiveStoreStore()
const storeId = computed(() => activeStoreStore.store?.id ?? '')
const { getTransactions, getSummary, deleteTransaction, loading } = useFinance()

// ── Data ──────────────────────────────────────────────────────────────────────
const transactions = ref<FinanceTransaction[]>([])
const total        = ref(0)
const page         = ref(1)
const limit        = 20

const summary = ref<FinanceSummary | null>(null)

// ── Filters ───────────────────────────────────────────────────────────────────
const search        = ref('')
const typeFilter    = ref<TransactionType | ''>('')
const cashFlowFilter = ref<CashFlow | ''>('')
const sourceFilter  = ref('')
const dateFrom      = ref('')
const dateTo        = ref('')

// ── Delete ────────────────────────────────────────────────────────────────────
const deleteTarget  = ref<FinanceTransaction | null>(null)
const deleteLoading = ref(false)

// ── Form Modal ────────────────────────────────────────────────────────────────
const showForm    = ref(false)
const editTarget  = ref<FinanceTransaction | null>(null)

// ── Import Modal ──────────────────────────────────────────────────────────────
const showImport  = ref(false)

// ── Detail Modal ─────────────────────────────────────────────────────────────
const detailTarget = ref<FinanceTransaction | null>(null)

// ── Order Summary Modal ───────────────────────────────────────────────────────
const orderSummaryRef = ref<string | null>(null) // orderNumber

// ── Toast ─────────────────────────────────────────────────────────────────────
const toast = ref<{ message: string; type: 'success' | 'error' } | null>(null)

const totalPages = computed(() => Math.ceil(total.value / limit))

// ── Load ──────────────────────────────────────────────────────────────────────
async function load() {
  if (!storeId.value) return
  const [res, sum] = await Promise.all([
    getTransactions({
      storeId: storeId.value,
      type:     typeFilter.value    || undefined,
      cashFlow: cashFlowFilter.value || undefined,
      source:   sourceFilter.value  || undefined,
      dateFrom: dateFrom.value      || undefined,
      dateTo:   dateTo.value        || undefined,
      search:   search.value        || undefined,
      page:     page.value,
      limit,
    }),
    getSummary(storeId.value, dateFrom.value || undefined, dateTo.value || undefined),
  ])
  transactions.value = res?.data ?? []
  total.value        = res?.total ?? 0
  summary.value      = sum ?? null
}

let debounce: ReturnType<typeof setTimeout> | null = null
watch([search, typeFilter, cashFlowFilter, sourceFilter, dateFrom, dateTo], () => {
  page.value = 1
  if (debounce) clearTimeout(debounce)
  debounce = setTimeout(load, 300)
})
watch(page, load)

onMounted(() => {
  activeStoreStore.loadFromStorage()
  load()
})

watch(toast, (v) => {
  if (v) setTimeout(() => { toast.value = null }, 3000)
})

// ── Helpers ───────────────────────────────────────────────────────────────────
function resetFilters() {
  search.value = ''; typeFilter.value = ''; cashFlowFilter.value = ''
  sourceFilter.value = ''; dateFrom.value = ''; dateTo.value = ''
}

const hasFilter = computed(() => search.value || typeFilter.value || cashFlowFilter.value || sourceFilter.value || dateFrom.value || dateTo.value)

function formatCurrency(n: number | string) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(n))
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

const TYPE_LABEL: Record<TransactionType, string>  = { ORDER: 'Order', ADS: 'Iklan', LOGISTIC: 'Logistik', WITHDRAW: 'Tarik Saldo' }
const TYPE_COLOR: Record<TransactionType, string>  = {
  ORDER:    'bg-blue-100 text-blue-700',
  ADS:      'bg-purple-100 text-purple-700',
  LOGISTIC: 'bg-orange-100 text-orange-700',
  WITHDRAW: 'bg-gray-100 text-gray-600',
}


// ── Actions ───────────────────────────────────────────────────────────────────
function openCreate() { editTarget.value = null; showForm.value = true }
function openEdit(tx: FinanceTransaction) { editTarget.value = tx; showForm.value = true }

async function confirmDelete() {
  if (!deleteTarget.value) return
  deleteLoading.value = true
  try {
    await deleteTransaction(deleteTarget.value.id)
    toast.value = { message: 'Transaksi berhasil dihapus', type: 'success' }
    deleteTarget.value = null
    load()
  } catch {
    toast.value = { message: 'Gagal menghapus transaksi', type: 'error' }
  } finally {
    deleteLoading.value = false
  }
}

function handleSaved() {
  showForm.value = false
  editTarget.value = null
  load()
}
</script>

<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex items-center justify-between gap-4 flex-wrap">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Finance & Saldo</h1>
        <p class="text-sm text-gray-500 mt-0.5">Manajemen transaksi keuangan toko</p>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-sm font-medium transition-colors shadow-sm"
          @click="showImport = true"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Import TikTok
        </button>
        <button
          class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
          @click="openCreate"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Tambah Transaksi
        </button>
      </div>
    </div>

    <!-- Summary Cards -->
    <div v-if="summary" class="space-y-3">

      <!-- Row 1: Saldo & Arus Kas -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <!-- Saldo TikTok — hero card -->
        <div
          class="col-span-2 lg:col-span-1 rounded-xl p-4 text-white"
          :class="summary.totalBalance >= 0 ? 'bg-gradient-to-br from-emerald-500 to-green-600' : 'bg-gradient-to-br from-red-500 to-rose-600'"
        >
          <p class="text-xs font-medium opacity-80">Saldo TikTok</p>
          <p class="text-2xl font-bold mt-1 leading-tight">{{ formatCurrency(summary.totalBalance) }}</p>
          <p class="text-xs opacity-70 mt-1">Belum ditarik ke bank</p>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <p class="text-xs text-gray-500 mb-1">Total Pemasukan</p>
          <p class="text-lg font-bold text-blue-600">{{ formatCurrency(summary.totalIn) }}</p>
          <p class="text-xs text-gray-400 mt-0.5">{{ summary.txCount }} transaksi</p>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <p class="text-xs text-gray-500 mb-1">Total Pengeluaran</p>
          <p class="text-lg font-bold text-red-500">{{ formatCurrency(summary.totalOut) }}</p>
          <p class="text-xs text-gray-400 mt-0.5">Biaya + iklan + withdraw</p>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <p class="text-xs text-gray-500 mb-1">Total Withdraw</p>
          <p class="text-lg font-bold text-gray-700">{{ formatCurrency(summary.totalWithdraw) }}</p>
          <p class="text-xs text-gray-400 mt-0.5">Sudah ditransfer ke bank</p>
        </div>
      </div>

      <!-- Row 2: Rincian Biaya -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div class="bg-white rounded-xl border border-amber-100 shadow-sm p-4">
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs text-gray-500">Biaya Platform</p>
            <span class="text-xs px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded font-medium">TikTok</span>
          </div>
          <p class="text-base font-bold text-amber-600">{{ formatCurrency(summary.totalPlatformFee) }}</p>
          <p class="text-xs text-gray-400 mt-0.5">Komisi + payment fee</p>
        </div>

        <div class="bg-white rounded-xl border border-purple-100 shadow-sm p-4">
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs text-gray-500">Biaya Affiliate</p>
            <span class="text-xs px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded font-medium">Kreator</span>
          </div>
          <p class="text-base font-bold text-purple-600">{{ formatCurrency(summary.totalAffiliateFee) }}</p>
          <p class="text-xs text-gray-400 mt-0.5">Komisi affiliate & shop</p>
        </div>

        <div class="bg-white rounded-xl border border-teal-100 shadow-sm p-4">
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs text-gray-500">Biaya Ongkir</p>
            <span class="text-xs px-1.5 py-0.5 bg-teal-50 text-teal-600 rounded font-medium">Logistik</span>
          </div>
          <p class="text-base font-bold text-teal-600">{{ formatCurrency(summary.totalShippingFee) }}</p>
          <p class="text-xs text-gray-400 mt-0.5">Setelah subsidi platform</p>
        </div>

        <div class="bg-white rounded-xl border border-rose-100 shadow-sm p-4">
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs text-gray-500">Biaya Iklan</p>
            <span class="text-xs px-1.5 py-0.5 bg-rose-50 text-rose-600 rounded font-medium">ADS</span>
          </div>
          <p class="text-base font-bold text-rose-600">{{ formatCurrency(summary.totalAds) }}</p>
          <p class="text-xs text-gray-400 mt-0.5">GMV Max &amp; campaign</p>
        </div>
      </div>

      <!-- Row 3: Status Order Aktif -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <!-- Menunggu Dikirim -->
        <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="min-w-0">
            <p class="text-xs font-medium text-amber-700">Menunggu Dikirim</p>
            <p class="text-xl font-bold text-amber-800 leading-tight">{{ summary.pendingOrderCount }} order</p>
            <p class="text-xs text-amber-600 truncate">{{ formatCurrency(summary.pendingOrderAmount) }}</p>
          </div>
        </div>

        <!-- Dalam Pengiriman -->
        <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
          </div>
          <div class="min-w-0">
            <p class="text-xs font-medium text-blue-700">Dalam Pengiriman</p>
            <p class="text-xl font-bold text-blue-800 leading-tight">{{ summary.shippedOrderCount }} order</p>
            <p class="text-xs text-blue-600 truncate">{{ formatCurrency(summary.shippedOrderAmount) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-wrap gap-3 items-end">
      <div class="flex-1 min-w-[160px]">
        <label class="block text-xs text-gray-500 mb-1">Cari</label>
        <input
          v-model="search"
          type="text"
          placeholder="Ref ID atau keterangan..."
          class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
      </div>
      <div class="min-w-[140px]">
        <label class="block text-xs text-gray-500 mb-1">Tipe</label>
        <select v-model="typeFilter" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="">Semua Tipe</option>
          <option value="ORDER">Order</option>
          <option value="ADS">Iklan</option>
          <option value="LOGISTIC">Logistik</option>
          <option value="WITHDRAW">Tarik Saldo</option>
        </select>
      </div>
      <div class="min-w-[130px]">
        <label class="block text-xs text-gray-500 mb-1">Arus Kas</label>
        <select v-model="cashFlowFilter" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="">Semua</option>
          <option value="IN">Masuk</option>
          <option value="OUT">Keluar</option>
        </select>
      </div>
      <div class="min-w-[130px]">
        <label class="block text-xs text-gray-500 mb-1">Source</label>
        <input v-model="sourceFilter" type="text" placeholder="Semua source..." class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>
      <div>
        <label class="block text-xs text-gray-500 mb-1">Dari</label>
        <input v-model="dateFrom" type="date" class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>
      <div>
        <label class="block text-xs text-gray-500 mb-1">Sampai</label>
        <input v-model="dateTo" type="date" class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>
      <button v-if="hasFilter" class="text-xs text-gray-400 hover:text-red-500 px-2 py-2 transition-colors" @click="resetFilters">Reset</button>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div v-if="loading" class="flex justify-center py-16">
        <svg class="animate-spin h-7 w-7 text-blue-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>

      <div v-else-if="transactions.length === 0" class="py-20 text-center">
        <p class="text-gray-400 text-sm">Belum ada transaksi</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm min-w-[800px]">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr class="text-xs text-gray-500">
              <th class="px-4 py-3 text-left font-medium">Tanggal</th>
              <th class="px-4 py-3 text-left font-medium">Tipe</th>
              <th class="px-4 py-3 text-left font-medium">Arus</th>
              <th class="px-4 py-3 text-left font-medium">Source</th>
              <th class="px-4 py-3 text-left font-medium">Ref ID</th>
              <th class="px-4 py-3 text-right font-medium">Nilai</th>
              <th class="px-4 py-3 text-right font-medium">Net</th>
              <th class="px-4 py-3 text-left font-medium">Keterangan</th>
              <th class="px-4 py-3" />
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr
              v-for="tx in transactions"
              :key="tx.id"
              class="hover:bg-gray-50/50 cursor-pointer"
              @click="detailTarget = tx"
            >
              <td class="px-4 py-3 text-gray-600 whitespace-nowrap">{{ formatDate(tx.date) }}</td>
              <td class="px-4 py-3">
                <span :class="['text-xs px-2 py-0.5 rounded-full font-medium', TYPE_COLOR[tx.type]]">
                  {{ TYPE_LABEL[tx.type] }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span
                  :class="[
                    'text-xs px-2 py-0.5 rounded-full font-medium',
                    tx.cashFlow === 'IN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                  ]"
                >
                  {{ tx.cashFlow === 'IN' ? 'Masuk' : 'Keluar' }}
                </span>
              </td>
              <td class="px-4 py-3 text-gray-500 text-xs">{{ tx.source || '-' }}</td>
              <td class="px-4 py-3 font-mono text-xs max-w-[120px] truncate" @click.stop>
                <button
                  v-if="tx.type === 'ORDER' && tx.referenceId"
                  class="text-blue-600 hover:text-blue-800 hover:underline font-mono text-xs truncate max-w-full text-left"
                  :title="tx.referenceId"
                  @click="orderSummaryRef = tx.referenceId"
                >
                  {{ tx.referenceId }}
                </button>
                <span v-else class="text-gray-500">{{ tx.referenceId || '-' }}</span>
              </td>
              <td class="px-4 py-3 text-right font-medium text-gray-800">{{ formatCurrency(tx.amount) }}</td>
              <td class="px-4 py-3 text-right font-semibold" :class="tx.cashFlow === 'IN' ? 'text-green-600' : 'text-red-500'">
                {{ tx.cashFlow === 'OUT' ? '-' : '' }}{{ formatCurrency(tx.netAmount) }}
              </td>
              <td class="px-4 py-3 text-gray-500 max-w-[160px] truncate">{{ tx.note || '-' }}</td>
              <td class="px-4 py-3" @click.stop>
                <div class="flex items-center gap-1 justify-end">
                  <button
                    class="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    title="Edit"
                    @click="openEdit(tx)"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    class="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Hapus"
                    @click="deleteTarget = tx"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-between text-sm text-gray-500">
      <span>{{ total }} transaksi ditemukan</span>
      <div class="flex items-center gap-1">
        <button :disabled="page === 1" class="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors" @click="page--">Prev</button>
        <span class="px-3 py-1.5">{{ page }} / {{ totalPages }}</span>
        <button :disabled="page >= totalPages" class="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors" @click="page++">Next</button>
      </div>
    </div>

    <!-- Form Modal -->
    <FinanceFormModal
      v-if="showForm"
      :store-id="storeId"
      :edit="editTarget"
      @close="showForm = false"
      @saved="handleSaved"
    />

    <!-- Import Modal -->
    <FinanceImportModal
      v-if="showImport"
      :store-id="storeId"
      @close="showImport = false"
      @imported="load"
    />

    <!-- Finance Detail Modal -->
    <FinanceDetailModal
      v-if="detailTarget"
      :tx="detailTarget"
      @close="detailTarget = null"
      @edit="(tx) => { detailTarget = null; openEdit(tx) }"
    />

    <!-- Order Summary Modal -->
    <OrderSummaryModal
      v-if="orderSummaryRef"
      :store-id="storeId"
      :order-number="orderSummaryRef"
      @close="orderSummaryRef = null"
    />

    <!-- Delete Confirm Modal -->
    <AppModal :is-open="!!deleteTarget" title="Hapus Transaksi" size="sm" @close="deleteTarget = null">
      <p class="text-sm text-gray-600">
        Hapus transaksi <span class="font-semibold">{{ deleteTarget ? TYPE_LABEL[deleteTarget.type] : '' }}</span>
        senilai <span class="font-semibold text-gray-900">{{ deleteTarget ? formatCurrency(deleteTarget.netAmount) : '' }}</span>?
      </p>
      <template #footer>
        <div class="flex gap-3 justify-end">
          <button class="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors" @click="deleteTarget = null">Batal</button>
          <button :disabled="deleteLoading" class="px-4 py-2 text-sm rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors disabled:opacity-60" @click="confirmDelete">
            {{ deleteLoading ? 'Menghapus...' : 'Hapus' }}
          </button>
        </div>
      </template>
    </AppModal>

    <!-- Toast -->
    <Transition name="slide-up">
      <div
        v-if="toast"
        :class="toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-lg z-50"
      >
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translate(-50%, 12px); }
</style>
