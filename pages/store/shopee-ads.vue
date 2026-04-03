<script setup lang="ts">
import type { ShopeeAdSummary, ShopeeAdGroupRow } from '~/types'

definePageMeta({ layout: 'store', middleware: ['auth'] })

const activeStoreStore = useActiveStoreStore()
const storeId = computed(() => activeStoreStore.store?.id ?? '')
const { getSummary, getGrouped, loading } = useShopeeAds()

// ── Data ──────────────────────────────────────────────────────────────────────
const rows    = ref<ShopeeAdGroupRow[]>([])
const summary = ref<ShopeeAdSummary | null>(null)

// ── View mode ─────────────────────────────────────────────────────────────────
type GroupMode = 'ad' | 'adType' | 'adPlacement'
const groupBy  = ref<GroupMode>('ad')

const groupOptions: { value: GroupMode; label: string }[] = [
  { value: 'ad',          label: 'Per Iklan' },
  { value: 'adType',      label: 'Per Jenis' },
  { value: 'adPlacement', label: 'Per Penempatan' },
]

// ── Filters ───────────────────────────────────────────────────────────────────
const dateFrom = ref('')
const dateTo   = ref('')

// ── Modal ─────────────────────────────────────────────────────────────────────
const showImport = ref(false)

// ── Toast ─────────────────────────────────────────────────────────────────────
const toast = ref<{ message: string; type: 'success' | 'error' } | null>(null)
watch(toast, v => { if (v) setTimeout(() => { toast.value = null }, 3000) })

const hasFilter = computed(() => dateFrom.value || dateTo.value)

// ── Load ──────────────────────────────────────────────────────────────────────
async function load() {
  if (!storeId.value) return
  const [grouped, sum] = await Promise.all([
    getGrouped(storeId.value, groupBy.value, dateFrom.value || undefined, dateTo.value || undefined),
    getSummary(storeId.value, dateFrom.value || undefined, dateTo.value || undefined),
  ])
  rows.value    = grouped ?? []
  summary.value = sum ?? null
}

let debounce: ReturnType<typeof setTimeout> | null = null
watch([dateFrom, dateTo], () => {
  if (debounce) clearTimeout(debounce)
  debounce = setTimeout(load, 300)
})
watch(groupBy, load)

onMounted(() => {
  activeStoreStore.loadFromStorage()
  load()
})

// ── Formatters ────────────────────────────────────────────────────────────────
function fmtCurrency(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)
}
function fmtNum(n: number) { return new Intl.NumberFormat('id-ID').format(n) }
function fmtPct(n: number) { return (n * 100).toFixed(2) + '%' }
function fmtRoas(n: number) { return n.toFixed(2) + 'x' }

// ── Totals ────────────────────────────────────────────────────────────────────
const totals = computed(() => ({
  cost:        rows.value.reduce((s, r) => s + r.cost, 0),
  impressions: rows.value.reduce((s, r) => s + r.impressions, 0),
  clicks:      rows.value.reduce((s, r) => s + r.clicks, 0),
  conversions: rows.value.reduce((s, r) => s + r.conversions, 0),
  grossRevenue: rows.value.reduce((s, r) => s + r.grossRevenue, 0),
}))
</script>

