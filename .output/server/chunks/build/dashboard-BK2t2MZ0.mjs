import { _ as __nuxt_component_0 } from './nuxt-link-CM8y4qxG.mjs';
import { _ as _sfc_main$1 } from './AppButton-DxMiFqDS.mjs';
import { _ as _sfc_main$2 } from './AppBadge-B-HdCKTa.mjs';
import { defineComponent, reactive, ref, mergeProps, unref, withCtx, openBlock, createBlock, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { u as useAuthStore } from './auth-BWjTzQkA.mjs';
import { u as useUsers } from './useUsers-rVqoph26.mjs';
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
  __name: "dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    useUsers();
    const stats = reactive({
      total: 0,
      admins: 0,
      users: 0
    });
    const recentUsers = ref([]);
    const isLoading = ref(false);
    function formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_NuxtLink = __nuxt_component_0;
      const _component_AppButton = _sfc_main$1;
      const _component_AppBadge = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="flex items-center justify-between"><div><h2 class="text-2xl font-bold text-gray-800"> Hello, ${ssrInterpolate((_b = (_a = unref(authStore).user) == null ? void 0 : _a.name) == null ? void 0 : _b.split(" ")[0])} \u{1F44B} </h2><p class="text-sm text-gray-500 mt-0.5">Here&#39;s what&#39;s happening in your system.</p></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/admin/users" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_AppButton, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"${_scopeId2}></path></svg> Add User `);
                } else {
                  return [
                    (openBlock(), createBlock("svg", {
                      class: "w-4 h-4",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      })
                    ])),
                    createTextVNode(" Add User ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_AppButton, null, {
                default: withCtx(() => [
                  (openBlock(), createBlock("svg", {
                    class: "w-4 h-4",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    })
                  ])),
                  createTextVNode(" Add User ")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="grid grid-cols-1 sm:grid-cols-3 gap-5"><div class="card p-5"><div class="flex items-center justify-between mb-3"><p class="text-sm font-medium text-gray-500">Total Users</p><div class="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center"><svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg></div></div><p class="text-3xl font-bold text-gray-800">`);
      if (unref(isLoading)) {
        _push(`<span class="animate-pulse">\u2014</span>`);
      } else {
        _push(`<span>${ssrInterpolate(unref(stats).total)}</span>`);
      }
      _push(`</p><p class="text-xs text-gray-400 mt-1">All registered accounts</p></div><div class="card p-5"><div class="flex items-center justify-between mb-3"><p class="text-sm font-medium text-gray-500">Admins</p><div class="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center"><svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg></div></div><p class="text-3xl font-bold text-gray-800">`);
      if (unref(isLoading)) {
        _push(`<span class="animate-pulse">\u2014</span>`);
      } else {
        _push(`<span>${ssrInterpolate(unref(stats).admins)}</span>`);
      }
      _push(`</p><p class="text-xs text-gray-400 mt-1">Administrator accounts</p></div><div class="card p-5"><div class="flex items-center justify-between mb-3"><p class="text-sm font-medium text-gray-500">Regular Users</p><div class="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center"><svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></div></div><p class="text-3xl font-bold text-gray-800">`);
      if (unref(isLoading)) {
        _push(`<span class="animate-pulse">\u2014</span>`);
      } else {
        _push(`<span>${ssrInterpolate(unref(stats).users)}</span>`);
      }
      _push(`</p><p class="text-xs text-gray-400 mt-1">Standard user accounts</p></div></div><div class="card"><div class="flex items-center justify-between px-6 py-4 border-b border-gray-100"><h3 class="font-semibold text-gray-800">Recent Users</h3>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/users",
        class: "text-sm text-blue-600 hover:text-blue-700 font-medium"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` View all \u2192 `);
          } else {
            return [
              createTextVNode(" View all \u2192 ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="divide-y divide-gray-50">`);
      if (unref(isLoading)) {
        _push(`<!--[-->`);
        ssrRenderList(5, (i) => {
          _push(`<div class="flex items-center gap-3 px-6 py-3.5"><div class="w-8 h-8 rounded-full bg-gray-100 animate-pulse"></div><div class="flex-1 space-y-1.5"><div class="h-3.5 bg-gray-100 rounded animate-pulse w-32"></div><div class="h-3 bg-gray-100 rounded animate-pulse w-48"></div></div></div>`);
        });
        _push(`<!--]-->`);
      } else if (unref(recentUsers).length === 0) {
        _push(`<div class="px-6 py-10 text-center text-sm text-gray-400"> No users yet </div>`);
      } else {
        _push(`<!--[-->`);
        ssrRenderList(unref(recentUsers), (u) => {
          _push(`<div class="flex items-center gap-3 px-6 py-3.5 hover:bg-gray-50 transition-colors"><div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">${ssrInterpolate(u.name.charAt(0).toUpperCase())}</div><div class="flex-1 min-w-0"><p class="text-sm font-medium text-gray-800 truncate">${ssrInterpolate(u.name)}</p><p class="text-xs text-gray-500 truncate">${ssrInterpolate(u.email)}</p></div><div class="flex items-center gap-2 shrink-0">`);
          _push(ssrRenderComponent(_component_AppBadge, {
            variant: u.role === "ADMIN" ? "purple" : "info"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(u.role)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(u.role), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`<span class="text-xs text-gray-400 hidden sm:block">${ssrInterpolate(formatDate(u.createdAt))}</span></div></div>`);
        });
        _push(`<!--]-->`);
      }
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=dashboard-BK2t2MZ0.mjs.map
