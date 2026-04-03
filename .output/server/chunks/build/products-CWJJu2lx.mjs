import { defineComponent, computed, ref, watch, unref, withCtx, createVNode, openBlock, createBlock, createTextVNode, toDisplayString, createCommentVNode, mergeProps, useSSRContext } from 'vue';
import { ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderComponent, ssrRenderAttrs, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { u as useApi } from './useApi-0aCYoCTI.mjs';
import { _ as _export_sfc } from './server.mjs';
import { _ as __nuxt_component_2 } from './AppModal-D_J5cd1L.mjs';
import { u as useActiveStoreStore } from './activeStore-yswwjCHd.mjs';
import './auth-BWjTzQkA.mjs';
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

function useProducts() {
  const { fetchWithAuth } = useApi();
  const isLoading = ref(false);
  const error = ref(null);
  async function getProducts(filters) {
    var _a, _b, _c;
    isLoading.value = true;
    error.value = null;
    try {
      const params = { storeId: filters.storeId };
      if (filters.page) params.page = filters.page;
      if (filters.limit) params.limit = filters.limit;
      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;
      return await fetchWithAuth("/api/products", { params });
    } catch (err) {
      const e = err;
      error.value = (_c = (_b = (_a = e.data) == null ? void 0 : _a.message) != null ? _b : e.message) != null ? _c : "Failed to fetch products";
      return null;
    } finally {
      isLoading.value = false;
    }
  }
  async function getProduct(id) {
    var _a, _b, _c;
    isLoading.value = true;
    error.value = null;
    try {
      return await fetchWithAuth(`/api/products/${id}`);
    } catch (err) {
      const e = err;
      error.value = (_c = (_b = (_a = e.data) == null ? void 0 : _a.message) != null ? _b : e.message) != null ? _c : "Failed to fetch product";
      return null;
    } finally {
      isLoading.value = false;
    }
  }
  async function createProduct(payload) {
    var _a, _b, _c;
    isLoading.value = true;
    error.value = null;
    try {
      return await fetchWithAuth("/api/products", {
        method: "POST",
        body: payload
      });
    } catch (err) {
      const e = err;
      error.value = (_c = (_b = (_a = e.data) == null ? void 0 : _a.message) != null ? _b : e.message) != null ? _c : "Failed to create product";
      return null;
    } finally {
      isLoading.value = false;
    }
  }
  async function updateProduct(id, payload) {
    var _a, _b, _c;
    isLoading.value = true;
    error.value = null;
    try {
      return await fetchWithAuth(`/api/products/${id}`, {
        method: "PUT",
        body: payload
      });
    } catch (err) {
      const e = err;
      error.value = (_c = (_b = (_a = e.data) == null ? void 0 : _a.message) != null ? _b : e.message) != null ? _c : "Failed to update product";
      return null;
    } finally {
      isLoading.value = false;
    }
  }
  async function deleteProduct(id) {
    var _a, _b, _c;
    isLoading.value = true;
    error.value = null;
    try {
      return await fetchWithAuth(`/api/products/${id}`, { method: "DELETE" });
    } catch (err) {
      const e = err;
      error.value = (_c = (_b = (_a = e.data) == null ? void 0 : _a.message) != null ? _b : e.message) != null ? _c : "Failed to delete product";
      return null;
    } finally {
      isLoading.value = false;
    }
  }
  return { isLoading, error, getProducts, getProduct, createProduct, updateProduct, deleteProduct };
}
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "ProductTable",
  __ssrInlineRender: true,
  props: {
    products: {},
    loading: { type: Boolean },
    refreshKey: {}
  },
  emits: ["edit", "delete", "edit-hpp"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    function formatDate(d) {
      return new Date(d).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" });
    }
    function formatPrice(v) {
      return Number(v).toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
    }
    const expandedId = ref(null);
    const skuCache = ref({});
    const skuLoading = ref({});
    watch(() => props.refreshKey, () => {
      skuCache.value = {};
    });
    useProducts();
    function variantLabel(sku) {
      const entries = Object.entries(sku.variants);
      if (!entries.length) return "\u2014";
      return entries.map(([k, v]) => `${k}: ${v}`).join(" \xB7 ");
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "overflow-x-auto" }, _attrs))} data-v-9c5d8126><table class="min-w-full divide-y divide-gray-200" data-v-9c5d8126><thead class="bg-gray-50" data-v-9c5d8126><tr data-v-9c5d8126><th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider" data-v-9c5d8126>Produk</th><th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell" data-v-9c5d8126>MP Product ID</th><th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell" data-v-9c5d8126>SKU</th><th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell" data-v-9c5d8126>Varian</th><th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider" data-v-9c5d8126>Status</th><th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell" data-v-9c5d8126>Dibuat</th><th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider" data-v-9c5d8126>Aksi</th></tr></thead><tbody class="bg-white divide-y divide-gray-100" data-v-9c5d8126>`);
      if (__props.loading) {
        _push(`<!--[-->`);
        ssrRenderList(5, (i) => {
          _push(`<tr data-v-9c5d8126><td class="px-4 py-3" data-v-9c5d8126><div class="h-4 bg-gray-100 rounded animate-pulse w-40" data-v-9c5d8126></div></td><td class="px-4 py-3 hidden md:table-cell" data-v-9c5d8126><div class="h-4 bg-gray-100 rounded animate-pulse w-28" data-v-9c5d8126></div></td><td class="px-4 py-3 hidden sm:table-cell" data-v-9c5d8126><div class="h-4 bg-gray-100 rounded animate-pulse w-12" data-v-9c5d8126></div></td><td class="px-4 py-3 hidden lg:table-cell" data-v-9c5d8126><div class="h-4 bg-gray-100 rounded animate-pulse w-20" data-v-9c5d8126></div></td><td class="px-4 py-3" data-v-9c5d8126><div class="h-5 bg-gray-100 rounded-full animate-pulse w-16" data-v-9c5d8126></div></td><td class="px-4 py-3 hidden lg:table-cell" data-v-9c5d8126><div class="h-4 bg-gray-100 rounded animate-pulse w-24" data-v-9c5d8126></div></td><td class="px-4 py-3" data-v-9c5d8126></td></tr>`);
        });
        _push(`<!--]-->`);
      } else if (__props.products.length === 0) {
        _push(`<tr data-v-9c5d8126><td colspan="7" class="px-4 py-16 text-center" data-v-9c5d8126><svg class="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-9c5d8126><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" data-v-9c5d8126></path></svg><p class="text-sm font-medium text-gray-500" data-v-9c5d8126>Belum ada produk</p><p class="text-xs text-gray-400 mt-1" data-v-9c5d8126>Klik &quot;Tambah Produk&quot; untuk mulai</p></td></tr>`);
      } else {
        _push(`<!--[-->`);
        ssrRenderList(__props.products, (product) => {
          var _a, _b, _c;
          _push(`<!--[--><tr class="${ssrRenderClass([unref(expandedId) === product.id ? "bg-blue-50/40" : "", "hover:bg-gray-50 transition-colors cursor-pointer"])}" data-v-9c5d8126><td class="px-4 py-3" data-v-9c5d8126><div class="flex items-center gap-2" data-v-9c5d8126><svg class="${ssrRenderClass([unref(expandedId) === product.id ? "rotate-90" : "", "w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200"])}" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-9c5d8126><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-v-9c5d8126></path></svg><div class="min-w-0" data-v-9c5d8126><p class="text-sm font-medium text-gray-900 truncate max-w-[160px]" data-v-9c5d8126>${ssrInterpolate(product.name)}</p><div class="flex items-center gap-1.5 flex-wrap" data-v-9c5d8126>`);
          if (product.description) {
            _push(`<p class="text-xs text-gray-400 truncate max-w-[160px]" data-v-9c5d8126>${ssrInterpolate(product.description)}</p>`);
          } else {
            _push(`<!---->`);
          }
          if (product.category) {
            _push(`<span class="text-xs bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded-full font-medium" data-v-9c5d8126>${ssrInterpolate(product.category)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></div></td><td class="px-4 py-3 hidden md:table-cell" data-v-9c5d8126><span class="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-0.5 rounded" data-v-9c5d8126>${ssrInterpolate(product.mpProductId)}</span></td><td class="px-4 py-3 hidden sm:table-cell" data-v-9c5d8126><span class="text-sm text-gray-700" data-v-9c5d8126>${ssrInterpolate((_b = (_a = product._count) == null ? void 0 : _a.skus) != null ? _b : 0)}</span></td><td class="px-4 py-3 hidden lg:table-cell" data-v-9c5d8126><div class="flex flex-wrap gap-1" data-v-9c5d8126><!--[-->`);
          ssrRenderList(product.variantTypes, (v) => {
            _push(`<span class="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full" data-v-9c5d8126>${ssrInterpolate(v)}</span>`);
          });
          _push(`<!--]-->`);
          if (product.variantTypes.length === 0) {
            _push(`<span class="text-xs text-gray-400" data-v-9c5d8126>\u2014</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></td><td class="px-4 py-3 whitespace-nowrap" data-v-9c5d8126><span class="${ssrRenderClass([product.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500", "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"])}" data-v-9c5d8126>${ssrInterpolate(product.status === "ACTIVE" ? "Aktif" : "Tidak Aktif")}</span></td><td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell" data-v-9c5d8126>${ssrInterpolate(formatDate(product.createdAt))}</td><td class="px-4 py-3 whitespace-nowrap text-right" data-v-9c5d8126><div class="flex items-center justify-end gap-1.5" data-v-9c5d8126><button class="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit HPP" data-v-9c5d8126><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-9c5d8126><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-v-9c5d8126></path></svg></button><button class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit produk" data-v-9c5d8126><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-9c5d8126><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" data-v-9c5d8126></path></svg></button><button class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus produk" data-v-9c5d8126><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-9c5d8126><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" data-v-9c5d8126></path></svg></button></div></td></tr>`);
          if (unref(expandedId) === product.id) {
            _push(`<tr class="bg-gray-50/60" data-v-9c5d8126><td colspan="7" class="px-0 py-0" data-v-9c5d8126><div class="sku-drawer" data-v-9c5d8126>`);
            if (unref(skuLoading)[product.id]) {
              _push(`<div class="flex items-center gap-2 px-10 py-4 text-sm text-gray-400" data-v-9c5d8126><svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" data-v-9c5d8126><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-9c5d8126></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" data-v-9c5d8126></path></svg> Memuat SKU... </div>`);
            } else if (!((_c = unref(skuCache)[product.id]) == null ? void 0 : _c.length)) {
              _push(`<div class="px-10 py-4 text-sm text-gray-400 italic" data-v-9c5d8126> Tidak ada SKU </div>`);
            } else {
              _push(`<table class="w-full text-xs" data-v-9c5d8126><thead data-v-9c5d8126><tr class="border-b border-gray-200" data-v-9c5d8126><th class="px-10 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider" data-v-9c5d8126>Kode SKU</th><th class="px-4 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell" data-v-9c5d8126>MP SKU ID</th><th class="px-4 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell" data-v-9c5d8126>Varian</th><th class="px-4 py-2 text-right font-semibold text-gray-500 uppercase tracking-wider" data-v-9c5d8126>Harga</th><th class="px-4 py-2 text-right font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell" data-v-9c5d8126>HPP</th></tr></thead><tbody data-v-9c5d8126><!--[-->`);
              ssrRenderList(unref(skuCache)[product.id], (sku) => {
                _push(`<tr class="border-b border-gray-100 last:border-0" data-v-9c5d8126><td class="px-10 py-2 font-mono text-gray-700" data-v-9c5d8126>${ssrInterpolate(sku.sku || "\u2014")}</td><td class="px-4 py-2 font-mono text-gray-500 hidden md:table-cell" data-v-9c5d8126>${ssrInterpolate(sku.mpSkuId || "\u2014")}</td><td class="px-4 py-2 text-gray-600 hidden sm:table-cell" data-v-9c5d8126>${ssrInterpolate(variantLabel(sku))}</td><td class="px-4 py-2 text-right text-gray-800 font-medium" data-v-9c5d8126>${ssrInterpolate(formatPrice(sku.price))}</td><td class="px-4 py-2 text-right text-gray-500 hidden sm:table-cell" data-v-9c5d8126>${ssrInterpolate(formatPrice(sku.hpp))}</td></tr>`);
              });
              _push(`<!--]--></tbody></table>`);
            }
            _push(`</div></td></tr>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        });
        _push(`<!--]-->`);
      }
      _push(`</tbody></table></div>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/product/ProductTable.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-9c5d8126"]]);
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "HppImportModal",
  __ssrInlineRender: true,
  props: {
    storeId: {}
  },
  emits: ["close", "updated"],
  setup(__props, { emit: __emit }) {
    useApi();
    useProducts();
    const step = ref("select");
    const products = ref([]);
    const loadingProducts = ref(false);
    const selectedIds = ref(/* @__PURE__ */ new Set());
    const productSearch = ref("");
    const downloading = ref(false);
    const downloadError = ref(null);
    ref(null);
    const selectedFile = ref(null);
    const dragOver = ref(false);
    const parseError = ref(null);
    const previewRows = ref([]);
    const uploading = ref(false);
    const result = ref(null);
    const filteredProducts = computed(() => {
      const q = productSearch.value.toLowerCase().trim();
      if (!q) return products.value;
      return products.value.filter((p) => p.name.toLowerCase().includes(q));
    });
    const allSelected = computed(
      () => filteredProducts.value.length > 0 && filteredProducts.value.every((p) => selectedIds.value.has(p.id))
    );
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      if (unref(step) === "select") {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><p class="text-sm text-gray-500"> Pilih produk yang ingin diperbarui HPP-nya, lalu unduh template Excel. Edit kolom <span class="font-medium text-gray-700">harga_hpp</span>, kemudian upload kembali. </p><div class="relative"><svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"></path></svg><input${ssrRenderAttr("value", unref(productSearch))} type="text" placeholder="Cari produk..." class="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></div><div class="border border-gray-200 rounded-lg overflow-hidden"><div class="flex items-center gap-3 px-3 py-2 bg-gray-50 border-b border-gray-200"><input type="checkbox"${ssrIncludeBooleanAttr(unref(allSelected)) ? " checked" : ""} class="rounded text-blue-600"><span class="text-xs font-medium text-gray-600">${ssrInterpolate(unref(selectedIds).size === 0 ? "Pilih semua (semua produk akan diunduh)" : `${unref(selectedIds).size} produk dipilih`)}</span></div>`);
        if (unref(loadingProducts)) {
          _push(`<div class="py-8 text-center text-sm text-gray-400">Memuat produk...</div>`);
        } else if (unref(filteredProducts).length === 0) {
          _push(`<div class="py-8 text-center text-sm text-gray-400">Tidak ada produk</div>`);
        } else {
          _push(`<ul class="divide-y divide-gray-100 max-h-52 overflow-y-auto"><!--[-->`);
          ssrRenderList(unref(filteredProducts), (product) => {
            var _a2, _b;
            _push(`<li class="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 cursor-pointer"><input type="checkbox"${ssrIncludeBooleanAttr(unref(selectedIds).has(product.id)) ? " checked" : ""} class="rounded text-blue-600 pointer-events-none"><span class="text-sm text-gray-800 flex-1 truncate">${ssrInterpolate(product.name)}</span><span class="text-xs text-gray-400">${ssrInterpolate((_b = (_a2 = product._count) == null ? void 0 : _a2.skus) != null ? _b : 0)} SKU</span></li>`);
          });
          _push(`<!--]--></ul>`);
        }
        _push(`</div>`);
        if (unref(downloadError)) {
          _push(`<p class="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">${ssrInterpolate(unref(downloadError))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex justify-between gap-3 pt-1"><button class="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition">Batal</button><div class="flex gap-2"><button class="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-50 disabled:opacity-60 transition"${ssrIncludeBooleanAttr(unref(downloading)) ? " disabled" : ""}>`);
        if (unref(downloading)) {
          _push(`<svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>`);
        } else {
          _push(`<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"></path></svg>`);
        }
        _push(` ${ssrInterpolate(unref(downloading) ? "Mengunduh..." : "Unduh Template")}</button><button class="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"> Upload File <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></button></div></div></div>`);
      } else if (unref(step) === "upload") {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><p class="text-sm text-gray-500"> Upload file Excel yang sudah diperbarui nilainya pada kolom <span class="font-medium text-gray-700">harga_hpp</span>. </p><div class="${ssrRenderClass([unref(dragOver) ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-gray-50", "relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer"])}"><svg class="w-10 h-10 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"></path></svg><p class="text-sm font-medium text-gray-700">Klik untuk pilih file atau drag &amp; drop</p><p class="text-xs text-gray-400 mt-1">Format: .xlsx, .xls</p><input type="file" accept=".xlsx,.xls" class="hidden"></div>`);
        if (unref(parseError)) {
          _push(`<p class="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">${ssrInterpolate(unref(parseError))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex justify-between gap-3 pt-1"><button class="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition">Kembali</button><button class="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition">Batal</button></div></div>`);
      } else if (unref(step) === "preview") {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><div class="flex items-center gap-3 text-sm"><span class="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">${ssrInterpolate(unref(previewRows).length)} SKU </span><span class="text-gray-400 truncate max-w-[240px]">${ssrInterpolate((_a = unref(selectedFile)) == null ? void 0 : _a.name)}</span></div><div class="overflow-auto max-h-64 rounded-lg border border-gray-200"><table class="min-w-full text-xs"><thead class="bg-gray-50 sticky top-0"><tr><th class="px-3 py-2 text-left font-medium text-gray-500 whitespace-nowrap">Nama Produk</th><th class="px-3 py-2 text-left font-medium text-gray-500 whitespace-nowrap">SKU</th><th class="px-3 py-2 text-left font-medium text-gray-500 whitespace-nowrap">Variasi</th><th class="px-3 py-2 text-right font-medium text-gray-500 whitespace-nowrap">HPP Baru</th></tr></thead><tbody class="divide-y divide-gray-100"><!--[-->`);
        ssrRenderList(unref(previewRows), (row, i) => {
          _push(`<tr class="hover:bg-gray-50"><td class="px-3 py-2 text-gray-800 max-w-[180px] truncate">${ssrInterpolate(row.namaProduk)}</td><td class="px-3 py-2 text-gray-500 font-mono">${ssrInterpolate(row.sku || "-")}</td><td class="px-3 py-2 text-gray-600 whitespace-nowrap">${ssrInterpolate(row.variasi || "-")}</td><td class="px-3 py-2 text-right font-semibold text-green-700 whitespace-nowrap"> Rp ${ssrInterpolate(row.hpp.toLocaleString("id-ID"))}</td></tr>`);
        });
        _push(`<!--]--></tbody></table></div>`);
        if (unref(parseError)) {
          _push(`<p class="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">${ssrInterpolate(unref(parseError))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex justify-between gap-3 pt-1"><button class="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition">Ganti File</button><div class="flex gap-2"><button class="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition">Batal</button><button class="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-60 transition"${ssrIncludeBooleanAttr(unref(uploading)) ? " disabled" : ""}>`);
        if (unref(uploading)) {
          _push(`<svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>`);
        } else {
          _push(`<!---->`);
        }
        _push(` ${ssrInterpolate(unref(uploading) ? "Menyimpan..." : "Simpan HPP")}</button></div></div></div>`);
      } else if (unref(step) === "result" && unref(result)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><div class="rounded-xl bg-green-50 border border-green-200 p-4 space-y-3"><div class="flex items-center gap-2 text-green-700 font-semibold"><svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> HPP berhasil diperbarui </div><div class="grid grid-cols-3 gap-3 text-sm"><div class="text-center"><div class="text-2xl font-bold text-green-600">${ssrInterpolate(unref(result).updated)}</div><div class="text-gray-500 text-xs">SKU diperbarui</div></div><div class="text-center"><div class="text-2xl font-bold text-gray-400">${ssrInterpolate(unref(result).skipped)}</div><div class="text-gray-500 text-xs">Dilewati</div></div><div class="text-center"><div class="text-2xl font-bold text-gray-600">${ssrInterpolate(unref(result).total)}</div><div class="text-gray-500 text-xs">Total baris</div></div></div></div>`);
        if (unref(result).errors.length > 0) {
          _push(`<div class="rounded-xl bg-red-50 border border-red-200 p-3"><p class="text-sm font-medium text-red-700 mb-1">${ssrInterpolate(unref(result).errors.length)} error:</p><ul class="text-xs text-red-600 space-y-0.5 max-h-24 overflow-y-auto"><!--[-->`);
          ssrRenderList(unref(result).errors, (err, i) => {
            _push(`<li>\u2022 ${ssrInterpolate(err)}</li>`);
          });
          _push(`<!--]--></ul></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex justify-end gap-3"><button class="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">Selesai</button></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/product/HppImportModal.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "ImportModal",
  __ssrInlineRender: true,
  props: {
    storeId: {}
  },
  emits: ["close", "imported"],
  setup(__props, { emit: __emit }) {
    useApi();
    const step = ref("pick");
    ref(null);
    const selectedFile = ref(null);
    const dragOver = ref(false);
    const previewRows = ref([]);
    const parseError = ref(null);
    const importing = ref(false);
    const result = ref(null);
    const productCount = computed(() => {
      const ids = new Set(previewRows.value.map((r) => r.product_id));
      return ids.size;
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      if (unref(step) === "pick") {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><p class="text-sm text-gray-500"> Upload file <span class="font-medium text-gray-700">.xlsx</span> hasil ekspor produk dari <span class="font-medium text-gray-700">TikTok Shop Seller Center</span>. </p><div class="${ssrRenderClass([unref(dragOver) ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-gray-50", "relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer"])}"><svg class="w-10 h-10 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"></path></svg><p class="text-sm font-medium text-gray-700">Klik untuk pilih file atau drag &amp; drop</p><p class="text-xs text-gray-400 mt-1">Format: .xlsx, .xls (max 10 MB)</p><input type="file" accept=".xlsx,.xls" class="hidden"></div>`);
        if (unref(parseError)) {
          _push(`<p class="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">${ssrInterpolate(unref(parseError))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex justify-end gap-3 pt-1"><button class="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition">Batal</button></div></div>`);
      } else if (unref(step) === "preview") {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><div class="flex items-center gap-3 text-sm"><span class="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6M4 21h16"></path></svg> ${ssrInterpolate(unref(productCount))} produk </span><span class="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 px-3 py-1 rounded-full">${ssrInterpolate(unref(previewRows).length)} SKU </span><span class="text-gray-400 truncate max-w-[180px]">${ssrInterpolate((_a = unref(selectedFile)) == null ? void 0 : _a.name)}</span></div><div class="overflow-auto max-h-72 rounded-lg border border-gray-200"><table class="min-w-full text-xs"><thead class="bg-gray-50 sticky top-0"><tr><th class="px-3 py-2 text-left font-medium text-gray-500 whitespace-nowrap">Nama Produk</th><th class="px-3 py-2 text-left font-medium text-gray-500 whitespace-nowrap">Kategori</th><th class="px-3 py-2 text-left font-medium text-gray-500 whitespace-nowrap">Variasi</th><th class="px-3 py-2 text-right font-medium text-gray-500 whitespace-nowrap">Harga</th><th class="px-3 py-2 text-left font-medium text-gray-500 whitespace-nowrap">SKU</th></tr></thead><tbody class="divide-y divide-gray-100"><!--[-->`);
        ssrRenderList(unref(previewRows), (row, i) => {
          _push(`<tr class="hover:bg-gray-50"><td class="px-3 py-2 text-gray-800 max-w-[200px] truncate">${ssrInterpolate(row.product_name)}</td><td class="px-3 py-2 text-gray-500 whitespace-nowrap">${ssrInterpolate(row.category || "-")}</td><td class="px-3 py-2 text-gray-600 whitespace-nowrap">${ssrInterpolate(row.variation_value || "-")}</td><td class="px-3 py-2 text-right text-gray-800 whitespace-nowrap">${ssrInterpolate(row.price.toLocaleString("id-ID"))}</td><td class="px-3 py-2 text-gray-500 font-mono whitespace-nowrap">${ssrInterpolate(row.seller_sku || "-")}</td></tr>`);
        });
        _push(`<!--]--></tbody></table></div>`);
        if (unref(parseError)) {
          _push(`<p class="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">${ssrInterpolate(unref(parseError))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<p class="text-xs text-gray-500"> Produk yang sudah ada akan diperbarui (nama, kategori, harga). HPP tidak akan berubah. </p><div class="flex justify-between gap-3 pt-1"><button class="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition">Ganti File</button><div class="flex gap-2"><button class="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition">Batal</button><button class="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition"${ssrIncludeBooleanAttr(unref(importing)) ? " disabled" : ""}>`);
        if (unref(importing)) {
          _push(`<svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>`);
        } else {
          _push(`<!---->`);
        }
        _push(` ${ssrInterpolate(unref(importing) ? "Mengimpor..." : "Import Sekarang")}</button></div></div></div>`);
      } else if (unref(step) === "result" && unref(result)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><div class="rounded-xl bg-green-50 border border-green-200 p-4 space-y-2"><div class="flex items-center gap-2 text-green-700 font-semibold"><svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Import selesai </div><div class="grid grid-cols-3 gap-3 text-sm"><div class="text-center"><div class="text-2xl font-bold text-green-600">${ssrInterpolate(unref(result).imported)}</div><div class="text-gray-500 text-xs">Produk baru</div></div><div class="text-center"><div class="text-2xl font-bold text-blue-600">${ssrInterpolate(unref(result).updated)}</div><div class="text-gray-500 text-xs">Diperbarui</div></div><div class="text-center"><div class="text-2xl font-bold text-gray-600">${ssrInterpolate(unref(result).skuCount)}</div><div class="text-gray-500 text-xs">Total SKU</div></div></div></div>`);
        if (unref(result).errors.length > 0) {
          _push(`<div class="rounded-xl bg-red-50 border border-red-200 p-3"><p class="text-sm font-medium text-red-700 mb-1">${ssrInterpolate(unref(result).errors.length)} produk gagal diimport:</p><ul class="text-xs text-red-600 space-y-0.5 max-h-28 overflow-y-auto"><!--[-->`);
          ssrRenderList(unref(result).errors, (err, i) => {
            _push(`<li>\u2022 ${ssrInterpolate(err)}</li>`);
          });
          _push(`<!--]--></ul></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex justify-end gap-3"><button class="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition">Import Lagi</button><button class="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">Selesai</button></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/product/ImportModal.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "HppModal",
  __ssrInlineRender: true,
  props: {
    product: {},
    loading: { type: Boolean },
    error: {}
  },
  emits: ["submit", "cancel"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const rows = ref([]);
    const bulkHpp = ref("");
    const bulkError = ref("");
    const hppErrors = ref({});
    watch(
      () => props.product,
      (p) => {
        bulkHpp.value = "";
        bulkError.value = "";
        hppErrors.value = {};
        if (p == null ? void 0 : p.skus) {
          rows.value = p.skus.map((s) => ({
            id: s.id,
            sku: s.sku,
            mpSkuId: s.mpSkuId,
            variants: { ...s.variants },
            price: String(s.price),
            hpp: String(s.hpp)
          }));
        } else {
          rows.value = [];
        }
      },
      { immediate: true }
    );
    function variantLabel(variants) {
      const entries = Object.entries(variants);
      if (!entries.length) return "";
      return entries.map(([k, v]) => `${k}: ${v}`).join(" \xB7 ");
    }
    function formatPrice(v) {
      return Number(v).toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col gap-5" }, _attrs))}>`);
      if (__props.error) {
        _push(`<div class="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">${ssrInterpolate(__props.error)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="bg-amber-50 border border-amber-200 rounded-xl p-4"><p class="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">HPP Massal</p><p class="text-xs text-amber-600 mb-3">Isi nilai HPP yang sama ke semua SKU sekaligus.</p><div class="flex gap-2"><div class="relative flex-1"><span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">Rp</span><input${ssrRenderAttr("value", unref(bulkHpp))} type="number" min="0" placeholder="0" class="${ssrRenderClass([unref(bulkError) ? "border-red-400" : "border-amber-200", "w-full pl-8 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition bg-white"])}"></div><button type="button" class="px-4 py-2 text-sm bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors whitespace-nowrap"> Terapkan ke Semua </button></div>`);
      if (unref(bulkError)) {
        _push(`<p class="mt-1.5 text-xs text-red-500">${ssrInterpolate(unref(bulkError))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(rows).length === 0) {
        _push(`<div class="text-sm text-gray-400 text-center py-6"> Tidak ada SKU </div>`);
      } else {
        _push(`<div class="flex flex-col divide-y divide-gray-100"><!--[-->`);
        ssrRenderList(unref(rows), (row, idx) => {
          _push(`<div class="flex items-center gap-3 py-3 first:pt-0 last:pb-0"><div class="flex-1 min-w-0"><p class="text-sm font-medium text-gray-800 truncate">${ssrInterpolate(row.sku || "\u2014")}</p>`);
          if (variantLabel(row.variants)) {
            _push(`<p class="text-xs text-gray-400 truncate">${ssrInterpolate(variantLabel(row.variants))}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<p class="text-xs text-gray-400">Harga jual: ${ssrInterpolate(formatPrice(row.price))}</p></div><div class="w-36 shrink-0"><label class="block text-xs text-gray-500 mb-1">HPP (Rp)</label><div class="relative"><span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">Rp</span><input${ssrRenderAttr("value", row.hpp)} type="number" min="0" placeholder="0" class="${ssrRenderClass([unref(hppErrors)[idx] ? "border-red-400" : "border-gray-300", "w-full pl-7 pr-2 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"])}"></div>`);
          if (unref(hppErrors)[idx]) {
            _push(`<p class="mt-0.5 text-xs text-red-500">${ssrInterpolate(unref(hppErrors)[idx])}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`<div class="flex justify-end gap-3 pt-2 border-t border-gray-100"><button type="button" class="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"${ssrIncludeBooleanAttr(__props.loading) ? " disabled" : ""}> Batal </button><button type="button" class="px-5 py-2 text-sm rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-60 transition flex items-center gap-2"${ssrIncludeBooleanAttr(__props.loading || unref(rows).length === 0) ? " disabled" : ""}>`);
      if (__props.loading) {
        _push(`<svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>`);
      } else {
        _push(`<!---->`);
      }
      _push(` Simpan HPP </button></div></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/product/HppModal.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ProductForm",
  __ssrInlineRender: true,
  props: {
    mode: {},
    initialData: {},
    storeId: {},
    loading: { type: Boolean },
    error: {}
  },
  emits: ["submit", "cancel"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    function makeKey() {
      return Math.random().toString(36).slice(2);
    }
    const mpProductId = ref("");
    const name = ref("");
    const description = ref("");
    const category = ref("");
    const status = ref("ACTIVE");
    const variantTypes = ref([]);
    const formSkus = ref([]);
    watch(
      () => props.initialData,
      (data) => {
        var _a, _b, _c;
        if (data) {
          mpProductId.value = data.mpProductId;
          name.value = data.name;
          description.value = (_a = data.description) != null ? _a : "";
          category.value = (_b = data.category) != null ? _b : "";
          status.value = data.status;
          variantTypes.value = [...data.variantTypes];
          formSkus.value = ((_c = data.skus) != null ? _c : []).map((s) => ({
            _key: makeKey(),
            id: s.id,
            mpSkuId: s.mpSkuId,
            sku: s.sku,
            price: String(s.price),
            hpp: String(s.hpp),
            variants: { ...s.variants }
          }));
        } else {
          resetForm();
        }
      },
      { immediate: true }
    );
    function resetForm() {
      mpProductId.value = "";
      name.value = "";
      description.value = "";
      category.value = "";
      status.value = "ACTIVE";
      variantTypes.value = [];
      formSkus.value = [];
    }
    const errors = ref({});
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<form${ssrRenderAttrs(mergeProps({ class: "flex flex-col gap-6" }, _attrs))}>`);
      if (__props.error) {
        _push(`<div class="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">${ssrInterpolate(__props.error)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div class="sm:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1"> Nama Produk <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(name))} type="text" placeholder="cth. Kaos Polos Premium" class="${ssrRenderClass([unref(errors).name ? "border-red-400" : "border-gray-300", "w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"])}">`);
      if (unref(errors).name) {
        _push(`<p class="mt-1 text-xs text-red-500">${ssrInterpolate(unref(errors).name)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-1"> MP Product ID <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(mpProductId))} type="text" placeholder="cth. PROD-001" class="${ssrRenderClass([unref(errors).mpProductId ? "border-red-400" : "border-gray-300", "w-full rounded-lg border px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 transition"])}">`);
      if (unref(errors).mpProductId) {
        _push(`<p class="mt-1 text-xs text-red-500">${ssrInterpolate(unref(errors).mpProductId)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-1">Status</label><div class="flex gap-3"><!--[-->`);
      ssrRenderList([{ value: "ACTIVE", label: "Aktif" }, { value: "INACTIVE", label: "Tidak Aktif" }], (opt) => {
        _push(`<label class="flex items-center gap-2 cursor-pointer"><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(status), opt.value)) ? " checked" : ""} type="radio"${ssrRenderAttr("value", opt.value)} class="accent-blue-600"><span class="text-sm text-gray-700">${ssrInterpolate(opt.label)}</span></label>`);
      });
      _push(`<!--]--></div></div><div class="sm:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label><textarea rows="2" placeholder="Opsional" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none">${ssrInterpolate(unref(description))}</textarea></div><div class="sm:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Kategori</label><input${ssrRenderAttr("value", unref(category))} type="text" placeholder="cth. Pakaian, Elektronik, Aksesoris" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"></div></div><div><div class="flex items-center justify-between mb-2"><label class="text-sm font-medium text-gray-700">Tipe Varian <span class="text-gray-400 font-normal">(maks. 2)</span></label>`);
      if (unref(variantTypes).length < 2) {
        _push(`<button type="button" class="text-xs text-blue-600 hover:text-blue-700 font-medium">+ Tambah Varian</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(variantTypes).length === 0) {
        _push(`<div class="text-xs text-gray-400 italic"> Tidak ada varian \u2014 semua SKU akan bernilai default </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex flex-col gap-2"><!--[-->`);
      ssrRenderList(unref(variantTypes), (vt, index) => {
        _push(`<div class="flex items-center gap-2"><input${ssrRenderAttr("value", vt)} type="text"${ssrRenderAttr("placeholder", `cth. ${index === 0 ? "Warna" : "Ukuran"}`)} class="${ssrRenderClass([unref(errors)[`vt_${index}`] ? "border-red-400" : "border-gray-300", "flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"])}"><button type="button" class="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>`);
        if (unref(errors)[`vt_${index}`]) {
          _push(`<p class="mt-1 text-xs text-red-500">${ssrInterpolate(unref(errors)[`vt_${index}`])}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div></div><div><div class="flex items-center justify-between mb-2"><label class="text-sm font-medium text-gray-700"> Daftar SKU <span class="text-red-500">*</span></label><button type="button" class="text-xs text-blue-600 hover:text-blue-700 font-medium">+ Tambah SKU</button></div>`);
      if (unref(errors).skus) {
        _push(`<p class="mb-2 text-xs text-red-500">${ssrInterpolate(unref(errors).skus)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(formSkus).length === 0) {
        _push(`<div class="border border-dashed border-gray-300 rounded-lg py-8 text-center"><p class="text-sm text-gray-400">Belum ada SKU. Klik &quot;Tambah SKU&quot; untuk mulai.</p></div>`);
      } else {
        _push(`<div class="flex flex-col gap-3"><!--[-->`);
        ssrRenderList(unref(formSkus), (sku, idx) => {
          _push(`<div class="border border-gray-200 rounded-lg p-3 bg-gray-50 relative"><div class="flex items-center justify-between mb-2"><span class="text-xs font-semibold text-gray-500 uppercase">SKU #${ssrInterpolate(idx + 1)}</span>`);
          if (unref(formSkus).length > 1) {
            _push(`<button type="button" class="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="grid grid-cols-2 sm:grid-cols-4 gap-2"><div><label class="block text-xs text-gray-500 mb-0.5">MP SKU ID</label><input${ssrRenderAttr("value", sku.mpSkuId)} type="text" placeholder="ID marketplace" class="w-full rounded border border-gray-300 px-2 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 transition bg-white"></div><div><label class="block text-xs text-gray-500 mb-0.5">Kode SKU</label><input${ssrRenderAttr("value", sku.sku)} type="text" placeholder="cth. SKU-001" class="w-full rounded border border-gray-300 px-2 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 transition bg-white"></div><!--[-->`);
          ssrRenderList(unref(variantTypes).filter((t) => t.trim()), (vt) => {
            _push(`<div><label class="block text-xs text-gray-500 mb-0.5">${ssrInterpolate(vt)}</label><input${ssrRenderAttr("value", sku.variants[vt])} type="text"${ssrRenderAttr("placeholder", `Nilai ${vt}`)} class="w-full rounded border border-gray-300 px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition bg-white"></div>`);
          });
          _push(`<!--]--><div><label class="block text-xs text-gray-500 mb-0.5">Harga (Rp) <span class="text-red-400">*</span></label><input${ssrRenderAttr("value", sku.price)} type="number" min="0" placeholder="0" class="${ssrRenderClass([unref(errors)[`sku_price_${idx}`] ? "border-red-400" : "border-gray-300", "w-full rounded border px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition bg-white"])}">`);
          if (unref(errors)[`sku_price_${idx}`]) {
            _push(`<p class="mt-0.5 text-xs text-red-500">${ssrInterpolate(unref(errors)[`sku_price_${idx}`])}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div><label class="block text-xs text-gray-500 mb-0.5">HPP / Modal (Rp) <span class="text-red-400">*</span></label><input${ssrRenderAttr("value", sku.hpp)} type="number" min="0" placeholder="0" class="${ssrRenderClass([unref(errors)[`sku_hpp_${idx}`] ? "border-red-400" : "border-gray-300", "w-full rounded border px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition bg-white"])}">`);
          if (unref(errors)[`sku_hpp_${idx}`]) {
            _push(`<p class="mt-0.5 text-xs text-red-500">${ssrInterpolate(unref(errors)[`sku_hpp_${idx}`])}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div><div class="flex justify-end gap-3 pt-2 border-t border-gray-100"><button type="button" class="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"${ssrIncludeBooleanAttr(__props.loading) ? " disabled" : ""}> Batal </button><button type="submit" class="px-5 py-2 text-sm rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-60 transition flex items-center gap-2"${ssrIncludeBooleanAttr(__props.loading) ? " disabled" : ""}>`);
      if (__props.loading) {
        _push(`<svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>`);
      } else {
        _push(`<!---->`);
      }
      _push(` ${ssrInterpolate(__props.mode === "create" ? "Simpan Produk" : "Update Produk")}</button></div></form>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/product/ProductForm.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const limit = 20;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "products",
  __ssrInlineRender: true,
  setup(__props) {
    const activeStoreStore = useActiveStoreStore();
    const storeId = computed(() => {
      var _a, _b;
      return (_b = (_a = activeStoreStore.store) == null ? void 0 : _a.id) != null ? _b : "";
    });
    const { getProducts, getProduct, createProduct, updateProduct, deleteProduct, isLoading, error } = useProducts();
    const products = ref([]);
    const total = ref(0);
    const page = ref(1);
    const search = ref("");
    const statusFilter = ref("");
    const formLoading = ref(false);
    const formError = ref(null);
    const showCreateModal = ref(false);
    const showEditModal = ref(false);
    const showDeleteModal = ref(false);
    const showHppModal = ref(false);
    const showImportModal = ref(false);
    const showHppImportModal = ref(false);
    const selectedProduct = ref(null);
    const hppProduct = ref(null);
    const hppLoading = ref(false);
    const hppError = ref(null);
    async function handleImported() {
      showImportModal.value = false;
      await loadProducts();
    }
    async function handleHppUpdated() {
      showHppImportModal.value = false;
      tableRefreshKey.value++;
      await loadProducts();
    }
    async function openHppModal(product) {
      hppError.value = null;
      hppProduct.value = null;
      showHppModal.value = true;
      const res = await getProduct(product.id);
      if (res == null ? void 0 : res.data) {
        hppProduct.value = res.data;
      } else {
        showHppModal.value = false;
      }
    }
    async function handleHppUpdate(payload) {
      var _a;
      if (!hppProduct.value) return;
      hppLoading.value = true;
      hppError.value = null;
      const res = await updateProduct(hppProduct.value.id, payload);
      hppLoading.value = false;
      if (res == null ? void 0 : res.data) {
        showHppModal.value = false;
        tableRefreshKey.value++;
        await loadProducts();
      } else {
        hppError.value = (_a = error.value) != null ? _a : "Gagal menyimpan HPP";
      }
    }
    async function openEditModal(product) {
      formError.value = null;
      const res = await getProduct(product.id);
      if (res == null ? void 0 : res.data) {
        selectedProduct.value = res.data;
        showEditModal.value = true;
      }
    }
    function openDeleteModal(product) {
      selectedProduct.value = product;
      showDeleteModal.value = true;
    }
    async function loadProducts() {
      if (!storeId.value) return;
      const res = await getProducts({
        storeId: storeId.value,
        page: page.value,
        limit,
        search: search.value || void 0,
        status: statusFilter.value || void 0
      });
      if (res) {
        products.value = res.data;
        total.value = res.total;
      }
    }
    watch([page, statusFilter], loadProducts);
    let searchTimeout;
    watch(search, () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        page.value = 1;
        loadProducts();
      }, 400);
    });
    const tableRefreshKey = ref(0);
    async function handleCreate(payload) {
      var _a;
      formLoading.value = true;
      formError.value = null;
      const res = await createProduct(payload);
      formLoading.value = false;
      if (res == null ? void 0 : res.data) {
        showCreateModal.value = false;
        await loadProducts();
      } else {
        formError.value = (_a = error.value) != null ? _a : "Gagal menyimpan produk";
      }
    }
    async function handleUpdate(payload) {
      var _a;
      if (!selectedProduct.value) return;
      formLoading.value = true;
      formError.value = null;
      const res = await updateProduct(selectedProduct.value.id, payload);
      formLoading.value = false;
      if (res == null ? void 0 : res.data) {
        showEditModal.value = false;
        await loadProducts();
      } else {
        formError.value = (_a = error.value) != null ? _a : "Gagal memperbarui produk";
      }
    }
    async function confirmDelete() {
      if (!selectedProduct.value) return;
      await deleteProduct(selectedProduct.value.id);
      showDeleteModal.value = false;
      if (!error.value) {
        if (products.value.length === 1 && page.value > 1) page.value--;
        await loadProducts();
      }
    }
    const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit)));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ProductTable = __nuxt_component_0;
      const _component_AppModal = __nuxt_component_2;
      const _component_HppImportModal = _sfc_main$4;
      const _component_ImportModal = _sfc_main$3;
      const _component_HppModal = _sfc_main$2;
      const _component_ProductForm = _sfc_main$1;
      _push(`<!--[--><div class="space-y-5"><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"><div><h1 class="text-xl font-bold text-gray-900">Produk</h1><p class="text-sm text-gray-500 mt-0.5">${ssrInterpolate(unref(total))} produk di toko ini</p></div><div class="flex items-center gap-2"><button class="inline-flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg> Import HPP </button><button class="inline-flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"></path></svg> Import TikTok </button><button class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg> Tambah Produk </button></div></div><div class="flex flex-col sm:flex-row gap-2"><div class="relative flex-1"><svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"></path></svg><input${ssrRenderAttr("value", unref(search))} type="text" placeholder="Cari produk..." class="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"></div><select class="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "") : ssrLooseEqual(unref(statusFilter), "")) ? " selected" : ""}>Semua Status</option><option value="ACTIVE"${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "ACTIVE") : ssrLooseEqual(unref(statusFilter), "ACTIVE")) ? " selected" : ""}>Aktif</option><option value="INACTIVE"${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "INACTIVE") : ssrLooseEqual(unref(statusFilter), "INACTIVE")) ? " selected" : ""}>Tidak Aktif</option></select></div><div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">`);
      _push(ssrRenderComponent(_component_ProductTable, {
        products: unref(products),
        loading: unref(isLoading),
        "refresh-key": unref(tableRefreshKey),
        onEdit: openEditModal,
        onDelete: openDeleteModal,
        onEditHpp: openHppModal
      }, null, _parent));
      if (unref(total) > limit) {
        _push(`<div class="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm text-gray-600"><span>Halaman ${ssrInterpolate(unref(page))} dari ${ssrInterpolate(unref(totalPages))}</span><div class="flex gap-2"><button class="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 transition"${ssrIncludeBooleanAttr(unref(page) <= 1) ? " disabled" : ""}>Sebelumnya</button><button class="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 transition"${ssrIncludeBooleanAttr(unref(page) >= unref(totalPages)) ? " disabled" : ""}>Berikutnya</button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      _push(ssrRenderComponent(_component_AppModal, {
        "is-open": unref(showHppImportModal),
        title: "Import HPP dari Excel",
        size: "lg",
        onClose: ($event) => showHppImportModal.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_HppImportModal, {
              "store-id": unref(storeId),
              onClose: ($event) => showHppImportModal.value = false,
              onUpdated: handleHppUpdated
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_HppImportModal, {
                "store-id": unref(storeId),
                onClose: ($event) => showHppImportModal.value = false,
                onUpdated: handleHppUpdated
              }, null, 8, ["store-id", "onClose"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_AppModal, {
        "is-open": unref(showImportModal),
        title: "Import Produk dari TikTok",
        size: "lg",
        onClose: ($event) => showImportModal.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_ImportModal, {
              "store-id": unref(storeId),
              onClose: ($event) => showImportModal.value = false,
              onImported: handleImported
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_ImportModal, {
                "store-id": unref(storeId),
                onClose: ($event) => showImportModal.value = false,
                onImported: handleImported
              }, null, 8, ["store-id", "onClose"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_AppModal, {
        "is-open": unref(showHppModal),
        title: "Edit HPP",
        size: "md",
        onClose: ($event) => showHppModal.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (!unref(hppProduct)) {
              _push2(`<div class="flex items-center justify-center py-10 gap-2 text-sm text-gray-400"${_scopeId}><svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"${_scopeId}></path></svg> Memuat SKU... </div>`);
            } else {
              _push2(ssrRenderComponent(_component_HppModal, {
                product: unref(hppProduct),
                loading: unref(hppLoading),
                error: unref(hppError),
                onSubmit: handleHppUpdate,
                onCancel: ($event) => showHppModal.value = false
              }, null, _parent2, _scopeId));
            }
          } else {
            return [
              !unref(hppProduct) ? (openBlock(), createBlock("div", {
                key: 0,
                class: "flex items-center justify-center py-10 gap-2 text-sm text-gray-400"
              }, [
                (openBlock(), createBlock("svg", {
                  class: "w-5 h-5 animate-spin",
                  fill: "none",
                  viewBox: "0 0 24 24"
                }, [
                  createVNode("circle", {
                    class: "opacity-25",
                    cx: "12",
                    cy: "12",
                    r: "10",
                    stroke: "currentColor",
                    "stroke-width": "4"
                  }),
                  createVNode("path", {
                    class: "opacity-75",
                    fill: "currentColor",
                    d: "M4 12a8 8 0 018-8v8H4z"
                  })
                ])),
                createTextVNode(" Memuat SKU... ")
              ])) : (openBlock(), createBlock(_component_HppModal, {
                key: 1,
                product: unref(hppProduct),
                loading: unref(hppLoading),
                error: unref(hppError),
                onSubmit: handleHppUpdate,
                onCancel: ($event) => showHppModal.value = false
              }, null, 8, ["product", "loading", "error", "onCancel"]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_AppModal, {
        "is-open": unref(showCreateModal),
        title: "Tambah Produk",
        size: "lg",
        onClose: ($event) => showCreateModal.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_ProductForm, {
              mode: "create",
              "store-id": unref(storeId),
              loading: unref(formLoading),
              error: unref(formError),
              onSubmit: handleCreate,
              onCancel: ($event) => showCreateModal.value = false
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_ProductForm, {
                mode: "create",
                "store-id": unref(storeId),
                loading: unref(formLoading),
                error: unref(formError),
                onSubmit: handleCreate,
                onCancel: ($event) => showCreateModal.value = false
              }, null, 8, ["store-id", "loading", "error", "onCancel"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_AppModal, {
        "is-open": unref(showEditModal),
        title: "Edit Produk",
        size: "lg",
        onClose: ($event) => showEditModal.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b;
          if (_push2) {
            _push2(ssrRenderComponent(_component_ProductForm, {
              mode: "edit",
              "store-id": unref(storeId),
              "initial-data": (_a = unref(selectedProduct)) != null ? _a : void 0,
              loading: unref(formLoading),
              error: unref(formError),
              onSubmit: handleUpdate,
              onCancel: ($event) => showEditModal.value = false
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_ProductForm, {
                mode: "edit",
                "store-id": unref(storeId),
                "initial-data": (_b = unref(selectedProduct)) != null ? _b : void 0,
                loading: unref(formLoading),
                error: unref(formError),
                onSubmit: handleUpdate,
                onCancel: ($event) => showEditModal.value = false
              }, null, 8, ["store-id", "initial-data", "loading", "error", "onCancel"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_AppModal, {
        "is-open": unref(showDeleteModal),
        title: "Hapus Produk",
        size: "sm",
        onClose: ($event) => showDeleteModal.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b;
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}><p class="text-sm text-gray-600"${_scopeId}> Yakin ingin menghapus produk <span class="font-semibold text-gray-900"${_scopeId}>${ssrInterpolate((_a = unref(selectedProduct)) == null ? void 0 : _a.name)}</span>? Semua SKU akan ikut terhapus dan tindakan ini tidak dapat dibatalkan. </p><div class="flex justify-end gap-3"${_scopeId}><button class="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"${_scopeId}>Batal</button><button class="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 transition flex items-center gap-2"${ssrIncludeBooleanAttr(unref(isLoading)) ? " disabled" : ""}${_scopeId}>`);
            if (unref(isLoading)) {
              _push2(`<svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"${_scopeId}></path></svg>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(` Hapus </button></div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                createVNode("p", { class: "text-sm text-gray-600" }, [
                  createTextVNode(" Yakin ingin menghapus produk "),
                  createVNode("span", { class: "font-semibold text-gray-900" }, toDisplayString((_b = unref(selectedProduct)) == null ? void 0 : _b.name), 1),
                  createTextVNode("? Semua SKU akan ikut terhapus dan tindakan ini tidak dapat dibatalkan. ")
                ]),
                createVNode("div", { class: "flex justify-end gap-3" }, [
                  createVNode("button", {
                    class: "px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition",
                    onClick: ($event) => showDeleteModal.value = false
                  }, "Batal", 8, ["onClick"]),
                  createVNode("button", {
                    class: "px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 transition flex items-center gap-2",
                    disabled: unref(isLoading),
                    onClick: confirmDelete
                  }, [
                    unref(isLoading) ? (openBlock(), createBlock("svg", {
                      key: 0,
                      class: "w-4 h-4 animate-spin",
                      fill: "none",
                      viewBox: "0 0 24 24"
                    }, [
                      createVNode("circle", {
                        class: "opacity-25",
                        cx: "12",
                        cy: "12",
                        r: "10",
                        stroke: "currentColor",
                        "stroke-width": "4"
                      }),
                      createVNode("path", {
                        class: "opacity-75",
                        fill: "currentColor",
                        d: "M4 12a8 8 0 018-8v8H4z"
                      })
                    ])) : createCommentVNode("", true),
                    createTextVNode(" Hapus ")
                  ], 8, ["disabled"])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/store/products.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=products-CWJJu2lx.mjs.map
