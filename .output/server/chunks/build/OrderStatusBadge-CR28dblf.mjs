import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "OrderStatusBadge",
  __ssrInlineRender: true,
  props: {
    status: {}
  },
  setup(__props) {
    const props = __props;
    const map = {
      PENDING: { label: "Pending", class: "bg-yellow-100 text-yellow-800" },
      SHIPPED: { label: "Dikirim", class: "bg-blue-100 text-blue-800" },
      DELIVERED: { label: "Sampai", class: "bg-indigo-100 text-indigo-800" },
      COMPLETED: { label: "Selesai", class: "bg-green-100 text-green-800" },
      CANCELLED: { label: "Dibatalkan", class: "bg-red-100 text-red-800" },
      RETURNED: { label: "Retur", class: "bg-gray-100 text-gray-700" }
    };
    const badgeClass = computed(() => {
      var _a, _b;
      return (_b = (_a = map[props.status]) == null ? void 0 : _a.class) != null ? _b : "bg-gray-100 text-gray-700";
    });
    const label = computed(() => {
      var _a, _b;
      return (_b = (_a = map[props.status]) == null ? void 0 : _a.label) != null ? _b : props.status;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<span${ssrRenderAttrs(mergeProps({
        class: [unref(badgeClass), "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"]
      }, _attrs))}>${ssrInterpolate(unref(label))}</span>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/order/OrderStatusBadge.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=OrderStatusBadge-CR28dblf.mjs.map
