import { _ as __nuxt_component_0 } from './nuxt-link-CM8y4qxG.mjs';
import { _ as _sfc_main$1 } from './OrderStatusBadge-CR28dblf.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, openBlock, createBlock, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { u as useRouter, d as useRoute } from './server.mjs';
import { u as useOrders } from './useOrders-BB7rCAnb.mjs';
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
import 'pinia';
import 'vue-router';
import './useApi-0aCYoCTI.mjs';
import './auth-BWjTzQkA.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    const route = useRoute();
    route.params.id;
    const { loading } = useOrders();
    const order = ref(null);
    const error = ref(null);
    function formatCurrency(v) {
      return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(v));
    }
    function formatDate(v) {
      if (!v) return "-";
      return new Date(v).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_OrderStatusBadge = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-4xl mx-auto space-y-6 pb-10" }, _attrs))}><div class="flex items-center justify-between gap-4 flex-wrap"><div class="flex items-center gap-3"><button class="text-gray-400 hover:text-gray-600 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"></path></svg></button><div><h1 class="text-xl font-bold text-gray-900">Detail Order</h1>`);
      if (unref(order)) {
        _push(`<p class="text-sm text-gray-500 font-mono">${ssrInterpolate(unref(order).orderNumber)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      if (unref(order)) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/store/orders/${unref(order).id}/edit`,
          class: "inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828A2 2 0 0110 16.414H8v-2a2 2 0 01.586-1.414z"${_scopeId}></path></svg> Edit Order `);
            } else {
              return [
                (openBlock(), createBlock("svg", {
                  xmlns: "http://www.w3.org/2000/svg",
                  class: "h-4 w-4",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828A2 2 0 0110 16.414H8v-2a2 2 0 01.586-1.414z"
                  })
                ])),
                createTextVNode(" Edit Order ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(loading)) {
        _push(`<div class="flex justify-center py-20"><svg class="animate-spin h-7 w-7 text-blue-500" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg></div>`);
      } else if (unref(error)) {
        _push(`<div class="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">${ssrInterpolate(unref(error))}</div>`);
      } else if (unref(order)) {
        _push(`<!--[--><div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5"><div class="flex items-start justify-between gap-4 flex-wrap mb-4"><h2 class="font-semibold text-gray-800">Informasi Order</h2>`);
        _push(ssrRenderComponent(_component_OrderStatusBadge, {
          status: unref(order).status
        }, null, _parent));
        _push(`</div><div class="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm"><div><p class="text-xs text-gray-400 mb-0.5">No. Order</p><p class="font-mono font-semibold text-gray-800">${ssrInterpolate(unref(order).orderNumber)}</p></div><div><p class="text-xs text-gray-400 mb-0.5">Tanggal Order</p><p class="text-gray-700">${ssrInterpolate(formatDate(unref(order).createdDate))}</p></div><div><p class="text-xs text-gray-400 mb-0.5">Tanggal Kirim</p><p class="text-gray-700">${ssrInterpolate(formatDate(unref(order).shippedDate))}</p></div><div><p class="text-xs text-gray-400 mb-0.5">Tanggal Sampai</p><p class="text-gray-700">${ssrInterpolate(formatDate(unref(order).deliveredDate))}</p></div><div><p class="text-xs text-gray-400 mb-0.5">Tanggal Selesai</p><p class="text-gray-700">${ssrInterpolate(formatDate(unref(order).completedDate))}</p></div>`);
        if (unref(order).cancelBy) {
          _push(`<div><p class="text-xs text-gray-400 mb-0.5">Dibatalkan Oleh</p><p class="text-gray-700">${ssrInterpolate(unref(order).cancelBy)}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(order).cancelReason) {
          _push(`<div class="sm:col-span-2"><p class="text-xs text-gray-400 mb-0.5">Alasan Pembatalan</p><p class="text-gray-700">${ssrInterpolate(unref(order).cancelReason)}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5"><h2 class="font-semibold text-gray-800 mb-4">Item Pesanan</h2><div class="overflow-x-auto"><table class="min-w-full text-sm"><thead><tr class="border-b border-gray-100"><th class="text-left text-xs text-gray-400 font-medium pb-2">Produk</th><th class="text-center text-xs text-gray-400 font-medium pb-2">Qty</th><th class="text-right text-xs text-gray-400 font-medium pb-2">Harga</th><th class="text-right text-xs text-gray-400 font-medium pb-2">Diskon</th><th class="text-right text-xs text-gray-400 font-medium pb-2">Subtotal</th><th class="text-right text-xs text-gray-400 font-medium pb-2">HPP</th></tr></thead><tbody class="divide-y divide-gray-50"><!--[-->`);
        ssrRenderList(unref(order).items, (item) => {
          _push(`<tr><td class="py-3 pr-4"><p class="font-medium text-gray-800">${ssrInterpolate(item.productName)}</p><div class="flex gap-2 mt-0.5 flex-wrap">`);
          if (item.sku) {
            _push(`<span class="text-xs text-gray-400">SKU: ${ssrInterpolate(item.sku)}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (item.productCategory) {
            _push(`<span class="text-xs bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded-full">${ssrInterpolate(item.productCategory)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></td><td class="py-3 text-center text-gray-700">${ssrInterpolate(item.qty)}</td><td class="py-3 text-right text-gray-700 whitespace-nowrap">${ssrInterpolate(formatCurrency(item.price))}</td><td class="py-3 text-right text-gray-500 whitespace-nowrap">${ssrInterpolate(formatCurrency(item.discount))}</td><td class="py-3 text-right font-semibold text-gray-800 whitespace-nowrap">${ssrInterpolate(formatCurrency(item.total))}</td><td class="py-3 text-right text-gray-400 whitespace-nowrap">${ssrInterpolate(formatCurrency(item.hppTotal))}</td></tr>`);
        });
        _push(`<!--]--></tbody></table></div></div><div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5"><h2 class="font-semibold text-gray-800 mb-4">Ringkasan Keuangan</h2><div class="max-w-xs ml-auto space-y-2 text-sm"><div class="flex justify-between text-gray-600"><span>Subtotal</span><span>${ssrInterpolate(formatCurrency(unref(order).subtotal))}</span></div><div class="flex justify-between text-gray-600"><span>Diskon</span><span>-${ssrInterpolate(formatCurrency(unref(order).discount))}</span></div><div class="flex justify-between text-gray-600"><span>Total</span><span>${ssrInterpolate(formatCurrency(unref(order).total))}</span></div><div class="flex justify-between text-gray-600"><span>Ongkos Kirim</span><span>+${ssrInterpolate(formatCurrency(unref(order).shippingFee))}</span></div><div class="flex justify-between text-gray-600"><span>Biaya Platform</span><span>-${ssrInterpolate(formatCurrency(unref(order).platformFee))}</span></div><div class="flex justify-between text-gray-600"><span>Biaya Afiliasi</span><span>-${ssrInterpolate(formatCurrency(unref(order).affiliateFee))}</span></div><div class="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900 text-base"><span>Grand Total</span><span>${ssrInterpolate(formatCurrency(unref(order).grandTotal))}</span></div><div class="flex justify-between text-gray-500"><span>Total HPP</span><span>${ssrInterpolate(formatCurrency(unref(order).totalHpp))}</span></div><div class="${ssrRenderClass([Number(unref(order).netTotal) >= 0 ? "text-green-700" : "text-red-600", "flex justify-between font-semibold"])}"><span>Net (Laba)</span><span>${ssrInterpolate(formatCurrency(unref(order).netTotal))}</span></div></div></div><div class="grid grid-cols-1 sm:grid-cols-2 gap-5"><div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5"><h2 class="font-semibold text-gray-800 mb-4">Pelanggan</h2>`);
        if (unref(order).customer) {
          _push(`<div class="space-y-2 text-sm">`);
          if (unref(order).customer.customerId) {
            _push(`<div><p class="text-xs text-gray-400">Customer ID</p><p class="font-mono text-gray-700">${ssrInterpolate(unref(order).customer.customerId)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div><p class="text-xs text-gray-400">Nama</p><p class="font-medium text-gray-800">${ssrInterpolate(unref(order).customer.name)}</p></div>`);
          if (unref(order).customer.phone) {
            _push(`<div><p class="text-xs text-gray-400">No. Telepon</p><p class="text-gray-700">${ssrInterpolate(unref(order).customer.phone)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(order).customer.address) {
            _push(`<div><p class="text-xs text-gray-400">Alamat Detail</p><p class="text-gray-700">${ssrInterpolate(unref(order).customer.address)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(order).customer.province || unref(order).customer.city) {
            _push(`<div><p class="text-xs text-gray-400">Kota/Provinsi</p><p class="text-gray-700">${ssrInterpolate([unref(order).customer.district, unref(order).customer.city, unref(order).customer.province, unref(order).customer.zipcode].filter(Boolean).join(", "))}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<p class="text-sm text-gray-400">Tidak ada data pelanggan</p>`);
        }
        _push(`</div><div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5"><h2 class="font-semibold text-gray-800 mb-4">Pengiriman</h2>`);
        if (unref(order).shipping) {
          _push(`<div class="space-y-2 text-sm">`);
          if (unref(order).shipping.name) {
            _push(`<div><p class="text-xs text-gray-400">Kurir</p><p class="font-medium text-gray-800">${ssrInterpolate(unref(order).shipping.name)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(order).shipping.serviceName) {
            _push(`<div><p class="text-xs text-gray-400">Layanan</p><p class="text-gray-700">${ssrInterpolate(unref(order).shipping.serviceName)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(order).shipping.trackingNumber) {
            _push(`<div><p class="text-xs text-gray-400">No. Resi</p><p class="font-mono font-semibold text-blue-700">${ssrInterpolate(unref(order).shipping.trackingNumber)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<p class="text-sm text-gray-400">Tidak ada data pengiriman</p>`);
        }
        _push(`</div></div><!--]-->`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/store/orders/[id]/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Cmr_JYQJ.mjs.map
