import { _ as _sfc_main$4 } from './AppBadge-B-HdCKTa.mjs';
import { defineComponent, ref, watch, mergeProps, unref, withCtx, createVNode, openBlock, createBlock, createTextVNode, toDisplayString, computed, reactive, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderComponent, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { _ as __nuxt_component_2 } from './AppModal-D_J5cd1L.mjs';
import { _ as _sfc_main$5 } from './AppInput-BzBRQFXN.mjs';
import { _ as _sfc_main$6 } from './AppButton-DxMiFqDS.mjs';
import { u as useUsers } from './useUsers-rVqoph26.mjs';
import { _ as _export_sfc } from './server.mjs';
import './useApi-0aCYoCTI.mjs';
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

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "UserTable",
  __ssrInlineRender: true,
  props: {
    users: {},
    loading: { type: Boolean }
  },
  emits: ["edit", "delete"],
  setup(__props, { emit: __emit }) {
    function formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    }
    function formatDateTime(dateStr) {
      if (!dateStr) return "\u2014";
      return new Date(dateStr).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    }
    function isExpired(expiredAt) {
      if (!expiredAt) return false;
      return new Date(expiredAt) < /* @__PURE__ */ new Date();
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AppBadge = _sfc_main$4;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "overflow-hidden rounded-xl border border-gray-200" }, _attrs))}><div class="overflow-x-auto"><table class="min-w-full divide-y divide-gray-200"><thead class="bg-gray-50"><tr><th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"> User </th><th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"> Email </th><th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"> Role </th><th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"> Status </th><th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"> Expired At </th><th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"> Joined </th><th class="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"> Actions </th></tr></thead><tbody class="bg-white divide-y divide-gray-100">`);
      if (__props.loading) {
        _push(`<!--[-->`);
        ssrRenderList(5, (i) => {
          _push(`<tr><td class="px-6 py-4"><div class="h-4 bg-gray-100 rounded animate-pulse w-36"></div></td><td class="px-6 py-4"><div class="h-4 bg-gray-100 rounded animate-pulse w-48"></div></td><td class="px-6 py-4"><div class="h-5 bg-gray-100 rounded-full animate-pulse w-16"></div></td><td class="px-6 py-4"><div class="h-5 bg-gray-100 rounded-full animate-pulse w-16"></div></td><td class="px-6 py-4"><div class="h-4 bg-gray-100 rounded animate-pulse w-32"></div></td><td class="px-6 py-4"><div class="h-4 bg-gray-100 rounded animate-pulse w-28"></div></td><td class="px-6 py-4"></td></tr>`);
        });
        _push(`<!--]-->`);
      } else if (__props.users.length === 0) {
        _push(`<tr><td colspan="7" class="px-6 py-16 text-center"><svg class="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg><p class="text-sm font-medium text-gray-500">No users found</p><p class="text-xs text-gray-400 mt-1">Try adjusting your search or filters</p></td></tr>`);
      } else {
        _push(`<!--[-->`);
        ssrRenderList(__props.users, (user) => {
          _push(`<tr class="hover:bg-gray-50 transition-colors"><td class="px-6 py-4 whitespace-nowrap"><div class="flex items-center gap-3"><div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">${ssrInterpolate(user.name.charAt(0).toUpperCase())}</div><span class="text-sm font-medium text-gray-900">${ssrInterpolate(user.name)}</span></div></td><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${ssrInterpolate(user.email)}</td><td class="px-6 py-4 whitespace-nowrap">`);
          _push(ssrRenderComponent(_component_AppBadge, {
            variant: user.role === "ADMIN" ? "purple" : "info"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(user.role)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(user.role), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</td> <td class="px-6 py-4 whitespace-nowrap">`);
          _push(ssrRenderComponent(_component_AppBadge, {
            variant: user.status === "ACTIVE" ? "success" : "warning"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(user.status === "ACTIVE" ? "Active" : "Inactive")}`);
              } else {
                return [
                  createTextVNode(toDisplayString(user.status === "ACTIVE" ? "Active" : "Inactive"), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</td><td class="${ssrRenderClass([isExpired(user.expiredAt) ? "text-red-500 font-medium" : "text-gray-500", "px-6 py-4 whitespace-nowrap text-sm"])}">${ssrInterpolate(formatDateTime(user.expiredAt))}</td> <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${ssrInterpolate(formatDate(user.createdAt))}</td><td class="px-6 py-4 whitespace-nowrap text-right"><div class="flex items-center justify-end gap-2"><button class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit user"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button><button class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete user"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button></div></td></tr>`);
        });
        _push(`<!--]-->`);
      }
      _push(`</tbody></table></div></div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/user/UserTable.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "AppPagination",
  __ssrInlineRender: true,
  props: {
    currentPage: {},
    totalPages: {},
    total: {},
    limit: {}
  },
  emits: ["change"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const from = computed(() => (props.currentPage - 1) * props.limit + 1);
    const to = computed(() => Math.min(props.currentPage * props.limit, props.total));
    const pageNumbers = computed(() => {
      const pages = [];
      const { totalPages, currentPage } = props;
      if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
        return pages;
      }
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
      return pages;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col sm:flex-row items-center justify-between gap-4 py-3" }, _attrs))}><p class="text-sm text-gray-600"> Showing <span class="font-medium">${ssrInterpolate(unref(from))}</span> \u2013 <span class="font-medium">${ssrInterpolate(unref(to))}</span> of <span class="font-medium">${ssrInterpolate(__props.total)}</span> results </p>`);
      if (__props.totalPages > 1) {
        _push(`<div class="flex items-center gap-1"><button${ssrIncludeBooleanAttr(__props.currentPage === 1) ? " disabled" : ""} class="px-2.5 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"> \u2190 </button><!--[-->`);
        ssrRenderList(unref(pageNumbers), (p) => {
          _push(`<!--[-->`);
          if (p === "...") {
            _push(`<span class="px-2 text-gray-400 text-sm">\u2026</span>`);
          } else {
            _push(`<button class="${ssrRenderClass([
              p === __props.currentPage ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-700 hover:bg-gray-50",
              "w-8 h-8 text-sm rounded-lg border transition-colors"
            ])}">${ssrInterpolate(p)}</button>`);
          }
          _push(`<!--]-->`);
        });
        _push(`<!--]--><button${ssrIncludeBooleanAttr(__props.currentPage === __props.totalPages) ? " disabled" : ""} class="px-2.5 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"> \u2192 </button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/AppPagination.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "UserForm",
  __ssrInlineRender: true,
  props: {
    mode: {},
    initialData: {},
    loading: { type: Boolean },
    error: {}
  },
  emits: ["submit", "cancel"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const form = reactive({
      name: "",
      email: "",
      password: "",
      role: "USER",
      status: "ACTIVE",
      expiredAt: ""
    });
    const formErrors = reactive({
      name: "",
      email: "",
      password: "",
      role: ""
    });
    watch(
      () => props.initialData,
      (user) => {
        if (user) {
          form.name = user.name;
          form.email = user.email;
          form.password = "";
          form.role = user.role;
          form.status = user.status;
          form.expiredAt = user.expiredAt ? user.expiredAt.slice(0, 16) : "";
        }
      },
      { immediate: true }
    );
    function reset() {
      form.name = "";
      form.email = "";
      form.password = "";
      form.role = "USER";
      form.status = "ACTIVE";
      form.expiredAt = "";
      formErrors.name = "";
      formErrors.email = "";
      formErrors.password = "";
      formErrors.role = "";
    }
    __expose({ reset });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AppInput = _sfc_main$5;
      const _component_AppButton = _sfc_main$6;
      _push(`<form${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}>`);
      if (__props.error) {
        _push(`<div class="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg"><svg class="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg><p class="text-sm text-red-700">${ssrInterpolate(__props.error)}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_AppInput, {
        modelValue: unref(form).name,
        "onUpdate:modelValue": ($event) => unref(form).name = $event,
        label: "Full Name",
        placeholder: "John Doe",
        required: "",
        error: unref(formErrors).name
      }, null, _parent));
      _push(ssrRenderComponent(_component_AppInput, {
        modelValue: unref(form).email,
        "onUpdate:modelValue": ($event) => unref(form).email = $event,
        label: "Email Address",
        type: "email",
        placeholder: "john@example.com",
        required: "",
        error: unref(formErrors).email
      }, null, _parent));
      _push(ssrRenderComponent(_component_AppInput, {
        modelValue: unref(form).password,
        "onUpdate:modelValue": ($event) => unref(form).password = $event,
        label: "Password",
        type: "password",
        placeholder: __props.mode === "edit" ? "Leave blank to keep current password" : "Min. 8 characters",
        required: __props.mode === "create",
        error: unref(formErrors).password,
        hint: __props.mode === "edit" ? "Leave blank to keep the current password" : void 0
      }, null, _parent));
      _push(`<div><label class="label"> Role <span class="text-red-500">*</span></label><select class="${ssrRenderClass([{ "input-error": !!unref(formErrors).role }, "input"])}"><option value="USER"${ssrIncludeBooleanAttr(Array.isArray(unref(form).role) ? ssrLooseContain(unref(form).role, "USER") : ssrLooseEqual(unref(form).role, "USER")) ? " selected" : ""}>User</option><option value="ADMIN"${ssrIncludeBooleanAttr(Array.isArray(unref(form).role) ? ssrLooseContain(unref(form).role, "ADMIN") : ssrLooseEqual(unref(form).role, "ADMIN")) ? " selected" : ""}>Admin</option></select>`);
      if (unref(formErrors).role) {
        _push(`<p class="mt-1 text-xs text-red-500">${ssrInterpolate(unref(formErrors).role)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label class="label"> Status <span class="text-red-500">*</span></label><select class="input"><option value="ACTIVE"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "ACTIVE") : ssrLooseEqual(unref(form).status, "ACTIVE")) ? " selected" : ""}>Active</option><option value="INACTIVE"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "INACTIVE") : ssrLooseEqual(unref(form).status, "INACTIVE")) ? " selected" : ""}>Inactive</option></select></div><div><label class="label">Expired At</label><input${ssrRenderAttr("value", unref(form).expiredAt)} type="datetime-local" class="input"><p class="mt-1 text-xs text-gray-400">Leave empty for no expiry</p></div><div class="flex justify-end gap-3 pt-2">`);
      _push(ssrRenderComponent(_component_AppButton, {
        variant: "secondary",
        type: "button",
        onClick: ($event) => emit("cancel")
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
      _push(ssrRenderComponent(_component_AppButton, {
        type: "submit",
        loading: __props.loading
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.mode === "create" ? "Create User" : "Save Changes")}`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.mode === "create" ? "Create User" : "Save Changes"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></form>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/user/UserForm.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { getUsers, createUser, updateUser, deleteUser, isLoading, error } = useUsers();
    const users = ref([]);
    const pagination = ref({ page: 1, limit: 10, total: 0, totalPages: 1 });
    const search = ref("");
    const roleFilter = ref("");
    const statusFilter = ref("");
    const limitFilter = ref(10);
    const currentPage = ref(1);
    const showCreateModal = ref(false);
    const showEditModal = ref(false);
    const showDeleteModal = ref(false);
    const selectedUser = ref(null);
    const formRef = ref();
    const formError = ref("");
    const deleteLoading = ref(false);
    const successMsg = ref("");
    const loadError = ref("");
    async function loadUsers() {
      loadError.value = "";
      const res = await getUsers({
        page: currentPage.value,
        limit: limitFilter.value,
        search: search.value || void 0,
        role: roleFilter.value || void 0,
        status: statusFilter.value || void 0
      });
      if (res) {
        users.value = res.data;
        pagination.value = res.pagination;
      } else if (error.value) {
        loadError.value = error.value;
      }
    }
    let searchTimer;
    watch(search, () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        currentPage.value = 1;
        loadUsers();
      }, 350);
    });
    watch(roleFilter, () => {
      currentPage.value = 1;
      loadUsers();
    });
    watch(statusFilter, () => {
      currentPage.value = 1;
      loadUsers();
    });
    watch(limitFilter, () => {
      currentPage.value = 1;
      loadUsers();
    });
    function changePage(page) {
      currentPage.value = page;
      loadUsers();
    }
    function openEdit(user) {
      selectedUser.value = { ...user };
      formError.value = "";
      showEditModal.value = true;
    }
    function openDelete(user) {
      selectedUser.value = user;
      showDeleteModal.value = true;
    }
    function closeCreate() {
      showCreateModal.value = false;
      formError.value = "";
    }
    function closeEdit() {
      showEditModal.value = false;
      formError.value = "";
      selectedUser.value = null;
    }
    function closeDelete() {
      showDeleteModal.value = false;
      selectedUser.value = null;
    }
    async function handleCreate(payload) {
      var _a;
      formError.value = "";
      const res = await createUser(payload);
      if (res == null ? void 0 : res.success) {
        closeCreate();
        successMsg.value = "User created successfully!";
        await loadUsers();
        setTimeout(() => successMsg.value = "", 4e3);
      } else {
        formError.value = (_a = error.value) != null ? _a : "Failed to create user";
      }
    }
    async function handleEdit(payload) {
      var _a;
      if (!selectedUser.value) return;
      formError.value = "";
      const res = await updateUser(selectedUser.value.id, payload);
      if (res == null ? void 0 : res.success) {
        closeEdit();
        successMsg.value = "User updated successfully!";
        await loadUsers();
        setTimeout(() => successMsg.value = "", 4e3);
      } else {
        formError.value = (_a = error.value) != null ? _a : "Failed to update user";
      }
    }
    async function handleDelete() {
      if (!selectedUser.value) return;
      deleteLoading.value = true;
      const res = await deleteUser(selectedUser.value.id);
      deleteLoading.value = false;
      if (res == null ? void 0 : res.success) {
        closeDelete();
        successMsg.value = "User deleted successfully!";
        await loadUsers();
        setTimeout(() => successMsg.value = "", 4e3);
      } else if (error.value) {
        loadError.value = error.value;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UserTable = _sfc_main$3;
      const _component_AppPagination = _sfc_main$2;
      const _component_AppModal = __nuxt_component_2;
      const _component_UserForm = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-5" }, _attrs))} data-v-8a8550c6><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4" data-v-8a8550c6><div data-v-8a8550c6><h2 class="text-2xl font-bold text-gray-800" data-v-8a8550c6>User Management</h2><p class="text-sm text-gray-500 mt-0.5" data-v-8a8550c6>${ssrInterpolate(unref(pagination).total)} total user${ssrInterpolate(unref(pagination).total !== 1 ? "s" : "")}</p></div><button class="btn-primary" data-v-8a8550c6><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-8a8550c6><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" data-v-8a8550c6></path></svg> New User </button></div>`);
      if (unref(successMsg)) {
        _push(`<div class="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl" data-v-8a8550c6><svg class="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20" data-v-8a8550c6><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" data-v-8a8550c6></path></svg><p class="text-sm font-medium text-green-700" data-v-8a8550c6>${ssrInterpolate(unref(successMsg))}</p><button class="ml-auto text-green-400 hover:text-green-600" data-v-8a8550c6>\u2715</button></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(loadError)) {
        _push(`<div class="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl" data-v-8a8550c6><svg class="w-4 h-4 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20" data-v-8a8550c6><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" data-v-8a8550c6></path></svg><p class="text-sm font-medium text-red-700" data-v-8a8550c6>${ssrInterpolate(unref(loadError))}</p><button class="ml-auto text-red-400 hover:text-red-600" data-v-8a8550c6>\u2715</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="card p-4" data-v-8a8550c6><div class="flex flex-col sm:flex-row gap-3" data-v-8a8550c6><div class="relative flex-1" data-v-8a8550c6><svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-8a8550c6><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-v-8a8550c6></path></svg><input${ssrRenderAttr("value", unref(search))} type="text" placeholder="Search by name or email\u2026" class="input pl-9" data-v-8a8550c6></div><select class="input sm:w-40" data-v-8a8550c6><option value="" data-v-8a8550c6${ssrIncludeBooleanAttr(Array.isArray(unref(roleFilter)) ? ssrLooseContain(unref(roleFilter), "") : ssrLooseEqual(unref(roleFilter), "")) ? " selected" : ""}>All roles</option><option value="ADMIN" data-v-8a8550c6${ssrIncludeBooleanAttr(Array.isArray(unref(roleFilter)) ? ssrLooseContain(unref(roleFilter), "ADMIN") : ssrLooseEqual(unref(roleFilter), "ADMIN")) ? " selected" : ""}>Admin</option><option value="USER" data-v-8a8550c6${ssrIncludeBooleanAttr(Array.isArray(unref(roleFilter)) ? ssrLooseContain(unref(roleFilter), "USER") : ssrLooseEqual(unref(roleFilter), "USER")) ? " selected" : ""}>User</option></select><select class="input sm:w-40" data-v-8a8550c6><option value="" data-v-8a8550c6${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "") : ssrLooseEqual(unref(statusFilter), "")) ? " selected" : ""}>All status</option><option value="ACTIVE" data-v-8a8550c6${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "ACTIVE") : ssrLooseEqual(unref(statusFilter), "ACTIVE")) ? " selected" : ""}>Active</option><option value="INACTIVE" data-v-8a8550c6${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "INACTIVE") : ssrLooseEqual(unref(statusFilter), "INACTIVE")) ? " selected" : ""}>Inactive</option></select><select class="input sm:w-36" data-v-8a8550c6><option${ssrRenderAttr("value", 10)} data-v-8a8550c6${ssrIncludeBooleanAttr(Array.isArray(unref(limitFilter)) ? ssrLooseContain(unref(limitFilter), 10) : ssrLooseEqual(unref(limitFilter), 10)) ? " selected" : ""}>10 per page</option><option${ssrRenderAttr("value", 25)} data-v-8a8550c6${ssrIncludeBooleanAttr(Array.isArray(unref(limitFilter)) ? ssrLooseContain(unref(limitFilter), 25) : ssrLooseEqual(unref(limitFilter), 25)) ? " selected" : ""}>25 per page</option><option${ssrRenderAttr("value", 50)} data-v-8a8550c6${ssrIncludeBooleanAttr(Array.isArray(unref(limitFilter)) ? ssrLooseContain(unref(limitFilter), 50) : ssrLooseEqual(unref(limitFilter), 50)) ? " selected" : ""}>50 per page</option></select></div></div>`);
      _push(ssrRenderComponent(_component_UserTable, {
        users: unref(users),
        loading: unref(isLoading),
        onEdit: openEdit,
        onDelete: openDelete
      }, null, _parent));
      if (unref(pagination).total > 0) {
        _push(ssrRenderComponent(_component_AppPagination, {
          "current-page": unref(pagination).page,
          "total-pages": unref(pagination).totalPages,
          total: unref(pagination).total,
          limit: unref(pagination).limit,
          onChange: changePage
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_AppModal, {
        "is-open": unref(showCreateModal),
        title: "Create New User",
        onClose: closeCreate
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UserForm, {
              ref_key: "formRef",
              ref: formRef,
              mode: "create",
              loading: unref(isLoading),
              error: unref(formError),
              onSubmit: handleCreate,
              onCancel: closeCreate
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UserForm, {
                ref_key: "formRef",
                ref: formRef,
                mode: "create",
                loading: unref(isLoading),
                error: unref(formError),
                onSubmit: handleCreate,
                onCancel: closeCreate
              }, null, 8, ["loading", "error"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_AppModal, {
        "is-open": unref(showEditModal),
        title: "Edit User",
        onClose: closeEdit
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b;
          if (_push2) {
            _push2(ssrRenderComponent(_component_UserForm, {
              mode: "edit",
              "initial-data": (_a = unref(selectedUser)) != null ? _a : void 0,
              loading: unref(isLoading),
              error: unref(formError),
              onSubmit: handleEdit,
              onCancel: closeEdit
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UserForm, {
                mode: "edit",
                "initial-data": (_b = unref(selectedUser)) != null ? _b : void 0,
                loading: unref(isLoading),
                error: unref(formError),
                onSubmit: handleEdit,
                onCancel: closeEdit
              }, null, 8, ["initial-data", "loading", "error"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_AppModal, {
        "is-open": unref(showDeleteModal),
        title: "Delete User",
        size: "sm",
        onClose: closeDelete
      }, {
        footer: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<button class="btn-secondary" data-v-8a8550c6${_scopeId}>Cancel</button><button class="btn-danger"${ssrIncludeBooleanAttr(unref(deleteLoading)) ? " disabled" : ""} data-v-8a8550c6${_scopeId}>`);
            if (unref(deleteLoading)) {
              _push2(`<span data-v-8a8550c6${_scopeId}>Deleting\u2026</span>`);
            } else {
              _push2(`<span data-v-8a8550c6${_scopeId}>Delete</span>`);
            }
            _push2(`</button>`);
          } else {
            return [
              createVNode("button", {
                class: "btn-secondary",
                onClick: closeDelete
              }, "Cancel"),
              createVNode("button", {
                class: "btn-danger",
                disabled: unref(deleteLoading),
                onClick: handleDelete
              }, [
                unref(deleteLoading) ? (openBlock(), createBlock("span", { key: 0 }, "Deleting\u2026")) : (openBlock(), createBlock("span", { key: 1 }, "Delete"))
              ], 8, ["disabled"])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b;
          if (_push2) {
            _push2(`<div class="text-center py-2" data-v-8a8550c6${_scopeId}><div class="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4" data-v-8a8550c6${_scopeId}><svg class="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-8a8550c6${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" data-v-8a8550c6${_scopeId}></path></svg></div><h4 class="text-base font-semibold text-gray-800" data-v-8a8550c6${_scopeId}>Delete user?</h4><p class="text-sm text-gray-500 mt-1" data-v-8a8550c6${_scopeId}> Are you sure you want to delete <span class="font-semibold text-gray-700" data-v-8a8550c6${_scopeId}>${ssrInterpolate((_a = unref(selectedUser)) == null ? void 0 : _a.name)}</span>? This action cannot be undone. </p></div>`);
          } else {
            return [
              createVNode("div", { class: "text-center py-2" }, [
                createVNode("div", { class: "w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4" }, [
                  (openBlock(), createBlock("svg", {
                    class: "w-7 h-7 text-red-500",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    })
                  ]))
                ]),
                createVNode("h4", { class: "text-base font-semibold text-gray-800" }, "Delete user?"),
                createVNode("p", { class: "text-sm text-gray-500 mt-1" }, [
                  createTextVNode(" Are you sure you want to delete "),
                  createVNode("span", { class: "font-semibold text-gray-700" }, toDisplayString((_b = unref(selectedUser)) == null ? void 0 : _b.name), 1),
                  createTextVNode("? This action cannot be undone. ")
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/users/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8a8550c6"]]);

export { index as default };
//# sourceMappingURL=index-CJHANV2i.mjs.map
