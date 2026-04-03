import { defineComponent, ref, unref, useSSRContext } from 'vue';
import { ssrRenderTeleport, ssrRenderClass, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AppModal",
  __ssrInlineRender: true,
  props: {
    isOpen: { type: Boolean },
    title: {},
    size: { default: "md" },
    hideClose: { type: Boolean, default: false }
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const sizeClasses = {
      sm: "max-w-sm",
      md: "max-w-lg",
      lg: "max-w-2xl"
    };
    const isMounted = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(isMounted)) {
        ssrRenderTeleport(_push, (_push2) => {
          if (__props.isOpen) {
            _push2(`<div class="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto" data-v-035c15a1><div class="absolute inset-0 bg-black/50 backdrop-blur-sm" data-v-035c15a1></div><div class="${ssrRenderClass([sizeClasses[__props.size], "relative w-full bg-white rounded-2xl shadow-2xl animate-fade-in my-auto"])}" data-v-035c15a1>`);
            if (__props.title || !__props.hideClose) {
              _push2(`<div class="flex items-center justify-between px-6 py-4 border-b border-gray-100" data-v-035c15a1>`);
              if (__props.title) {
                _push2(`<h3 class="text-lg font-semibold text-gray-800" data-v-035c15a1>${ssrInterpolate(__props.title)}</h3>`);
              } else {
                _push2(`<!---->`);
              }
              if (!__props.hideClose) {
                _push2(`<button class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors ml-auto" data-v-035c15a1><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-035c15a1><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-035c15a1></path></svg></button>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="px-6 py-4 overflow-y-auto max-h-[calc(100dvh-10rem)]" data-v-035c15a1>`);
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent);
            _push2(`</div>`);
            if (_ctx.$slots.footer) {
              _push2(`<div class="px-6 py-4 border-t border-gray-100 flex justify-end gap-3" data-v-035c15a1>`);
              ssrRenderSlot(_ctx.$slots, "footer", {}, null, _push2, _parent);
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
          } else {
            _push2(`<!---->`);
          }
        }, "body", false, _parent);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/AppModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-035c15a1"]]);

export { __nuxt_component_2 as _ };
//# sourceMappingURL=AppModal-D_J5cd1L.mjs.map
