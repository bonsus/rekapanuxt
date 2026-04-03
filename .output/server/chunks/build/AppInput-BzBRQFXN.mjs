import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderClass } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AppInput",
  __ssrInlineRender: true,
  props: {
    modelValue: {},
    label: {},
    placeholder: {},
    type: { default: "text" },
    error: {},
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    hint: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full" }, _attrs))}>`);
      if (__props.label) {
        _push(`<label class="label">${ssrInterpolate(__props.label)} `);
        if (__props.required) {
          _push(`<span class="text-red-500 ml-0.5">*</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</label>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<input${ssrRenderAttr("type", __props.type)}${ssrRenderAttr("value", __props.modelValue)}${ssrRenderAttr("placeholder", __props.placeholder)}${ssrIncludeBooleanAttr(__props.disabled) ? " disabled" : ""}${ssrIncludeBooleanAttr(__props.required) ? " required" : ""} class="${ssrRenderClass([{ "input-error": !!__props.error }, "input"])}">`);
      if (__props.error) {
        _push(`<p class="mt-1 text-xs text-red-500 flex items-center gap-1"><svg class="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg> ${ssrInterpolate(__props.error)}</p>`);
      } else if (__props.hint) {
        _push(`<p class="mt-1 text-xs text-gray-500">${ssrInterpolate(__props.hint)}</p>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/AppInput.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=AppInput-BzBRQFXN.mjs.map
