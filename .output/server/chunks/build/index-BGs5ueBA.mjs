import { _ as __nuxt_component_2 } from './AppModal-D_J5cd1L.mjs';
import { defineComponent, computed, ref, watch, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, reactive, withDirectives, vModelSelect, vModelText, openBlock, createBlock, createCommentVNode, withModifiers, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { u as useApi } from './useApi-0aCYoCTI.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-CM8y4qxG.mjs';
import { u as useActiveStoreStore } from './activeStore-yswwjCHd.mjs';
import { _ as _export_sfc } from './server.mjs';
import './auth-BWjTzQkA.mjs';
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

function useFinance() {
  const { fetchWithAuth } = useApi();
  const loading = ref(false);
  async function getTransactions(params) {
    loading.value = true;
    try {
      return await fetchWithAuth(
        "/api/finance",
        { params }
      );
    } finally {
      loading.value = false;
    }
  }
  async function getSummary(storeId, dateFrom, dateTo) {
    return fetchWithAuth("/api/finance/summary", {
      params: { storeId, dateFrom, dateTo }
    });
  }
  async function createTransaction(payload) {
    return fetchWithAuth("/api/finance", {
      method: "POST",
      body: payload
    });
  }
  async function updateTransaction(id, payload) {
    return fetchWithAuth(`/api/finance/${id}`, {
      method: "PUT",
      body: payload
    });
  }
  async function deleteTransaction(id) {
    return fetchWithAuth(`/api/finance/${id}`, { method: "DELETE" });
  }
  async function importFinance(storeId, file) {
    const form = new FormData();
    form.append("storeId", storeId);
    form.append("file", file);
    return fetchWithAuth(
      "/api/finance/import",
      { method: "POST", body: form }
    );
  }
  return { loading, getTransactions, getSummary, createTransaction, updateTransaction, deleteTransaction, importFinance };
}
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "FinanceFormModal",
  __ssrInlineRender: true,
  props: {
    storeId: {},
    edit: {}
  },
  emits: ["close", "saved"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { createTransaction, updateTransaction } = useFinance();
    const isEdit = computed(() => !!props.edit);
    const form = reactive({
      date: "",
      type: "ORDER",
      cashFlow: "IN",
      source: "",
      referenceId: "",
      amount: 0,
      platformFee: 0,
      affiliateFee: 0,
      shippingFee: 0,
      note: ""
    });
    const saving = ref(false);
    const error = ref(null);
    watch(() => form.type, (t) => {
      if (t === "ORDER") form.cashFlow = "IN";
      if (t === "ADS") form.cashFlow = "OUT";
      if (t === "LOGISTIC") form.cashFlow = "OUT";
      if (t === "WITHDRAW") form.cashFlow = "OUT";
    });
    const isOrder = computed(() => form.type === "ORDER");
    const netAmount = computed(
      () => Math.max(0, form.amount - (isOrder.value ? form.platformFee + form.affiliateFee + form.shippingFee : 0))
    );
    async function handleSubmit() {
      var _a, _b;
      error.value = null;
      if (!form.date) {
        error.value = "Tanggal wajib diisi";
        return;
      }
      if (!form.amount) {
        error.value = "Nilai transaksi wajib diisi";
        return;
      }
      saving.value = true;
      try {
        const payload = {
          storeId: props.storeId,
          date: form.date,
          type: form.type,
          cashFlow: form.cashFlow,
          source: form.source || null,
          referenceId: form.referenceId || null,
          amount: form.amount,
          platformFee: isOrder.value ? form.platformFee : 0,
          affiliateFee: isOrder.value ? form.affiliateFee : 0,
          shippingFee: isOrder.value ? form.shippingFee : 0,
          note: form.note || null
        };
        if (isEdit.value && props.edit) {
          await updateTransaction(props.edit.id, payload);
        } else {
          await createTransaction(payload);
        }
        emit("saved");
      } catch (e) {
        error.value = (_b = (_a = e == null ? void 0 : e.data) == null ? void 0 : _a.message) != null ? _b : "Gagal menyimpan";
      } finally {
        saving.value = false;
      }
    }
    const formatCurrency = (n) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AppModal = __nuxt_component_2;
      _push(ssrRenderComponent(_component_AppModal, mergeProps({
        "is-open": true,
        title: unref(isEdit) ? "Edit Transaksi" : "Tambah Transaksi",
        size: "md",
        onClose: ($event) => emit("close")
      }, _attrs), {
        footer: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex gap-3 justify-end"${_scopeId}><button class="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"${_scopeId}>Batal</button><button${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""} class="px-4 py-2 text-sm rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-60 flex items-center gap-2"${_scopeId}>`);
            if (unref(saving)) {
              _push2(`<svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"${_scopeId}></path></svg>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(` ${ssrInterpolate(unref(saving) ? "Menyimpan..." : unref(isEdit) ? "Simpan Perubahan" : "Tambah Transaksi")}</button></div>`);
          } else {
            return [
              createVNode("div", { class: "flex gap-3 justify-end" }, [
                createVNode("button", {
                  class: "px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors",
                  onClick: ($event) => emit("close")
                }, "Batal", 8, ["onClick"]),
                createVNode("button", {
                  disabled: unref(saving),
                  class: "px-4 py-2 text-sm rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-60 flex items-center gap-2",
                  onClick: handleSubmit
                }, [
                  unref(saving) ? (openBlock(), createBlock("svg", {
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
                  createTextVNode(" " + toDisplayString(unref(saving) ? "Menyimpan..." : unref(isEdit) ? "Simpan Perubahan" : "Tambah Transaksi"), 1)
                ], 8, ["disabled"])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}><div class="grid grid-cols-2 gap-4"${_scopeId}><div${_scopeId}><label class="block text-xs text-gray-500 mb-1"${_scopeId}>Tipe Transaksi <span class="text-red-500"${_scopeId}>*</span></label><select class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"${_scopeId}><option value="ORDER"${ssrIncludeBooleanAttr(Array.isArray(unref(form).type) ? ssrLooseContain(unref(form).type, "ORDER") : ssrLooseEqual(unref(form).type, "ORDER")) ? " selected" : ""}${_scopeId}>Order (Penghasilan)</option><option value="ADS"${ssrIncludeBooleanAttr(Array.isArray(unref(form).type) ? ssrLooseContain(unref(form).type, "ADS") : ssrLooseEqual(unref(form).type, "ADS")) ? " selected" : ""}${_scopeId}>Iklan (Ads)</option><option value="LOGISTIC"${ssrIncludeBooleanAttr(Array.isArray(unref(form).type) ? ssrLooseContain(unref(form).type, "LOGISTIC") : ssrLooseEqual(unref(form).type, "LOGISTIC")) ? " selected" : ""}${_scopeId}>Logistik (Kurir)</option><option value="WITHDRAW"${ssrIncludeBooleanAttr(Array.isArray(unref(form).type) ? ssrLooseContain(unref(form).type, "WITHDRAW") : ssrLooseEqual(unref(form).type, "WITHDRAW")) ? " selected" : ""}${_scopeId}>Tarik Saldo</option></select></div><div${_scopeId}><label class="block text-xs text-gray-500 mb-1"${_scopeId}>Tanggal <span class="text-red-500"${_scopeId}>*</span></label><input${ssrRenderAttr("value", unref(form).date)} type="date" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"${_scopeId}></div></div><div class="grid grid-cols-2 gap-4"${_scopeId}><div${_scopeId}><label class="block text-xs text-gray-500 mb-1"${_scopeId}>Arus Kas <span class="text-red-500"${_scopeId}>*</span></label><select class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"${_scopeId}><option value="IN"${ssrIncludeBooleanAttr(Array.isArray(unref(form).cashFlow) ? ssrLooseContain(unref(form).cashFlow, "IN") : ssrLooseEqual(unref(form).cashFlow, "IN")) ? " selected" : ""}${_scopeId}>Masuk (IN)</option><option value="OUT"${ssrIncludeBooleanAttr(Array.isArray(unref(form).cashFlow) ? ssrLooseContain(unref(form).cashFlow, "OUT") : ssrLooseEqual(unref(form).cashFlow, "OUT")) ? " selected" : ""}${_scopeId}>Keluar (OUT)</option></select></div><div${_scopeId}><label class="block text-xs text-gray-500 mb-1"${_scopeId}>Source / Platform</label><input${ssrRenderAttr("value", unref(form).source)} type="text" placeholder="Contoh: TikTok, Shopee, Manual..." class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"${_scopeId}></div></div><div${_scopeId}><label class="block text-xs text-gray-500 mb-1"${_scopeId}>Reference ID</label><input${ssrRenderAttr("value", unref(form).referenceId)} type="text" placeholder="Nomor order, invoice, dll (opsional)" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"${_scopeId}></div><div${_scopeId}><label class="block text-xs text-gray-500 mb-1"${_scopeId}>Nilai Transaksi <span class="text-red-500"${_scopeId}>*</span></label><input${ssrRenderAttr("value", unref(form).amount)} type="number" min="0" placeholder="0" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"${_scopeId}></div>`);
            if (unref(isOrder)) {
              _push2(`<div class="grid grid-cols-3 gap-4"${_scopeId}><div${_scopeId}><label class="block text-xs text-gray-500 mb-1"${_scopeId}>Platform Fee</label><input${ssrRenderAttr("value", unref(form).platformFee)} type="number" min="0" placeholder="0" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"${_scopeId}></div><div${_scopeId}><label class="block text-xs text-gray-500 mb-1"${_scopeId}>Affiliate Fee</label><input${ssrRenderAttr("value", unref(form).affiliateFee)} type="number" min="0" placeholder="0" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"${_scopeId}></div><div${_scopeId}><label class="block text-xs text-gray-500 mb-1"${_scopeId}>Shipping Fee</label><input${ssrRenderAttr("value", unref(form).shippingFee)} type="number" min="0" placeholder="0" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"${_scopeId}></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-between"${_scopeId}><span class="text-sm text-gray-500"${_scopeId}>Total Bersih</span><span class="${ssrRenderClass([unref(form).cashFlow === "IN" ? "text-green-600" : "text-red-500", "text-base font-bold"])}"${_scopeId}>${ssrInterpolate(unref(form).cashFlow === "OUT" ? "-" : "")}${ssrInterpolate(formatCurrency(unref(netAmount)))}</span></div><div${_scopeId}><label class="block text-xs text-gray-500 mb-1"${_scopeId}>Keterangan</label><input${ssrRenderAttr("value", unref(form).note)} type="text" placeholder="Keterangan tambahan (opsional)" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"${_scopeId}></div>`);
            if (unref(error)) {
              _push2(`<p class="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2"${_scopeId}>${ssrInterpolate(unref(error))}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-xs text-gray-500 mb-1" }, [
                      createTextVNode("Tipe Transaksi "),
                      createVNode("span", { class: "text-red-500" }, "*")
                    ]),
                    withDirectives(createVNode("select", {
                      "onUpdate:modelValue": ($event) => unref(form).type = $event,
                      class: "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    }, [
                      createVNode("option", { value: "ORDER" }, "Order (Penghasilan)"),
                      createVNode("option", { value: "ADS" }, "Iklan (Ads)"),
                      createVNode("option", { value: "LOGISTIC" }, "Logistik (Kurir)"),
                      createVNode("option", { value: "WITHDRAW" }, "Tarik Saldo")
                    ], 8, ["onUpdate:modelValue"]), [
                      [vModelSelect, unref(form).type]
                    ])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-xs text-gray-500 mb-1" }, [
                      createTextVNode("Tanggal "),
                      createVNode("span", { class: "text-red-500" }, "*")
                    ]),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => unref(form).date = $event,
                      type: "date",
                      class: "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, unref(form).date]
                    ])
                  ])
                ]),
                createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-xs text-gray-500 mb-1" }, [
                      createTextVNode("Arus Kas "),
                      createVNode("span", { class: "text-red-500" }, "*")
                    ]),
                    withDirectives(createVNode("select", {
                      "onUpdate:modelValue": ($event) => unref(form).cashFlow = $event,
                      class: "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    }, [
                      createVNode("option", { value: "IN" }, "Masuk (IN)"),
                      createVNode("option", { value: "OUT" }, "Keluar (OUT)")
                    ], 8, ["onUpdate:modelValue"]), [
                      [vModelSelect, unref(form).cashFlow]
                    ])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-xs text-gray-500 mb-1" }, "Source / Platform"),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => unref(form).source = $event,
                      type: "text",
                      placeholder: "Contoh: TikTok, Shopee, Manual...",
                      class: "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, unref(form).source]
                    ])
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("label", { class: "block text-xs text-gray-500 mb-1" }, "Reference ID"),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => unref(form).referenceId = $event,
                    type: "text",
                    placeholder: "Nomor order, invoice, dll (opsional)",
                    class: "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, unref(form).referenceId]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("label", { class: "block text-xs text-gray-500 mb-1" }, [
                    createTextVNode("Nilai Transaksi "),
                    createVNode("span", { class: "text-red-500" }, "*")
                  ]),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => unref(form).amount = $event,
                    type: "number",
                    min: "0",
                    placeholder: "0",
                    class: "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [
                      vModelText,
                      unref(form).amount,
                      void 0,
                      { number: true }
                    ]
                  ])
                ]),
                unref(isOrder) ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "grid grid-cols-3 gap-4"
                }, [
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-xs text-gray-500 mb-1" }, "Platform Fee"),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => unref(form).platformFee = $event,
                      type: "number",
                      min: "0",
                      placeholder: "0",
                      class: "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [
                        vModelText,
                        unref(form).platformFee,
                        void 0,
                        { number: true }
                      ]
                    ])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-xs text-gray-500 mb-1" }, "Affiliate Fee"),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => unref(form).affiliateFee = $event,
                      type: "number",
                      min: "0",
                      placeholder: "0",
                      class: "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [
                        vModelText,
                        unref(form).affiliateFee,
                        void 0,
                        { number: true }
                      ]
                    ])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-xs text-gray-500 mb-1" }, "Shipping Fee"),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => unref(form).shippingFee = $event,
                      type: "number",
                      min: "0",
                      placeholder: "0",
                      class: "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [
                        vModelText,
                        unref(form).shippingFee,
                        void 0,
                        { number: true }
                      ]
                    ])
                  ])
                ])) : createCommentVNode("", true),
                createVNode("div", { class: "bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-between" }, [
                  createVNode("span", { class: "text-sm text-gray-500" }, "Total Bersih"),
                  createVNode("span", {
                    class: ["text-base font-bold", unref(form).cashFlow === "IN" ? "text-green-600" : "text-red-500"]
                  }, toDisplayString(unref(form).cashFlow === "OUT" ? "-" : "") + toDisplayString(formatCurrency(unref(netAmount))), 3)
                ]),
                createVNode("div", null, [
                  createVNode("label", { class: "block text-xs text-gray-500 mb-1" }, "Keterangan"),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => unref(form).note = $event,
                    type: "text",
                    placeholder: "Keterangan tambahan (opsional)",
                    class: "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, unref(form).note]
                  ])
                ]),
                unref(error) ? (openBlock(), createBlock("p", {
                  key: 1,
                  class: "text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2"
                }, toDisplayString(unref(error)), 1)) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/finance/FinanceFormModal.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "FinanceImportModal",
  __ssrInlineRender: true,
  props: {
    storeId: {}
  },
  emits: ["close", "imported"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { importFinance } = useFinance();
    const step = ref("pick");
    const fileRef = ref(null);
    const file = ref(null);
    const error = ref(null);
    const result = ref(null);
    function onFileChange(e) {
      var _a, _b;
      const input = e.target;
      file.value = (_b = (_a = input.files) == null ? void 0 : _a[0]) != null ? _b : null;
      error.value = null;
    }
    const previewRows = ref([]);
    const previewLoading = ref(false);
    async function loadPreview() {
      if (!file.value) return;
      previewLoading.value = true;
      previewRows.value = [];
      try {
        const XLSX = await import('../_/xlsx.mjs').then(function (n) { return n.x; }).then((m) => {
          var _a;
          return (_a = m.default) != null ? _a : m;
        });
        const buffer = await file.value.arrayBuffer();
        const wb = XLSX.read(buffer, { type: "array" });
        const sheetName = wb.SheetNames.includes("Order details") ? "Order details" : wb.SheetNames[0];
        const ws = wb.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
        const headers = rows[0].map((h) => String(h).trim().toLowerCase());
        const col = (name) => headers.findIndex((h) => h.includes(name.toLowerCase()));
        const cRefId = col("order/adjustment id");
        const cType = col("type");
        const cSettled = col("order settled time");
        const cNet = col("total settlement amount");
        const cSource = col("order source");
        previewRows.value = rows.slice(1).filter((r) => {
          var _a;
          return r && String((_a = r[0]) != null ? _a : "").trim();
        }).slice(0, 10).map((r) => {
          var _a, _b, _c, _d, _e;
          const row = r;
          return {
            refId: String((_a = row[cRefId]) != null ? _a : "").trim(),
            type: String((_b = row[cType]) != null ? _b : "").trim(),
            date: String((_c = row[cSettled]) != null ? _c : "").trim(),
            net: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number((_d = row[cNet]) != null ? _d : 0)),
            source: cSource >= 0 ? String((_e = row[cSource]) != null ? _e : "").trim() || "TikTok" : "TikTok"
          };
        });
      } catch {
        error.value = "Gagal membaca file";
      } finally {
        previewLoading.value = false;
      }
    }
    watch(file, (f) => {
      if (f) loadPreview();
    });
    async function handleImport() {
      var _a, _b;
      if (!file.value) {
        error.value = "Pilih file terlebih dahulu";
        return;
      }
      error.value = null;
      step.value = "importing";
      try {
        const res = await importFinance(props.storeId, file.value);
        result.value = res != null ? res : { imported: 0, skipped: 0, updated: 0, total: 0, errors: [] };
        step.value = "result";
      } catch (e) {
        error.value = (_b = (_a = e == null ? void 0 : e.data) == null ? void 0 : _a.message) != null ? _b : "Import gagal";
        step.value = "pick";
      }
    }
    function reset() {
      file.value = null;
      previewRows.value = [];
      result.value = null;
      error.value = null;
      step.value = "pick";
      if (fileRef.value) fileRef.value.value = "";
    }
    function done() {
      emit("imported");
      emit("close");
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AppModal = __nuxt_component_2;
      _push(ssrRenderComponent(_component_AppModal, mergeProps({
        "is-open": true,
        title: "Import Finance TikTok",
        size: "lg",
        onClose: ($event) => emit("close")
      }, _attrs), {
        footer: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex gap-3 justify-end"${_scopeId}><button class="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"${_scopeId}>${ssrInterpolate(unref(step) === "result" ? "Tutup" : "Batal")}</button>`);
            if (unref(step) === "pick") {
              _push2(`<button${ssrIncludeBooleanAttr(!unref(file)) ? " disabled" : ""} class="px-4 py-2 text-sm rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-50"${_scopeId}> Import Finance </button>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(step) === "result") {
              _push2(`<button class="px-4 py-2 text-sm rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"${_scopeId}> Import Lagi </button>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex gap-3 justify-end" }, [
                createVNode("button", {
                  class: "px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors",
                  onClick: ($event) => unref(step) === "result" ? done() : emit("close")
                }, toDisplayString(unref(step) === "result" ? "Tutup" : "Batal"), 9, ["onClick"]),
                unref(step) === "pick" ? (openBlock(), createBlock("button", {
                  key: 0,
                  disabled: !unref(file),
                  class: "px-4 py-2 text-sm rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-50",
                  onClick: handleImport
                }, " Import Finance ", 8, ["disabled"])) : createCommentVNode("", true),
                unref(step) === "result" ? (openBlock(), createBlock("button", {
                  key: 1,
                  class: "px-4 py-2 text-sm rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors",
                  onClick: reset
                }, " Import Lagi ")) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(step) === "pick") {
              _push2(`<div class="space-y-4"${_scopeId}><div class="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 text-sm text-blue-700 space-y-1"${_scopeId}><p class="font-medium"${_scopeId}>Format file yang didukung:</p><ul class="list-disc list-inside text-xs space-y-0.5 text-blue-600"${_scopeId}><li${_scopeId}>File Excel TikTok Seller Center \u2192 Finance \u2192 Income / Settlement</li><li${_scopeId}>Sheet: <b${_scopeId}>Order details</b></li><li${_scopeId}>Kolom wajib: Order/Adjustment ID, Type, Order settled time, Total settlement amount</li></ul></div><label class="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-8 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors"${_scopeId}><svg class="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"${_scopeId}></path></svg><span class="text-sm text-gray-500"${_scopeId}>${ssrInterpolate(unref(file) ? unref(file).name : "Klik atau drag & drop file Excel TikTok")}</span><span class="text-xs text-gray-400"${_scopeId}>.xlsx / .xls</span><input type="file" accept=".xlsx,.xls" class="hidden"${_scopeId}></label>`);
              if (unref(previewLoading)) {
                _push2(`<div class="text-center text-sm text-gray-400 py-2"${_scopeId}>Membaca file...</div>`);
              } else if (unref(previewRows).length > 0) {
                _push2(`<div${_scopeId}><p class="text-xs text-gray-500 mb-2 font-medium"${_scopeId}>Preview (10 baris pertama):</p><div class="overflow-x-auto rounded-xl border border-gray-100"${_scopeId}><table class="w-full text-xs min-w-[500px]"${_scopeId}><thead class="bg-gray-50 text-gray-500"${_scopeId}><tr${_scopeId}><th class="px-3 py-2 text-left font-medium"${_scopeId}>Ref ID</th><th class="px-3 py-2 text-left font-medium"${_scopeId}>Tipe</th><th class="px-3 py-2 text-left font-medium"${_scopeId}>Tanggal</th><th class="px-3 py-2 text-right font-medium"${_scopeId}>Net Settlement</th><th class="px-3 py-2 text-left font-medium"${_scopeId}>Source</th></tr></thead><tbody class="divide-y divide-gray-50"${_scopeId}><!--[-->`);
                ssrRenderList(unref(previewRows), (r) => {
                  _push2(`<tr class="hover:bg-gray-50/50"${_scopeId}><td class="px-3 py-2 font-mono text-gray-600 max-w-[120px] truncate"${_scopeId}>${ssrInterpolate(r.refId)}</td><td class="px-3 py-2 text-gray-600"${_scopeId}>${ssrInterpolate(r.type)}</td><td class="px-3 py-2 text-gray-500"${_scopeId}>${ssrInterpolate(r.date)}</td><td class="px-3 py-2 text-right text-gray-700 font-medium"${_scopeId}>${ssrInterpolate(r.net)}</td><td class="px-3 py-2 text-gray-500"${_scopeId}>${ssrInterpolate(r.source)}</td></tr>`);
                });
                _push2(`<!--]--></tbody></table></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(error)) {
                _push2(`<p class="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2"${_scopeId}>${ssrInterpolate(unref(error))}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else if (unref(step) === "importing") {
              _push2(`<div class="flex flex-col items-center justify-center py-12 gap-4"${_scopeId}><svg class="animate-spin h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24"${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"${_scopeId}></path></svg><p class="text-sm text-gray-500"${_scopeId}>Mengimport data finance...</p></div>`);
            } else if (unref(step) === "result" && unref(result)) {
              _push2(`<div class="space-y-4"${_scopeId}><div class="grid grid-cols-4 gap-3"${_scopeId}><div class="bg-blue-50 rounded-xl p-3 text-center"${_scopeId}><p class="text-2xl font-bold text-blue-700"${_scopeId}>${ssrInterpolate(unref(result).total)}</p><p class="text-xs text-blue-500 mt-0.5"${_scopeId}>Total Baris</p></div><div class="bg-green-50 rounded-xl p-3 text-center"${_scopeId}><p class="text-2xl font-bold text-green-700"${_scopeId}>${ssrInterpolate(unref(result).imported)}</p><p class="text-xs text-green-500 mt-0.5"${_scopeId}>Berhasil Import</p></div><div class="bg-purple-50 rounded-xl p-3 text-center"${_scopeId}><p class="text-2xl font-bold text-purple-700"${_scopeId}>${ssrInterpolate(unref(result).updated)}</p><p class="text-xs text-purple-500 mt-0.5"${_scopeId}>Order Diupdate</p></div><div class="bg-gray-50 rounded-xl p-3 text-center"${_scopeId}><p class="text-2xl font-bold text-gray-500"${_scopeId}>${ssrInterpolate(unref(result).skipped)}</p><p class="text-xs text-gray-400 mt-0.5"${_scopeId}>Dilewati (duplikat)</p></div></div>`);
              if (unref(result).errors.length > 0) {
                _push2(`<div class="rounded-xl bg-red-50 border border-red-100 p-3"${_scopeId}><p class="text-xs font-medium text-red-600 mb-1"${_scopeId}>Error (${ssrInterpolate(unref(result).errors.length)}):</p><ul class="space-y-0.5 max-h-32 overflow-y-auto"${_scopeId}><!--[-->`);
                ssrRenderList(unref(result).errors, (err) => {
                  _push2(`<li class="text-xs text-red-500"${_scopeId}>${ssrInterpolate(err)}</li>`);
                });
                _push2(`<!--]--></ul></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(result).imported > 0 || unref(result).updated > 0) {
                _push2(`<div class="rounded-xl bg-green-50 border border-green-100 px-4 py-3 flex items-center gap-2 text-sm text-green-700"${_scopeId}><svg class="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"${_scopeId}><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"${_scopeId}></path></svg> Import selesai! ${ssrInterpolate(unref(result).imported)} transaksi berhasil ditambahkan${ssrInterpolate(unref(result).updated > 0 ? `, ${unref(result).updated} order diperbarui` : "")}. </div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              unref(step) === "pick" ? (openBlock(), createBlock("div", {
                key: 0,
                class: "space-y-4"
              }, [
                createVNode("div", { class: "rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 text-sm text-blue-700 space-y-1" }, [
                  createVNode("p", { class: "font-medium" }, "Format file yang didukung:"),
                  createVNode("ul", { class: "list-disc list-inside text-xs space-y-0.5 text-blue-600" }, [
                    createVNode("li", null, "File Excel TikTok Seller Center \u2192 Finance \u2192 Income / Settlement"),
                    createVNode("li", null, [
                      createTextVNode("Sheet: "),
                      createVNode("b", null, "Order details")
                    ]),
                    createVNode("li", null, "Kolom wajib: Order/Adjustment ID, Type, Order settled time, Total settlement amount")
                  ])
                ]),
                createVNode("label", {
                  class: "flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-8 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors",
                  onDragover: withModifiers(() => {
                  }, ["prevent"]),
                  onDrop: withModifiers((e) => {
                    var _a, _b;
                    const f = (_b = (_a = e.dataTransfer) == null ? void 0 : _a.files) == null ? void 0 : _b[0];
                    if (f) {
                      file.value = f;
                      error.value = null;
                    }
                  }, ["prevent"])
                }, [
                  (openBlock(), createBlock("svg", {
                    class: "h-10 w-10 text-gray-300",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    stroke: "currentColor",
                    "stroke-width": "1.5"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    })
                  ])),
                  createVNode("span", { class: "text-sm text-gray-500" }, toDisplayString(unref(file) ? unref(file).name : "Klik atau drag & drop file Excel TikTok"), 1),
                  createVNode("span", { class: "text-xs text-gray-400" }, ".xlsx / .xls"),
                  createVNode("input", {
                    ref_key: "fileRef",
                    ref: fileRef,
                    type: "file",
                    accept: ".xlsx,.xls",
                    class: "hidden",
                    onChange: onFileChange
                  }, null, 544)
                ], 40, ["onDragover", "onDrop"]),
                unref(previewLoading) ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "text-center text-sm text-gray-400 py-2"
                }, "Membaca file...")) : unref(previewRows).length > 0 ? (openBlock(), createBlock("div", { key: 1 }, [
                  createVNode("p", { class: "text-xs text-gray-500 mb-2 font-medium" }, "Preview (10 baris pertama):"),
                  createVNode("div", { class: "overflow-x-auto rounded-xl border border-gray-100" }, [
                    createVNode("table", { class: "w-full text-xs min-w-[500px]" }, [
                      createVNode("thead", { class: "bg-gray-50 text-gray-500" }, [
                        createVNode("tr", null, [
                          createVNode("th", { class: "px-3 py-2 text-left font-medium" }, "Ref ID"),
                          createVNode("th", { class: "px-3 py-2 text-left font-medium" }, "Tipe"),
                          createVNode("th", { class: "px-3 py-2 text-left font-medium" }, "Tanggal"),
                          createVNode("th", { class: "px-3 py-2 text-right font-medium" }, "Net Settlement"),
                          createVNode("th", { class: "px-3 py-2 text-left font-medium" }, "Source")
                        ])
                      ]),
                      createVNode("tbody", { class: "divide-y divide-gray-50" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(unref(previewRows), (r) => {
                          return openBlock(), createBlock("tr", {
                            key: r.refId,
                            class: "hover:bg-gray-50/50"
                          }, [
                            createVNode("td", { class: "px-3 py-2 font-mono text-gray-600 max-w-[120px] truncate" }, toDisplayString(r.refId), 1),
                            createVNode("td", { class: "px-3 py-2 text-gray-600" }, toDisplayString(r.type), 1),
                            createVNode("td", { class: "px-3 py-2 text-gray-500" }, toDisplayString(r.date), 1),
                            createVNode("td", { class: "px-3 py-2 text-right text-gray-700 font-medium" }, toDisplayString(r.net), 1),
                            createVNode("td", { class: "px-3 py-2 text-gray-500" }, toDisplayString(r.source), 1)
                          ]);
                        }), 128))
                      ])
                    ])
                  ])
                ])) : createCommentVNode("", true),
                unref(error) ? (openBlock(), createBlock("p", {
                  key: 2,
                  class: "text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2"
                }, toDisplayString(unref(error)), 1)) : createCommentVNode("", true)
              ])) : unref(step) === "importing" ? (openBlock(), createBlock("div", {
                key: 1,
                class: "flex flex-col items-center justify-center py-12 gap-4"
              }, [
                (openBlock(), createBlock("svg", {
                  class: "animate-spin h-10 w-10 text-blue-500",
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
                ])),
                createVNode("p", { class: "text-sm text-gray-500" }, "Mengimport data finance...")
              ])) : unref(step) === "result" && unref(result) ? (openBlock(), createBlock("div", {
                key: 2,
                class: "space-y-4"
              }, [
                createVNode("div", { class: "grid grid-cols-4 gap-3" }, [
                  createVNode("div", { class: "bg-blue-50 rounded-xl p-3 text-center" }, [
                    createVNode("p", { class: "text-2xl font-bold text-blue-700" }, toDisplayString(unref(result).total), 1),
                    createVNode("p", { class: "text-xs text-blue-500 mt-0.5" }, "Total Baris")
                  ]),
                  createVNode("div", { class: "bg-green-50 rounded-xl p-3 text-center" }, [
                    createVNode("p", { class: "text-2xl font-bold text-green-700" }, toDisplayString(unref(result).imported), 1),
                    createVNode("p", { class: "text-xs text-green-500 mt-0.5" }, "Berhasil Import")
                  ]),
                  createVNode("div", { class: "bg-purple-50 rounded-xl p-3 text-center" }, [
                    createVNode("p", { class: "text-2xl font-bold text-purple-700" }, toDisplayString(unref(result).updated), 1),
                    createVNode("p", { class: "text-xs text-purple-500 mt-0.5" }, "Order Diupdate")
                  ]),
                  createVNode("div", { class: "bg-gray-50 rounded-xl p-3 text-center" }, [
                    createVNode("p", { class: "text-2xl font-bold text-gray-500" }, toDisplayString(unref(result).skipped), 1),
                    createVNode("p", { class: "text-xs text-gray-400 mt-0.5" }, "Dilewati (duplikat)")
                  ])
                ]),
                unref(result).errors.length > 0 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "rounded-xl bg-red-50 border border-red-100 p-3"
                }, [
                  createVNode("p", { class: "text-xs font-medium text-red-600 mb-1" }, "Error (" + toDisplayString(unref(result).errors.length) + "):", 1),
                  createVNode("ul", { class: "space-y-0.5 max-h-32 overflow-y-auto" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(result).errors, (err) => {
                      return openBlock(), createBlock("li", {
                        key: err,
                        class: "text-xs text-red-500"
                      }, toDisplayString(err), 1);
                    }), 128))
                  ])
                ])) : createCommentVNode("", true),
                unref(result).imported > 0 || unref(result).updated > 0 ? (openBlock(), createBlock("div", {
                  key: 1,
                  class: "rounded-xl bg-green-50 border border-green-100 px-4 py-3 flex items-center gap-2 text-sm text-green-700"
                }, [
                  (openBlock(), createBlock("svg", {
                    class: "h-4 w-4 flex-shrink-0",
                    fill: "currentColor",
                    viewBox: "0 0 20 20"
                  }, [
                    createVNode("path", {
                      "fill-rule": "evenodd",
                      d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
                      "clip-rule": "evenodd"
                    })
                  ])),
                  createTextVNode(" Import selesai! " + toDisplayString(unref(result).imported) + " transaksi berhasil ditambahkan" + toDisplayString(unref(result).updated > 0 ? `, ${unref(result).updated} order diperbarui` : "") + ". ", 1)
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
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/finance/FinanceImportModal.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "FinanceDetailModal",
  __ssrInlineRender: true,
  props: {
    tx: {}
  },
  emits: ["close", "edit"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const TYPE_LABEL = {
      ORDER: "Order",
      ADS: "Iklan",
      LOGISTIC: "Logistik",
      WITHDRAW: "Tarik Saldo"
    };
    const TYPE_COLOR = {
      ORDER: "bg-blue-100 text-blue-700",
      ADS: "bg-purple-100 text-purple-700",
      LOGISTIC: "bg-orange-100 text-orange-700",
      WITHDRAW: "bg-gray-100 text-gray-600"
    };
    function fmt(n) {
      return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(n));
    }
    function fmtDate(s) {
      return new Date(s).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AppModal = __nuxt_component_2;
      _push(ssrRenderComponent(_component_AppModal, mergeProps({
        "is-open": true,
        title: "Detail Transaksi",
        size: "sm",
        onClose: ($event) => emit("close")
      }, _attrs), {
        footer: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex gap-3 justify-end"${_scopeId}><button class="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"${_scopeId}> Tutup </button><button class="px-4 py-2 text-sm rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"${_scopeId}> Edit </button></div>`);
          } else {
            return [
              createVNode("div", { class: "flex gap-3 justify-end" }, [
                createVNode("button", {
                  class: "px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors",
                  onClick: ($event) => emit("close")
                }, " Tutup ", 8, ["onClick"]),
                createVNode("button", {
                  class: "px-4 py-2 text-sm rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors",
                  onClick: ($event) => {
                    emit("edit", __props.tx);
                    emit("close");
                  }
                }, " Edit ", 8, ["onClick"])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b;
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><span class="${ssrRenderClass(["text-xs px-2.5 py-1 rounded-full font-medium", TYPE_COLOR[__props.tx.type]])}"${_scopeId}>${ssrInterpolate(TYPE_LABEL[__props.tx.type])}</span><span class="${ssrRenderClass([
              "text-xs px-2.5 py-1 rounded-full font-medium",
              __props.tx.cashFlow === "IN" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
            ])}"${_scopeId}>${ssrInterpolate(__props.tx.cashFlow === "IN" ? "Uang Masuk" : "Uang Keluar")}</span></div><div class="rounded-xl bg-gray-50 px-5 py-4"${_scopeId}><p class="text-xs text-gray-400 mb-1"${_scopeId}>Total Bersih (Net)</p><p class="${ssrRenderClass([__props.tx.cashFlow === "IN" ? "text-green-600" : "text-red-500", "text-2xl font-bold"])}"${_scopeId}>${ssrInterpolate(__props.tx.cashFlow === "OUT" ? "-" : "")}${ssrInterpolate(fmt(__props.tx.netAmount))}</p></div><dl class="divide-y divide-gray-50 text-sm"${_scopeId}><div class="flex justify-between py-2.5"${_scopeId}><dt class="text-gray-500"${_scopeId}>Tanggal</dt><dd class="font-medium text-gray-800"${_scopeId}>${ssrInterpolate(fmtDate(__props.tx.date))}</dd></div><div class="flex justify-between py-2.5"${_scopeId}><dt class="text-gray-500"${_scopeId}>Nilai Transaksi</dt><dd class="font-medium text-gray-800"${_scopeId}>${ssrInterpolate(fmt(__props.tx.amount))}</dd></div>`);
            if (Number(__props.tx.platformFee) > 0) {
              _push2(`<div class="flex justify-between py-2.5"${_scopeId}><dt class="text-gray-500"${_scopeId}>Platform Fee</dt><dd class="text-red-500 font-medium"${_scopeId}>-${ssrInterpolate(fmt(__props.tx.platformFee))}</dd></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (Number(__props.tx.affiliateFee) > 0) {
              _push2(`<div class="flex justify-between py-2.5"${_scopeId}><dt class="text-gray-500"${_scopeId}>Affiliate Fee</dt><dd class="text-red-500 font-medium"${_scopeId}>-${ssrInterpolate(fmt(__props.tx.affiliateFee))}</dd></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (Number((_a = __props.tx.shippingFee) != null ? _a : 0) > 0) {
              _push2(`<div class="flex justify-between py-2.5"${_scopeId}><dt class="text-gray-500"${_scopeId}>Shipping Fee</dt><dd class="text-red-500 font-medium"${_scopeId}>-${ssrInterpolate(fmt(__props.tx.shippingFee))}</dd></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.tx.source) {
              _push2(`<div class="flex justify-between py-2.5"${_scopeId}><dt class="text-gray-500"${_scopeId}>Source</dt><dd class="text-gray-700"${_scopeId}>${ssrInterpolate(__props.tx.source)}</dd></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="flex justify-between py-2.5"${_scopeId}><dt class="text-gray-500"${_scopeId}>Reference ID</dt><dd class="font-mono text-xs text-gray-600 text-right max-w-[60%] break-all"${_scopeId}>${ssrInterpolate(__props.tx.referenceId || "-")}</dd></div>`);
            if (__props.tx.note) {
              _push2(`<div class="flex justify-between py-2.5"${_scopeId}><dt class="text-gray-500"${_scopeId}>Keterangan</dt><dd class="text-gray-700 text-right max-w-[60%]"${_scopeId}>${ssrInterpolate(__props.tx.note)}</dd></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="flex justify-between py-2.5"${_scopeId}><dt class="text-gray-500"${_scopeId}>Dibuat</dt><dd class="text-gray-500 text-xs"${_scopeId}>${ssrInterpolate(fmtDate(__props.tx.createdAt))}</dd></div></dl></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                createVNode("div", { class: "flex items-center gap-2" }, [
                  createVNode("span", {
                    class: ["text-xs px-2.5 py-1 rounded-full font-medium", TYPE_COLOR[__props.tx.type]]
                  }, toDisplayString(TYPE_LABEL[__props.tx.type]), 3),
                  createVNode("span", {
                    class: [
                      "text-xs px-2.5 py-1 rounded-full font-medium",
                      __props.tx.cashFlow === "IN" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                    ]
                  }, toDisplayString(__props.tx.cashFlow === "IN" ? "Uang Masuk" : "Uang Keluar"), 3)
                ]),
                createVNode("div", { class: "rounded-xl bg-gray-50 px-5 py-4" }, [
                  createVNode("p", { class: "text-xs text-gray-400 mb-1" }, "Total Bersih (Net)"),
                  createVNode("p", {
                    class: ["text-2xl font-bold", __props.tx.cashFlow === "IN" ? "text-green-600" : "text-red-500"]
                  }, toDisplayString(__props.tx.cashFlow === "OUT" ? "-" : "") + toDisplayString(fmt(__props.tx.netAmount)), 3)
                ]),
                createVNode("dl", { class: "divide-y divide-gray-50 text-sm" }, [
                  createVNode("div", { class: "flex justify-between py-2.5" }, [
                    createVNode("dt", { class: "text-gray-500" }, "Tanggal"),
                    createVNode("dd", { class: "font-medium text-gray-800" }, toDisplayString(fmtDate(__props.tx.date)), 1)
                  ]),
                  createVNode("div", { class: "flex justify-between py-2.5" }, [
                    createVNode("dt", { class: "text-gray-500" }, "Nilai Transaksi"),
                    createVNode("dd", { class: "font-medium text-gray-800" }, toDisplayString(fmt(__props.tx.amount)), 1)
                  ]),
                  Number(__props.tx.platformFee) > 0 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "flex justify-between py-2.5"
                  }, [
                    createVNode("dt", { class: "text-gray-500" }, "Platform Fee"),
                    createVNode("dd", { class: "text-red-500 font-medium" }, "-" + toDisplayString(fmt(__props.tx.platformFee)), 1)
                  ])) : createCommentVNode("", true),
                  Number(__props.tx.affiliateFee) > 0 ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "flex justify-between py-2.5"
                  }, [
                    createVNode("dt", { class: "text-gray-500" }, "Affiliate Fee"),
                    createVNode("dd", { class: "text-red-500 font-medium" }, "-" + toDisplayString(fmt(__props.tx.affiliateFee)), 1)
                  ])) : createCommentVNode("", true),
                  Number((_b = __props.tx.shippingFee) != null ? _b : 0) > 0 ? (openBlock(), createBlock("div", {
                    key: 2,
                    class: "flex justify-between py-2.5"
                  }, [
                    createVNode("dt", { class: "text-gray-500" }, "Shipping Fee"),
                    createVNode("dd", { class: "text-red-500 font-medium" }, "-" + toDisplayString(fmt(__props.tx.shippingFee)), 1)
                  ])) : createCommentVNode("", true),
                  __props.tx.source ? (openBlock(), createBlock("div", {
                    key: 3,
                    class: "flex justify-between py-2.5"
                  }, [
                    createVNode("dt", { class: "text-gray-500" }, "Source"),
                    createVNode("dd", { class: "text-gray-700" }, toDisplayString(__props.tx.source), 1)
                  ])) : createCommentVNode("", true),
                  createVNode("div", { class: "flex justify-between py-2.5" }, [
                    createVNode("dt", { class: "text-gray-500" }, "Reference ID"),
                    createVNode("dd", { class: "font-mono text-xs text-gray-600 text-right max-w-[60%] break-all" }, toDisplayString(__props.tx.referenceId || "-"), 1)
                  ]),
                  __props.tx.note ? (openBlock(), createBlock("div", {
                    key: 4,
                    class: "flex justify-between py-2.5"
                  }, [
                    createVNode("dt", { class: "text-gray-500" }, "Keterangan"),
                    createVNode("dd", { class: "text-gray-700 text-right max-w-[60%]" }, toDisplayString(__props.tx.note), 1)
                  ])) : createCommentVNode("", true),
                  createVNode("div", { class: "flex justify-between py-2.5" }, [
                    createVNode("dt", { class: "text-gray-500" }, "Dibuat"),
                    createVNode("dd", { class: "text-gray-500 text-xs" }, toDisplayString(fmtDate(__props.tx.createdAt)), 1)
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/finance/FinanceDetailModal.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "OrderSummaryModal",
  __ssrInlineRender: true,
  props: {
    storeId: {},
    orderNumber: {}
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    useApi();
    const order = ref(null);
    const loading = ref(true);
    const error = ref(null);
    function fmt(n) {
      return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(n));
    }
    function fmtDate(s) {
      if (!s) return "-";
      return new Date(s).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
    }
    const STATUS_LABEL = {
      PENDING: "Pending",
      SHIPPED: "Dikirim",
      DELIVERED: "Terkirim",
      COMPLETED: "Selesai",
      CANCELLED: "Dibatalkan",
      RETURNED: "Retur"
    };
    const STATUS_COLOR = {
      PENDING: "bg-yellow-100 text-yellow-700",
      SHIPPED: "bg-blue-100 text-blue-700",
      DELIVERED: "bg-indigo-100 text-indigo-700",
      COMPLETED: "bg-green-100 text-green-700",
      CANCELLED: "bg-red-100 text-red-600",
      RETURNED: "bg-orange-100 text-orange-600"
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AppModal = __nuxt_component_2;
      const _component_NuxtLink = __nuxt_component_0;
      _push(ssrRenderComponent(_component_AppModal, mergeProps({
        "is-open": true,
        title: `Order #${__props.orderNumber}`,
        size: "md",
        onClose: ($event) => emit("close")
      }, _attrs), {
        footer: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex gap-3 justify-end"${_scopeId}><button class="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"${_scopeId}> Tutup </button>`);
            if (unref(order)) {
              _push2(ssrRenderComponent(_component_NuxtLink, {
                to: `/store/orders/${unref(order).id}`,
                class: "px-4 py-2 text-sm rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors",
                onClick: ($event) => emit("close")
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Lihat Detail Order `);
                  } else {
                    return [
                      createTextVNode(" Lihat Detail Order ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex gap-3 justify-end" }, [
                createVNode("button", {
                  class: "px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors",
                  onClick: ($event) => emit("close")
                }, " Tutup ", 8, ["onClick"]),
                unref(order) ? (openBlock(), createBlock(_component_NuxtLink, {
                  key: 0,
                  to: `/store/orders/${unref(order).id}`,
                  class: "px-4 py-2 text-sm rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors",
                  onClick: ($event) => emit("close")
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Lihat Detail Order ")
                  ]),
                  _: 1
                }, 8, ["to", "onClick"])) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
          if (_push2) {
            if (unref(loading)) {
              _push2(`<div class="flex items-center justify-center py-12"${_scopeId}><svg class="animate-spin h-7 w-7 text-blue-500" fill="none" viewBox="0 0 24 24"${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"${_scopeId}></path></svg></div>`);
            } else if (unref(error)) {
              _push2(`<div class="py-8 text-center text-sm text-gray-500"${_scopeId}>${ssrInterpolate(unref(error))}</div>`);
            } else if (unref(order)) {
              _push2(`<div class="space-y-4"${_scopeId}><div class="flex items-center gap-3"${_scopeId}><span class="${ssrRenderClass(["text-xs px-2.5 py-1 rounded-full font-medium", STATUS_COLOR[unref(order).status]])}"${_scopeId}>${ssrInterpolate(STATUS_LABEL[unref(order).status])}</span><span class="font-mono text-xs text-gray-500"${_scopeId}>${ssrInterpolate(unref(order).orderNumber)}</span></div><div class="grid grid-cols-2 gap-3 text-sm"${_scopeId}><div class="bg-gray-50 rounded-xl p-3 space-y-1"${_scopeId}><p class="text-xs text-gray-400 font-medium uppercase tracking-wide"${_scopeId}>Pelanggan</p><p class="font-medium text-gray-800"${_scopeId}>${ssrInterpolate(((_a = unref(order).customer) == null ? void 0 : _a.name) || "-")}</p>`);
              if ((_b = unref(order).customer) == null ? void 0 : _b.phone) {
                _push2(`<p class="text-xs text-gray-500"${_scopeId}>${ssrInterpolate(unref(order).customer.phone)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              if ((_c = unref(order).customer) == null ? void 0 : _c.address) {
                _push2(`<p class="text-xs text-gray-500 leading-snug"${_scopeId}>${ssrInterpolate(unref(order).customer.address)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              if ((_d = unref(order).customer) == null ? void 0 : _d.city) {
                _push2(`<p class="text-xs text-gray-500"${_scopeId}>${ssrInterpolate([unref(order).customer.city, unref(order).customer.province].filter(Boolean).join(", "))}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="bg-gray-50 rounded-xl p-3 space-y-1"${_scopeId}><p class="text-xs text-gray-400 font-medium uppercase tracking-wide"${_scopeId}>Tanggal</p><div class="text-xs space-y-0.5"${_scopeId}><div class="flex justify-between gap-2"${_scopeId}><span class="text-gray-400"${_scopeId}>Order</span><span class="text-gray-700"${_scopeId}>${ssrInterpolate(fmtDate(unref(order).createdDate))}</span></div><div class="flex justify-between gap-2"${_scopeId}><span class="text-gray-400"${_scopeId}>Kirim</span><span class="text-gray-700"${_scopeId}>${ssrInterpolate(fmtDate(unref(order).shippedDate))}</span></div><div class="flex justify-between gap-2"${_scopeId}><span class="text-gray-400"${_scopeId}>Tiba</span><span class="text-gray-700"${_scopeId}>${ssrInterpolate(fmtDate(unref(order).deliveredDate))}</span></div><div class="flex justify-between gap-2"${_scopeId}><span class="text-gray-400"${_scopeId}>Selesai</span><span class="text-gray-700"${_scopeId}>${ssrInterpolate(fmtDate(unref(order).completedDate))}</span></div></div>`);
              if ((_e = unref(order).shipping) == null ? void 0 : _e.trackingNumber) {
                _push2(`<!--[--><p class="text-xs text-gray-400 mt-1 font-medium uppercase tracking-wide pt-2 border-t border-gray-200"${_scopeId}>Resi</p><p class="text-xs font-mono text-gray-700"${_scopeId}>${ssrInterpolate(unref(order).shipping.trackingNumber)}</p>`);
                if (unref(order).shipping.serviceName) {
                  _push2(`<p class="text-xs text-gray-500"${_scopeId}>${ssrInterpolate(unref(order).shipping.serviceName)}</p>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<!--]-->`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div>`);
              if (unref(order).items && unref(order).items.length) {
                _push2(`<div${_scopeId}><p class="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2"${_scopeId}>Items (${ssrInterpolate(unref(order).items.length)})</p><div class="rounded-xl border border-gray-100 overflow-hidden"${_scopeId}><table class="w-full text-xs"${_scopeId}><thead class="bg-gray-50 text-gray-500"${_scopeId}><tr${_scopeId}><th class="px-3 py-2 text-left font-medium"${_scopeId}>Produk</th><th class="px-3 py-2 text-center font-medium"${_scopeId}>Qty</th><th class="px-3 py-2 text-right font-medium"${_scopeId}>Harga</th><th class="px-3 py-2 text-right font-medium"${_scopeId}>Total</th></tr></thead><tbody class="divide-y divide-gray-50"${_scopeId}><!--[-->`);
                ssrRenderList(unref(order).items, (item) => {
                  _push2(`<tr class="hover:bg-gray-50/50"${_scopeId}><td class="px-3 py-2"${_scopeId}><p class="font-medium text-gray-700 leading-tight"${_scopeId}>${ssrInterpolate(item.productName)}</p>`);
                  if (item.sku) {
                    _push2(`<p class="text-gray-400 font-mono"${_scopeId}>${ssrInterpolate(item.sku)}</p>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</td><td class="px-3 py-2 text-center text-gray-600"${_scopeId}>${ssrInterpolate(item.qty)}</td><td class="px-3 py-2 text-right text-gray-600"${_scopeId}>${ssrInterpolate(fmt(item.price))}</td><td class="px-3 py-2 text-right font-medium text-gray-700"${_scopeId}>${ssrInterpolate(fmt(item.total))}</td></tr>`);
                });
                _push2(`<!--]--></tbody></table></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="rounded-xl bg-gray-50 px-4 py-3 space-y-1.5 text-sm"${_scopeId}><div class="flex justify-between text-gray-500"${_scopeId}><span${_scopeId}>Subtotal</span><span${_scopeId}>${ssrInterpolate(fmt(unref(order).subtotal))}</span></div>`);
              if (Number(unref(order).discount) > 0) {
                _push2(`<div class="flex justify-between text-gray-500"${_scopeId}><span${_scopeId}>Diskon</span><span class="text-orange-500"${_scopeId}>-${ssrInterpolate(fmt(unref(order).discount))}</span></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="flex justify-between text-gray-700 font-medium border-t border-gray-200 pt-1.5"${_scopeId}><span${_scopeId}>Total Produk</span><span${_scopeId}>${ssrInterpolate(fmt(unref(order).total))}</span></div>`);
              if (Number(unref(order).shippingFee) > 0) {
                _push2(`<div class="flex justify-between text-gray-500"${_scopeId}><span${_scopeId}>Ongkir</span><span${_scopeId}>${ssrInterpolate(fmt(unref(order).shippingFee))}</span></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (Number(unref(order).platformFee) > 0) {
                _push2(`<div class="flex justify-between text-gray-500"${_scopeId}><span${_scopeId}>Biaya Platform</span><span class="text-red-400"${_scopeId}>-${ssrInterpolate(fmt(unref(order).platformFee))}</span></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (Number(unref(order).affiliateFee) > 0) {
                _push2(`<div class="flex justify-between text-gray-500"${_scopeId}><span${_scopeId}>Affiliate Fee</span><span class="text-red-400"${_scopeId}>-${ssrInterpolate(fmt(unref(order).affiliateFee))}</span></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (Number(unref(order).totalHpp) > 0) {
                _push2(`<div class="flex justify-between text-gray-500"${_scopeId}><span${_scopeId}>HPP</span><span class="text-red-400"${_scopeId}>-${ssrInterpolate(fmt(unref(order).totalHpp))}</span></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="flex justify-between font-bold text-gray-800 border-t border-gray-300 pt-1.5"${_scopeId}><span${_scopeId}>Grand Total</span><span${_scopeId}>${ssrInterpolate(fmt(unref(order).grandTotal))}</span></div><div class="${ssrRenderClass([Number(unref(order).netTotal) >= 0 ? "text-green-600" : "text-red-500", "flex justify-between font-bold"])}"${_scopeId}><span${_scopeId}>Net Profit</span><span${_scopeId}>${ssrInterpolate(fmt(unref(order).netTotal))}</span></div></div></div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              unref(loading) ? (openBlock(), createBlock("div", {
                key: 0,
                class: "flex items-center justify-center py-12"
              }, [
                (openBlock(), createBlock("svg", {
                  class: "animate-spin h-7 w-7 text-blue-500",
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
                ]))
              ])) : unref(error) ? (openBlock(), createBlock("div", {
                key: 1,
                class: "py-8 text-center text-sm text-gray-500"
              }, toDisplayString(unref(error)), 1)) : unref(order) ? (openBlock(), createBlock("div", {
                key: 2,
                class: "space-y-4"
              }, [
                createVNode("div", { class: "flex items-center gap-3" }, [
                  createVNode("span", {
                    class: ["text-xs px-2.5 py-1 rounded-full font-medium", STATUS_COLOR[unref(order).status]]
                  }, toDisplayString(STATUS_LABEL[unref(order).status]), 3),
                  createVNode("span", { class: "font-mono text-xs text-gray-500" }, toDisplayString(unref(order).orderNumber), 1)
                ]),
                createVNode("div", { class: "grid grid-cols-2 gap-3 text-sm" }, [
                  createVNode("div", { class: "bg-gray-50 rounded-xl p-3 space-y-1" }, [
                    createVNode("p", { class: "text-xs text-gray-400 font-medium uppercase tracking-wide" }, "Pelanggan"),
                    createVNode("p", { class: "font-medium text-gray-800" }, toDisplayString(((_f = unref(order).customer) == null ? void 0 : _f.name) || "-"), 1),
                    ((_g = unref(order).customer) == null ? void 0 : _g.phone) ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "text-xs text-gray-500"
                    }, toDisplayString(unref(order).customer.phone), 1)) : createCommentVNode("", true),
                    ((_h = unref(order).customer) == null ? void 0 : _h.address) ? (openBlock(), createBlock("p", {
                      key: 1,
                      class: "text-xs text-gray-500 leading-snug"
                    }, toDisplayString(unref(order).customer.address), 1)) : createCommentVNode("", true),
                    ((_i = unref(order).customer) == null ? void 0 : _i.city) ? (openBlock(), createBlock("p", {
                      key: 2,
                      class: "text-xs text-gray-500"
                    }, toDisplayString([unref(order).customer.city, unref(order).customer.province].filter(Boolean).join(", ")), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("div", { class: "bg-gray-50 rounded-xl p-3 space-y-1" }, [
                    createVNode("p", { class: "text-xs text-gray-400 font-medium uppercase tracking-wide" }, "Tanggal"),
                    createVNode("div", { class: "text-xs space-y-0.5" }, [
                      createVNode("div", { class: "flex justify-between gap-2" }, [
                        createVNode("span", { class: "text-gray-400" }, "Order"),
                        createVNode("span", { class: "text-gray-700" }, toDisplayString(fmtDate(unref(order).createdDate)), 1)
                      ]),
                      createVNode("div", { class: "flex justify-between gap-2" }, [
                        createVNode("span", { class: "text-gray-400" }, "Kirim"),
                        createVNode("span", { class: "text-gray-700" }, toDisplayString(fmtDate(unref(order).shippedDate)), 1)
                      ]),
                      createVNode("div", { class: "flex justify-between gap-2" }, [
                        createVNode("span", { class: "text-gray-400" }, "Tiba"),
                        createVNode("span", { class: "text-gray-700" }, toDisplayString(fmtDate(unref(order).deliveredDate)), 1)
                      ]),
                      createVNode("div", { class: "flex justify-between gap-2" }, [
                        createVNode("span", { class: "text-gray-400" }, "Selesai"),
                        createVNode("span", { class: "text-gray-700" }, toDisplayString(fmtDate(unref(order).completedDate)), 1)
                      ])
                    ]),
                    ((_j = unref(order).shipping) == null ? void 0 : _j.trackingNumber) ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                      createVNode("p", { class: "text-xs text-gray-400 mt-1 font-medium uppercase tracking-wide pt-2 border-t border-gray-200" }, "Resi"),
                      createVNode("p", { class: "text-xs font-mono text-gray-700" }, toDisplayString(unref(order).shipping.trackingNumber), 1),
                      unref(order).shipping.serviceName ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "text-xs text-gray-500"
                      }, toDisplayString(unref(order).shipping.serviceName), 1)) : createCommentVNode("", true)
                    ], 64)) : createCommentVNode("", true)
                  ])
                ]),
                unref(order).items && unref(order).items.length ? (openBlock(), createBlock("div", { key: 0 }, [
                  createVNode("p", { class: "text-xs text-gray-400 font-medium uppercase tracking-wide mb-2" }, "Items (" + toDisplayString(unref(order).items.length) + ")", 1),
                  createVNode("div", { class: "rounded-xl border border-gray-100 overflow-hidden" }, [
                    createVNode("table", { class: "w-full text-xs" }, [
                      createVNode("thead", { class: "bg-gray-50 text-gray-500" }, [
                        createVNode("tr", null, [
                          createVNode("th", { class: "px-3 py-2 text-left font-medium" }, "Produk"),
                          createVNode("th", { class: "px-3 py-2 text-center font-medium" }, "Qty"),
                          createVNode("th", { class: "px-3 py-2 text-right font-medium" }, "Harga"),
                          createVNode("th", { class: "px-3 py-2 text-right font-medium" }, "Total")
                        ])
                      ]),
                      createVNode("tbody", { class: "divide-y divide-gray-50" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(unref(order).items, (item) => {
                          return openBlock(), createBlock("tr", {
                            key: item.id,
                            class: "hover:bg-gray-50/50"
                          }, [
                            createVNode("td", { class: "px-3 py-2" }, [
                              createVNode("p", { class: "font-medium text-gray-700 leading-tight" }, toDisplayString(item.productName), 1),
                              item.sku ? (openBlock(), createBlock("p", {
                                key: 0,
                                class: "text-gray-400 font-mono"
                              }, toDisplayString(item.sku), 1)) : createCommentVNode("", true)
                            ]),
                            createVNode("td", { class: "px-3 py-2 text-center text-gray-600" }, toDisplayString(item.qty), 1),
                            createVNode("td", { class: "px-3 py-2 text-right text-gray-600" }, toDisplayString(fmt(item.price)), 1),
                            createVNode("td", { class: "px-3 py-2 text-right font-medium text-gray-700" }, toDisplayString(fmt(item.total)), 1)
                          ]);
                        }), 128))
                      ])
                    ])
                  ])
                ])) : createCommentVNode("", true),
                createVNode("div", { class: "rounded-xl bg-gray-50 px-4 py-3 space-y-1.5 text-sm" }, [
                  createVNode("div", { class: "flex justify-between text-gray-500" }, [
                    createVNode("span", null, "Subtotal"),
                    createVNode("span", null, toDisplayString(fmt(unref(order).subtotal)), 1)
                  ]),
                  Number(unref(order).discount) > 0 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "flex justify-between text-gray-500"
                  }, [
                    createVNode("span", null, "Diskon"),
                    createVNode("span", { class: "text-orange-500" }, "-" + toDisplayString(fmt(unref(order).discount)), 1)
                  ])) : createCommentVNode("", true),
                  createVNode("div", { class: "flex justify-between text-gray-700 font-medium border-t border-gray-200 pt-1.5" }, [
                    createVNode("span", null, "Total Produk"),
                    createVNode("span", null, toDisplayString(fmt(unref(order).total)), 1)
                  ]),
                  Number(unref(order).shippingFee) > 0 ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "flex justify-between text-gray-500"
                  }, [
                    createVNode("span", null, "Ongkir"),
                    createVNode("span", null, toDisplayString(fmt(unref(order).shippingFee)), 1)
                  ])) : createCommentVNode("", true),
                  Number(unref(order).platformFee) > 0 ? (openBlock(), createBlock("div", {
                    key: 2,
                    class: "flex justify-between text-gray-500"
                  }, [
                    createVNode("span", null, "Biaya Platform"),
                    createVNode("span", { class: "text-red-400" }, "-" + toDisplayString(fmt(unref(order).platformFee)), 1)
                  ])) : createCommentVNode("", true),
                  Number(unref(order).affiliateFee) > 0 ? (openBlock(), createBlock("div", {
                    key: 3,
                    class: "flex justify-between text-gray-500"
                  }, [
                    createVNode("span", null, "Affiliate Fee"),
                    createVNode("span", { class: "text-red-400" }, "-" + toDisplayString(fmt(unref(order).affiliateFee)), 1)
                  ])) : createCommentVNode("", true),
                  Number(unref(order).totalHpp) > 0 ? (openBlock(), createBlock("div", {
                    key: 4,
                    class: "flex justify-between text-gray-500"
                  }, [
                    createVNode("span", null, "HPP"),
                    createVNode("span", { class: "text-red-400" }, "-" + toDisplayString(fmt(unref(order).totalHpp)), 1)
                  ])) : createCommentVNode("", true),
                  createVNode("div", { class: "flex justify-between font-bold text-gray-800 border-t border-gray-300 pt-1.5" }, [
                    createVNode("span", null, "Grand Total"),
                    createVNode("span", null, toDisplayString(fmt(unref(order).grandTotal)), 1)
                  ]),
                  createVNode("div", {
                    class: ["flex justify-between font-bold", Number(unref(order).netTotal) >= 0 ? "text-green-600" : "text-red-500"]
                  }, [
                    createVNode("span", null, "Net Profit"),
                    createVNode("span", null, toDisplayString(fmt(unref(order).netTotal)), 1)
                  ], 2)
                ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/order/OrderSummaryModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const limit = 20;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const activeStoreStore = useActiveStoreStore();
    const storeId = computed(() => {
      var _a, _b;
      return (_b = (_a = activeStoreStore.store) == null ? void 0 : _a.id) != null ? _b : "";
    });
    const { getTransactions, getSummary, deleteTransaction, loading } = useFinance();
    const transactions = ref([]);
    const total = ref(0);
    const page = ref(1);
    const summary = ref(null);
    const search = ref("");
    const typeFilter = ref("");
    const cashFlowFilter = ref("");
    const sourceFilter = ref("");
    const dateFrom = ref("");
    const dateTo = ref("");
    const deleteTarget = ref(null);
    const deleteLoading = ref(false);
    const showForm = ref(false);
    const editTarget = ref(null);
    const showImport = ref(false);
    const detailTarget = ref(null);
    const orderSummaryRef = ref(null);
    const toast = ref(null);
    const totalPages = computed(() => Math.ceil(total.value / limit));
    async function load() {
      var _a, _b;
      if (!storeId.value) return;
      const [res, sum] = await Promise.all([
        getTransactions({
          storeId: storeId.value,
          type: typeFilter.value || void 0,
          cashFlow: cashFlowFilter.value || void 0,
          source: sourceFilter.value || void 0,
          dateFrom: dateFrom.value || void 0,
          dateTo: dateTo.value || void 0,
          search: search.value || void 0,
          page: page.value,
          limit
        }),
        getSummary(storeId.value, dateFrom.value || void 0, dateTo.value || void 0)
      ]);
      transactions.value = (_a = res == null ? void 0 : res.data) != null ? _a : [];
      total.value = (_b = res == null ? void 0 : res.total) != null ? _b : 0;
      summary.value = sum != null ? sum : null;
    }
    let debounce = null;
    watch([search, typeFilter, cashFlowFilter, sourceFilter, dateFrom, dateTo], () => {
      page.value = 1;
      if (debounce) clearTimeout(debounce);
      debounce = setTimeout(load, 300);
    });
    watch(page, load);
    watch(toast, (v) => {
      if (v) setTimeout(() => {
        toast.value = null;
      }, 3e3);
    });
    const hasFilter = computed(() => search.value || typeFilter.value || cashFlowFilter.value || sourceFilter.value || dateFrom.value || dateTo.value);
    function formatCurrency(n) {
      return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(n));
    }
    function formatDate(s) {
      return new Date(s).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
    }
    const TYPE_LABEL = { ORDER: "Order", ADS: "Iklan", LOGISTIC: "Logistik", WITHDRAW: "Tarik Saldo" };
    const TYPE_COLOR = {
      ORDER: "bg-blue-100 text-blue-700",
      ADS: "bg-purple-100 text-purple-700",
      LOGISTIC: "bg-orange-100 text-orange-700",
      WITHDRAW: "bg-gray-100 text-gray-600"
    };
    function openEdit(tx) {
      editTarget.value = tx;
      showForm.value = true;
    }
    async function confirmDelete() {
      if (!deleteTarget.value) return;
      deleteLoading.value = true;
      try {
        await deleteTransaction(deleteTarget.value.id);
        toast.value = { message: "Transaksi berhasil dihapus", type: "success" };
        deleteTarget.value = null;
        load();
      } catch {
        toast.value = { message: "Gagal menghapus transaksi", type: "error" };
      } finally {
        deleteLoading.value = false;
      }
    }
    function handleSaved() {
      showForm.value = false;
      editTarget.value = null;
      load();
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FinanceFormModal = _sfc_main$4;
      const _component_FinanceImportModal = _sfc_main$3;
      const _component_FinanceDetailModal = _sfc_main$2;
      const _component_OrderSummaryModal = _sfc_main$1;
      const _component_AppModal = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-5" }, _attrs))} data-v-eca88f81><div class="flex items-center justify-between gap-4 flex-wrap" data-v-eca88f81><div data-v-eca88f81><h1 class="text-2xl font-bold text-gray-900" data-v-eca88f81>Finance &amp; Saldo</h1><p class="text-sm text-gray-500 mt-0.5" data-v-eca88f81>Manajemen transaksi keuangan toko</p></div><div class="flex items-center gap-2" data-v-eca88f81><button class="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-sm font-medium transition-colors shadow-sm" data-v-eca88f81><svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" data-v-eca88f81><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" data-v-eca88f81></path></svg> Import TikTok </button><button class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm" data-v-eca88f81><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" data-v-eca88f81><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" data-v-eca88f81></path></svg> Tambah Transaksi </button></div></div>`);
      if (unref(summary)) {
        _push(`<div class="space-y-3" data-v-eca88f81><div class="grid grid-cols-2 lg:grid-cols-4 gap-3" data-v-eca88f81><div class="${ssrRenderClass([unref(summary).totalBalance >= 0 ? "bg-gradient-to-br from-emerald-500 to-green-600" : "bg-gradient-to-br from-red-500 to-rose-600", "col-span-2 lg:col-span-1 rounded-xl p-4 text-white"])}" data-v-eca88f81><p class="text-xs font-medium opacity-80" data-v-eca88f81>Saldo TikTok</p><p class="text-2xl font-bold mt-1 leading-tight" data-v-eca88f81>${ssrInterpolate(formatCurrency(unref(summary).totalBalance))}</p><p class="text-xs opacity-70 mt-1" data-v-eca88f81>Belum ditarik ke bank</p></div><div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4" data-v-eca88f81><p class="text-xs text-gray-500 mb-1" data-v-eca88f81>Total Pemasukan</p><p class="text-lg font-bold text-blue-600" data-v-eca88f81>${ssrInterpolate(formatCurrency(unref(summary).totalIn))}</p><p class="text-xs text-gray-400 mt-0.5" data-v-eca88f81>${ssrInterpolate(unref(summary).txCount)} transaksi</p></div><div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4" data-v-eca88f81><p class="text-xs text-gray-500 mb-1" data-v-eca88f81>Total Pengeluaran</p><p class="text-lg font-bold text-red-500" data-v-eca88f81>${ssrInterpolate(formatCurrency(unref(summary).totalOut))}</p><p class="text-xs text-gray-400 mt-0.5" data-v-eca88f81>Biaya + iklan + withdraw</p></div><div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4" data-v-eca88f81><p class="text-xs text-gray-500 mb-1" data-v-eca88f81>Total Withdraw</p><p class="text-lg font-bold text-gray-700" data-v-eca88f81>${ssrInterpolate(formatCurrency(unref(summary).totalWithdraw))}</p><p class="text-xs text-gray-400 mt-0.5" data-v-eca88f81>Sudah ditransfer ke bank</p></div></div><div class="grid grid-cols-2 lg:grid-cols-4 gap-3" data-v-eca88f81><div class="bg-white rounded-xl border border-amber-100 shadow-sm p-4" data-v-eca88f81><div class="flex items-center justify-between mb-2" data-v-eca88f81><p class="text-xs text-gray-500" data-v-eca88f81>Biaya Platform</p><span class="text-xs px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded font-medium" data-v-eca88f81>TikTok</span></div><p class="text-base font-bold text-amber-600" data-v-eca88f81>${ssrInterpolate(formatCurrency(unref(summary).totalPlatformFee))}</p><p class="text-xs text-gray-400 mt-0.5" data-v-eca88f81>Komisi + payment fee</p></div><div class="bg-white rounded-xl border border-purple-100 shadow-sm p-4" data-v-eca88f81><div class="flex items-center justify-between mb-2" data-v-eca88f81><p class="text-xs text-gray-500" data-v-eca88f81>Biaya Affiliate</p><span class="text-xs px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded font-medium" data-v-eca88f81>Kreator</span></div><p class="text-base font-bold text-purple-600" data-v-eca88f81>${ssrInterpolate(formatCurrency(unref(summary).totalAffiliateFee))}</p><p class="text-xs text-gray-400 mt-0.5" data-v-eca88f81>Komisi affiliate &amp; shop</p></div><div class="bg-white rounded-xl border border-teal-100 shadow-sm p-4" data-v-eca88f81><div class="flex items-center justify-between mb-2" data-v-eca88f81><p class="text-xs text-gray-500" data-v-eca88f81>Biaya Ongkir</p><span class="text-xs px-1.5 py-0.5 bg-teal-50 text-teal-600 rounded font-medium" data-v-eca88f81>Logistik</span></div><p class="text-base font-bold text-teal-600" data-v-eca88f81>${ssrInterpolate(formatCurrency(unref(summary).totalShippingFee))}</p><p class="text-xs text-gray-400 mt-0.5" data-v-eca88f81>Setelah subsidi platform</p></div><div class="bg-white rounded-xl border border-rose-100 shadow-sm p-4" data-v-eca88f81><div class="flex items-center justify-between mb-2" data-v-eca88f81><p class="text-xs text-gray-500" data-v-eca88f81>Biaya Iklan</p><span class="text-xs px-1.5 py-0.5 bg-rose-50 text-rose-600 rounded font-medium" data-v-eca88f81>ADS</span></div><p class="text-base font-bold text-rose-600" data-v-eca88f81>${ssrInterpolate(formatCurrency(unref(summary).totalAds))}</p><p class="text-xs text-gray-400 mt-0.5" data-v-eca88f81>GMV Max &amp; campaign</p></div></div><div class="grid grid-cols-1 sm:grid-cols-2 gap-3" data-v-eca88f81><div class="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-4" data-v-eca88f81><div class="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0" data-v-eca88f81><svg class="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" data-v-eca88f81><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" data-v-eca88f81></path></svg></div><div class="min-w-0" data-v-eca88f81><p class="text-xs font-medium text-amber-700" data-v-eca88f81>Menunggu Dikirim</p><p class="text-xl font-bold text-amber-800 leading-tight" data-v-eca88f81>${ssrInterpolate(unref(summary).pendingOrderCount)} order</p><p class="text-xs text-amber-600 truncate" data-v-eca88f81>${ssrInterpolate(formatCurrency(unref(summary).pendingOrderAmount))}</p></div></div><div class="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-4" data-v-eca88f81><div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0" data-v-eca88f81><svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" data-v-eca88f81><path stroke-linecap="round" stroke-linejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" data-v-eca88f81></path></svg></div><div class="min-w-0" data-v-eca88f81><p class="text-xs font-medium text-blue-700" data-v-eca88f81>Dalam Pengiriman</p><p class="text-xl font-bold text-blue-800 leading-tight" data-v-eca88f81>${ssrInterpolate(unref(summary).shippedOrderCount)} order</p><p class="text-xs text-blue-600 truncate" data-v-eca88f81>${ssrInterpolate(formatCurrency(unref(summary).shippedOrderAmount))}</p></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-wrap gap-3 items-end" data-v-eca88f81><div class="flex-1 min-w-[160px]" data-v-eca88f81><label class="block text-xs text-gray-500 mb-1" data-v-eca88f81>Cari</label><input${ssrRenderAttr("value", unref(search))} type="text" placeholder="Ref ID atau keterangan..." class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" data-v-eca88f81></div><div class="min-w-[140px]" data-v-eca88f81><label class="block text-xs text-gray-500 mb-1" data-v-eca88f81>Tipe</label><select class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" data-v-eca88f81><option value="" data-v-eca88f81${ssrIncludeBooleanAttr(Array.isArray(unref(typeFilter)) ? ssrLooseContain(unref(typeFilter), "") : ssrLooseEqual(unref(typeFilter), "")) ? " selected" : ""}>Semua Tipe</option><option value="ORDER" data-v-eca88f81${ssrIncludeBooleanAttr(Array.isArray(unref(typeFilter)) ? ssrLooseContain(unref(typeFilter), "ORDER") : ssrLooseEqual(unref(typeFilter), "ORDER")) ? " selected" : ""}>Order</option><option value="ADS" data-v-eca88f81${ssrIncludeBooleanAttr(Array.isArray(unref(typeFilter)) ? ssrLooseContain(unref(typeFilter), "ADS") : ssrLooseEqual(unref(typeFilter), "ADS")) ? " selected" : ""}>Iklan</option><option value="LOGISTIC" data-v-eca88f81${ssrIncludeBooleanAttr(Array.isArray(unref(typeFilter)) ? ssrLooseContain(unref(typeFilter), "LOGISTIC") : ssrLooseEqual(unref(typeFilter), "LOGISTIC")) ? " selected" : ""}>Logistik</option><option value="WITHDRAW" data-v-eca88f81${ssrIncludeBooleanAttr(Array.isArray(unref(typeFilter)) ? ssrLooseContain(unref(typeFilter), "WITHDRAW") : ssrLooseEqual(unref(typeFilter), "WITHDRAW")) ? " selected" : ""}>Tarik Saldo</option></select></div><div class="min-w-[130px]" data-v-eca88f81><label class="block text-xs text-gray-500 mb-1" data-v-eca88f81>Arus Kas</label><select class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" data-v-eca88f81><option value="" data-v-eca88f81${ssrIncludeBooleanAttr(Array.isArray(unref(cashFlowFilter)) ? ssrLooseContain(unref(cashFlowFilter), "") : ssrLooseEqual(unref(cashFlowFilter), "")) ? " selected" : ""}>Semua</option><option value="IN" data-v-eca88f81${ssrIncludeBooleanAttr(Array.isArray(unref(cashFlowFilter)) ? ssrLooseContain(unref(cashFlowFilter), "IN") : ssrLooseEqual(unref(cashFlowFilter), "IN")) ? " selected" : ""}>Masuk</option><option value="OUT" data-v-eca88f81${ssrIncludeBooleanAttr(Array.isArray(unref(cashFlowFilter)) ? ssrLooseContain(unref(cashFlowFilter), "OUT") : ssrLooseEqual(unref(cashFlowFilter), "OUT")) ? " selected" : ""}>Keluar</option></select></div><div class="min-w-[130px]" data-v-eca88f81><label class="block text-xs text-gray-500 mb-1" data-v-eca88f81>Source</label><input${ssrRenderAttr("value", unref(sourceFilter))} type="text" placeholder="Semua source..." class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" data-v-eca88f81></div><div data-v-eca88f81><label class="block text-xs text-gray-500 mb-1" data-v-eca88f81>Dari</label><input${ssrRenderAttr("value", unref(dateFrom))} type="date" class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" data-v-eca88f81></div><div data-v-eca88f81><label class="block text-xs text-gray-500 mb-1" data-v-eca88f81>Sampai</label><input${ssrRenderAttr("value", unref(dateTo))} type="date" class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" data-v-eca88f81></div>`);
      if (unref(hasFilter)) {
        _push(`<button class="text-xs text-gray-400 hover:text-red-500 px-2 py-2 transition-colors" data-v-eca88f81>Reset</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden" data-v-eca88f81>`);
      if (unref(loading)) {
        _push(`<div class="flex justify-center py-16" data-v-eca88f81><svg class="animate-spin h-7 w-7 text-blue-500" fill="none" viewBox="0 0 24 24" data-v-eca88f81><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-eca88f81></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" data-v-eca88f81></path></svg></div>`);
      } else if (unref(transactions).length === 0) {
        _push(`<div class="py-20 text-center" data-v-eca88f81><p class="text-gray-400 text-sm" data-v-eca88f81>Belum ada transaksi</p></div>`);
      } else {
        _push(`<div class="overflow-x-auto" data-v-eca88f81><table class="w-full text-sm min-w-[800px]" data-v-eca88f81><thead class="bg-gray-50 border-b border-gray-100" data-v-eca88f81><tr class="text-xs text-gray-500" data-v-eca88f81><th class="px-4 py-3 text-left font-medium" data-v-eca88f81>Tanggal</th><th class="px-4 py-3 text-left font-medium" data-v-eca88f81>Tipe</th><th class="px-4 py-3 text-left font-medium" data-v-eca88f81>Arus</th><th class="px-4 py-3 text-left font-medium" data-v-eca88f81>Source</th><th class="px-4 py-3 text-left font-medium" data-v-eca88f81>Ref ID</th><th class="px-4 py-3 text-right font-medium" data-v-eca88f81>Nilai</th><th class="px-4 py-3 text-right font-medium" data-v-eca88f81>Net</th><th class="px-4 py-3 text-left font-medium" data-v-eca88f81>Keterangan</th><th class="px-4 py-3" data-v-eca88f81></th></tr></thead><tbody class="divide-y divide-gray-50" data-v-eca88f81><!--[-->`);
        ssrRenderList(unref(transactions), (tx) => {
          _push(`<tr class="hover:bg-gray-50/50 cursor-pointer" data-v-eca88f81><td class="px-4 py-3 text-gray-600 whitespace-nowrap" data-v-eca88f81>${ssrInterpolate(formatDate(tx.date))}</td><td class="px-4 py-3" data-v-eca88f81><span class="${ssrRenderClass(["text-xs px-2 py-0.5 rounded-full font-medium", TYPE_COLOR[tx.type]])}" data-v-eca88f81>${ssrInterpolate(TYPE_LABEL[tx.type])}</span></td><td class="px-4 py-3" data-v-eca88f81><span class="${ssrRenderClass([
            "text-xs px-2 py-0.5 rounded-full font-medium",
            tx.cashFlow === "IN" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
          ])}" data-v-eca88f81>${ssrInterpolate(tx.cashFlow === "IN" ? "Masuk" : "Keluar")}</span></td><td class="px-4 py-3 text-gray-500 text-xs" data-v-eca88f81>${ssrInterpolate(tx.source || "-")}</td><td class="px-4 py-3 font-mono text-xs max-w-[120px] truncate" data-v-eca88f81>`);
          if (tx.type === "ORDER" && tx.referenceId) {
            _push(`<button class="text-blue-600 hover:text-blue-800 hover:underline font-mono text-xs truncate max-w-full text-left"${ssrRenderAttr("title", tx.referenceId)} data-v-eca88f81>${ssrInterpolate(tx.referenceId)}</button>`);
          } else {
            _push(`<span class="text-gray-500" data-v-eca88f81>${ssrInterpolate(tx.referenceId || "-")}</span>`);
          }
          _push(`</td><td class="px-4 py-3 text-right font-medium text-gray-800" data-v-eca88f81>${ssrInterpolate(formatCurrency(tx.amount))}</td><td class="${ssrRenderClass([tx.cashFlow === "IN" ? "text-green-600" : "text-red-500", "px-4 py-3 text-right font-semibold"])}" data-v-eca88f81>${ssrInterpolate(tx.cashFlow === "OUT" ? "-" : "")}${ssrInterpolate(formatCurrency(tx.netAmount))}</td><td class="px-4 py-3 text-gray-500 max-w-[160px] truncate" data-v-eca88f81>${ssrInterpolate(tx.note || "-")}</td><td class="px-4 py-3" data-v-eca88f81><div class="flex items-center gap-1 justify-end" data-v-eca88f81><button class="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Edit" data-v-eca88f81><svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" data-v-eca88f81><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" data-v-eca88f81></path></svg></button><button class="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Hapus" data-v-eca88f81><svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" data-v-eca88f81><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" data-v-eca88f81></path></svg></button></div></td></tr>`);
        });
        _push(`<!--]--></tbody></table></div>`);
      }
      _push(`</div>`);
      if (unref(totalPages) > 1) {
        _push(`<div class="flex items-center justify-between text-sm text-gray-500" data-v-eca88f81><span data-v-eca88f81>${ssrInterpolate(unref(total))} transaksi ditemukan</span><div class="flex items-center gap-1" data-v-eca88f81><button${ssrIncludeBooleanAttr(unref(page) === 1) ? " disabled" : ""} class="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors" data-v-eca88f81>Prev</button><span class="px-3 py-1.5" data-v-eca88f81>${ssrInterpolate(unref(page))} / ${ssrInterpolate(unref(totalPages))}</span><button${ssrIncludeBooleanAttr(unref(page) >= unref(totalPages)) ? " disabled" : ""} class="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors" data-v-eca88f81>Next</button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(showForm)) {
        _push(ssrRenderComponent(_component_FinanceFormModal, {
          "store-id": unref(storeId),
          edit: unref(editTarget),
          onClose: ($event) => showForm.value = false,
          onSaved: handleSaved
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(showImport)) {
        _push(ssrRenderComponent(_component_FinanceImportModal, {
          "store-id": unref(storeId),
          onClose: ($event) => showImport.value = false,
          onImported: load
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(detailTarget)) {
        _push(ssrRenderComponent(_component_FinanceDetailModal, {
          tx: unref(detailTarget),
          onClose: ($event) => detailTarget.value = null,
          onEdit: (tx) => {
            detailTarget.value = null;
            openEdit(tx);
          }
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(orderSummaryRef)) {
        _push(ssrRenderComponent(_component_OrderSummaryModal, {
          "store-id": unref(storeId),
          "order-number": unref(orderSummaryRef),
          onClose: ($event) => orderSummaryRef.value = null
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_AppModal, {
        "is-open": !!unref(deleteTarget),
        title: "Hapus Transaksi",
        size: "sm",
        onClose: ($event) => deleteTarget.value = null
      }, {
        footer: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex gap-3 justify-end" data-v-eca88f81${_scopeId}><button class="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors" data-v-eca88f81${_scopeId}>Batal</button><button${ssrIncludeBooleanAttr(unref(deleteLoading)) ? " disabled" : ""} class="px-4 py-2 text-sm rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors disabled:opacity-60" data-v-eca88f81${_scopeId}>${ssrInterpolate(unref(deleteLoading) ? "Menghapus..." : "Hapus")}</button></div>`);
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
          if (_push2) {
            _push2(`<p class="text-sm text-gray-600" data-v-eca88f81${_scopeId}> Hapus transaksi <span class="font-semibold" data-v-eca88f81${_scopeId}>${ssrInterpolate(unref(deleteTarget) ? TYPE_LABEL[unref(deleteTarget).type] : "")}</span> senilai <span class="font-semibold text-gray-900" data-v-eca88f81${_scopeId}>${ssrInterpolate(unref(deleteTarget) ? formatCurrency(unref(deleteTarget).netAmount) : "")}</span>? </p>`);
          } else {
            return [
              createVNode("p", { class: "text-sm text-gray-600" }, [
                createTextVNode(" Hapus transaksi "),
                createVNode("span", { class: "font-semibold" }, toDisplayString(unref(deleteTarget) ? TYPE_LABEL[unref(deleteTarget).type] : ""), 1),
                createTextVNode(" senilai "),
                createVNode("span", { class: "font-semibold text-gray-900" }, toDisplayString(unref(deleteTarget) ? formatCurrency(unref(deleteTarget).netAmount) : ""), 1),
                createTextVNode("? ")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(toast)) {
        _push(`<div class="${ssrRenderClass([unref(toast).type === "success" ? "bg-green-600" : "bg-red-600", "fixed bottom-6 left-1/2 -translate-x-1/2 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-lg z-50"])}" data-v-eca88f81>${ssrInterpolate(unref(toast).message)}</div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/store/finance/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-eca88f81"]]);

export { index as default };
//# sourceMappingURL=index-BGs5ueBA.mjs.map
