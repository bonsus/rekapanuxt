import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';
import { u as useActiveStoreStore } from './activeStore-yswwjCHd.mjs';
import { storeToRefs } from 'pinia';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    const { store } = storeToRefs(useActiveStoreStore());
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div><h1 class="text-2xl font-bold text-gray-900">Dashboard</h1><p class="text-sm text-gray-500 mt-1">Ringkasan performa toko <strong>${ssrInterpolate((_a = unref(store)) == null ? void 0 : _a.name)}</strong></p></div><div class="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20 gap-4"><svg class="w-14 h-14 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg><div class="text-center"><p class="text-base font-semibold text-gray-400">Fitur Segera Hadir</p><p class="text-sm text-gray-300 mt-1">Dashboard akan menampilkan statistik penjualan toko Anda</p></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/store/dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=dashboard-DZFWnu-J.mjs.map
