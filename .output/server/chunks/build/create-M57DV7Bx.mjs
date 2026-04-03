import { defineComponent, computed, reactive, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass } from 'vue/server-renderer';
import { u as useRouter } from './server.mjs';
import { u as useActiveStoreStore } from './activeStore-yswwjCHd.mjs';
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
  __name: "create",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    const activeStoreStore = useActiveStoreStore();
    computed(() => {
      var _a, _b;
      return (_b = (_a = activeStoreStore.store) == null ? void 0 : _a.id) != null ? _b : "";
    });
    const { loading } = useOrders();
    const form = reactive({
      orderNumber: "",
      createdDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      shippedDate: "",
      deliveredDate: "",
      completedDate: "",
      status: "PENDING",
      cancelBy: "",
      cancelReason: "",
      shippingFee: 0,
      platformFee: 0,
      affiliateFee: 0
    });
    const customerForm = reactive({
      enabled: false,
      customerId: "",
      name: "",
      phone: "",
      address: "",
      country: "",
      province: "",
      city: "",
      district: "",
      zipcode: ""
    });
    const shippingForm = reactive({
      enabled: false,
      name: "",
      serviceName: "",
      trackingNumber: ""
    });
    const items = ref([]);
    const skuQuery = ref([]);
    const skuResults = ref([]);
    const skuOpen = ref([]);
    const subtotal = computed(() => items.value.reduce((s, i) => s + i.price * i.qty, 0));
    const discount = computed(() => items.value.reduce((s, i) => s + i.discount * i.qty, 0));
    const total = computed(() => subtotal.value - discount.value);
    const totalHpp = computed(() => items.value.reduce((s, i) => s + i.hpp * i.qty, 0));
    const grandTotal = computed(() => total.value + form.shippingFee - form.platformFee - form.affiliateFee);
    const netTotal = computed(() => grandTotal.value - totalHpp.value);
    function formatCurrency(v) {
      return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v);
    }
    const error = ref(null);
    const statusOptions = ["PENDING", "SHIPPED", "DELIVERED", "COMPLETED", "CANCELLED", "RETURNED"];
    const cancelByOptions = ["", "SELLER", "USER", "SYSTEM"];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-4xl mx-auto space-y-6 pb-10" }, _attrs))}><div class="flex items-center gap-3"><button class="text-gray-400 hover:text-gray-600 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"></path></svg></button><div><h1 class="text-xl font-bold text-gray-900">Tambah Order</h1><p class="text-sm text-gray-500">Buat pesanan baru</p></div></div>`);
      if (unref(error)) {
        _push(`<div class="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4"><h2 class="font-semibold text-gray-800">Informasi Order</h2><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label class="block text-xs text-gray-500 mb-1">No. Order <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).orderNumber)} type="text" placeholder="INV-001" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div><div><label class="block text-xs text-gray-500 mb-1">Tanggal Order <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).createdDate)} type="date" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div><div><label class="block text-xs text-gray-500 mb-1">Status</label><select class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"><!--[-->`);
      ssrRenderList(statusOptions, (s) => {
        _push(`<option${ssrRenderAttr("value", s)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, s) : ssrLooseEqual(unref(form).status, s)) ? " selected" : ""}>${ssrInterpolate(s)}</option>`);
      });
      _push(`<!--]--></select></div><div><label class="block text-xs text-gray-500 mb-1">Tanggal Kirim</label><input${ssrRenderAttr("value", unref(form).shippedDate)} type="date" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div><div><label class="block text-xs text-gray-500 mb-1">Tanggal Sampai</label><input${ssrRenderAttr("value", unref(form).deliveredDate)} type="date" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div><div><label class="block text-xs text-gray-500 mb-1">Tanggal Selesai</label><input${ssrRenderAttr("value", unref(form).completedDate)} type="date" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div>`);
      if (unref(form).status === "CANCELLED") {
        _push(`<div><label class="block text-xs text-gray-500 mb-1">Dibatalkan Oleh</label><select class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).cancelBy) ? ssrLooseContain(unref(form).cancelBy, "") : ssrLooseEqual(unref(form).cancelBy, "")) ? " selected" : ""}>-</option><!--[-->`);
        ssrRenderList(cancelByOptions.slice(1), (c) => {
          _push(`<option${ssrRenderAttr("value", c)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).cancelBy) ? ssrLooseContain(unref(form).cancelBy, c) : ssrLooseEqual(unref(form).cancelBy, c)) ? " selected" : ""}>${ssrInterpolate(c)}</option>`);
        });
        _push(`<!--]--></select></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(form).status === "CANCELLED") {
        _push(`<div class="sm:col-span-2"><label class="block text-xs text-gray-500 mb-1">Alasan Pembatalan</label><input${ssrRenderAttr("value", unref(form).cancelReason)} type="text" placeholder="Alasan..." class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4"><div class="flex items-center justify-between"><h2 class="font-semibold text-gray-800">Item Pesanan</h2><button class="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors">+ Tambah Item</button></div>`);
      if (unref(items).length === 0) {
        _push(`<div class="text-center py-8 text-gray-400 text-sm">Belum ada item</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(unref(items), (item, idx) => {
        var _a;
        _push(`<div class="border border-gray-100 rounded-xl p-4 space-y-3 bg-gray-50/50"><div class="flex items-start gap-3"><div class="flex-1 relative"><label class="block text-xs text-gray-500 mb-1">Produk / SKU <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(skuQuery)[idx])} type="text" placeholder="Cari produk atau SKU..." class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">`);
        if (unref(skuOpen)[idx] && ((_a = unref(skuResults)[idx]) == null ? void 0 : _a.length)) {
          _push(`<div class="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto"><!--[-->`);
          ssrRenderList(unref(skuResults)[idx], (result) => {
            _push(`<button class="w-full text-left px-3 py-2.5 hover:bg-blue-50 text-sm border-b border-gray-50 last:border-0 transition-colors"><div class="font-medium text-gray-800">${ssrInterpolate(result.productName)}</div><div class="text-xs text-gray-500 flex gap-2 mt-0.5">`);
            if (result.sku) {
              _push(`<span>SKU: ${ssrInterpolate(result.sku)}</span>`);
            } else {
              _push(`<!---->`);
            }
            if (result.productCategory) {
              _push(`<span>${ssrInterpolate(result.productCategory)}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<span class="text-blue-600">${ssrInterpolate(formatCurrency(result.price))}</span></div></button>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><button class="mt-6 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>`);
        if (!item.skuId) {
          _push(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-3"><div><label class="block text-xs text-gray-500 mb-1">Nama Produk <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", item.productName)} type="text" placeholder="Nama produk" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div><div><label class="block text-xs text-gray-500 mb-1">Kategori</label><input${ssrRenderAttr("value", item.productCategory)} type="text" placeholder="Kategori" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="grid grid-cols-2 sm:grid-cols-4 gap-3"><div><label class="block text-xs text-gray-500 mb-1">Qty</label><input${ssrRenderAttr("value", item.qty)} type="number" min="1" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div><div><label class="block text-xs text-gray-500 mb-1">Harga</label><input${ssrRenderAttr("value", item.price)} type="number" min="0" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div><div><label class="block text-xs text-gray-500 mb-1">Diskon / unit</label><input${ssrRenderAttr("value", item.discount)} type="number" min="0" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div><div><label class="block text-xs text-gray-500 mb-1">HPP / unit</label><input${ssrRenderAttr("value", item.hpp)} type="number" min="0" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div></div><div class="text-xs text-right text-gray-500"> Subtotal: <span class="font-semibold text-gray-800">${ssrInterpolate(formatCurrency(item.price * item.qty - item.discount * item.qty))}</span></div></div>`);
      });
      _push(`<!--]--></div><div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4"><h2 class="font-semibold text-gray-800">Biaya Tambahan</h2><div class="grid grid-cols-1 sm:grid-cols-3 gap-4"><div><label class="block text-xs text-gray-500 mb-1">Ongkos Kirim</label><input${ssrRenderAttr("value", unref(form).shippingFee)} type="number" min="0" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div><div><label class="block text-xs text-gray-500 mb-1">Biaya Platform</label><input${ssrRenderAttr("value", unref(form).platformFee)} type="number" min="0" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div><div><label class="block text-xs text-gray-500 mb-1">Biaya Afiliasi</label><input${ssrRenderAttr("value", unref(form).affiliateFee)} type="number" min="0" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div></div></div><div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4"><div class="flex items-center gap-3"><h2 class="font-semibold text-gray-800">Pelanggan</h2><label class="flex items-center gap-2 text-sm text-gray-500 cursor-pointer"><input${ssrIncludeBooleanAttr(Array.isArray(unref(customerForm).enabled) ? ssrLooseContain(unref(customerForm).enabled, null) : unref(customerForm).enabled) ? " checked" : ""} type="checkbox" class="rounded"> Isi data pelanggan </label></div>`);
      if (unref(customerForm).enabled) {
        _push(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label class="block text-xs text-gray-500 mb-1">Customer ID</label><input${ssrRenderAttr("value", unref(customerForm).customerId)} type="text" placeholder="ID pelanggan (opsional)" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div><div><label class="block text-xs text-gray-500 mb-1">Nama <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(customerForm).name)} type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div><div><label class="block text-xs text-gray-500 mb-1">No. Telepon</label><input${ssrRenderAttr("value", unref(customerForm).phone)} type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div><div class="sm:col-span-2"><label class="block text-xs text-gray-500 mb-1">Alamat Detail</label><input${ssrRenderAttr("value", unref(customerForm).address)} type="text" placeholder="Nama jalan, nomor rumah, dll" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div><div><label class="block text-xs text-gray-500 mb-1">Provinsi</label><input${ssrRenderAttr("value", unref(customerForm).province)} type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div><div><label class="block text-xs text-gray-500 mb-1">Kota</label><input${ssrRenderAttr("value", unref(customerForm).city)} type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div><div><label class="block text-xs text-gray-500 mb-1">Kecamatan</label><input${ssrRenderAttr("value", unref(customerForm).district)} type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div><div><label class="block text-xs text-gray-500 mb-1">Kode Pos</label><input${ssrRenderAttr("value", unref(customerForm).zipcode)} type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4"><div class="flex items-center gap-3"><h2 class="font-semibold text-gray-800">Pengiriman</h2><label class="flex items-center gap-2 text-sm text-gray-500 cursor-pointer"><input${ssrIncludeBooleanAttr(Array.isArray(unref(shippingForm).enabled) ? ssrLooseContain(unref(shippingForm).enabled, null) : unref(shippingForm).enabled) ? " checked" : ""} type="checkbox" class="rounded"> Isi data pengiriman </label></div>`);
      if (unref(shippingForm).enabled) {
        _push(`<div class="grid grid-cols-1 sm:grid-cols-3 gap-4"><div><label class="block text-xs text-gray-500 mb-1">Kurir</label><input${ssrRenderAttr("value", unref(shippingForm).name)} type="text" placeholder="JNE, TIKI, dll" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div><div><label class="block text-xs text-gray-500 mb-1">Layanan</label><input${ssrRenderAttr("value", unref(shippingForm).serviceName)} type="text" placeholder="REG, YES, dll" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div><div><label class="block text-xs text-gray-500 mb-1">No. Resi</label><input${ssrRenderAttr("value", unref(shippingForm).trackingNumber)} type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="bg-gray-50 rounded-xl border border-gray-200 p-5"><h2 class="font-semibold text-gray-800 mb-3">Ringkasan</h2><div class="space-y-2 text-sm"><div class="flex justify-between text-gray-600"><span>Subtotal</span><span>${ssrInterpolate(formatCurrency(unref(subtotal)))}</span></div><div class="flex justify-between text-gray-600"><span>Diskon</span><span>-${ssrInterpolate(formatCurrency(unref(discount)))}</span></div><div class="flex justify-between text-gray-600"><span>Total</span><span>${ssrInterpolate(formatCurrency(unref(total)))}</span></div><div class="flex justify-between text-gray-600"><span>Ongkos Kirim</span><span>+${ssrInterpolate(formatCurrency(unref(form).shippingFee))}</span></div><div class="flex justify-between text-gray-600"><span>Biaya Platform</span><span>-${ssrInterpolate(formatCurrency(unref(form).platformFee))}</span></div><div class="flex justify-between text-gray-600"><span>Biaya Afiliasi</span><span>-${ssrInterpolate(formatCurrency(unref(form).affiliateFee))}</span></div><div class="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900 text-base"><span>Grand Total</span><span>${ssrInterpolate(formatCurrency(unref(grandTotal)))}</span></div><div class="flex justify-between text-gray-500"><span>Total HPP</span><span>${ssrInterpolate(formatCurrency(unref(totalHpp)))}</span></div><div class="${ssrRenderClass([unref(netTotal) >= 0 ? "text-green-700" : "text-red-600", "flex justify-between font-semibold"])}"><span>Net (Laba)</span><span>${ssrInterpolate(formatCurrency(unref(netTotal)))}</span></div></div></div><div class="flex justify-end gap-3"><button class="px-5 py-2.5 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">Batal</button><button${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="px-6 py-2.5 text-sm rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-60 shadow-sm">${ssrInterpolate(unref(loading) ? "Menyimpan..." : "Simpan Order")}</button></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/store/orders/create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=create-M57DV7Bx.mjs.map
