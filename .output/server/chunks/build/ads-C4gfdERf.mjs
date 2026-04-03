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

function useTikTokAds() {
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
        `/api/tiktok-ads?${params.toString()}`
      );
    } finally {
      loading.value = false;
    }
  }
  async function getSummary(storeId, dateFrom, dateTo, campaignId) {
    const params = new URLSearchParams({ storeId });
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    if (campaignId) params.set("campaignId", campaignId);
    return fetchWithAuth(`/api/tiktok-ads/summary?${params.toString()}`);
  }
  async function deleteAd(id) {
    return fetchWithAuth(`/api/tiktok-ads/${id}`, { method: "DELETE" });
  }
  async function getGrouped(storeId, groupBy, dateFrom, dateTo) {
    loading.value = true;
    try {
      const params = new URLSearchParams({ storeId, groupBy });
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo) params.set("dateTo", dateTo);
      return await fetchWithAuth(`/api/tiktok-ads/group?${params.toString()}`);
    } finally {
      loading.value = false;
    }
  }
  async function importAds(storeId, file) {
    const authStore = useAuthStore();
    const form = new FormData();
    form.append("storeId", storeId);
    form.append("file", file);
    return $fetch(
      "/api/tiktok-ads/import",
      {
        method: "POST",
        body: form,
        headers: authStore.accessToken ? { Authorization: `Bearer ${authStore.accessToken}` } : {}
      }
    );
  }
  return { getAds, getSummary, deleteAd, getGrouped, importAds, loading };
}
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "TikTokAdsImportModal",
  __ssrInlineRender: true,
  props: {
    storeId: {}
  },
  emits: ["close", "imported"],
  setup(__props, { emit: __emit }) {
    useTikTokAds();
    const step = ref("pick");
    ref(null);
    const file = ref(null);
    const error = ref(null);
    const dragging = ref(false);
    const result = ref(null);
    const previewRows = ref([]);
    const previewLoading = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" }, _attrs))}><div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"><div class="flex items-center justify-between px-6 py-4 border-b border-gray-100"><div><h2 class="text-base font-bold text-gray-900">Import Ads TikTok</h2><p class="text-xs text-gray-400 mt-0.5">Upload file Excel dari TikTok Ads Manager</p></div><button class="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><div class="flex-1 overflow-y-auto px-6 py-5 space-y-4">`);
      if (unref(step) === "pick") {
        _push(`<!--[--><div class="${ssrRenderClass([unref(dragging) ? "border-blue-400 bg-blue-50" : "border-gray-200 hover:border-blue-300 hover:bg-gray-50", "border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 transition-colors cursor-pointer"])}"><svg class="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg><div class="text-center"><p class="text-sm font-medium text-gray-700">${ssrInterpolate(unref(file) ? unref(file).name : "Drag & drop atau klik untuk pilih file")}</p><p class="text-xs text-gray-400 mt-0.5">Excel (.xlsx / .xls) dari TikTok Ads Manager</p></div><input type="file" accept=".xlsx,.xls,.csv" class="hidden"></div>`);
        if (unref(error)) {
          _push(`<p class="text-sm text-red-500 text-center">${ssrInterpolate(unref(error))}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(previewLoading)) {
          _push(`<div class="flex justify-center py-4"><svg class="animate-spin h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg></div>`);
        } else if (unref(previewRows).length) {
          _push(`<div class="space-y-2"><p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Preview (10 baris pertama)</p><div class="overflow-x-auto rounded-xl border border-gray-100"><table class="w-full text-xs min-w-[640px]"><thead class="bg-gray-50"><tr class="text-gray-500"><th class="px-3 py-2 text-left font-medium">Tanggal</th><th class="px-3 py-2 text-left font-medium">Campaign</th><th class="px-3 py-2 text-left font-medium">Ad Group</th><th class="px-3 py-2 text-right font-medium">Cost</th><th class="px-3 py-2 text-right font-medium">Impresi</th><th class="px-3 py-2 text-right font-medium">Klik</th><th class="px-3 py-2 text-right font-medium">Konversi</th><th class="px-3 py-2 text-right font-medium">Revenue</th></tr></thead><tbody class="divide-y divide-gray-50"><!--[-->`);
          ssrRenderList(unref(previewRows), (r, i) => {
            _push(`<tr class="hover:bg-gray-50"><td class="px-3 py-2 text-gray-600">${ssrInterpolate(r.date)}</td><td class="px-3 py-2 text-gray-700 max-w-[120px] truncate">${ssrInterpolate(r.campaign)}</td><td class="px-3 py-2 text-gray-700 max-w-[120px] truncate">${ssrInterpolate(r.adGroup)}</td><td class="px-3 py-2 text-right text-gray-800">${ssrInterpolate(r.cost)}</td><td class="px-3 py-2 text-right text-gray-600">${ssrInterpolate(r.impressions)}</td><td class="px-3 py-2 text-right text-gray-600">${ssrInterpolate(r.clicks)}</td><td class="px-3 py-2 text-right text-gray-600">${ssrInterpolate(r.conversions)}</td><td class="px-3 py-2 text-right text-green-600 font-medium">${ssrInterpolate(r.revenue)}</td></tr>`);
          });
          _push(`<!--]--></tbody></table></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      } else if (unref(step) === "importing") {
        _push(`<div class="flex flex-col items-center justify-center py-12 gap-4"><svg class="animate-spin h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg><p class="text-sm text-gray-500">Sedang mengimport data ads...</p></div>`);
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
      _push(`</div><div class="px-6 py-4 border-t border-gray-100 flex justify-end gap-2"><button class="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"> Tutup </button>`);
      if (unref(step) === "pick") {
        _push(`<button${ssrIncludeBooleanAttr(!unref(file)) ? " disabled" : ""} class="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"> Import </button>`);
      } else if (unref(step) === "result") {
        _push(`<button class="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"> Selesai </button>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ads/TikTokAdsImportModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ads",
  __ssrInlineRender: true,
  setup(__props) {
    const activeStoreStore = useActiveStoreStore();
    const storeId = computed(() => {
      var _a, _b;
      return (_b = (_a = activeStoreStore.store) == null ? void 0 : _a.id) != null ? _b : "";
    });
    const { getSummary, getGrouped, loading } = useTikTokAds();
    const rows = ref([]);
    const summary = ref(null);
    const groupBy = ref("campaign");
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
    return (_ctx, _push, _parent, _attrs) => {
      const _component_TikTokAdsImportModal = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-5" }, _attrs))} data-v-d90fbb81><div class="flex items-center justify-between gap-4 flex-wrap" data-v-d90fbb81><div data-v-d90fbb81><h1 class="text-2xl font-bold text-gray-900" data-v-d90fbb81>TikTok Ads</h1><p class="text-sm text-gray-500 mt-0.5" data-v-d90fbb81>Performa iklan teragregasi dari TikTok Ads Manager</p></div><button class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm" data-v-d90fbb81><svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" data-v-d90fbb81><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" data-v-d90fbb81></path></svg> Import Excel </button></div>`);
      if (unref(summary)) {
        _push(`<div class="space-y-3" data-v-d90fbb81><div class="grid grid-cols-2 lg:grid-cols-4 gap-3" data-v-d90fbb81><div class="rounded-xl p-4 text-white bg-gradient-to-br from-rose-500 to-red-600" data-v-d90fbb81><p class="text-xs font-medium opacity-80" data-v-d90fbb81>Total Biaya Iklan</p><p class="text-2xl font-bold mt-1 leading-tight" data-v-d90fbb81>${ssrInterpolate(fmtCurrency(unref(summary).totalCost))}</p><p class="text-xs opacity-70 mt-1" data-v-d90fbb81>${ssrInterpolate(fmtNum(unref(summary).recordCount))} record</p></div><div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4" data-v-d90fbb81><p class="text-xs text-gray-500 mb-1" data-v-d90fbb81>Gross Revenue</p><p class="text-lg font-bold text-green-600" data-v-d90fbb81>${ssrInterpolate(fmtCurrency(unref(summary).totalGrossRevenue))}</p><p class="text-xs text-gray-400 mt-0.5" data-v-d90fbb81>${ssrInterpolate(fmtNum(unref(summary).totalConversions))} konversi</p></div><div class="bg-white rounded-xl border border-emerald-100 shadow-sm p-4" data-v-d90fbb81><p class="text-xs text-gray-500 mb-1" data-v-d90fbb81>ROAS</p><p class="${ssrRenderClass([unref(summary).roas >= 1 ? "text-emerald-600" : "text-red-500", "text-lg font-bold"])}" data-v-d90fbb81>${ssrInterpolate(fmtRoas(unref(summary).roas))}</p><p class="text-xs text-gray-400 mt-0.5" data-v-d90fbb81>Revenue / Cost</p></div><div class="bg-white rounded-xl border border-amber-100 shadow-sm p-4" data-v-d90fbb81><p class="text-xs text-gray-500 mb-1" data-v-d90fbb81>Cost per Konversi</p><p class="text-lg font-bold text-amber-600" data-v-d90fbb81>${ssrInterpolate(fmtCurrency(unref(summary).avgCostPerConversion))}</p><p class="text-xs text-gray-400 mt-0.5" data-v-d90fbb81>Avg per order</p></div></div><div class="grid grid-cols-2 lg:grid-cols-4 gap-3" data-v-d90fbb81><div class="bg-white rounded-xl border border-blue-100 shadow-sm p-4" data-v-d90fbb81><p class="text-xs text-gray-500 mb-1" data-v-d90fbb81>Impressi</p><p class="text-lg font-bold text-blue-600" data-v-d90fbb81>${ssrInterpolate(fmtNum(unref(summary).totalImpressions))}</p><p class="text-xs text-gray-400 mt-0.5" data-v-d90fbb81>Tayang</p></div><div class="bg-white rounded-xl border border-purple-100 shadow-sm p-4" data-v-d90fbb81><p class="text-xs text-gray-500 mb-1" data-v-d90fbb81>Klik</p><p class="text-lg font-bold text-purple-600" data-v-d90fbb81>${ssrInterpolate(fmtNum(unref(summary).totalClicks))}</p><p class="text-xs text-gray-400 mt-0.5" data-v-d90fbb81>Destination clicks</p></div><div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4" data-v-d90fbb81><p class="text-xs text-gray-500 mb-1" data-v-d90fbb81>CTR</p><p class="text-lg font-bold text-gray-700" data-v-d90fbb81>${ssrInterpolate(fmtPct(unref(summary).avgCtr))}</p><p class="text-xs text-gray-400 mt-0.5" data-v-d90fbb81>Click-through rate</p></div><div class="bg-white rounded-xl border border-teal-100 shadow-sm p-4" data-v-d90fbb81><p class="text-xs text-gray-500 mb-1" data-v-d90fbb81>CPC</p><p class="text-lg font-bold text-teal-600" data-v-d90fbb81>${ssrInterpolate(fmtCurrency(unref(summary).avgCpc))}</p><p class="text-xs text-gray-400 mt-0.5" data-v-d90fbb81>Cost per click</p></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-wrap gap-3 items-end" data-v-d90fbb81><div data-v-d90fbb81><label class="block text-xs text-gray-500 mb-1" data-v-d90fbb81>Dari</label><input${ssrRenderAttr("value", unref(dateFrom))} type="date" class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" data-v-d90fbb81></div><div data-v-d90fbb81><label class="block text-xs text-gray-500 mb-1" data-v-d90fbb81>Sampai</label><input${ssrRenderAttr("value", unref(dateTo))} type="date" class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" data-v-d90fbb81></div>`);
      if (unref(hasFilter)) {
        _push(`<button class="text-xs text-gray-400 hover:text-red-500 px-2 py-2 transition-colors" data-v-d90fbb81>Reset</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex-1" data-v-d90fbb81></div><div data-v-d90fbb81><label class="block text-xs text-gray-500 mb-1" data-v-d90fbb81>Tampilkan</label><div class="flex rounded-lg border border-gray-200 overflow-hidden text-sm" data-v-d90fbb81><button class="${ssrRenderClass([unref(groupBy) === "campaign" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50", "px-4 py-2 font-medium transition-colors"])}" data-v-d90fbb81>Per Campaign</button><button class="${ssrRenderClass([unref(groupBy) === "adGroup" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50", "px-4 py-2 font-medium transition-colors border-l border-gray-200"])}" data-v-d90fbb81>Per Ad Group</button></div></div></div><div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden" data-v-d90fbb81>`);
      if (unref(loading)) {
        _push(`<div class="flex justify-center py-16" data-v-d90fbb81><svg class="animate-spin h-7 w-7 text-blue-500" fill="none" viewBox="0 0 24 24" data-v-d90fbb81><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-d90fbb81></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" data-v-d90fbb81></path></svg></div>`);
      } else if (unref(rows).length === 0) {
        _push(`<div class="py-20 text-center" data-v-d90fbb81><svg class="w-12 h-12 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-d90fbb81><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" data-v-d90fbb81></path></svg><p class="text-gray-400 text-sm" data-v-d90fbb81>Belum ada data. Import file Excel dari TikTok Ads Manager.</p></div>`);
      } else {
        _push(`<div class="overflow-x-auto" data-v-d90fbb81>`);
        if (unref(groupBy) === "campaign") {
          _push(`<table class="w-full text-sm min-w-[900px]" data-v-d90fbb81><thead class="bg-gray-50 border-b border-gray-100" data-v-d90fbb81><tr class="text-xs text-gray-500" data-v-d90fbb81><th class="px-4 py-3 text-left font-medium" data-v-d90fbb81>Campaign</th><th class="px-4 py-3 text-right font-medium" data-v-d90fbb81>Cost</th><th class="px-4 py-3 text-right font-medium" data-v-d90fbb81>Impressi</th><th class="px-4 py-3 text-right font-medium" data-v-d90fbb81>Klik</th><th class="px-4 py-3 text-right font-medium" data-v-d90fbb81>CTR</th><th class="px-4 py-3 text-right font-medium" data-v-d90fbb81>Konversi</th><th class="px-4 py-3 text-right font-medium" data-v-d90fbb81>CVR</th><th class="px-4 py-3 text-right font-medium" data-v-d90fbb81>CPC</th><th class="px-4 py-3 text-right font-medium" data-v-d90fbb81>Cost/Conv</th><th class="px-4 py-3 text-right font-medium" data-v-d90fbb81>Revenue</th><th class="px-4 py-3 text-right font-medium" data-v-d90fbb81>ROAS</th></tr></thead><tbody class="divide-y divide-gray-50" data-v-d90fbb81><!--[-->`);
          ssrRenderList(unref(rows), (r) => {
            _push(`<tr class="hover:bg-gray-50/60" data-v-d90fbb81><td class="px-4 py-3 max-w-[200px]" data-v-d90fbb81><p class="text-gray-800 font-medium text-xs truncate"${ssrRenderAttr("title", r.campaignName)} data-v-d90fbb81>${ssrInterpolate(r.campaignName)}</p><p class="text-gray-400 text-xs" data-v-d90fbb81>ID: ${ssrInterpolate(r.campaignId)}</p></td><td class="px-4 py-3 text-right font-semibold text-red-500 text-xs" data-v-d90fbb81>${ssrInterpolate(fmtCurrency(r.cost))}</td><td class="px-4 py-3 text-right text-gray-600 text-xs" data-v-d90fbb81>${ssrInterpolate(fmtNum(r.impressions))}</td><td class="px-4 py-3 text-right text-gray-600 text-xs" data-v-d90fbb81>${ssrInterpolate(fmtNum(r.clicks))}</td><td class="px-4 py-3 text-right text-gray-500 text-xs" data-v-d90fbb81>${ssrInterpolate(fmtPct(r.ctr))}</td><td class="px-4 py-3 text-right text-gray-700 font-medium text-xs" data-v-d90fbb81>${ssrInterpolate(fmtNum(r.conversions))}</td><td class="px-4 py-3 text-right text-gray-500 text-xs" data-v-d90fbb81>${ssrInterpolate(fmtPct(r.cvr))}</td><td class="px-4 py-3 text-right text-amber-600 text-xs" data-v-d90fbb81>${ssrInterpolate(fmtCurrency(r.cpc))}</td><td class="px-4 py-3 text-right text-amber-600 text-xs" data-v-d90fbb81>${ssrInterpolate(fmtCurrency(r.costPerConversion))}</td><td class="px-4 py-3 text-right font-semibold text-green-600 text-xs" data-v-d90fbb81>${ssrInterpolate(fmtCurrency(r.grossRevenue))}</td><td class="${ssrRenderClass([r.roas >= 1 ? "text-emerald-600" : "text-red-500", "px-4 py-3 text-right text-xs font-bold"])}" data-v-d90fbb81>${ssrInterpolate(fmtRoas(r.roas))}</td></tr>`);
          });
          _push(`<!--]--></tbody><tfoot class="bg-gray-50 border-t-2 border-gray-200" data-v-d90fbb81><tr class="text-xs font-semibold text-gray-700" data-v-d90fbb81><td class="px-4 py-3" data-v-d90fbb81>Total (${ssrInterpolate(unref(rows).length)} campaign)</td><td class="px-4 py-3 text-right text-red-500" data-v-d90fbb81>${ssrInterpolate(fmtCurrency(unref(rows).reduce((s, r) => s + r.cost, 0)))}</td><td class="px-4 py-3 text-right" data-v-d90fbb81>${ssrInterpolate(fmtNum(unref(rows).reduce((s, r) => s + r.impressions, 0)))}</td><td class="px-4 py-3 text-right" data-v-d90fbb81>${ssrInterpolate(fmtNum(unref(rows).reduce((s, r) => s + r.clicks, 0)))}</td><td class="px-4 py-3 text-right text-gray-400" data-v-d90fbb81>\u2014</td><td class="px-4 py-3 text-right" data-v-d90fbb81>${ssrInterpolate(fmtNum(unref(rows).reduce((s, r) => s + r.conversions, 0)))}</td><td class="px-4 py-3 text-right text-gray-400" data-v-d90fbb81>\u2014</td><td class="px-4 py-3 text-right text-gray-400" data-v-d90fbb81>\u2014</td><td class="px-4 py-3 text-right text-gray-400" data-v-d90fbb81>\u2014</td><td class="px-4 py-3 text-right text-green-600" data-v-d90fbb81>${ssrInterpolate(fmtCurrency(unref(rows).reduce((s, r) => s + r.grossRevenue, 0)))}</td><td class="px-4 py-3 text-right text-gray-400" data-v-d90fbb81>\u2014</td></tr></tfoot></table>`);
        } else {
          _push(`<table class="w-full text-sm min-w-[1050px]" data-v-d90fbb81><thead class="bg-gray-50 border-b border-gray-100" data-v-d90fbb81><tr class="text-xs text-gray-500" data-v-d90fbb81><th class="px-4 py-3 text-left font-medium" data-v-d90fbb81>Campaign</th><th class="px-4 py-3 text-left font-medium" data-v-d90fbb81>Ad Group</th><th class="px-4 py-3 text-right font-medium" data-v-d90fbb81>Cost</th><th class="px-4 py-3 text-right font-medium" data-v-d90fbb81>Impressi</th><th class="px-4 py-3 text-right font-medium" data-v-d90fbb81>Klik</th><th class="px-4 py-3 text-right font-medium" data-v-d90fbb81>CTR</th><th class="px-4 py-3 text-right font-medium" data-v-d90fbb81>Konversi</th><th class="px-4 py-3 text-right font-medium" data-v-d90fbb81>CVR</th><th class="px-4 py-3 text-right font-medium" data-v-d90fbb81>CPC</th><th class="px-4 py-3 text-right font-medium" data-v-d90fbb81>Cost/Conv</th><th class="px-4 py-3 text-right font-medium" data-v-d90fbb81>Revenue</th><th class="px-4 py-3 text-right font-medium" data-v-d90fbb81>ROAS</th></tr></thead><tbody class="divide-y divide-gray-50" data-v-d90fbb81><!--[-->`);
          ssrRenderList(unref(rows), (r) => {
            var _a;
            _push(`<tr class="hover:bg-gray-50/60" data-v-d90fbb81><td class="px-4 py-3 max-w-[140px]" data-v-d90fbb81><p class="text-gray-600 text-xs truncate"${ssrRenderAttr("title", r.campaignName)} data-v-d90fbb81>${ssrInterpolate(r.campaignName)}</p></td><td class="px-4 py-3 max-w-[160px]" data-v-d90fbb81><p class="text-gray-800 font-medium text-xs truncate"${ssrRenderAttr("title", (_a = r.adGroupName) != null ? _a : "")} data-v-d90fbb81>${ssrInterpolate(r.adGroupName)}</p><p class="text-gray-400 text-xs" data-v-d90fbb81>ID: ${ssrInterpolate(r.adGroupId)}</p></td><td class="px-4 py-3 text-right font-semibold text-red-500 text-xs" data-v-d90fbb81>${ssrInterpolate(fmtCurrency(r.cost))}</td><td class="px-4 py-3 text-right text-gray-600 text-xs" data-v-d90fbb81>${ssrInterpolate(fmtNum(r.impressions))}</td><td class="px-4 py-3 text-right text-gray-600 text-xs" data-v-d90fbb81>${ssrInterpolate(fmtNum(r.clicks))}</td><td class="px-4 py-3 text-right text-gray-500 text-xs" data-v-d90fbb81>${ssrInterpolate(fmtPct(r.ctr))}</td><td class="px-4 py-3 text-right text-gray-700 font-medium text-xs" data-v-d90fbb81>${ssrInterpolate(fmtNum(r.conversions))}</td><td class="px-4 py-3 text-right text-gray-500 text-xs" data-v-d90fbb81>${ssrInterpolate(fmtPct(r.cvr))}</td><td class="px-4 py-3 text-right text-amber-600 text-xs" data-v-d90fbb81>${ssrInterpolate(fmtCurrency(r.cpc))}</td><td class="px-4 py-3 text-right text-amber-600 text-xs" data-v-d90fbb81>${ssrInterpolate(fmtCurrency(r.costPerConversion))}</td><td class="px-4 py-3 text-right font-semibold text-green-600 text-xs" data-v-d90fbb81>${ssrInterpolate(fmtCurrency(r.grossRevenue))}</td><td class="${ssrRenderClass([r.roas >= 1 ? "text-emerald-600" : "text-red-500", "px-4 py-3 text-right text-xs font-bold"])}" data-v-d90fbb81>${ssrInterpolate(fmtRoas(r.roas))}</td></tr>`);
          });
          _push(`<!--]--></tbody><tfoot class="bg-gray-50 border-t-2 border-gray-200" data-v-d90fbb81><tr class="text-xs font-semibold text-gray-700" data-v-d90fbb81><td class="px-4 py-3" colspan="2" data-v-d90fbb81>Total (${ssrInterpolate(unref(rows).length)} ad group)</td><td class="px-4 py-3 text-right text-red-500" data-v-d90fbb81>${ssrInterpolate(fmtCurrency(unref(rows).reduce((s, r) => s + r.cost, 0)))}</td><td class="px-4 py-3 text-right" data-v-d90fbb81>${ssrInterpolate(fmtNum(unref(rows).reduce((s, r) => s + r.impressions, 0)))}</td><td class="px-4 py-3 text-right" data-v-d90fbb81>${ssrInterpolate(fmtNum(unref(rows).reduce((s, r) => s + r.clicks, 0)))}</td><td class="px-4 py-3 text-right text-gray-400" data-v-d90fbb81>\u2014</td><td class="px-4 py-3 text-right" data-v-d90fbb81>${ssrInterpolate(fmtNum(unref(rows).reduce((s, r) => s + r.conversions, 0)))}</td><td class="px-4 py-3 text-right text-gray-400" data-v-d90fbb81>\u2014</td><td class="px-4 py-3 text-right text-gray-400" data-v-d90fbb81>\u2014</td><td class="px-4 py-3 text-right text-gray-400" data-v-d90fbb81>\u2014</td><td class="px-4 py-3 text-right text-green-600" data-v-d90fbb81>${ssrInterpolate(fmtCurrency(unref(rows).reduce((s, r) => s + r.grossRevenue, 0)))}</td><td class="px-4 py-3 text-right text-gray-400" data-v-d90fbb81>\u2014</td></tr></tfoot></table>`);
        }
        _push(`</div>`);
      }
      _push(`</div>`);
      if (unref(showImport)) {
        _push(ssrRenderComponent(_component_TikTokAdsImportModal, {
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
        _push(`<div class="${ssrRenderClass([unref(toast).type === "success" ? "bg-green-600" : "bg-red-600", "fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white"])}" data-v-d90fbb81>${ssrInterpolate(unref(toast).message)}</div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/store/ads.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ads = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-d90fbb81"]]);

export { ads as default };
//# sourceMappingURL=ads-C4gfdERf.mjs.map
