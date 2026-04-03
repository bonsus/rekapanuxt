import { _ as __nuxt_component_0 } from './nuxt-link-CM8y4qxG.mjs';
import { _ as _sfc_main$3 } from './OrderStatusBadge-CR28dblf.mjs';
import { defineComponent, computed, ref, watch, mergeProps, withCtx, openBlock, createBlock, createVNode, createTextVNode, unref, toDisplayString, Fragment, renderList, createCommentVNode, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { _ as __nuxt_component_2 } from './AppModal-D_J5cd1L.mjs';
import { u as useApi } from './useApi-0aCYoCTI.mjs';
import { _ as _export_sfc, u as useRouter } from './server.mjs';
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
import './auth-BWjTzQkA.mjs';
import 'pinia';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "OrderTable",
  __ssrInlineRender: true,
  props: {
    orders: {}
  },
  emits: ["detail", "edit", "delete"],
  setup(__props) {
    function formatCurrency(value) {
      return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value));
    }
    function formatDate(value) {
      return new Date(value).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_OrderStatusBadge = _sfc_main$3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm" }, _attrs))}><table class="min-w-full divide-y divide-gray-200 text-sm"><thead class="bg-gray-50"><tr><th class="px-4 py-3 text-left font-semibold text-gray-600">No. Order</th><th class="px-4 py-3 text-left font-semibold text-gray-600">Pelanggan</th><th class="px-4 py-3 text-left font-semibold text-gray-600">Status</th><th class="px-4 py-3 text-center font-semibold text-gray-600">Item</th><th class="px-4 py-3 text-right font-semibold text-gray-600">Grand Total</th><th class="px-4 py-3 text-left font-semibold text-gray-600">Tanggal</th><th class="px-4 py-3 text-center font-semibold text-gray-600">Aksi</th></tr></thead><tbody class="divide-y divide-gray-100">`);
      if (__props.orders.length === 0) {
        _push(`<tr><td colspan="7" class="px-4 py-10 text-center text-gray-400">Belum ada order</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(__props.orders, (order) => {
        var _a, _b, _c, _d;
        _push(`<tr class="hover:bg-gray-50 transition-colors"><td class="px-4 py-3 font-mono whitespace-nowrap"><button class="text-blue-700 hover:underline font-medium">${ssrInterpolate(order.orderNumber)}</button></td><td class="px-4 py-3 text-gray-700">${ssrInterpolate((_b = (_a = order.customer) == null ? void 0 : _a.name) != null ? _b : "-")}</td><td class="px-4 py-3">`);
        _push(ssrRenderComponent(_component_OrderStatusBadge, {
          status: order.status
        }, null, _parent));
        _push(`</td><td class="px-4 py-3 text-center text-gray-600">${ssrInterpolate((_d = (_c = order._count) == null ? void 0 : _c.items) != null ? _d : 0)}</td><td class="px-4 py-3 text-right font-semibold text-gray-800 whitespace-nowrap">${ssrInterpolate(formatCurrency(order.grandTotal))}</td><td class="px-4 py-3 text-gray-500 whitespace-nowrap">${ssrInterpolate(formatDate(order.createdDate))}</td><td class="px-4 py-3"><div class="flex items-center justify-center gap-2"><button class="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors" title="Edit"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828A2 2 0 0110 16.414H8v-2a2 2 0 01.586-1.414z"></path></svg></button><button class="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors" title="Hapus"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button></div></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/order/OrderTable.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "OrderImportModal",
  __ssrInlineRender: true,
  props: {
    storeId: {}
  },
  emits: ["close", "imported"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { fetchWithAuth } = useApi();
    const step = ref("pick");
    const fileInput = ref(null);
    const selectedFile = ref(null);
    const dragOver = ref(false);
    const parseError = ref(null);
    const importing = ref(false);
    const previewOrders = ref([]);
    const result = ref(null);
    const STATUS_LABEL = {
      "Selesai": "Selesai",
      "Completed": "Selesai",
      "Dibatalkan": "Dibatalkan",
      "Cancelled": "Dibatalkan",
      "Dalam Pengiriman": "Dikirim",
      "In Transit": "Dikirim",
      "Siap Dikirim": "Pending",
      "Ready to Ship": "Pending"
    };
    const C = {
      ORDER_ID: 0,
      STATUS: 1,
      SKU_ID: 5,
      QTY: 9,
      PRICE: 11,
      SELLER_DISCOUNT: 14,
      SHIPPING_FEE: 18,
      BUYER_USERNAME: 43,
      RECIPIENT: 44
    };
    function onFileChange(e) {
      var _a;
      const f = (_a = e.target.files) == null ? void 0 : _a[0];
      if (f) processFile(f);
    }
    function onDrop(e) {
      var _a, _b;
      dragOver.value = false;
      const f = (_b = (_a = e.dataTransfer) == null ? void 0 : _a.files) == null ? void 0 : _b[0];
      if (f) processFile(f);
    }
    async function processFile(file) {
      var _a;
      const ext = (_a = file.name.split(".").pop()) == null ? void 0 : _a.toLowerCase();
      if (!["xlsx", "xls"].includes(ext != null ? ext : "")) {
        parseError.value = "Hanya file .xlsx atau .xls yang didukung";
        return;
      }
      selectedFile.value = file;
      parseError.value = null;
      await previewFile(file);
    }
    async function previewFile(file) {
      try {
        const XLSX = await import('../_/xlsx.mjs').then(function (n) { return n.x; });
        const buffer = await file.arrayBuffer();
        const wb = XLSX.read(buffer, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const allRows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
        const dataRows = allRows.slice(2).filter((r) => {
          var _a;
          return String((_a = r[C.ORDER_ID]) != null ? _a : "").trim();
        });
        const orderMap = /* @__PURE__ */ new Map();
        for (const row of dataRows) {
          const id = String(row[C.ORDER_ID]).trim();
          if (!orderMap.has(id)) orderMap.set(id, []);
          orderMap.get(id).push(row);
        }
        previewOrders.value = [...orderMap.entries()].map(([orderId, rows]) => {
          var _a;
          const first = rows[0];
          let subtotal = 0;
          let discount = 0;
          for (const row of rows) {
            const qty = Number(row[C.QTY]) || 1;
            subtotal += (Number(row[C.PRICE]) || 0) * qty;
            discount += Number(row[C.SELLER_DISCOUNT]) || 0;
          }
          const shippingFee = Number(first[C.SHIPPING_FEE]) || 0;
          return {
            orderId,
            status: (_a = STATUS_LABEL[String(first[C.STATUS])]) != null ? _a : String(first[C.STATUS]),
            customer: String(first[C.RECIPIENT] || first[C.BUYER_USERNAME] || "-").trim(),
            itemCount: rows.length,
            total: subtotal - discount,
            shippingFee
          };
        });
        if (previewOrders.value.length === 0) {
          parseError.value = "Tidak ada data order ditemukan di file ini";
          return;
        }
        step.value = "preview";
      } catch (e) {
        parseError.value = "Gagal membaca file: " + e.message;
      }
    }
    async function doImport() {
      var _a, _b;
      if (!selectedFile.value) return;
      importing.value = true;
      try {
        const fd = new FormData();
        fd.append("storeId", props.storeId);
        fd.append("file", selectedFile.value);
        const res = await fetchWithAuth("/api/orders/import", {
          method: "POST",
          body: fd
        });
        result.value = res;
        step.value = "result";
      } catch (e) {
        parseError.value = (_b = (_a = e == null ? void 0 : e.data) == null ? void 0 : _a.message) != null ? _b : "Gagal import";
      } finally {
        importing.value = false;
      }
    }
    function reset() {
      step.value = "pick";
      selectedFile.value = null;
      previewOrders.value = [];
      parseError.value = null;
      result.value = null;
      if (fileInput.value) fileInput.value.value = "";
    }
    function handleDone() {
      emit("imported");
      emit("close");
    }
    const formatCurrency = (n) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AppModal = __nuxt_component_2;
      _push(ssrRenderComponent(_component_AppModal, mergeProps({
        "is-open": true,
        title: "Import Order TikTok",
        size: "lg",
        onClose: ($event) => emit("close")
      }, _attrs), {
        footer: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex gap-3 justify-end"${_scopeId}><button class="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"${_scopeId}>${ssrInterpolate(unref(step) === "result" ? "Tutup" : "Batal")}</button>`);
            if (unref(step) === "preview") {
              _push2(`<button${ssrIncludeBooleanAttr(unref(importing)) ? " disabled" : ""} class="px-4 py-2 text-sm rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-60 flex items-center gap-2"${_scopeId}>`);
              if (unref(importing)) {
                _push2(`<svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"${_scopeId}></path></svg>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(` ${ssrInterpolate(unref(importing) ? "Mengimport..." : `Import ${unref(previewOrders).length} Order`)}</button>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(step) === "result" && unref(result) && unref(result).imported > 0) {
              _push2(`<button class="px-4 py-2 text-sm rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium transition-colors"${_scopeId}> Selesai </button>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex gap-3 justify-end" }, [
                createVNode("button", {
                  class: "px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors",
                  onClick: ($event) => unref(step) === "result" ? handleDone() : emit("close")
                }, toDisplayString(unref(step) === "result" ? "Tutup" : "Batal"), 9, ["onClick"]),
                unref(step) === "preview" ? (openBlock(), createBlock("button", {
                  key: 0,
                  disabled: unref(importing),
                  class: "px-4 py-2 text-sm rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-60 flex items-center gap-2",
                  onClick: doImport
                }, [
                  unref(importing) ? (openBlock(), createBlock("svg", {
                    key: 0,
                    class: "animate-spin h-4 w-4",
                    fill: "none",
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("circle", {
                      class: "opacity-25",
                      cx: "12",
                      cy: "12",
                      r: "10",
                      stroke: "currentColor",
                      "stroke-width": "4"
                    }),
                    createVNode("path", {
                      class: "opacity-75",
                      fill: "currentColor",
                      d: "M4 12a8 8 0 018-8v8z"
                    })
                  ])) : createCommentVNode("", true),
                  createTextVNode(" " + toDisplayString(unref(importing) ? "Mengimport..." : `Import ${unref(previewOrders).length} Order`), 1)
                ], 8, ["disabled"])) : createCommentVNode("", true),
                unref(step) === "result" && unref(result) && unref(result).imported > 0 ? (openBlock(), createBlock("button", {
                  key: 1,
                  class: "px-4 py-2 text-sm rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium transition-colors",
                  onClick: handleDone
                }, " Selesai ")) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b;
          if (_push2) {
            _push2(`<div class="flex items-center gap-0 mb-5 text-xs"${_scopeId}><!--[-->`);
            ssrRenderList(["Pilih File", "Preview", "Hasil"], (label, i) => {
              _push2(`<div class="flex items-center"${_scopeId}><div class="flex items-center gap-1.5"${_scopeId}><div class="${ssrRenderClass([
                "w-5 h-5 rounded-full flex items-center justify-center font-semibold transition-colors",
                unref(step) === "pick" && i === 0 || unref(step) === "preview" && i === 1 || unref(step) === "result" && i === 2 ? "bg-blue-600 text-white" : i < ["pick", "preview", "result"].indexOf(unref(step)) ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"
              ])}"${_scopeId}>${ssrInterpolate(i + 1)}</div><span class="${ssrRenderClass(unref(step) === ["pick", "preview", "result"][i] ? "text-blue-600 font-medium" : "text-gray-400")}"${_scopeId}>${ssrInterpolate(label)}</span></div>`);
              if (i < 2) {
                _push2(`<div class="w-8 h-px bg-gray-200 mx-1"${_scopeId}></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            });
            _push2(`<!--]--></div>`);
            if (unref(step) === "pick") {
              _push2(`<div class="space-y-4"${_scopeId}><p class="text-sm text-gray-500"${_scopeId}>Upload file Excel export order dari TikTok Seller Center</p><div class="${ssrRenderClass([unref(dragOver) ? "border-blue-400 bg-blue-50" : "border-gray-200 hover:border-gray-300", "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors"])}"${_scopeId}><svg class="h-10 w-10 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"${_scopeId}></path></svg><p class="text-sm text-gray-500"${_scopeId}>Drag &amp; drop atau <span class="text-blue-600 font-medium"${_scopeId}>klik untuk pilih file</span></p><p class="text-xs text-gray-400 mt-1"${_scopeId}>.xlsx / .xls</p></div><input type="file" accept=".xlsx,.xls" class="hidden"${_scopeId}>`);
              if (unref(parseError)) {
                _push2(`<p class="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2"${_scopeId}>${ssrInterpolate(unref(parseError))}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else if (unref(step) === "preview") {
              _push2(`<div class="space-y-4"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><p class="text-sm text-gray-600"${_scopeId}><span class="font-semibold text-gray-900"${_scopeId}>${ssrInterpolate(unref(previewOrders).length)}</span> order ditemukan dari <span class="font-medium"${_scopeId}>${ssrInterpolate((_a = unref(selectedFile)) == null ? void 0 : _a.name)}</span></p><button class="text-xs text-gray-400 hover:text-gray-600"${_scopeId}>Ganti file</button></div><div class="overflow-auto rounded-xl border border-gray-100 max-h-80"${_scopeId}><table class="w-full text-sm min-w-[600px]"${_scopeId}><thead class="bg-gray-50 text-xs text-gray-500 sticky top-0"${_scopeId}><tr${_scopeId}><th class="px-3 py-2.5 text-left font-medium"${_scopeId}>Order ID</th><th class="px-3 py-2.5 text-left font-medium"${_scopeId}>Status</th><th class="px-3 py-2.5 text-left font-medium"${_scopeId}>Pelanggan</th><th class="px-3 py-2.5 text-center font-medium"${_scopeId}>Item</th><th class="px-3 py-2.5 text-right font-medium"${_scopeId}>Total</th><th class="px-3 py-2.5 text-right font-medium"${_scopeId}>Ongkir</th></tr></thead><tbody class="divide-y divide-gray-50"${_scopeId}><!--[-->`);
              ssrRenderList(unref(previewOrders), (o) => {
                _push2(`<tr class="hover:bg-gray-50/50"${_scopeId}><td class="px-3 py-2 font-mono text-xs text-gray-600"${_scopeId}>${ssrInterpolate(o.orderId)}</td><td class="px-3 py-2"${_scopeId}><span class="${ssrRenderClass([
                  "text-xs px-2 py-0.5 rounded-full font-medium",
                  o.status === "Selesai" ? "bg-green-100 text-green-700" : o.status === "Dibatalkan" ? "bg-red-100 text-red-600" : o.status === "Dikirim" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"
                ])}"${_scopeId}>${ssrInterpolate(o.status)}</span></td><td class="px-3 py-2 text-gray-700 max-w-[140px] truncate"${_scopeId}>${ssrInterpolate(o.customer)}</td><td class="px-3 py-2 text-center text-gray-600"${_scopeId}>${ssrInterpolate(o.itemCount)}</td><td class="px-3 py-2 text-right text-gray-700"${_scopeId}>${ssrInterpolate(formatCurrency(o.total))}</td><td class="px-3 py-2 text-right text-gray-700"${_scopeId}>${ssrInterpolate(formatCurrency(o.shippingFee))}</td></tr>`);
              });
              _push2(`<!--]--></tbody></table></div>`);
              if (unref(parseError)) {
                _push2(`<p class="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2"${_scopeId}>${ssrInterpolate(unref(parseError))}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else if (unref(step) === "result" && unref(result)) {
              _push2(`<div class="space-y-4"${_scopeId}><div class="grid grid-cols-3 gap-3"${_scopeId}><div class="bg-green-50 rounded-xl p-4 text-center"${_scopeId}><p class="text-2xl font-bold text-green-600"${_scopeId}>${ssrInterpolate(unref(result).imported)}</p><p class="text-xs text-green-700 mt-0.5"${_scopeId}>Berhasil diimport</p></div><div class="bg-yellow-50 rounded-xl p-4 text-center"${_scopeId}><p class="text-2xl font-bold text-yellow-600"${_scopeId}>${ssrInterpolate(unref(result).skipped)}</p><p class="text-xs text-yellow-700 mt-0.5"${_scopeId}>Dilewati (duplikat)</p></div><div class="bg-gray-50 rounded-xl p-4 text-center"${_scopeId}><p class="text-2xl font-bold text-gray-700"${_scopeId}>${ssrInterpolate(unref(result).total)}</p><p class="text-xs text-gray-500 mt-0.5"${_scopeId}>Total order</p></div></div>`);
              if (unref(result).errors.length > 0) {
                _push2(`<div class="bg-red-50 rounded-xl p-3 space-y-1 max-h-36 overflow-auto"${_scopeId}><p class="text-xs font-semibold text-red-600 mb-1"${_scopeId}>${ssrInterpolate(unref(result).errors.length)} order gagal diimport: </p><!--[-->`);
                ssrRenderList(unref(result).errors, (err, i) => {
                  _push2(`<p class="text-xs text-red-500"${_scopeId}>${ssrInterpolate(err)}</p>`);
                });
                _push2(`<!--]--></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("div", { class: "flex items-center gap-0 mb-5 text-xs" }, [
                (openBlock(), createBlock(Fragment, null, renderList(["Pilih File", "Preview", "Hasil"], (label, i) => {
                  return createVNode("div", {
                    key: i,
                    class: "flex items-center"
                  }, [
                    createVNode("div", { class: "flex items-center gap-1.5" }, [
                      createVNode("div", {
                        class: [
                          "w-5 h-5 rounded-full flex items-center justify-center font-semibold transition-colors",
                          unref(step) === "pick" && i === 0 || unref(step) === "preview" && i === 1 || unref(step) === "result" && i === 2 ? "bg-blue-600 text-white" : i < ["pick", "preview", "result"].indexOf(unref(step)) ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"
                        ]
                      }, toDisplayString(i + 1), 3),
                      createVNode("span", {
                        class: unref(step) === ["pick", "preview", "result"][i] ? "text-blue-600 font-medium" : "text-gray-400"
                      }, toDisplayString(label), 3)
                    ]),
                    i < 2 ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "w-8 h-px bg-gray-200 mx-1"
                    })) : createCommentVNode("", true)
                  ]);
                }), 64))
              ]),
              unref(step) === "pick" ? (openBlock(), createBlock("div", {
                key: 0,
                class: "space-y-4"
              }, [
                createVNode("p", { class: "text-sm text-gray-500" }, "Upload file Excel export order dari TikTok Seller Center"),
                createVNode("div", {
                  class: ["border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors", unref(dragOver) ? "border-blue-400 bg-blue-50" : "border-gray-200 hover:border-gray-300"],
                  onClick: ($event) => {
                    var _a2;
                    return (_a2 = unref(fileInput)) == null ? void 0 : _a2.click();
                  },
                  onDragover: withModifiers(($event) => dragOver.value = true, ["prevent"]),
                  onDragleave: ($event) => dragOver.value = false,
                  onDrop: withModifiers(onDrop, ["prevent"])
                }, [
                  (openBlock(), createBlock("svg", {
                    class: "h-10 w-10 mx-auto text-gray-300 mb-3",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    stroke: "currentColor"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "1.5",
                      d: "M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    })
                  ])),
                  createVNode("p", { class: "text-sm text-gray-500" }, [
                    createTextVNode("Drag & drop atau "),
                    createVNode("span", { class: "text-blue-600 font-medium" }, "klik untuk pilih file")
                  ]),
                  createVNode("p", { class: "text-xs text-gray-400 mt-1" }, ".xlsx / .xls")
                ], 42, ["onClick", "onDragover", "onDragleave"]),
                createVNode("input", {
                  ref_key: "fileInput",
                  ref: fileInput,
                  type: "file",
                  accept: ".xlsx,.xls",
                  class: "hidden",
                  onChange: onFileChange
                }, null, 544),
                unref(parseError) ? (openBlock(), createBlock("p", {
                  key: 0,
                  class: "text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2"
                }, toDisplayString(unref(parseError)), 1)) : createCommentVNode("", true)
              ])) : unref(step) === "preview" ? (openBlock(), createBlock("div", {
                key: 1,
                class: "space-y-4"
              }, [
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode("p", { class: "text-sm text-gray-600" }, [
                    createVNode("span", { class: "font-semibold text-gray-900" }, toDisplayString(unref(previewOrders).length), 1),
                    createTextVNode(" order ditemukan dari "),
                    createVNode("span", { class: "font-medium" }, toDisplayString((_b = unref(selectedFile)) == null ? void 0 : _b.name), 1)
                  ]),
                  createVNode("button", {
                    class: "text-xs text-gray-400 hover:text-gray-600",
                    onClick: reset
                  }, "Ganti file")
                ]),
                createVNode("div", { class: "overflow-auto rounded-xl border border-gray-100 max-h-80" }, [
                  createVNode("table", { class: "w-full text-sm min-w-[600px]" }, [
                    createVNode("thead", { class: "bg-gray-50 text-xs text-gray-500 sticky top-0" }, [
                      createVNode("tr", null, [
                        createVNode("th", { class: "px-3 py-2.5 text-left font-medium" }, "Order ID"),
                        createVNode("th", { class: "px-3 py-2.5 text-left font-medium" }, "Status"),
                        createVNode("th", { class: "px-3 py-2.5 text-left font-medium" }, "Pelanggan"),
                        createVNode("th", { class: "px-3 py-2.5 text-center font-medium" }, "Item"),
                        createVNode("th", { class: "px-3 py-2.5 text-right font-medium" }, "Total"),
                        createVNode("th", { class: "px-3 py-2.5 text-right font-medium" }, "Ongkir")
                      ])
                    ]),
                    createVNode("tbody", { class: "divide-y divide-gray-50" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(previewOrders), (o) => {
                        return openBlock(), createBlock("tr", {
                          key: o.orderId,
                          class: "hover:bg-gray-50/50"
                        }, [
                          createVNode("td", { class: "px-3 py-2 font-mono text-xs text-gray-600" }, toDisplayString(o.orderId), 1),
                          createVNode("td", { class: "px-3 py-2" }, [
                            createVNode("span", {
                              class: [
                                "text-xs px-2 py-0.5 rounded-full font-medium",
                                o.status === "Selesai" ? "bg-green-100 text-green-700" : o.status === "Dibatalkan" ? "bg-red-100 text-red-600" : o.status === "Dikirim" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"
                              ]
                            }, toDisplayString(o.status), 3)
                          ]),
                          createVNode("td", { class: "px-3 py-2 text-gray-700 max-w-[140px] truncate" }, toDisplayString(o.customer), 1),
                          createVNode("td", { class: "px-3 py-2 text-center text-gray-600" }, toDisplayString(o.itemCount), 1),
                          createVNode("td", { class: "px-3 py-2 text-right text-gray-700" }, toDisplayString(formatCurrency(o.total)), 1),
                          createVNode("td", { class: "px-3 py-2 text-right text-gray-700" }, toDisplayString(formatCurrency(o.shippingFee)), 1)
                        ]);
                      }), 128))
                    ])
                  ])
                ]),
                unref(parseError) ? (openBlock(), createBlock("p", {
                  key: 0,
                  class: "text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2"
                }, toDisplayString(unref(parseError)), 1)) : createCommentVNode("", true)
              ])) : unref(step) === "result" && unref(result) ? (openBlock(), createBlock("div", {
                key: 2,
                class: "space-y-4"
              }, [
                createVNode("div", { class: "grid grid-cols-3 gap-3" }, [
                  createVNode("div", { class: "bg-green-50 rounded-xl p-4 text-center" }, [
                    createVNode("p", { class: "text-2xl font-bold text-green-600" }, toDisplayString(unref(result).imported), 1),
                    createVNode("p", { class: "text-xs text-green-700 mt-0.5" }, "Berhasil diimport")
                  ]),
                  createVNode("div", { class: "bg-yellow-50 rounded-xl p-4 text-center" }, [
                    createVNode("p", { class: "text-2xl font-bold text-yellow-600" }, toDisplayString(unref(result).skipped), 1),
                    createVNode("p", { class: "text-xs text-yellow-700 mt-0.5" }, "Dilewati (duplikat)")
                  ]),
                  createVNode("div", { class: "bg-gray-50 rounded-xl p-4 text-center" }, [
                    createVNode("p", { class: "text-2xl font-bold text-gray-700" }, toDisplayString(unref(result).total), 1),
                    createVNode("p", { class: "text-xs text-gray-500 mt-0.5" }, "Total order")
                  ])
                ]),
                unref(result).errors.length > 0 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "bg-red-50 rounded-xl p-3 space-y-1 max-h-36 overflow-auto"
                }, [
                  createVNode("p", { class: "text-xs font-semibold text-red-600 mb-1" }, toDisplayString(unref(result).errors.length) + " order gagal diimport: ", 1),
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(result).errors, (err, i) => {
                    return openBlock(), createBlock("p", {
                      key: i,
                      class: "text-xs text-red-500"
                    }, toDisplayString(err), 1);
                  }), 128))
                ])) : createCommentVNode("", true)
              ])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/order/OrderImportModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const limit = 20;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const router = useRouter();
    const activeStoreStore = useActiveStoreStore();
    const storeId = computed(() => {
      var _a, _b;
      return (_b = (_a = activeStoreStore.store) == null ? void 0 : _a.id) != null ? _b : "";
    });
    const { getOrders, deleteOrder, loading } = useOrders();
    const orders = ref([]);
    const total = ref(0);
    const page = ref(1);
    const search = ref("");
    const statusFilter = ref("");
    const dateFrom = ref("");
    const dateTo = ref("");
    const deleteTarget = ref(null);
    const deleteLoading = ref(false);
    const toast = ref(null);
    const showImportModal = ref(false);
    function handleImported() {
      toast.value = { message: "Order berhasil diimport", type: "success" };
      load();
    }
    const totalPages = computed(() => Math.ceil(total.value / limit));
    async function load() {
      var _a, _b;
      if (!storeId.value) return;
      const res = await getOrders({
        storeId: storeId.value,
        search: search.value || void 0,
        status: statusFilter.value || void 0,
        dateFrom: dateFrom.value || void 0,
        dateTo: dateTo.value || void 0,
        page: page.value,
        limit
      });
      orders.value = (_a = res == null ? void 0 : res.data) != null ? _a : [];
      total.value = (_b = res == null ? void 0 : res.total) != null ? _b : 0;
    }
    let filterDebounce = null;
    watch([search, statusFilter, dateFrom, dateTo], () => {
      page.value = 1;
      if (filterDebounce) clearTimeout(filterDebounce);
      filterDebounce = setTimeout(load, 300);
    });
    watch(page, load);
    function handleDetail(order) {
      router.push(`/store/orders/${order.id}`);
    }
    function handleEdit(order) {
      router.push(`/store/orders/${order.id}/edit`);
    }
    function handleDelete(order) {
      deleteTarget.value = order;
    }
    async function confirmDelete() {
      if (!deleteTarget.value) return;
      deleteLoading.value = true;
      try {
        await deleteOrder(deleteTarget.value.id);
        toast.value = { message: "Order berhasil dihapus", type: "success" };
        deleteTarget.value = null;
        load();
      } catch {
        toast.value = { message: "Gagal menghapus order", type: "error" };
      } finally {
        deleteLoading.value = false;
      }
    }
    watch(toast, (v) => {
      if (v) setTimeout(() => {
        toast.value = null;
      }, 3e3);
    });
    const statusOptions = [
      { value: "", label: "Semua Status" },
      { value: "PENDING", label: "Pending" },
      { value: "SHIPPED", label: "Dikirim" },
      { value: "COMPLETED", label: "Selesai" },
      { value: "CANCELLED", label: "Dibatalkan" },
      { value: "RETURNED", label: "Retur" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_OrderTable = _sfc_main$2;
      const _component_OrderImportModal = _sfc_main$1;
      const _component_AppModal = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-5" }, _attrs))} data-v-39303699><div class="flex items-center justify-between gap-4 flex-wrap" data-v-39303699><div data-v-39303699><h1 class="text-2xl font-bold text-gray-900" data-v-39303699>Order</h1><p class="text-sm text-gray-500 mt-0.5" data-v-39303699>Manajemen pesanan toko</p></div><div class="flex items-center gap-2" data-v-39303699><button class="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-sm font-medium transition-colors shadow-sm" data-v-39303699><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" data-v-39303699><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" data-v-39303699></path></svg> Import TikTok </button>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/store/orders/create",
        class: "inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" data-v-39303699${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" data-v-39303699${_scopeId}></path></svg> Tambah Order `);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                class: "h-4 w-4",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                "stroke-width": "2.5"
              }, [
                createVNode("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  d: "M12 4v16m8-8H4"
                })
              ])),
              createTextVNode(" Tambah Order ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-wrap gap-3 items-end" data-v-39303699><div class="flex-1 min-w-[180px]" data-v-39303699><label class="block text-xs text-gray-500 mb-1" data-v-39303699>Cari No. Order</label><input${ssrRenderAttr("value", unref(search))} type="text" placeholder="Cari nomor order..." class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" data-v-39303699></div><div class="min-w-[160px]" data-v-39303699><label class="block text-xs text-gray-500 mb-1" data-v-39303699>Status</label><select class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" data-v-39303699><!--[-->`);
      ssrRenderList(statusOptions, (opt) => {
        _push(`<option${ssrRenderAttr("value", opt.value)} data-v-39303699${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), opt.value) : ssrLooseEqual(unref(statusFilter), opt.value)) ? " selected" : ""}>${ssrInterpolate(opt.label)}</option>`);
      });
      _push(`<!--]--></select></div><div data-v-39303699><label class="block text-xs text-gray-500 mb-1" data-v-39303699>Dari Tanggal</label><input${ssrRenderAttr("value", unref(dateFrom))} type="date" class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" data-v-39303699></div><div data-v-39303699><label class="block text-xs text-gray-500 mb-1" data-v-39303699>Sampai Tanggal</label><input${ssrRenderAttr("value", unref(dateTo))} type="date" class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" data-v-39303699></div>`);
      if (unref(search) || unref(statusFilter) || unref(dateFrom) || unref(dateTo)) {
        _push(`<button class="text-xs text-gray-400 hover:text-red-500 px-2 py-2 transition-colors" data-v-39303699>Reset</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div data-v-39303699>`);
      if (unref(loading)) {
        _push(`<div class="flex justify-center py-16" data-v-39303699><svg class="animate-spin h-7 w-7 text-blue-500" fill="none" viewBox="0 0 24 24" data-v-39303699><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-39303699></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" data-v-39303699></path></svg></div>`);
      } else {
        _push(ssrRenderComponent(_component_OrderTable, {
          orders: unref(orders),
          onDetail: handleDetail,
          onEdit: handleEdit,
          onDelete: handleDelete
        }, null, _parent));
      }
      _push(`</div>`);
      if (unref(totalPages) > 1) {
        _push(`<div class="flex items-center justify-between text-sm text-gray-500" data-v-39303699><span data-v-39303699>${ssrInterpolate(unref(total))} order ditemukan</span><div class="flex items-center gap-1" data-v-39303699><button${ssrIncludeBooleanAttr(unref(page) === 1) ? " disabled" : ""} class="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors" data-v-39303699>Prev</button><span class="px-3 py-1.5" data-v-39303699>${ssrInterpolate(unref(page))} / ${ssrInterpolate(unref(totalPages))}</span><button${ssrIncludeBooleanAttr(unref(page) >= unref(totalPages)) ? " disabled" : ""} class="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors" data-v-39303699>Next</button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(showImportModal) && unref(storeId)) {
        _push(ssrRenderComponent(_component_OrderImportModal, {
          "store-id": unref(storeId),
          onClose: ($event) => showImportModal.value = false,
          onImported: handleImported
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_AppModal, {
        "is-open": !!unref(deleteTarget),
        title: "Hapus Order",
        size: "sm",
        onClose: ($event) => deleteTarget.value = null
      }, {
        footer: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex gap-3 justify-end" data-v-39303699${_scopeId}><button class="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors" data-v-39303699${_scopeId}>Batal</button><button${ssrIncludeBooleanAttr(unref(deleteLoading)) ? " disabled" : ""} class="px-4 py-2 text-sm rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors disabled:opacity-60" data-v-39303699${_scopeId}>${ssrInterpolate(unref(deleteLoading) ? "Menghapus..." : "Hapus")}</button></div>`);
          } else {
            return [
              createVNode("div", { class: "flex gap-3 justify-end" }, [
                createVNode("button", {
                  class: "px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors",
                  onClick: ($event) => deleteTarget.value = null
                }, "Batal", 8, ["onClick"]),
                createVNode("button", {
                  disabled: unref(deleteLoading),
                  class: "px-4 py-2 text-sm rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors disabled:opacity-60",
                  onClick: confirmDelete
                }, toDisplayString(unref(deleteLoading) ? "Menghapus..." : "Hapus"), 9, ["disabled"])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b;
          if (_push2) {
            _push2(`<p class="text-sm text-gray-600" data-v-39303699${_scopeId}> Hapus order <span class="font-semibold text-gray-900" data-v-39303699${_scopeId}>${ssrInterpolate((_a = unref(deleteTarget)) == null ? void 0 : _a.orderNumber)}</span>? Tindakan ini tidak dapat dibatalkan. </p>`);
          } else {
            return [
              createVNode("p", { class: "text-sm text-gray-600" }, [
                createTextVNode(" Hapus order "),
                createVNode("span", { class: "font-semibold text-gray-900" }, toDisplayString((_b = unref(deleteTarget)) == null ? void 0 : _b.orderNumber), 1),
                createTextVNode("? Tindakan ini tidak dapat dibatalkan. ")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(toast)) {
        _push(`<div class="${ssrRenderClass([unref(toast).type === "success" ? "bg-green-600" : "bg-red-600", "fixed bottom-6 left-1/2 -translate-x-1/2 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-lg z-50"])}" data-v-39303699>${ssrInterpolate(unref(toast).message)}</div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/store/orders/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-39303699"]]);

export { index as default };
//# sourceMappingURL=index-BspZTu9v.mjs.map
