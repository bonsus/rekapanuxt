import { _ as __nuxt_component_0 } from './nuxt-link-CM8y4qxG.mjs';
import { defineComponent, mergeProps, unref, watch, computed, withCtx, openBlock, createBlock, createVNode, createCommentVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { u as useAuthStore } from './auth-BWjTzQkA.mjs';
import { u as useAuth } from './useAuth-D6UPIiIl.mjs';
import { u as useSidebar } from './useSidebar-U986f8wU.mjs';
import { _ as _export_sfc, d as useRoute } from './server.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'pinia';
import './useApi-0aCYoCTI.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Sidebar",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    useAuth();
    const route = useRoute();
    const { isSidebarOpen, closeSidebar } = useSidebar();
    watch(() => route.path, () => closeSidebar());
    const userNavItems = [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: "home"
      },
      {
        label: "Stores",
        href: "/dashboard/stores",
        icon: "store"
      }
    ];
    const adminNavItems = [
      {
        label: "Dashboard",
        href: "/admin/dashboard",
        icon: "home"
      },
      {
        label: "User Management",
        href: "/admin/users",
        icon: "users"
      }
    ];
    const navItems = computed(
      () => authStore.isAdmin ? adminNavItems : userNavItems
    );
    const userInitial = computed(
      () => {
        var _a, _b, _c;
        return (_c = (_b = (_a = authStore.user) == null ? void 0 : _a.name) == null ? void 0 : _b.charAt(0).toUpperCase()) != null ? _c : "?";
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<aside${ssrRenderAttrs(mergeProps({
        class: ["fixed lg:relative inset-y-0 left-0 z-40 lg:z-10 w-64 shrink-0 bg-slate-900 text-white flex flex-col h-full shadow-xl transform transition-transform duration-300 ease-in-out", unref(isSidebarOpen) ? "translate-x-0" : "-translate-x-full lg:translate-x-0"]
      }, _attrs))}><div class="px-6 py-5 border-b border-slate-700/60"><div class="flex items-center gap-3"><div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0"><svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg></div><div><p class="font-bold text-white leading-none">RekapNuxt</p><p class="text-xs text-slate-400 capitalize mt-0.5">${ssrInterpolate((_b = (_a = unref(authStore).user) == null ? void 0 : _a.role) == null ? void 0 : _b.toLowerCase())} panel </p></div></div></div><nav class="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto"><p class="px-3 pt-2 pb-1 text-xs font-semibold text-slate-500 uppercase tracking-wider"> Navigation </p><!--[-->`);
      ssrRenderList(unref(navItems), (item) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: item.href,
          to: item.href,
          class: ["flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-700/60 hover:text-white transition-all duration-150 text-sm font-medium", {
            "bg-blue-600 text-white hover:bg-blue-600": unref(route).path === item.href
          }]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (item.icon === "home") {
                _push2(`<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"${_scopeId}></path></svg>`);
              } else if (item.icon === "user") {
                _push2(`<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"${_scopeId}></path></svg>`);
              } else if (item.icon === "users") {
                _push2(`<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"${_scopeId}></path></svg>`);
              } else if (item.icon === "store") {
                _push2(`<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"${_scopeId}></path></svg>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<span${_scopeId}>${ssrInterpolate(item.label)}</span>`);
            } else {
              return [
                item.icon === "home" ? (openBlock(), createBlock("svg", {
                  key: 0,
                  class: "w-4 h-4 shrink-0",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  })
                ])) : item.icon === "user" ? (openBlock(), createBlock("svg", {
                  key: 1,
                  class: "w-4 h-4 shrink-0",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  })
                ])) : item.icon === "users" ? (openBlock(), createBlock("svg", {
                  key: 2,
                  class: "w-4 h-4 shrink-0",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  })
                ])) : item.icon === "store" ? (openBlock(), createBlock("svg", {
                  key: 3,
                  class: "w-4 h-4 shrink-0",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  })
                ])) : createCommentVNode("", true),
                createVNode("span", null, toDisplayString(item.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></nav><div class="px-3 pb-4 pt-2 border-t border-slate-700/60 space-y-0.5"><div class="flex items-center gap-3 px-3 py-2.5"><div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold shrink-0">${ssrInterpolate(unref(userInitial))}</div><div class="flex-1 min-w-0"><p class="text-sm font-medium text-white truncate">${ssrInterpolate((_c = unref(authStore).user) == null ? void 0 : _c.name)}</p><p class="text-xs text-slate-400 truncate">${ssrInterpolate((_d = unref(authStore).user) == null ? void 0 : _d.email)}</p></div></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard/profile",
        class: ["flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-700/60 hover:text-white transition-all duration-150 text-sm font-medium", { "bg-blue-600 text-white hover:bg-blue-600": unref(route).path === "/dashboard/profile" }]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"${_scopeId}></path></svg><span${_scopeId}>Profile</span>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                class: "w-4 h-4 shrink-0",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24"
              }, [
                createVNode("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "stroke-width": "2",
                  d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                })
              ])),
              createVNode("span", null, "Profile")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-all duration-150 text-sm font-medium"><svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg><span>Sign out</span></button></div></aside>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/Sidebar.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    useAuthStore();
    const { isSidebarOpen } = useSidebar();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Sidebar = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex h-screen bg-gray-50 overflow-hidden" }, _attrs))} data-v-9141e3a5>`);
      if (unref(isSidebarOpen)) {
        _push(`<div class="fixed inset-0 z-30 lg:hidden bg-black/50" data-v-9141e3a5></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_Sidebar, null, null, _parent));
      _push(`<div class="flex-1 flex flex-col min-w-0 overflow-hidden" data-v-9141e3a5><main class="flex-1 overflow-y-auto p-4 lg:p-6" data-v-9141e3a5>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const dashboard = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-9141e3a5"]]);

export { dashboard as default };
//# sourceMappingURL=dashboard-D7fpi7ip.mjs.map
