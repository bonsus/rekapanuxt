<script setup lang="ts">
import type { TikTokAdSummary, TikTokAdGroupRow } from '~/types'

definePageMeta({ layout: 'store', middleware: ['auth'] })

const activeStoreStore = useActiveStoreStore()
const storeId = computed(() => activeStoreStore.store?.id ?? '')
const { getSummary, getGrouped, importAds, loading } = useTikTokAds()

// ── Data ──────────────────────────────────────────────────────────────────────
const rows    = ref<TikTokAdGroupRow[]>([])
const summary = ref<TikTokAdSummary | null>(null)

// ── View mode ─────────────────────────────────────────────────────────────────
const groupBy = ref<'campaign' | 'adGroup'>('campaign')

// ── Filters ───────────────────────────────────────────────────────────────────
const dateFrom = ref('')
const dateTo   = ref('')

// ── Modals ────────────────────────────────────────────────────────────────────
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
</script>

<template>
  <div class="space-y-5">

    <!-- Header -->
    <div class="flex items-center justify-between gap-4 flex-wrap">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">TikTok Ads</h1>
        <p class="text-sm text-gray-500 mt-0.5">Performa iklan teragregasi dari TikTok Ads Manager</p>
      </div>
      <button
        class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
        @click="showImport = true"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        Import Excel
      </button>
    </div>

    <!-- Summary Cards -->
    <div v-if="summary" class="space-y-3">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div class="rounded-xl p-4 text-white bg-gradient-to-br from-rose-500 to-red-600">
          <p class="text-xs font-medium opacity-80">Total Biaya Iklan</p>
          <p class="text-2xl font-bold mt-1 leading-tight">{{ fmtCurrency(summary.totalCost) }}</p>
          <p class="text-xs opacity-70 mt-1">{{ fmtNum(summary.recordCount) }} record</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <p class="text-xs text-gray-500 mb-1">Gross Revenue</p>
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
        <div class="bg-white rounded-xl border border-blue-100 shadow-sm p-4">
          <p class="text-xs text-gray-500 mb-1">Impressi</p>
          <p class="text-lg font-bold text-blue-600">{{ fmtNum(summary.totalImpressions) }}</p>
          <p class="text-xs text-gray-400 mt-0.5">Tayang</p>
        </div>
        <div class="bg-white rounded-xl border border-purple-100 shadow-sm p-4">
          <p class="text-xs text-gray-500 mb-1">Klik</p>
          <p class="text-lg font-bold text-purple-600">{{ fmtNum(summary.totalClicks) }}</p>
          <p class="text-xs text-gray-400 mt-0.5">Destination clicks</p>
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
      <!-- Date filters -->
      <div>
        <label class="block text-xs text-gray-500 mb-1">Dari</label>
        <input v-model="dateFrom" type="date" class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>
      <div>
        <label class="block text-xs text-gray-500 mb-1">Sampai</label>
        <input v-model="dateTo" type="date" class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>
      <button v-if="hasFilter" class="text-xs text-gray-400 hover:text-red-500 px-2 py-2 transition-colors" @click="dateFrom = ''; dateTo = ''">Reset</button>

      <!-- Spacer -->
      <div class="flex-1" />

      <!-- Group-by toggle -->
      <div>
        <label class="block text-xs text-gray-500 mb-1">Tampilkan</label>
        <div class="flex rounded-lg border border-gray-200 overflow-hidden text-sm">
          <button
            class="px-4 py-2 font-medium transition-colors"
            :class="groupBy === 'campaign' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'"
            @click="groupBy = 'campaign'"
          >Per Campaign</button>
          <button
            class="px-4 py-2 font-medium transition-colors border-l border-gray-200"
            :class="groupBy === 'adGroup' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'"
            @click="groupBy = 'adGroup'"
          >Per Ad Group</button>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div v-if="loading" class="flex justify-center py-16">
        <svg class="animate-spin h-7 w-7 text-blue-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>

      <div v-else-if="rows.length === 0" class="py-20 text-center">
        <svg class="w-12 h-12 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        </svg>
        <p class="text-gray-400 text-sm">Belum ada data. Import file Excel dari TikTok Ads Manager.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <!-- Campaign view -->
        <table v-if="groupBy === 'campaign'" class="w-full text-sm min-w-[900px]">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr class="text-xs text-gray-500">
              <th class="px-4 py-3 text-left font-medium">Campaign</th>
              <th class="px-4 py-3 text-right font-medium">Cost</th>
              <th class="px-4 py-3 text-right font-medium">Impressi</th>
              <th class="px-4 py-3 text-right font-medium">Klik</th>
              <th class="px-4 py-3 text-right font-medium">CTR</th>
              <th class="px-4 py-3 text-right font-medium">Konversi</th>
              <th class="px-4 py-3 text-right font-medium">CVR</th>
              <th class="px-4 py-3 text-right font-medium">CPC</th>
              <th class="px-4 py-3 text-right font-medium">Cost/Conv</th>
              <th class="px-4 py-3 text-right font-medium">Revenue</th>
              <th class="px-4 py-3 text-right font-medium">ROAS</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="r in rows" :key="r.campaignId" class="hover:bg-gray-50/60">
              <td class="px-4 py-3 max-w-[200px]">
                <p class="text-gray-800 font-medium text-xs truncate" :title="r.campaignName">{{ r.campaignName }}</p>
                <p class="text-gray-400 text-xs">ID: {{ r.campaignId }}</p>
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
          <!-- Totals row -->
          <tfoot class="bg-gray-50 border-t-2 border-gray-200">
            <tr class="text-xs font-semibold text-gray-700">
              <td class="px-4 py-3">Total ({{ rows.length }} campaign)</td>
              <td class="px-4 py-3 text-right text-red-500">{{ fmtCurrency(rows.reduce((s, r) => s + r.cost, 0)) }}</td>
              <td class="px-4 py-3 text-right">{{ fmtNum(rows.reduce((s, r) => s + r.impressions, 0)) }}</td>
              <td class="px-4 py-3 text-right">{{ fmtNum(rows.reduce((s, r) => s + r.clicks, 0)) }}</td>
              <td class="px-4 py-3 text-right text-gray-400">—</td>
              <td class="px-4 py-3 text-right">{{ fmtNum(rows.reduce((s, r) => s + r.conversions, 0)) }}</td>
              <td class="px-4 py-3 text-right text-gray-400">—</td>
              <td class="px-4 py-3 text-right text-gray-400">—</td>
              <td class="px-4 py-3 text-right text-gray-400">—</td>
              <td class="px-4 py-3 text-right text-green-600">{{ fmtCurrency(rows.reduce((s, r) => s + r.grossRevenue, 0)) }}</td>
              <td class="px-4 py-3 text-right text-gray-400">—</td>
            </tr>
          </tfoot>
        </table>

        <!-- Ad Group view -->
        <table v-else class="w-full text-sm min-w-[1050px]">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr class="text-xs text-gray-500">
              <th class="px-4 py-3 text-left font-medium">Campaign</th>
              <th class="px-4 py-3 text-left font-medium">Ad Group</th>
              <th class="px-4 py-3 text-right font-medium">Cost</th>
              <th class="px-4 py-3 text-right font-medium">Impressi</th>
              <th class="px-4 py-3 text-right font-medium">Klik</th>
              <th class="px-4 py-3 text-right font-medium">CTR</th>
              <th class="px-4 py-3 text-right font-medium">Konversi</th>
              <th class="px-4 py-3 text-right font-medium">CVR</th>
              <th class="px-4 py-3 text-right font-medium">CPC</th>
              <th class="px-4 py-3 text-right font-medium">Cost/Conv</th>
              <th class="px-4 py-3 text-right font-medium">Revenue</th>
              <th class="px-4 py-3 text-right font-medium">ROAS</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="r in rows" :key="(r.adGroupId ?? '') + r.campaignId" class="hover:bg-gray-50/60">
              <td class="px-4 py-3 max-w-[140px]">
                <p class="text-gray-600 text-xs truncate" :title="r.campaignName">{{ r.campaignName }}</p>
              </td>
              <td class="px-4 py-3 max-w-[160px]">
                <p class="text-gray-800 font-medium text-xs truncate" :title="r.adGroupName ?? ''">{{ r.adGroupName }}</p>
                <p class="text-gray-400 text-xs">ID: {{ r.adGroupId }}</p>
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
          <!-- Totals row -->
          <tfoot class="bg-gray-50 border-t-2 border-gray-200">
            <tr class="text-xs font-semibold text-gray-700">
              <td class="px-4 py-3" colspan="2">Total ({{ rows.length }} ad group)</td>
              <td class="px-4 py-3 text-right text-red-500">{{ fmtCurrency(rows.reduce((s, r) => s + r.cost, 0)) }}</td>
              <td class="px-4 py-3 text-right">{{ fmtNum(rows.reduce((s, r) => s + r.impressions, 0)) }}</td>
              <td class="px-4 py-3 text-right">{{ fmtNum(rows.reduce((s, r) => s + r.clicks, 0)) }}</td>
              <td class="px-4 py-3 text-right text-gray-400">—</td>
              <td class="px-4 py-3 text-right">{{ fmtNum(rows.reduce((s, r) => s + r.conversions, 0)) }}</td>
              <td class="px-4 py-3 text-right text-gray-400">—</td>
              <td class="px-4 py-3 text-right text-gray-400">—</td>
              <td class="px-4 py-3 text-right text-gray-400">—</td>
              <td class="px-4 py-3 text-right text-green-600">{{ fmtCurrency(rows.reduce((s, r) => s + r.grossRevenue, 0)) }}</td>
              <td class="px-4 py-3 text-right text-gray-400">—</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Import Modal -->
    <TikTokAdsImportModal
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
      >
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(8px); }
</style>

