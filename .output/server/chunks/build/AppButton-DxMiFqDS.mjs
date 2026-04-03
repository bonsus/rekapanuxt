import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AppButton",
  __ssrInlineRender: true,
  props: {
    variant: { default: "primary" },
    size: { default: "md" },
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    type: { default: "button" }
  },
  setup(__props) {
    const props = __props;
    const variantClasses = {
      primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm",
      secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-400 shadow-sm",
      danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm",
      ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-400"
    };
    const sizeClasses = {
      sm: "px-3 py-1.5 text-xs gap-1.5",
      md: "px-4 py-2 text-sm gap-2",
      lg: "px-5 py-2.5 text-base gap-2"
    };
    const classes = computed(() => [
      "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150",
      "focus:outline-none focus:ring-2 focus:ring-offset-1",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      variantClasses[props.variant],
      sizeClasses[props.size]
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps({
        type: __props.type,
        disabled: __props.disabled || __props.loading,
        class: unref(classes)
      }, _attrs))}>`);
      if (__props.loading) {
        _push(`<svg class="animate-spin -ml-0.5 w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</button>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/AppButton.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=AppButton-DxMiFqDS.mjs.map
