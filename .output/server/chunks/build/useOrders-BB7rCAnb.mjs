import { u as useApi } from './useApi-0aCYoCTI.mjs';
import { ref } from 'vue';

function useOrders() {
  const { fetchWithAuth } = useApi();
  const loading = ref(false);
  const error = ref(null);
  async function getOrders(filters) {
    var _a, _b;
    loading.value = true;
    error.value = null;
    try {
      const params = { storeId: filters.storeId };
      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;
      if (filters.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters.dateTo) params.dateTo = filters.dateTo;
      if (filters.page) params.page = filters.page;
      if (filters.limit) params.limit = filters.limit;
      return await fetchWithAuth(
        "/api/orders",
        { params }
      );
    } catch (e) {
      error.value = (_b = (_a = e == null ? void 0 : e.data) == null ? void 0 : _a.message) != null ? _b : "Failed to load orders";
      return null;
    } finally {
      loading.value = false;
    }
  }
  async function getOrder(id) {
    var _a, _b;
    loading.value = true;
    error.value = null;
    try {
      const res = await fetchWithAuth(`/api/orders/${id}`);
      return res.data;
    } catch (e) {
      error.value = (_b = (_a = e == null ? void 0 : e.data) == null ? void 0 : _a.message) != null ? _b : "Failed to load order";
      throw e;
    } finally {
      loading.value = false;
    }
  }
  async function createOrder(payload) {
    var _a, _b;
    loading.value = true;
    error.value = null;
    try {
      const res = await fetchWithAuth("/api/orders", {
        method: "POST",
        body: payload
      });
      return res.data;
    } catch (e) {
      error.value = (_b = (_a = e == null ? void 0 : e.data) == null ? void 0 : _a.message) != null ? _b : "Failed to create order";
      throw e;
    } finally {
      loading.value = false;
    }
  }
  async function updateOrder(id, payload) {
    var _a, _b;
    loading.value = true;
    error.value = null;
    try {
      const res = await fetchWithAuth(`/api/orders/${id}`, {
        method: "PUT",
        body: payload
      });
      return res.data;
    } catch (e) {
      error.value = (_b = (_a = e == null ? void 0 : e.data) == null ? void 0 : _a.message) != null ? _b : "Failed to update order";
      throw e;
    } finally {
      loading.value = false;
    }
  }
  async function deleteOrder(id) {
    var _a, _b;
    loading.value = true;
    error.value = null;
    try {
      await fetchWithAuth(`/api/orders/${id}`, { method: "DELETE" });
    } catch (e) {
      error.value = (_b = (_a = e == null ? void 0 : e.data) == null ? void 0 : _a.message) != null ? _b : "Failed to delete order";
      throw e;
    } finally {
      loading.value = false;
    }
  }
  async function searchSkus(storeId, q) {
    var _a;
    try {
      const res = await fetchWithAuth(
        "/api/orders/sku-search",
        { params: { storeId, q } }
      );
      return (_a = res.data) != null ? _a : [];
    } catch {
      return [];
    }
  }
  return { loading, error, getOrders, getOrder, createOrder, updateOrder, deleteOrder, searchSkus };
}

export { useOrders as u };
//# sourceMappingURL=useOrders-BB7rCAnb.mjs.map
