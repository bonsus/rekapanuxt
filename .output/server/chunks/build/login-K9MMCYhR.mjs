import { _ as _sfc_main$1 } from './AppInput-BzBRQFXN.mjs';
import { _ as _sfc_main$2 } from './AppButton-DxMiFqDS.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-CM8y4qxG.mjs';
import { defineComponent, reactive, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { u as useAuthStore } from './auth-BWjTzQkA.mjs';
import { u as useAuth } from './useAuth-D6UPIiIl.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'pinia';
import 'vue-router';
import './useApi-0aCYoCTI.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    useAuthStore();
    const { isLoading, error } = useAuth();
    const form = reactive({ email: "", password: "" });
    const formErrors = reactive({ email: "", password: "" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AppInput = _sfc_main$1;
      const _component_AppButton = _sfc_main$2;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="text-center mb-6"><h2 class="text-2xl font-bold text-gray-800">Welcome back</h2><p class="text-sm text-gray-500 mt-1">Sign in to your account</p></div><form class="space-y-4">`);
      _push(ssrRenderComponent(_component_AppInput, {
        modelValue: unref(form).email,
        "onUpdate:modelValue": ($event) => unref(form).email = $event,
        label: "Email",
        type: "email",
        placeholder: "you@example.com",
        required: "",
        error: unref(formErrors).email
      }, null, _parent));
      _push(ssrRenderComponent(_component_AppInput, {
        modelValue: unref(form).password,
        "onUpdate:modelValue": ($event) => unref(form).password = $event,
        label: "Password",
        type: "password",
        placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
        required: "",
        error: unref(formErrors).password
      }, null, _parent));
      if (unref(error)) {
        _push(`<div class="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"><svg class="w-4 h-4 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg><p class="text-sm text-red-700">${ssrInterpolate(unref(error))}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_AppButton, {
        type: "submit",
        class: "w-full",
        loading: unref(isLoading)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Sign in `);
          } else {
            return [
              createTextVNode(" Sign in ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</form><div class="mt-6 pt-6 border-t border-gray-100 text-center">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/login",
        class: "text-sm text-blue-600 hover:text-blue-700 font-medium"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Admin login \u2192 `);
          } else {
            return [
              createTextVNode(" Admin login \u2192 ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-K9MMCYhR.mjs.map