<template>
  <div class="space-y-5">

    <!-- Header -->
    <div class="flex items-center justify-between gap-4 flex-wrap">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Shopee Ads</h1>
        <p class="text-sm text-gray-500 mt-0.5">Performa iklan teragregasi dari Shopee Seller Centre</p>
      </div>
      <button
        class="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
        @click="showImport = true"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        Import CSV / Excel
      </button>
    </div>

    <!-- Summary Cards -->
    <div v-if="summary" class="space-y-3">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div class="rounded-xl p-4 text-white bg-gradient-to-br from-orange-500 to-red-500">
          <p class="text-xs font-medium opacity-80">Total Biaya Iklan</p>
          <p class="text-2xl font-bold mt-1 leading-tight">{{ fmtCurrency(summary.totalCost) }}</p>
          <p class="text-xs opacity-70 mt-1">{{ fmtNum(summary.recordCount) }} record</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <p class="text-xs text-gray-500 mb-1">Omzet Penjualan</p>
          <p class="text-lg font-bold text-green-600">{{ fmtCurrency(summary.totalGrossRevenue) }}</p>
          <p class="text-xs text-gray-400 mt-0.5">{{ fmtNum(summary.totalConversions) }} konversi</p>
        </div>
        <div class="bg-white rounded-xl border border-emerald-100 shadow-sm p-4">
          <p class="text-xs text-gray-500 mb-1">ROAS</p>
          <p class="text-lg font-bold" :class="summary.roas >= 1 ? 'text-emerald-600' : 'text-red-500'">
            {{ fmtRoas(summary.roas) }}
          </p>
          <p class="text-xs text-gray-400 mt-0.5">Revenue / Cost</p>
        </div>
        <div class="bg-white rounded-xl border border-amber-100 shadow-sm p-4">
          <p class="text-xs text-gray-500 mb-1">Cost per Konversi</p>
          <p class="text-lg font-bold text-amber-600">{{ fmtCurrency(summary.avgCostPerConversion) }}</p>
          <p class="text-xs text-gray-400 mt-0.5">Avg per order</p>
        </div>
      </div>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div class="bg-white rounded-xl border border-orange-100 shadow-sm p-4">
          <p class="text-xs text-gray-500 mb-1">Impressi (Dilihat)</p>
          <p class="text-lg font-bold text-orange-500">{{ fmtNum(summary.totalImpressions) }}</p>
          <p class="text-xs text-gray-400 mt-0.5">Tayang</p>
        </div>
        <div class="bg-white rounded-xl border border-purple-100 shadow-sm p-4">
          <p class="text-xs text-gray-500 mb-1">Klik</p>
          <p class="text-lg font-bold text-purple-600">{{ fmtNum(summary.totalClicks) }}</p>
          <p class="text-xs text-gray-400 mt-0.5">Jumlah klik</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <p class="text-xs text-gray-500 mb-1">CTR</p>
          <p class="text-lg font-bold text-gray-700">{{ fmtPct(summary.avgCtr) }}</p>
          <p class="text-xs text-gray-400 mt-0.5">Click-through rate</p>
        </div>
        <div class="bg-white rounded-xl border border-teal-100 shadow-sm p-4">
          <p class="text-xs text-gray-500 mb-1">CPC</p>
          <p class="text-lg font-bold text-teal-600">{{ fmtCurrency(summary.avgCpc) }}</p>
          <p class="text-xs text-gray-400 mt-0.5">Cost per click</p>
        </div>
      </div>
    </div>

    <!-- Filter + Group-by bar -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-wrap gap-3 items-end">
      <div>
        <label class="block text-xs text-gray-500 mb-1">Dari</label>
        <input v-model="dateFrom" type="date" class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
      </div>
      <div>
        <label class="block text-xs text-gray-500 mb-1">Sampai</label>
        <input v-model="dateTo" type="date" class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
      </div>
      <button v-if="hasFilter" class="text-xs text-gray-400 hover:text-red-500 px-2 py-2 transition-colors" @click="dateFrom = ''; dateTo = ''">Reset</button>
      <div class="flex-1" />
      <div>
        <label class="block text-xs text-gray-500 mb-1">Tampilkan</label>
        <div class="flex rounded-lg border border-gray-200 overflow-hidden text-sm">
          <button
            v-for="opt in groupOptions"
            :key="opt.value"
            class="px-4 py-2 font-medium transition-colors border-r border-gray-200 last:border-r-0"
            :class="groupBy === opt.value ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'"
            @click="groupBy = opt.value"
          >{{ opt.label }}</button>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div v-if="loading" class="flex justify-center py-16">
        <svg class="animate-spin h-7 w-7 text-orange-400" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>

      <div v-else-if="rows.length === 0" class="py-20 text-center">
        <svg class="w-12 h-12 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <p class="text-gray-400 text-sm">Belum ada data. Import file CSV dari Shopee Seller Centre.</p>
      </div>

      <div v-else class="overflow-x-auto">

        <!-- Per Iklan -->
        <table v-if="groupBy === 'ad'" class="w-full text-sm min-w-[1100px]">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr class="text-xs text-gray-500">
              <th class="px-4 py-3 text-left font-medium">Nama Iklan</th>
              <th class="px-4 py-3 text-left font-medium">Jenis</th>
              <th class="px-4 py-3 text-left font-medium">Kode Produk</th>
              <th class="px-4 py-3 text-left font-medium">Mode Bidding</th>
              <th class="px-4 py-3 text-right font-medium">Biaya</th>
              <th class="px-4 py-3 text-right font-medium">Dilihat</th>
              <th class="px-4 py-3 text-right font-medium">Klik</th>
              <th class="px-4 py-3 text-right font-medium">CTR</th>
              <th class="px-4 py-3 text-right font-medium">Konversi</th>
              <th class="px-4 py-3 text-right font-medium">CVR</th>
              <th class="px-4 py-3 text-right font-medium">CPC</th>
              <th class="px-4 py-3 text-right font-medium">Cost/Conv</th>
              <th class="px-4 py-3 text-right font-medium">Omzet</th>
              <th class="px-4 py-3 text-right font-medium">ROAS</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="r in rows" :key="r.key" class="hover:bg-gray-50/60">
              <td class="px-4 py-3 max-w-[180px]">
                <p class="text-gray-800 font-medium text-xs truncate" :title="r.adName">{{ r.adName }}</p>
              </td>
              <td class="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{{ r.adType || '-' }}</td>
              <td class="px-4 py-3 text-gray-400 text-xs font-mono">{{ r.productCode || '-' }}</td>
              <td class="px-4 py-3 text-gray-500 text-xs">{{ r.biddingMode || '-' }}</td>
              <td class="px-4 py-3 text-right font-semibold text-red-500 text-xs">{{ fmtCurrency(r.cost) }}</td>
              <td class="px-4 py-3 text-right text-gray-600 text-xs">{{ fmtNum(r.impressions) }}</td>
              <td class="px-4 py-3 text-right text-gray-600 text-xs">{{ fmtNum(r.clicks) }}</td>
              <td class="px-4 py-3 text-right text-gray-500 text-xs">{{ fmtPct(r.ctr) }}</td>
              <td class="px-4 py-3 text-right text-gray-700 font-medium text-xs">{{ fmtNum(r.conversions) }}</td>
              <td class="px-4 py-3 text-right text-gray-500 text-xs">{{ fmtPct(r.cvr) }}</td>
              <td class="px-4 py-3 text-right text-amber-600 text-xs">{{ fmtCurrency(r.cpc) }}</td>
              <td class="px-4 py-3 text-right text-amber-600 text-xs">{{ fmtCurrency(r.costPerConversion) }}</td>
              <td class="px-4 py-3 text-right font-semibold text-green-600 text-xs">{{ fmtCurrency(r.grossRevenue) }}</td>
              <td class="px-4 py-3 text-right text-xs font-bold" :class="r.roas >= 1 ? 'text-emerald-600' : 'text-red-500'">{{ fmtRoas(r.roas) }}</td>
            </tr>
          </tbody>
          <tfoot class="bg-gray-50 border-t-2 border-gray-200">
            <tr class="text-xs font-semibold text-gray-700">
              <td class="px-4 py-3" colspan="4">Total ({{ rows.length }} iklan)</td>
              <td class="px-4 py-3 text-right text-red-500">{{ fmtCurrency(totals.cost) }}</td>
              <td class="px-4 py-3 text-right">{{ fmtNum(totals.impressions) }}</td>
              <td class="px-4 py-3 text-right">{{ fmtNum(totals.clicks) }}</td>
              <td class="px-4 py-3 text-right text-gray-400">—</td>
              <td class="px-4 py-3 text-right">{{ fmtNum(totals.conversions) }}</td>
              <td class="px-4 py-3 text-right text-gray-400">—</td>
              <td class="px-4 py-3 text-right text-gray-400">—</td>
              <td class="px-4 py-3 text-right text-gray-400">—</td>
              <td class="px-4 py-3 text-right text-green-600">{{ fmtCurrency(totals.grossRevenue) }}</td>
              <td class="px-4 py-3 text-right text-gray-400">—</td>
            </tr>
          </tfoot>
        </table>

        <!-- Per Jenis / Per Penempatan -->
        <table v-else class="w-full text-sm min-w-[800px]">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr class="text-xs text-gray-500">
              <th class="px-4 py-3 text-left font-medium">{{ groupBy === 'adType' ? 'Jenis Iklan' : 'Penempatan' }}</th>
              <th class="px-4 py-3 text-right font-medium">Biaya</th>
              <th class="px-4 py-3 text-right font-medium">Dilihat</th>
              <th class="px-4 py-3 text-right font-medium">Klik</th>
              <th class="px-4 py-3 text-right font-medium">CTR</th>
              <th class="px-4 py-3 text-right font-medium">Konversi</th>
              <th class="px-4 py-3 text-right font-medium">CVR</th>
              <th class="px-4 py-3 text-right font-medium">CPC</th>
              <th class="px-4 py-3 text-right font-medium">Cost/Conv</th>
              <th class="px-4 py-3 text-right font-medium">Omzet</th>
              <th class="px-4 py-3 text-right font-medium">ROAS</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="r in rows" :key="r.key" class="hover:bg-gray-50/60">
              <td class="px-4 py-3">
                <p class="text-gray-800 font-medium text-xs">{{ r.key || '-' }}</p>
              </td>
              <td class="px-4 py-3 text-right font-semibold text-red-500 text-xs">{{ fmtCurrency(r.cost) }}</td>
              <td class="px-4 py-3 text-right text-gray-600 text-xs">{{ fmtNum(r.impressions) }}</td>
              <td class="px-4 py-3 text-right text-gray-600 text-xs">{{ fmtNum(r.clicks) }}</td>
              <td class="px-4 py-3 text-right text-gray-500 text-xs">{{ fmtPct(r.ctr) }}</td>
              <td class="px-4 py-3 text-right text-gray-700 font-medium text-xs">{{ fmtNum(r.conversions) }}</td>
              <td class="px-4 py-3 text-right text-gray-500 text-xs">{{ fmtPct(r.cvr) }}</td>
              <td class="px-4 py-3 text-right text-amber-600 text-xs">{{ fmtCurrency(r.cpc) }}</td>
              <td class="px-4 py-3 text-right text-amber-600 text-xs">{{ fmtCurrency(r.costPerConversion) }}</td>
              <td class="px-4 py-3 text-right font-semibold text-green-600 text-xs">{{ fmtCurrency(r.grossRevenue) }}</td>
              <td class="px-4 py-3 text-right text-xs font-bold" :class="r.roas >= 1 ? 'text-emerald-600' : 'text-red-500'">{{ fmtRoas(r.roas) }}</td>
            </tr>
          </tbody>
          <tfoot class="bg-gray-50 border-t-2 border-gray-200">
            <tr class="text-xs font-semibold text-gray-700">
              <td class="px-4 py-3">Total ({{ rows.length }})</td>
              <td class="px-4 py-3 text-right text-red-500">{{ fmtCurrency(totals.cost) }}</td>
              <td class="px-4 py-3 text-right">{{ fmtNum(totals.impressions) }}</td>
              <td class="px-4 py-3 text-right">{{ fmtNum(totals.clicks) }}</td>
              <td class="px-4 py-3 text-right text-gray-400">—</td>
              <td class="px-4 py-3 text-right">{{ fmtNum(totals.conversions) }}</td>
              <td class="px-4 py-3 text-right text-gray-400">—</td>
              <td class="px-4 py-3 text-right text-gray-400">—</td>
              <td class="px-4 py-3 text-right text-gray-400">—</td>
              <td class="px-4 py-3 text-right text-green-600">{{ fmtCurrency(totals.grossRevenue) }}</td>
              <td class="px-4 py-3 text-right text-gray-400">—</td>
            </tr>
          </tfoot>
        </table>

      </div>
    </div>

    <!-- Import Modal -->
    <ShopeeAdsImportModal
      v-if="showImport"
      :store-id="storeId"
      @close="showImport = false"
      @imported="() => { showImport = false; load() }"
    />

    <!-- Toast -->
    <Transition name="toast">
      <div
        v-if="toast"
        class="fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white"
        :class="toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'"
      >{{ toast.message }}</div>
    </Transition>
  </div>
</template>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(8px); }
</style>
