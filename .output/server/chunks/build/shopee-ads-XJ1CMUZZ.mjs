import { defineComponent, computed, ref, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrRenderAttr, ssrRenderList, ssrRenderComponent, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { u as useApi } from './useApi-0aCYoCTI.mjs';
import { u as useAuthStore } from './auth-BWjTzQkA.mjs';
import { u as useActiveStoreStore } from './activeStore-yswwjCHd.mjs';
import { _ as _export_sfc } from './server.mjs';
import 'pinia';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

function useShopeeAds() {
  const { fetchWithAuth } = useApi();
  const loading = ref(false);
  async function getAds(query) {
    loading.value = true;
    try {
      const params = new URLSearchParams();
      Object.entries(query).forEach(([k, v]) => {
        if (v !== void 0 && v !== "") params.set(k, String(v));
      });
      return await fetchWithAuth(
        `/api/shopee-ads?${params.toString()}`
      );
    } finally {
      loading.value = false;
    }
  }
  async function getSummary(storeId, dateFrom, dateTo) {
    const params = new URLSearchParams({ storeId });
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    return fetchWithAuth(`/api/shopee-ads/summary?${params.toString()}`);
  }
  async function getGrouped(storeId, groupBy, dateFrom, dateTo) {
    loading.value = true;
    try {
      const params = new URLSearchParams({ storeId, groupBy });
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo) params.set("dateTo", dateTo);
      return await fetchWithAuth(`/api/shopee-ads/group?${params.toString()}`);
    } finally {
      loading.value = false;
    }
  }
  async function importAds(storeId, files) {
    const authStore = useAuthStore();
    const form = new FormData();
    form.append("storeId", storeId);
    for (const f of files) form.append("files", f, f.name);
    return $fetch(
      "/api/shopee-ads/import",
      {
        method: "POST",
        body: form,
        headers: authStore.accessToken ? { Authorization: `Bearer ${authStore.accessToken}` } : {}
      }
    );
  }
  return { getAds, getSummary, getGrouped, importAds, loading };
}
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ShopeeAdsImportModal",
  __ssrInlineRender: true,
  props: {
    storeId: {}
  },
  emits: ["close", "imported"],
  setup(__props, { emit: __emit }) {
    useShopeeAds();
    const step = ref("pick");
    ref(null);
    const files = ref([]);
    const error = ref(null);
    const dragging = ref(false);
    const result = ref(null);
    const previewData = ref([]);
    const previewLoading = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" }, _attrs))}><div class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col"><div class="flex items-center justify-between px-6 py-4 border-b border-gray-100"><div><h2 class="text-base font-bold text-gray-900">Import Ads Shopee</h2><p class="text-xs text-gray-400 mt-0.5">Upload satu atau beberapa file CSV/Excel dari Shopee Seller Centre</p></div><button class="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><div class="flex-1 overflow-y-auto px-6 py-5 space-y-4">`);
      if (unref(step) === "pick") {
        _push(`<!--[--><div class="${ssrRenderClass([unref(dragging) ? "border-orange-400 bg-orange-50" : "border-gray-200 hover:border-orange-300 hover:bg-gray-50", "border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 transition-colors cursor-pointer"])}"><svg class="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg><div class="text-center"><p class="text-sm font-medium text-gray-700">Drag &amp; drop atau klik untuk pilih file</p><p class="text-xs text-gray-400 mt-0.5">CSV / Excel (.xlsx) dari Shopee Seller Centre \xB7 Bisa pilih banyak sekaligus</p></div><input type="file" accept=".csv,.xlsx,.xls" multiple class="hidden"></div>`);
        if (unref(files).length) {
          _push(`<div class="space-y-1.5"><!--[-->`);
          ssrRenderList(unref(files), (f, i) => {
            _push(`<div class="flex items-center gap-3 px-3 py-2 bg-orange-50 rounded-lg border border-orange-100"><svg class="w-4 h-4 text-orange-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z"></path></svg><span class="text-sm text-gray-700 flex-1 truncate">${ssrInterpolate(f.name)}</span><span class="text-xs text-gray-400">${ssrInterpolate((f.size / 1024).toFixed(0))} KB</span><button class="p-1 text-gray-400 hover:text-red-500 transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(error)) {
          _push(`<p class="text-sm text-red-500 text-center">${ssrInterpolate(unref(error))}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(previewLoading)) {
          _push(`<div class="flex justify-center py-4"><svg class="animate-spin h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg></div>`);
        } else if (unref(previewData).length) {
          _push(`<div class="space-y-4"><!--[-->`);
          ssrRenderList(unref(previewData), (pf) => {
            _push(`<div class="space-y-1.5"><div class="flex items-center gap-2"><p class="text-xs font-semibold text-gray-600 truncate">${ssrInterpolate(pf.fileName)}</p><span class="text-xs text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">${ssrInterpolate(pf.date)}</span></div><div class="overflow-x-auto rounded-xl border border-gray-100"><table class="w-full text-xs min-w-[640px]"><thead class="bg-gray-50"><tr class="text-gray-500"><th class="px-3 py-2 text-left font-medium">Nama Iklan</th><th class="px-3 py-2 text-left font-medium">Jenis</th><th class="px-3 py-2 text-right font-medium">Biaya</th><th class="px-3 py-2 text-right font-medium">Dilihat</th><th class="px-3 py-2 text-right font-medium">Klik</th><th class="px-3 py-2 text-right font-medium">Konversi</th><th class="px-3 py-2 text-right font-medium">Omzet</th></tr></thead><tbody class="divide-y divide-gray-50"><!--[-->`);
            ssrRenderList(pf.rows, (r, i) => {
              _push(`<tr class="hover:bg-gray-50"><td class="px-3 py-2 text-gray-700 max-w-[160px] truncate"${ssrRenderAttr("title", r.adName)}>${ssrInterpolate(r.adName)}</td><td class="px-3 py-2 text-gray-500">${ssrInterpolate(r.adType || "-")}</td><td class="px-3 py-2 text-right text-red-500">${ssrInterpolate(r.cost)}</td><td class="px-3 py-2 text-right text-gray-600">${ssrInterpolate(r.impressions)}</td><td class="px-3 py-2 text-right text-gray-600">${ssrInterpolate(r.clicks)}</td><td class="px-3 py-2 text-right text-gray-700">${ssrInterpolate(r.conversions)}</td><td class="px-3 py-2 text-right text-green-600 font-medium">${ssrInterpolate(r.revenue)}</td></tr>`);
            });
            _push(`<!--]--></tbody></table></div></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      } else if (unref(step) === "importing") {
        _push(`<div class="flex flex-col items-center justify-center py-12 gap-4"><svg class="animate-spin h-10 w-10 text-orange-400" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg><p class="text-sm text-gray-500">Sedang mengimport ${ssrInterpolate(unref(files).length)} file...</p></div>`);
      } else if (unref(step) === "result" && unref(result)) {
        _push(`<!--[--><div class="grid grid-cols-3 gap-3"><div class="bg-blue-50 rounded-xl p-4 text-center"><p class="text-2xl font-bold text-blue-600">${ssrInterpolate(unref(result).total)}</p><p class="text-xs text-blue-500 mt-1">Total Baris</p></div><div class="bg-green-50 rounded-xl p-4 text-center"><p class="text-2xl font-bold text-green-600">${ssrInterpolate(unref(result).imported)}</p><p class="text-xs text-green-500 mt-1">Berhasil Diimport</p></div><div class="bg-gray-50 rounded-xl p-4 text-center"><p class="text-2xl font-bold text-gray-500">${ssrInterpolate(unref(result).skipped)}</p><p class="text-xs text-gray-400 mt-1">Diperbarui</p></div></div>`);
        if (unref(result).errors.length) {
          _push(`<div class="space-y-1"><p class="text-xs font-semibold text-red-500">${ssrInterpolate(unref(result).errors.length)} error:</p><div class="bg-red-50 rounded-lg p-3 max-h-32 overflow-y-auto space-y-0.5"><!--[-->`);
          ssrRenderList(unref(result).errors, (e, i) => {
            _push(`<p class="text-xs text-red-600">${ssrInterpolate(e)}</p>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="px-6 py-4 border-t border-gray-100 flex justify-end gap-2"><button class="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">Tutup</button>`);
      if (unref(step) === "pick") {
        _push(`<button${ssrIncludeBooleanAttr(!unref(files).length) ? " disabled" : ""} class="px-5 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">Import ${ssrInterpolate(unref(files).length ? `(${unref(files).length} file)` : "")}</button>`);
      } else if (unref(step) === "result") {
        _push(`<button class="px-5 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors">Selesai</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ads/ShopeeAdsImportModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "shopee-ads",
  __ssrInlineRender: true,
  setup(__props) {
    const activeStoreStore = useActiveStoreStore();
    const storeId = computed(() => {
      var _a, _b;
      return (_b = (_a = activeStoreStore.store) == null ? void 0 : _a.id) != null ? _b : "";
    });
    const { getSummary, getGrouped, loading } = useShopeeAds();
    const rows = ref([]);
    const summary = ref(null);
    const groupBy = ref("ad");
    const groupOptions = [
      { value: "ad", label: "Per Iklan" },
      { value: "adType", label: "Per Jenis" },
      { value: "adPlacement", label: "Per Penempatan" }
    ];
    const dateFrom = ref("");
    const dateTo = ref("");
    const showImport = ref(false);
    const toast = ref(null);
    watch(toast, (v) => {
      if (v) setTimeout(() => {
        toast.value = null;
      }, 3e3);
    });
    const hasFilter = computed(() => dateFrom.value || dateTo.value);
    async function load() {
      if (!storeId.value) return;
      const [grouped, sum] = await Promise.all([
        getGrouped(storeId.value, groupBy.value, dateFrom.value || void 0, dateTo.value || void 0),
        getSummary(storeId.value, dateFrom.value || void 0, dateTo.value || void 0)
      ]);
      rows.value = grouped != null ? grouped : [];
      summary.value = sum != null ? sum : null;
    }
    let debounce = null;
    watch([dateFrom, dateTo], () => {
      if (debounce) clearTimeout(debounce);
      debounce = setTimeout(load, 300);
    });
    watch(groupBy, load);
    function fmtCurrency(n) {
      return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
    }
    function fmtNum(n) {
      return new Intl.NumberFormat("id-ID").format(n);
    }
    function fmtPct(n) {
      return (n * 100).toFixed(2) + "%";
    }
    function fmtRoas(n) {
      return n.toFixed(2) + "x";
    }
    const totals = computed(() => ({
      cost: rows.value.reduce((s, r) => s + r.cost, 0),
      impressions: rows.value.reduce((s, r) => s + r.impressions, 0),
      clicks: rows.value.reduce((s, r) => s + r.clicks, 0),
      conversions: rows.value.reduce((s, r) => s + r.conversions, 0),
      grossRevenue: rows.value.reduce((s, r) => s + r.grossRevenue, 0)
    }));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ShopeeAdsImportModal = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-5" }, _attrs))} data-v-6a7b52a8><div class="flex items-center justify-between gap-4 flex-wrap" data-v-6a7b52a8><div data-v-6a7b52a8><h1 class="text-2xl font-bold text-gray-900" data-v-6a7b52a8>Shopee Ads</h1><p class="text-sm text-gray-500 mt-0.5" data-v-6a7b52a8>Performa iklan teragregasi dari Shopee Seller Centre</p></div><button class="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition-colors shadow-sm" data-v-6a7b52a8><svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" data-v-6a7b52a8><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" data-v-6a7b52a8></path></svg> Import CSV / Excel </button></div>`);
      if (unref(summary)) {
        _push(`<div class="space-y-3" data-v-6a7b52a8><div class="grid grid-cols-2 lg:grid-cols-4 gap-3" data-v-6a7b52a8><div class="rounded-xl p-4 text-white bg-gradient-to-br from-orange-500 to-red-500" data-v-6a7b52a8><p class="text-xs font-medium opacity-80" data-v-6a7b52a8>Total Biaya Iklan</p><p class="text-2xl font-bold mt-1 leading-tight" data-v-6a7b52a8>${ssrInterpolate(fmtCurrency(unref(summary).totalCost))}</p><p class="text-xs opacity-70 mt-1" data-v-6a7b52a8>${ssrInterpolate(fmtNum(unref(summary).recordCount))} record</p></div><div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4" data-v-6a7b52a8><p class="text-xs text-gray-500 mb-1" data-v-6a7b52a8>Omzet Penjualan</p><p class="text-lg font-bold text-green-600" data-v-6a7b52a8>${ssrInterpolate(fmtCurrency(unref(summary).totalGrossRevenue))}</p><p class="text-xs text-gray-400 mt-0.5" data-v-6a7b52a8>${ssrInterpolate(fmtNum(unref(summary).totalConversions))} konversi</p></div><div class="bg-white rounded-xl border border-emerald-100 shadow-sm p-4" data-v-6a7b52a8><p class="text-xs text-gray-500 mb-1" data-v-6a7b52a8>ROAS</p><p class="${ssrRenderClass([unref(summary).roas >= 1 ? "text-emerald-600" : "text-red-500", "text-lg font-bold"])}" data-v-6a7b52a8>${ssrInterpolate(fmtRoas(unref(summary).roas))}</p><p class="text-xs text-gray-400 mt-0.5" data-v-6a7b52a8>Revenue / Cost</p></div><div class="bg-white rounded-xl border border-amber-100 shadow-sm p-4" data-v-6a7b52a8><p class="text-xs text-gray-500 mb-1" data-v-6a7b52a8>Cost per Konversi</p><p class="text-lg font-bold text-amber-600" data-v-6a7b52a8>${ssrInterpolate(fmtCurrency(unref(summary).avgCostPerConversion))}</p><p class="text-xs text-gray-400 mt-0.5" data-v-6a7b52a8>Avg per order</p></div></div><div class="grid grid-cols-2 lg:grid-cols-4 gap-3" data-v-6a7b52a8><div class="bg-white rounded-xl border border-orange-100 shadow-sm p-4" data-v-6a7b52a8><p class="text-xs text-gray-500 mb-1" data-v-6a7b52a8>Impressi (Dilihat)</p><p class="text-lg font-bold text-orange-500" data-v-6a7b52a8>${ssrInterpolate(fmtNum(unref(summary).totalImpressions))}</p><p class="text-xs text-gray-400 mt-0.5" data-v-6a7b52a8>Tayang</p></div><div class="bg-white rounded-xl border border-purple-100 shadow-sm p-4" data-v-6a7b52a8><p class="text-xs text-gray-500 mb-1" data-v-6a7b52a8>Klik</p><p class="text-lg font-bold text-purple-600" data-v-6a7b52a8>${ssrInterpolate(fmtNum(unref(summary).totalClicks))}</p><p class="text-xs text-gray-400 mt-0.5" data-v-6a7b52a8>Jumlah klik</p></div><div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4" data-v-6a7b52a8><p class="text-xs text-gray-500 mb-1" data-v-6a7b52a8>CTR</p><p class="text-lg font-bold text-gray-700" data-v-6a7b52a8>${ssrInterpolate(fmtPct(unref(summary).avgCtr))}</p><p class="text-xs text-gray-400 mt-0.5" data-v-6a7b52a8>Click-through rate</p></div><div class="bg-white rounded-xl border border-teal-100 shadow-sm p-4" data-v-6a7b52a8><p class="text-xs text-gray-500 mb-1" data-v-6a7b52a8>CPC</p><p class="text-lg font-bold text-teal-600" data-v-6a7b52a8>${ssrInterpolate(fmtCurrency(unref(summary).avgCpc))}</p><p class="text-xs text-gray-400 mt-0.5" data-v-6a7b52a8>Cost per click</p></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-wrap gap-3 items-end" data-v-6a7b52a8><div data-v-6a7b52a8><label class="block text-xs text-gray-500 mb-1" data-v-6a7b52a8>Dari</label><input${ssrRenderAttr("value", unref(dateFrom))} type="date" class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" data-v-6a7b52a8></div><div data-v-6a7b52a8><label class="block text-xs text-gray-500 mb-1" data-v-6a7b52a8>Sampai</label><input${ssrRenderAttr("value", unref(dateTo))} type="date" class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" data-v-6a7b52a8></div>`);
      if (unref(hasFilter)) {
        _push(`<button class="text-xs text-gray-400 hover:text-red-500 px-2 py-2 transition-colors" data-v-6a7b52a8>Reset</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex-1" data-v-6a7b52a8></div><div data-v-6a7b52a8><label class="block text-xs text-gray-500 mb-1" data-v-6a7b52a8>Tampilkan</label><div class="flex rounded-lg border border-gray-200 overflow-hidden text-sm" data-v-6a7b52a8><!--[-->`);
      ssrRenderList(groupOptions, (opt) => {
        _push(`<button class="${ssrRenderClass([unref(groupBy) === opt.value ? "bg-orange-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50", "px-4 py-2 font-medium transition-colors border-r border-gray-200 last:border-r-0"])}" data-v-6a7b52a8>${ssrInterpolate(opt.label)}</button>`);
      });
      _push(`<!--]--></div></div></div><div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden" data-v-6a7b52a8>`);
      if (unref(loading)) {
        _push(`<div class="flex justify-center py-16" data-v-6a7b52a8><svg class="animate-spin h-7 w-7 text-orange-400" fill="none" viewBox="0 0 24 24" data-v-6a7b52a8><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-6a7b52a8></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" data-v-6a7b52a8></path></svg></div>`);
      } else if (unref(rows).length === 0) {
        _push(`<div class="py-20 text-center" data-v-6a7b52a8><svg class="w-12 h-12 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-6a7b52a8><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" data-v-6a7b52a8></path></svg><p class="text-gray-400 text-sm" data-v-6a7b52a8>Belum ada data. Import file CSV dari Shopee Seller Centre.</p></div>`);
      } else {
        _push(`<div class="overflow-x-auto" data-v-6a7b52a8>`);
        if (unref(groupBy) === "ad") {
          _push(`<table class="w-full text-sm min-w-[1100px]" data-v-6a7b52a8><thead class="bg-gray-50 border-b border-gray-100" data-v-6a7b52a8><tr class="text-xs text-gray-500" data-v-6a7b52a8><th class="px-4 py-3 text-left font-medium" data-v-6a7b52a8>Nama Iklan</th><th class="px-4 py-3 text-left font-medium" data-v-6a7b52a8>Jenis</th><th class="px-4 py-3 text-left font-medium" data-v-6a7b52a8>Kode Produk</th><th class="px-4 py-3 text-left font-medium" data-v-6a7b52a8>Mode Bidding</th><th class="px-4 py-3 text-right font-medium" data-v-6a7b52a8>Biaya</th><th class="px-4 py-3 text-right font-medium" data-v-6a7b52a8>Dilihat</th><th class="px-4 py-3 text-right font-medium" data-v-6a7b52a8>Klik</th><th class="px-4 py-3 text-right font-medium" data-v-6a7b52a8>CTR</th><th class="px-4 py-3 text-right font-medium" data-v-6a7b52a8>Konversi</th><th class="px-4 py-3 text-right font-medium" data-v-6a7b52a8>CVR</th><th class="px-4 py-3 text-right font-medium" data-v-6a7b52a8>CPC</th><th class="px-4 py-3 text-right font-medium" data-v-6a7b52a8>Cost/Conv</th><th class="px-4 py-3 text-right font-medium" data-v-6a7b52a8>Omzet</th><th class="px-4 py-3 text-right font-medium" data-v-6a7b52a8>ROAS</th></tr></thead><tbody class="divide-y divide-gray-50" data-v-6a7b52a8><!--[-->`);
          ssrRenderList(unref(rows), (r) => {
            _push(`<tr class="hover:bg-gray-50/60" data-v-6a7b52a8><td class="px-4 py-3 max-w-[180px]" data-v-6a7b52a8><p class="text-gray-800 font-medium text-xs truncate"${ssrRenderAttr("title", r.adName)} data-v-6a7b52a8>${ssrInterpolate(r.adName)}</p></td><td class="px-4 py-3 text-gray-500 text-xs whitespace-nowrap" data-v-6a7b52a8>${ssrInterpolate(r.adType || "-")}</td><td class="px-4 py-3 text-gray-400 text-xs font-mono" data-v-6a7b52a8>${ssrInterpolate(r.productCode || "-")}</td><td class="px-4 py-3 text-gray-500 text-xs" data-v-6a7b52a8>${ssrInterpolate(r.biddingMode || "-")}</td><td class="px-4 py-3 text-right font-semibold text-red-500 text-xs" data-v-6a7b52a8>${ssrInterpolate(fmtCurrency(r.cost))}</td><td class="px-4 py-3 text-right text-gray-600 text-xs" data-v-6a7b52a8>${ssrInterpolate(fmtNum(r.impressions))}</td><td class="px-4 py-3 text-right text-gray-600 text-xs" data-v-6a7b52a8>${ssrInterpolate(fmtNum(r.clicks))}</td><td class="px-4 py-3 text-right text-gray-500 text-xs" data-v-6a7b52a8>${ssrInterpolate(fmtPct(r.ctr))}</td><td class="px-4 py-3 text-right text-gray-700 font-medium text-xs" data-v-6a7b52a8>${ssrInterpolate(fmtNum(r.conversions))}</td><td class="px-4 py-3 text-right text-gray-500 text-xs" data-v-6a7b52a8>${ssrInterpolate(fmtPct(r.cvr))}</td><td class="px-4 py-3 text-right text-amber-600 text-xs" data-v-6a7b52a8>${ssrInterpolate(fmtCurrency(r.cpc))}</td><td class="px-4 py-3 text-right text-amber-600 text-xs" data-v-6a7b52a8>${ssrInterpolate(fmtCurrency(r.costPerConversion))}</td><td class="px-4 py-3 text-right font-semibold text-green-600 text-xs" data-v-6a7b52a8>${ssrInterpolate(fmtCurrency(r.grossRevenue))}</td><td class="${ssrRenderClass([r.roas >= 1 ? "text-emerald-600" : "text-red-500", "px-4 py-3 text-right text-xs font-bold"])}" data-v-6a7b52a8>${ssrInterpolate(fmtRoas(r.roas))}</td></tr>`);
          });
          _push(`<!--]--></tbody><tfoot class="bg-gray-50 border-t-2 border-gray-200" data-v-6a7b52a8><tr class="text-xs font-semibold text-gray-700" data-v-6a7b52a8><td class="px-4 py-3" colspan="4" data-v-6a7b52a8>Total (${ssrInterpolate(unref(rows).length)} iklan)</td><td class="px-4 py-3 text-right text-red-500" data-v-6a7b52a8>${ssrInterpolate(fmtCurrency(unref(totals).cost))}</td><td class="px-4 py-3 text-right" data-v-6a7b52a8>${ssrInterpolate(fmtNum(unref(totals).impressions))}</td><td class="px-4 py-3 text-right" data-v-6a7b52a8>${ssrInterpolate(fmtNum(unref(totals).clicks))}</td><td class="px-4 py-3 text-right text-gray-400" data-v-6a7b52a8>\u2014</td><td class="px-4 py-3 text-right" data-v-6a7b52a8>${ssrInterpolate(fmtNum(unref(totals).conversions))}</td><td class="px-4 py-3 text-right text-gray-400" data-v-6a7b52a8>\u2014</td><td class="px-4 py-3 text-right text-gray-400" data-v-6a7b52a8>\u2014</td><td class="px-4 py-3 text-right text-gray-400" data-v-6a7b52a8>\u2014</td><td class="px-4 py-3 text-right text-green-600" data-v-6a7b52a8>${ssrInterpolate(fmtCurrency(unref(totals).grossRevenue))}</td><td class="px-4 py-3 text-right text-gray-400" data-v-6a7b52a8>\u2014</td></tr></tfoot></table>`);
        } else {
          _push(`<table class="w-full text-sm min-w-[800px]" data-v-6a7b52a8><thead class="bg-gray-50 border-b border-gray-100" data-v-6a7b52a8><tr class="text-xs text-gray-500" data-v-6a7b52a8><th class="px-4 py-3 text-left font-medium" data-v-6a7b52a8>${ssrInterpolate(unref(groupBy) === "adType" ? "Jenis Iklan" : "Penempatan")}</th><th class="px-4 py-3 text-right font-medium" data-v-6a7b52a8>Biaya</th><th class="px-4 py-3 text-right font-medium" data-v-6a7b52a8>Dilihat</th><th class="px-4 py-3 text-right font-medium" data-v-6a7b52a8>Klik</th><th class="px-4 py-3 text-right font-medium" data-v-6a7b52a8>CTR</th><th class="px-4 py-3 text-right font-medium" data-v-6a7b52a8>Konversi</th><th class="px-4 py-3 text-right font-medium" data-v-6a7b52a8>CVR</th><th class="px-4 py-3 text-right font-medium" data-v-6a7b52a8>CPC</th><th class="px-4 py-3 text-right font-medium" data-v-6a7b52a8>Cost/Conv</th><th class="px-4 py-3 text-right font-medium" data-v-6a7b52a8>Omzet</th><th class="px-4 py-3 text-right font-medium" data-v-6a7b52a8>ROAS</th></tr></thead><tbody class="divide-y divide-gray-50" data-v-6a7b52a8><!--[-->`);
          ssrRenderList(unref(rows), (r) => {
            _push(`<tr class="hover:bg-gray-50/60" data-v-6a7b52a8><td class="px-4 py-3" data-v-6a7b52a8><p class="text-gray-800 font-medium text-xs" data-v-6a7b52a8>${ssrInterpolate(r.key || "-")}</p></td><td class="px-4 py-3 text-right font-semibold text-red-500 text-xs" data-v-6a7b52a8>${ssrInterpolate(fmtCurrency(r.cost))}</td><td class="px-4 py-3 text-right text-gray-600 text-xs" data-v-6a7b52a8>${ssrInterpolate(fmtNum(r.impressions))}</td><td class="px-4 py-3 text-right text-gray-600 text-xs" data-v-6a7b52a8>${ssrInterpolate(fmtNum(r.clicks))}</td><td class="px-4 py-3 text-right text-gray-500 text-xs" data-v-6a7b52a8>${ssrInterpolate(fmtPct(r.ctr))}</td><td class="px-4 py-3 text-right text-gray-700 font-medium text-xs" data-v-6a7b52a8>${ssrInterpolate(fmtNum(r.conversions))}</td><td class="px-4 py-3 text-right text-gray-500 text-xs" data-v-6a7b52a8>${ssrInterpolate(fmtPct(r.cvr))}</td><td class="px-4 py-3 text-right text-amber-600 text-xs" data-v-6a7b52a8>${ssrInterpolate(fmtCurrency(r.cpc))}</td><td class="px-4 py-3 text-right text-amber-600 text-xs" data-v-6a7b52a8>${ssrInterpolate(fmtCurrency(r.costPerConversion))}</td><td class="px-4 py-3 text-right font-semibold text-green-600 text-xs" data-v-6a7b52a8>${ssrInterpolate(fmtCurrency(r.grossRevenue))}</td><td class="${ssrRenderClass([r.roas >= 1 ? "text-emerald-600" : "text-red-500", "px-4 py-3 text-right text-xs font-bold"])}" data-v-6a7b52a8>${ssrInterpolate(fmtRoas(r.roas))}</td></tr>`);
          });
          _push(`<!--]--></tbody><tfoot class="bg-gray-50 border-t-2 border-gray-200" data-v-6a7b52a8><tr class="text-xs font-semibold text-gray-700" data-v-6a7b52a8><td class="px-4 py-3" data-v-6a7b52a8>Total (${ssrInterpolate(unref(rows).length)})</td><td class="px-4 py-3 text-right text-red-500" data-v-6a7b52a8>${ssrInterpolate(fmtCurrency(unref(totals).cost))}</td><td class="px-4 py-3 text-right" data-v-6a7b52a8>${ssrInterpolate(fmtNum(unref(totals).impressions))}</td><td class="px-4 py-3 text-right" data-v-6a7b52a8>${ssrInterpolate(fmtNum(unref(totals).clicks))}</td><td class="px-4 py-3 text-right text-gray-400" data-v-6a7b52a8>\u2014</td><td class="px-4 py-3 text-right" data-v-6a7b52a8>${ssrInterpolate(fmtNum(unref(totals).conversions))}</td><td class="px-4 py-3 text-right text-gray-400" data-v-6a7b52a8>\u2014</td><td class="px-4 py-3 text-right text-gray-400" data-v-6a7b52a8>\u2014</td><td class="px-4 py-3 text-right text-gray-400" data-v-6a7b52a8>\u2014</td><td class="px-4 py-3 text-right text-green-600" data-v-6a7b52a8>${ssrInterpolate(fmtCurrency(unref(totals).grossRevenue))}</td><td class="px-4 py-3 text-right text-gray-400" data-v-6a7b52a8>\u2014</td></tr></tfoot></table>`);
        }
        _push(`</div>`);
      }
      _push(`</div>`);
      if (unref(showImport)) {
        _push(ssrRenderComponent(_component_ShopeeAdsImportModal, {
          "store-id": unref(storeId),
          onClose: ($event) => showImport.value = false,
          onImported: () => {
            showImport.value = false;
            load();
          }
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(toast)) {
        _push(`<div class="${ssrRenderClass([unref(toast).type === "success" ? "bg-green-600" : "bg-red-600", "fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white"])}" data-v-6a7b52a8>${ssrInterpolate(unref(toast).message)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/store/shopee-ads.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const shopeeAds = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-6a7b52a8"]]);

export { shopeeAds as default };
//# sourceMappingURL=shopee-ads-XJ1CMUZZ.mjs.map
