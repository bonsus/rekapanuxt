import { _ as _sfc_main$1 } from './AppInput-BzBRQFXN.mjs';
import { _ as _sfc_main$2 } from './AppButton-DxMiFqDS.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-CM8y4qxG.mjs';
import { defineComponent, reactive, ref, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
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
    const roleError = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AppInput = _sfc_main$1;
      const _component_AppButton = _sfc_main$2;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="text-center mb-6"><div class="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium mb-3"><svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg> Admin Portal </div><h2 class="text-2xl font-bold text-gray-800">Admin Sign In</h2><p class="text-sm text-gray-500 mt-1">Access the admin dashboard</p></div><form class="space-y-4">`);
      _push(ssrRenderComponent(_component_AppInput, {
        modelValue: unref(form).email,
        "onUpdate:modelValue": ($event) => unref(form).email = $event,
        label: "Email",
        type: "email",
        placeholder: "admin@example.com",
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
      if (unref(roleError)) {
        _push(`<div class="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg"><svg class="w-4 h-4 text-orange-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg><p class="text-sm text-orange-700">${ssrInterpolate(unref(roleError))}</p></div>`);
      } else {
        _push(`<!---->`);
      }
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
            _push2(` Sign in as Admin `);
          } else {
            return [
              createTextVNode(" Sign in as Admin ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</form><div class="mt-6 pt-6 border-t border-gray-100 text-center">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/login",
        class: "text-sm text-gray-500 hover:text-gray-700"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` \u2190 Back to user login `);
          } else {
            return [
              createTextVNode(" \u2190 Back to user login ")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-DLLqodOs.mjs.map
