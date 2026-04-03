import { _ as _sfc_main$3 } from './AppInput-BzBRQFXN.mjs';
import { _ as _sfc_main$4 } from './AppBadge-B-HdCKTa.mjs';
import { defineComponent, ref, watch, mergeProps, unref, isRef, withCtx, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, reactive, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderAttr, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { _ as __nuxt_component_2 } from './AppModal-D_J5cd1L.mjs';
import { u as useActiveStoreStore } from './activeStore-yswwjCHd.mjs';
import { u as useRouter } from './server.mjs';
import { u as useApi } from './useApi-0aCYoCTI.mjs';
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
import './auth-BWjTzQkA.mjs';

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "StoreTable",
  __ssrInlineRender: true,
  props: {
    stores: {},
    loading: { type: Boolean }
  },
  emits: ["open", "edit", "delete"],
  setup(__props, { emit: __emit }) {
    const TYPE_CONFIG = {
      SHOPEE: { label: "Shopee", icon: "/icon/shopee.svg", variant: "warning" },
      TIKTOK: { label: "TikTok", icon: "/icon/tiktok.svg", variant: "purple" }
    };
    function formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AppBadge = _sfc_main$4;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "overflow-hidden rounded-xl border border-gray-200" }, _attrs))}><div class="overflow-x-auto"><table class="min-w-full divide-y divide-gray-200"><thead class="bg-gray-50"><tr><th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"> Store </th><th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"> Type </th><th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"> Link </th><th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"> Created </th><th class="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"> Actions </th></tr></thead><tbody class="bg-white divide-y divide-gray-100">`);
      if (__props.loading) {
        _push(`<!--[-->`);
        ssrRenderList(5, (i) => {
          _push(`<tr><td class="px-6 py-4"><div class="h-4 bg-gray-100 rounded animate-pulse w-40"></div></td><td class="px-6 py-4"><div class="h-5 bg-gray-100 rounded-full animate-pulse w-20"></div></td><td class="px-6 py-4"><div class="h-4 bg-gray-100 rounded animate-pulse w-36"></div></td><td class="px-6 py-4"><div class="h-4 bg-gray-100 rounded animate-pulse w-24"></div></td><td class="px-6 py-4"></td></tr>`);
        });
        _push(`<!--]-->`);
      } else if (__props.stores.length === 0) {
        _push(`<tr><td colspan="5" class="px-6 py-16 text-center"><svg class="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg><p class="text-sm font-medium text-gray-500">No stores found</p><p class="text-xs text-gray-400 mt-1">Try adjusting your search or filters</p></td></tr>`);
      } else {
        _push(`<!--[-->`);
        ssrRenderList(__props.stores, (store) => {
          _push(`<tr class="hover:bg-blue-50/50 transition-colors cursor-pointer"><td class="px-6 py-4"><div class="flex items-center gap-3"><div class="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0 p-1"><img${ssrRenderAttr("src", TYPE_CONFIG[store.type].icon)}${ssrRenderAttr("alt", TYPE_CONFIG[store.type].label)} class="w-full h-full object-contain"></div><div><p class="text-sm font-medium text-gray-900">${ssrInterpolate(store.name)}</p>`);
          if (store.description) {
            _push(`<p class="text-xs text-gray-400 truncate max-w-[200px]">${ssrInterpolate(store.description)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></td><td class="px-6 py-4 whitespace-nowrap">`);
          _push(ssrRenderComponent(_component_AppBadge, {
            variant: TYPE_CONFIG[store.type].variant
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(TYPE_CONFIG[store.type].label)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(TYPE_CONFIG[store.type].label), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</td><td class="px-6 py-4 whitespace-nowrap">`);
          if (store.link) {
            _push(`<a${ssrRenderAttr("href", store.link)} target="_blank" rel="noopener noreferrer" class="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 max-w-[160px] truncate"><svg class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg> ${ssrInterpolate(store.link.replace(/^https?:\/\//, ""))}</a>`);
          } else {
            _push(`<span class="text-xs text-gray-400">\u2014</span>`);
          }
          _push(`</td><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${ssrInterpolate(formatDate(store.createdAt))}</td><td class="px-6 py-4 whitespace-nowrap text-right"><div class="flex items-center justify-end gap-2"><button class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit store"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button><button class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete store"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button></div></td></tr>`);
        });
        _push(`<!--]-->`);
      }
      _push(`</tbody></table></div></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/store/StoreTable.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "StoreForm",
  __ssrInlineRender: true,
  props: {
    mode: {},
    initialData: {},
    loading: { type: Boolean },
    error: {}
  },
  emits: ["submit", "cancel"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const STORE_TYPES = [
      { value: "SHOPEE", label: "Shopee" },
      { value: "TIKTOK", label: "TikTok" }
    ];
    const form = reactive({
      name: "",
      type: "SHOPEE",
      description: "",
      link: ""
    });
    const formErrors = reactive({
      name: "",
      type: "",
      description: "",
      link: ""
    });
    watch(
      () => props.initialData,
      (store) => {
        var _a, _b;
        if (store) {
          form.name = store.name;
          form.type = store.type;
          form.description = (_a = store.description) != null ? _a : "";
          form.link = (_b = store.link) != null ? _b : "";
        }
      },
      { immediate: true }
    );
    function reset() {
      form.name = "";
      form.type = "SHOPEE";
      form.description = "";
      form.link = "";
      formErrors.name = "";
      formErrors.type = "";
      formErrors.description = "";
      formErrors.link = "";
    }
    __expose({ reset });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AppInput = _sfc_main$3;
      _push(`<form${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}>`);
      if (__props.error) {
        _push(`<div class="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg"><svg class="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg><p class="text-sm text-red-700">${ssrInterpolate(__props.error)}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_AppInput, {
        modelValue: unref(form).name,
        "onUpdate:modelValue": ($event) => unref(form).name = $event,
        label: "Store Name",
        placeholder: "My Shopee Store",
        required: "",
        error: unref(formErrors).name
      }, null, _parent));
      _push(`<div><label class="label"> Type <span class="text-red-500">*</span></label><div class="flex gap-3"><!--[-->`);
      ssrRenderList(STORE_TYPES, (opt) => {
        _push(`<label class="${ssrRenderClass([unref(form).type === opt.value ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300", "flex-1 flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all"])}"><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).type, opt.value)) ? " checked" : ""} type="radio"${ssrRenderAttr("value", opt.value)} class="sr-only"><img${ssrRenderAttr("src", opt.value === "SHOPEE" ? "/icon/shopee.svg" : "/icon/tiktok.svg")}${ssrRenderAttr("alt", opt.label)} class="w-6 h-6 shrink-0"><span class="${ssrRenderClass([unref(form).type === opt.value ? "text-blue-700" : "text-gray-700", "text-sm font-medium"])}">${ssrInterpolate(opt.label)}</span></label>`);
      });
      _push(`<!--]--></div>`);
      if (unref(formErrors).type) {
        _push(`<p class="mt-1 text-xs text-red-500">${ssrInterpolate(unref(formErrors).type)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label class="label">Description</label><textarea rows="3" placeholder="Short description of the store\u2026" class="input resize-none">${ssrInterpolate(unref(form).description)}</textarea></div>`);
      _push(ssrRenderComponent(_component_AppInput, {
        modelValue: unref(form).link,
        "onUpdate:modelValue": ($event) => unref(form).link = $event,
        label: "Store Link",
        placeholder: "https://shopee.co.id/mystore",
        error: unref(formErrors).link
      }, null, _parent));
      _push(`<div class="flex justify-end gap-3 pt-2"><button type="button" class="btn-secondary">Cancel</button><button type="submit" class="btn-primary"${ssrIncludeBooleanAttr(__props.loading) ? " disabled" : ""}>`);
      if (__props.loading) {
        _push(`<svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>`);
      } else {
        _push(`<!---->`);
      }
      _push(` ${ssrInterpolate(__props.mode === "create" ? "Create Store" : "Save Changes")}</button></div></form>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/store/StoreForm.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
function useStores() {
  const { fetchWithAuth } = useApi();
  const isLoading = ref(false);
  const error = ref(null);
  async function getStores(filters = {}) {
    var _a, _b, _c;
    isLoading.value = true;
    error.value = null;
    try {
      const params = {};
      if (filters.page) params.page = filters.page;
      if (filters.limit) params.limit = filters.limit;
      if (filters.search) params.search = filters.search;
      if (filters.type) params.type = filters.type;
      return await fetchWithAuth("/api/stores", { params });
    } catch (err) {
      const e = err;
      error.value = (_c = (_b = (_a = e.data) == null ? void 0 : _a.message) != null ? _b : e.message) != null ? _c : "Failed to fetch stores";
      return null;
    } finally {
      isLoading.value = false;
    }
  }
  async function getStore(id) {
    var _a, _b, _c;
    isLoading.value = true;
    error.value = null;
    try {
      return await fetchWithAuth(`/api/stores/${id}`);
    } catch (err) {
      const e = err;
      error.value = (_c = (_b = (_a = e.data) == null ? void 0 : _a.message) != null ? _b : e.message) != null ? _c : "Failed to fetch store";
      return null;
    } finally {
      isLoading.value = false;
    }
  }
  async function createStore(payload) {
    var _a, _b, _c;
    isLoading.value = true;
    error.value = null;
    try {
      return await fetchWithAuth("/api/stores", {
        method: "POST",
        body: payload
      });
    } catch (err) {
      const e = err;
      error.value = (_c = (_b = (_a = e.data) == null ? void 0 : _a.message) != null ? _b : e.message) != null ? _c : "Failed to create store";
      return null;
    } finally {
      isLoading.value = false;
    }
  }
  async function updateStore(id, payload) {
    var _a, _b, _c;
    isLoading.value = true;
    error.value = null;
    try {
      return await fetchWithAuth(`/api/stores/${id}`, {
        method: "PUT",
        body: payload
      });
    } catch (err) {
      const e = err;
      error.value = (_c = (_b = (_a = e.data) == null ? void 0 : _a.message) != null ? _b : e.message) != null ? _c : "Failed to update store";
      return null;
    } finally {
      isLoading.value = false;
    }
  }
  async function deleteStore(id) {
    var _a, _b, _c;
    isLoading.value = true;
    error.value = null;
    try {
      return await fetchWithAuth(`/api/stores/${id}`, {
        method: "DELETE"
      });
    } catch (err) {
      const e = err;
      error.value = (_c = (_b = (_a = e.data) == null ? void 0 : _a.message) != null ? _b : e.message) != null ? _c : "Failed to delete store";
      return null;
    } finally {
      isLoading.value = false;
    }
  }
  return {
    isLoading,
    error,
    getStores,
    getStore,
    createStore,
    updateStore,
    deleteStore
  };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const router = useRouter();
    const activeStoreStore = useActiveStoreStore();
    const { getStores, createStore, updateStore, deleteStore, isLoading, error } = useStores();
    const stores = ref([]);
    const pagination = ref({ page: 1, limit: 10, total: 0, totalPages: 1 });
    const search = ref("");
    const typeFilter = ref("");
    const limitFilter = ref(10);
    const currentPage = ref(1);
    const showCreateModal = ref(false);
    const showEditModal = ref(false);
    const showDeleteModal = ref(false);
    const selectedStore = ref(null);
    const formRef = ref();
    const formError = ref("");
    const deleteLoading = ref(false);
    const successMsg = ref("");
    const loadError = ref("");
    async function loadStores() {
      loadError.value = "";
      const res = await getStores({
        page: currentPage.value,
        limit: limitFilter.value,
        search: search.value || void 0,
        type: typeFilter.value || void 0
      });
      if (res) {
        stores.value = res.data;
        pagination.value = res.pagination;
      } else if (error.value) {
        loadError.value = error.value;
      }
    }
    let searchTimer;
    watch(search, () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        currentPage.value = 1;
        loadStores();
      }, 350);
    });
    watch(typeFilter, () => {
      currentPage.value = 1;
      loadStores();
    });
    watch(limitFilter, () => {
      currentPage.value = 1;
      loadStores();
    });
    function openStore(store) {
      activeStoreStore.setStore(store);
      router.push("/store/dashboard");
    }
    function closeCreate() {
      showCreateModal.value = false;
      formError.value = "";
    }
    async function handleCreate(payload) {
      var _a, _b;
      formError.value = "";
      const res = await createStore(payload);
      if (res == null ? void 0 : res.success) {
        successMsg.value = (_a = res.message) != null ? _a : "Store created";
        closeCreate();
        await loadStores();
        setTimeout(() => successMsg.value = "", 3e3);
      } else {
        formError.value = (_b = error.value) != null ? _b : "Failed to create store";
      }
    }
    function openEdit(store) {
      selectedStore.value = store;
      formError.value = "";
      showEditModal.value = true;
    }
    function closeEdit() {
      showEditModal.value = false;
      selectedStore.value = null;
      formError.value = "";
    }
    async function handleEdit(payload) {
      var _a, _b;
      if (!selectedStore.value) return;
      formError.value = "";
      const res = await updateStore(selectedStore.value.id, payload);
      if (res == null ? void 0 : res.success) {
        successMsg.value = (_a = res.message) != null ? _a : "Store updated";
        closeEdit();
        await loadStores();
        setTimeout(() => successMsg.value = "", 3e3);
      } else {
        formError.value = (_b = error.value) != null ? _b : "Failed to update store";
      }
    }
    function openDelete(store) {
      selectedStore.value = store;
      showDeleteModal.value = true;
    }
    function closeDelete() {
      showDeleteModal.value = false;
      selectedStore.value = null;
    }
    async function handleDelete() {
      if (!selectedStore.value) return;
      deleteLoading.value = true;
      const res = await deleteStore(selectedStore.value.id);
      deleteLoading.value = false;
      if (res == null ? void 0 : res.success) {
        successMsg.value = "Store deleted";
        closeDelete();
        await loadStores();
        setTimeout(() => successMsg.value = "", 3e3);
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AppInput = _sfc_main$3;
      const _component_StoreTable = _sfc_main$2;
      const _component_AppModal = __nuxt_component_2;
      const _component_StoreForm = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="flex items-center justify-between"><div><h1 class="text-2xl font-bold text-gray-900">My Stores</h1><p class="text-sm text-gray-500 mt-1">Pilih toko untuk masuk ke aplikasi, atau kelola toko Anda</p></div><button class="btn-primary flex items-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg> Add Store </button></div>`);
      if (unref(successMsg)) {
        _push(`<div class="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700"><svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg> ${ssrInterpolate(unref(successMsg))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex flex-wrap items-center gap-3">`);
      _push(ssrRenderComponent(_component_AppInput, {
        modelValue: unref(search),
        "onUpdate:modelValue": ($event) => isRef(search) ? search.value = $event : null,
        placeholder: "Search stores\u2026",
        class: "w-56"
      }, null, _parent));
      _push(`<select class="input w-36"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(typeFilter)) ? ssrLooseContain(unref(typeFilter), "") : ssrLooseEqual(unref(typeFilter), "")) ? " selected" : ""}>All types</option><option value="SHOPEE"${ssrIncludeBooleanAttr(Array.isArray(unref(typeFilter)) ? ssrLooseContain(unref(typeFilter), "SHOPEE") : ssrLooseEqual(unref(typeFilter), "SHOPEE")) ? " selected" : ""}>Shopee</option><option value="TIKTOK"${ssrIncludeBooleanAttr(Array.isArray(unref(typeFilter)) ? ssrLooseContain(unref(typeFilter), "TIKTOK") : ssrLooseEqual(unref(typeFilter), "TIKTOK")) ? " selected" : ""}>TikTok</option></select><select class="input w-24"><option${ssrRenderAttr("value", 10)}${ssrIncludeBooleanAttr(Array.isArray(unref(limitFilter)) ? ssrLooseContain(unref(limitFilter), 10) : ssrLooseEqual(unref(limitFilter), 10)) ? " selected" : ""}>10</option><option${ssrRenderAttr("value", 25)}${ssrIncludeBooleanAttr(Array.isArray(unref(limitFilter)) ? ssrLooseContain(unref(limitFilter), 25) : ssrLooseEqual(unref(limitFilter), 25)) ? " selected" : ""}>25</option><option${ssrRenderAttr("value", 50)}${ssrIncludeBooleanAttr(Array.isArray(unref(limitFilter)) ? ssrLooseContain(unref(limitFilter), 50) : ssrLooseEqual(unref(limitFilter), 50)) ? " selected" : ""}>50</option></select><span class="text-sm text-gray-500 ml-auto">${ssrInterpolate(unref(pagination).total)} stores</span></div>`);
      if (unref(loadError)) {
        _push(`<div class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">${ssrInterpolate(unref(loadError))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">`);
      if (unref(isLoading)) {
        _push(`<div class="flex justify-center items-center py-16 text-gray-400"><svg class="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg></div>`);
      } else {
        _push(ssrRenderComponent(_component_StoreTable, {
          stores: unref(stores),
          onOpen: openStore,
          onEdit: openEdit,
          onDelete: openDelete
        }, null, _parent));
      }
      _push(`</div>`);
      if (unref(pagination).totalPages > 1) {
        _push(`<div class="flex items-center justify-center gap-2"><!--[-->`);
        ssrRenderList(unref(pagination).totalPages, (p) => {
          _push(`<button class="${ssrRenderClass([p === unref(currentPage) ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600 hover:border-gray-400", "px-3 py-1.5 text-sm rounded-lg border transition-colors"])}">${ssrInterpolate(p)}</button>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_AppModal, {
        "is-open": unref(showCreateModal),
        title: "Add Store",
        size: "md",
        onClose: closeCreate
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_StoreForm, {
              ref_key: "formRef",
              ref: formRef,
              mode: "create",
              loading: unref(isLoading),
              error: unref(formError),
              onSubmit: (p) => handleCreate(p),
              onCancel: closeCreate
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_StoreForm, {
                ref_key: "formRef",
                ref: formRef,
                mode: "create",
                loading: unref(isLoading),
                error: unref(formError),
                onSubmit: (p) => handleCreate(p),
                onCancel: closeCreate
              }, null, 8, ["loading", "error", "onSubmit"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_AppModal, {
        "is-open": unref(showEditModal),
        title: "Edit Store",
        size: "md",
        onClose: closeEdit
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b;
          if (_push2) {
            _push2(ssrRenderComponent(_component_StoreForm, {
              mode: "edit",
              "initial-data": (_a = unref(selectedStore)) != null ? _a : void 0,
              loading: unref(isLoading),
              error: unref(formError),
              onSubmit: (p) => handleEdit(p),
              onCancel: closeEdit
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_StoreForm, {
                mode: "edit",
                "initial-data": (_b = unref(selectedStore)) != null ? _b : void 0,
                loading: unref(isLoading),
                error: unref(formError),
                onSubmit: (p) => handleEdit(p),
                onCancel: closeEdit
              }, null, 8, ["initial-data", "loading", "error", "onSubmit"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_AppModal, {
        "is-open": unref(showDeleteModal),
        title: "Delete Store",
        size: "sm",
        onClose: closeDelete
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b;
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}><p class="text-sm text-gray-700"${_scopeId}> Are you sure you want to delete <strong${_scopeId}>${ssrInterpolate((_a = unref(selectedStore)) == null ? void 0 : _a.name)}</strong>? This action cannot be undone. </p><div class="flex justify-end gap-3"${_scopeId}><button class="btn-secondary"${_scopeId}>Cancel</button><button class="btn-danger"${ssrIncludeBooleanAttr(unref(deleteLoading)) ? " disabled" : ""}${_scopeId}>`);
            if (unref(deleteLoading)) {
              _push2(`<svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"${_scopeId}></path></svg>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(` Delete </button></div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                createVNode("p", { class: "text-sm text-gray-700" }, [
                  createTextVNode(" Are you sure you want to delete "),
                  createVNode("strong", null, toDisplayString((_b = unref(selectedStore)) == null ? void 0 : _b.name), 1),
                  createTextVNode("? This action cannot be undone. ")
                ]),
                createVNode("div", { class: "flex justify-end gap-3" }, [
                  createVNode("button", {
                    class: "btn-secondary",
                    onClick: closeDelete
                  }, "Cancel"),
                  createVNode("button", {
                    class: "btn-danger",
                    disabled: unref(deleteLoading),
                    onClick: handleDelete
                  }, [
                    unref(deleteLoading) ? (openBlock(), createBlock("svg", {
                      key: 0,
                      class: "animate-spin w-4 h-4",
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
                        d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      })
                    ])) : createCommentVNode("", true),
                    createTextVNode(" Delete ")
                  ], 8, ["disabled"])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/stores/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Cty0KtZR.mjs.map
