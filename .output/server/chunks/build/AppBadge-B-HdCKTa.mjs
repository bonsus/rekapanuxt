import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AppBadge",
  __ssrInlineRender: true,
  props: {
    variant: { default: "default" }
  },
  setup(__props) {
    const variantClasses = {
      default: "bg-gray-100 text-gray-700",
      success: "bg-green-100 text-green-700",
      warning: "bg-yellow-100 text-yellow-700",
      error: "bg-red-100 text-red-700",
      info: "bg-blue-100 text-blue-700",
      purple: "bg-purple-100 text-purple-700"
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<span${ssrRenderAttrs(mergeProps({
        class: ["inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", variantClasses[(_a = __props.variant) != null ? _a : "default"]]
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</span>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/AppBadge.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=AppBadge-B-HdCKTa.mjs.map
