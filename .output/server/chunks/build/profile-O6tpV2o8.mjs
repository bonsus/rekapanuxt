import { _ as _sfc_main$1 } from './AppBadge-B-HdCKTa.mjs';
import { _ as _sfc_main$2 } from './AppButton-DxMiFqDS.mjs';
import { _ as _sfc_main$3 } from './AppInput-BzBRQFXN.mjs';
import { defineComponent, computed, ref, reactive, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { u as useAuthStore } from './auth-BWjTzQkA.mjs';
import { u as useApi } from './useApi-0aCYoCTI.mjs';
import { _ as _export_sfc } from './server.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "profile",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    useApi();
    const user = computed(() => authStore.user);
    const isEditing = ref(false);
    const successMsg = ref("");
    const isLoading = ref(false);
    const apiError = ref("");
    const pwForm = reactive({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    const pwErrors = reactive({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    function formatDate(dateStr) {
      if (!dateStr) return "\u2014";
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i;
      const _component_AppBadge = _sfc_main$1;
      const _component_AppButton = _sfc_main$2;
      const _component_AppInput = _sfc_main$3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6 max-w-2xl" }, _attrs))} data-v-0c9c763c>`);
      if (unref(successMsg)) {
        _push(`<div class="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl" data-v-0c9c763c><svg class="w-5 h-5 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20" data-v-0c9c763c><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" data-v-0c9c763c></path></svg><p class="text-sm font-medium text-green-700" data-v-0c9c763c>${ssrInterpolate(unref(successMsg))}</p><button class="ml-auto text-green-400 hover:text-green-600" data-v-0c9c763c> \u2715 </button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="card p-6" data-v-0c9c763c><div class="flex items-center gap-4 mb-6" data-v-0c9c763c><div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-2xl font-bold text-white" data-v-0c9c763c>${ssrInterpolate((_b = (_a = unref(user)) == null ? void 0 : _a.name) == null ? void 0 : _b.charAt(0).toUpperCase())}</div><div data-v-0c9c763c><h2 class="text-xl font-bold text-gray-800" data-v-0c9c763c>${ssrInterpolate((_c = unref(user)) == null ? void 0 : _c.name)}</h2><p class="text-sm text-gray-500" data-v-0c9c763c>${ssrInterpolate((_d = unref(user)) == null ? void 0 : _d.email)}</p>`);
      _push(ssrRenderComponent(_component_AppBadge, {
        variant: ((_e = unref(user)) == null ? void 0 : _e.role) === "ADMIN" ? "purple" : "info",
        class: "mt-1"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b2;
          if (_push2) {
            _push2(`${ssrInterpolate((_a2 = unref(user)) == null ? void 0 : _a2.role)}`);
          } else {
            return [
              createTextVNode(toDisplayString((_b2 = unref(user)) == null ? void 0 : _b2.role), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="space-y-0 divide-y divide-gray-50" data-v-0c9c763c><div class="flex items-center justify-between py-3" data-v-0c9c763c><span class="text-sm text-gray-500" data-v-0c9c763c>Full Name</span><span class="text-sm font-medium text-gray-800" data-v-0c9c763c>${ssrInterpolate((_f = unref(user)) == null ? void 0 : _f.name)}</span></div><div class="flex items-center justify-between py-3" data-v-0c9c763c><span class="text-sm text-gray-500" data-v-0c9c763c>Email Address</span><span class="text-sm font-medium text-gray-800" data-v-0c9c763c>${ssrInterpolate((_g = unref(user)) == null ? void 0 : _g.email)}</span></div><div class="flex items-center justify-between py-3" data-v-0c9c763c><span class="text-sm text-gray-500" data-v-0c9c763c>Role</span>`);
      _push(ssrRenderComponent(_component_AppBadge, {
        variant: ((_h = unref(user)) == null ? void 0 : _h.role) === "ADMIN" ? "purple" : "info"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b2;
          if (_push2) {
            _push2(`${ssrInterpolate((_a2 = unref(user)) == null ? void 0 : _a2.role)}`);
          } else {
            return [
              createTextVNode(toDisplayString((_b2 = unref(user)) == null ? void 0 : _b2.role), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="flex items-center justify-between py-3" data-v-0c9c763c><span class="text-sm text-gray-500" data-v-0c9c763c>Member Since</span><span class="text-sm font-medium text-gray-800" data-v-0c9c763c>${ssrInterpolate(formatDate((_i = unref(user)) == null ? void 0 : _i.createdAt))}</span></div></div></div><div class="card p-6" data-v-0c9c763c><div class="flex items-center justify-between mb-4" data-v-0c9c763c><div data-v-0c9c763c><h3 class="text-base font-semibold text-gray-800" data-v-0c9c763c>Password</h3><p class="text-sm text-gray-500 mt-0.5" data-v-0c9c763c>Update your account password</p></div>`);
      if (!unref(isEditing)) {
        _push(ssrRenderComponent(_component_AppButton, {
          variant: "secondary",
          size: "sm",
          onClick: ($event) => isEditing.value = true
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Change Password `);
            } else {
              return [
                createTextVNode(" Change Password ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(isEditing)) {
        _push(`<form class="space-y-4" data-v-0c9c763c>`);
        if (unref(apiError)) {
          _push(`<div class="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg" data-v-0c9c763c><svg class="w-4 h-4 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20" data-v-0c9c763c><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" data-v-0c9c763c></path></svg><p class="text-sm text-red-700" data-v-0c9c763c>${ssrInterpolate(unref(apiError))}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(_component_AppInput, {
          modelValue: unref(pwForm).currentPassword,
          "onUpdate:modelValue": ($event) => unref(pwForm).currentPassword = $event,
          label: "Current Password",
          type: "password",
          placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
          required: "",
          error: unref(pwErrors).currentPassword
        }, null, _parent));
        _push(ssrRenderComponent(_component_AppInput, {
          modelValue: unref(pwForm).newPassword,
          "onUpdate:modelValue": ($event) => unref(pwForm).newPassword = $event,
          label: "New Password",
          type: "password",
          placeholder: "Min. 8 characters",
          required: "",
          error: unref(pwErrors).newPassword
        }, null, _parent));
        _push(ssrRenderComponent(_component_AppInput, {
          modelValue: unref(pwForm).confirmPassword,
          "onUpdate:modelValue": ($event) => unref(pwForm).confirmPassword = $event,
          label: "Confirm New Password",
          type: "password",
          placeholder: "Repeat new password",
          required: "",
          error: unref(pwErrors).confirmPassword
        }, null, _parent));
        _push(`<div class="flex gap-3 pt-1" data-v-0c9c763c>`);
        _push(ssrRenderComponent(_component_AppButton, {
          type: "submit",
          loading: unref(isLoading)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Update Password `);
            } else {
              return [
                createTextVNode(" Update Password ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_AppButton, {
          variant: "secondary",
          type: "button",
          onClick: ($event) => {
            isEditing.value = false;
            apiError.value = "";
          }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Cancel `);
            } else {
              return [
                createTextVNode(" Cancel ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></form>`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(isEditing)) {
        _push(`<p class="text-sm text-gray-400" data-v-0c9c763c> \u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022 </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/profile.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const profile = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-0c9c763c"]]);

export { profile as default };
//# sourceMappingURL=profile-O6tpV2o8.mjs.map
