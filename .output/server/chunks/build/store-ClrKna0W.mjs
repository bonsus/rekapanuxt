import { _ as __nuxt_component_0 } from './nuxt-link-CM8y4qxG.mjs';
import { defineComponent, computed, watch, mergeProps, unref, withCtx, openBlock, createBlock, createVNode, createCommentVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import { u as useAuthStore } from './auth-BWjTzQkA.mjs';
import { u as useActiveStoreStore } from './activeStore-yswwjCHd.mjs';
import { u as useSidebar } from './useSidebar-U986f8wU.mjs';
import { u as useAuth } from './useAuth-D6UPIiIl.mjs';
import { _ as _export_sfc, u as useRouter, d as useRoute } from './server.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "store",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    const activeStoreStore = useActiveStoreStore();
    useAuth();
    useRouter();
    const route = useRoute();
    const { isSidebarOpen, closeSidebar } = useSidebar();
    const store2 = computed(() => activeStoreStore.store);
    const storeNavItems = [
      { label: "Dashboard", href: "/store/dashboard", icon: "home" },
      { label: "Produk", href: "/store/products", icon: "box" },
      { label: "Order", href: "/store/orders", icon: "clipboard" },
      { label: "TikTok Ads", href: "/store/ads", icon: "chart" },
      { label: "Shopee Ads", href: "/store/shopee-ads", icon: "shopbag" },
      { label: "Finance", href: "/store/finance", icon: "wallet" }
    ];
    const TYPE_ICON = {
      SHOPEE: "/icon/shopee.svg",
      TIKTOK: "/icon/tiktok.svg"
    };
    const userInitial = computed(
      () => {
        var _a, _b, _c;
        return (_c = (_b = (_a = authStore.user) == null ? void 0 : _a.name) == null ? void 0 : _b.charAt(0).toUpperCase()) != null ? _c : "?";
      }
    );
    watch(() => route.path, () => closeSidebar());
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex h-screen bg-gray-50 overflow-hidden" }, _attrs))} data-v-96007403>`);
      if (unref(isSidebarOpen)) {
        _push(`<div class="fixed inset-0 z-30 lg:hidden bg-black/50" data-v-96007403></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<aside class="${ssrRenderClass([unref(isSidebarOpen) ? "translate-x-0" : "-translate-x-full lg:translate-x-0", "fixed lg:relative inset-y-0 left-0 z-40 lg:z-10 w-64 shrink-0 bg-slate-900 text-white flex flex-col h-full shadow-xl transform transition-transform duration-300 ease-in-out"])}" data-v-96007403><div class="px-4 py-4 border-b border-slate-700/60" data-v-96007403>`);
      if (unref(store2)) {
        _push(`<div class="flex items-center gap-3 mb-3" data-v-96007403><div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1.5 shrink-0" data-v-96007403><img${ssrRenderAttr("src", TYPE_ICON[unref(store2).type])}${ssrRenderAttr("alt", unref(store2).type)} class="w-full h-full object-contain" data-v-96007403></div><div class="flex-1 min-w-0" data-v-96007403><p class="text-sm font-bold text-white leading-tight truncate" data-v-96007403>${ssrInterpolate(unref(store2).name)}</p><p class="text-xs text-slate-400 mt-0.5" data-v-96007403>${ssrInterpolate(unref(store2).type === "SHOPEE" ? "Shopee" : "TikTok")}</p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-600/80 text-slate-300 hover:text-white text-xs font-medium transition-colors" data-v-96007403><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-96007403><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" data-v-96007403></path></svg> Ganti Toko </button></div><nav class="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto" data-v-96007403><p class="px-3 pt-1 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider" data-v-96007403> Menu </p><!--[-->`);
      ssrRenderList(storeNavItems, (item) => {
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
                _push2(`<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-96007403${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" data-v-96007403${_scopeId}></path></svg>`);
              } else if (item.icon === "box") {
                _push2(`<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-96007403${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" data-v-96007403${_scopeId}></path></svg>`);
              } else if (item.icon === "clipboard") {
                _push2(`<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-96007403${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" data-v-96007403${_scopeId}></path></svg>`);
              } else if (item.icon === "chart") {
                _push2(`<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-96007403${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" data-v-96007403${_scopeId}></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" data-v-96007403${_scopeId}></path></svg>`);
              } else if (item.icon === "wallet") {
                _push2(`<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-96007403${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" data-v-96007403${_scopeId}></path></svg>`);
              } else if (item.icon === "shopbag") {
                _push2(`<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-96007403${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" data-v-96007403${_scopeId}></path></svg>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<span data-v-96007403${_scopeId}>${ssrInterpolate(item.label)}</span>`);
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
                ])) : item.icon === "box" ? (openBlock(), createBlock("svg", {
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
                    d: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  })
                ])) : item.icon === "clipboard" ? (openBlock(), createBlock("svg", {
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
                    d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  })
                ])) : item.icon === "chart" ? (openBlock(), createBlock("svg", {
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
                    d: "M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                  }),
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                  })
                ])) : item.icon === "wallet" ? (openBlock(), createBlock("svg", {
                  key: 4,
                  class: "w-4 h-4 shrink-0",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  })
                ])) : item.icon === "shopbag" ? (openBlock(), createBlock("svg", {
                  key: 5,
                  class: "w-4 h-4 shrink-0",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  })
                ])) : createCommentVNode("", true),
                createVNode("span", null, toDisplayString(item.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></nav><div class="px-3 pb-4 pt-2 border-t border-slate-700/60 space-y-0.5" data-v-96007403><div class="flex items-center gap-3 px-3 py-2.5" data-v-96007403><div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold shrink-0" data-v-96007403>${ssrInterpolate(unref(userInitial))}</div><div class="flex-1 min-w-0" data-v-96007403><p class="text-sm font-medium text-white truncate" data-v-96007403>${ssrInterpolate((_a = unref(authStore).user) == null ? void 0 : _a.name)}</p><p class="text-xs text-slate-400 truncate" data-v-96007403>${ssrInterpolate((_b = unref(authStore).user) == null ? void 0 : _b.email)}</p></div></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard/profile",
        class: ["flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-700/60 hover:text-white transition-all duration-150 text-sm font-medium", { "bg-blue-600 text-white hover:bg-blue-600": unref(route).path === "/dashboard/profile" }]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-96007403${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" data-v-96007403${_scopeId}></path></svg><span data-v-96007403${_scopeId}>Profile</span>`);
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
      _push(`<button class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-all duration-150 text-sm font-medium" data-v-96007403><svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-96007403><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" data-v-96007403></path></svg><span data-v-96007403>Sign out</span></button></div></aside><div class="flex-1 flex flex-col min-w-0 overflow-hidden" data-v-96007403><main class="flex-1 overflow-y-auto p-4 lg:p-6" data-v-96007403>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/store.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const store = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-96007403"]]);

export { store as default };
//# sourceMappingURL=store-ClrKna0W.mjs.map
