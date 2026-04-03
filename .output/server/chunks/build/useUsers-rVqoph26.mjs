import { u as useApi } from './useApi-0aCYoCTI.mjs';
import { ref } from 'vue';

function useUsers() {
  const { fetchWithAuth } = useApi();
  const isLoading = ref(false);
  const error = ref(null);
  async function getUsers(filters = {}) {
    var _a, _b, _c;
    isLoading.value = true;
    error.value = null;
    try {
      const params = {};
      if (filters.page) params.page = filters.page;
      if (filters.limit) params.limit = filters.limit;
      if (filters.search) params.search = filters.search;
      if (filters.role) params.role = filters.role;
      if (filters.status) params.status = filters.status;
      return await fetchWithAuth("/api/admin/users", {
        params
      });
    } catch (err) {
      const e = err;
      error.value = (_c = (_b = (_a = e.data) == null ? void 0 : _a.message) != null ? _b : e.message) != null ? _c : "Failed to fetch users";
      return null;
    } finally {
      isLoading.value = false;
    }
  }
  async function createUser(payload) {
    var _a, _b, _c;
    isLoading.value = true;
    error.value = null;
    try {
      return await fetchWithAuth("/api/admin/users", {
        method: "POST",
        body: payload
      });
    } catch (err) {
      const e = err;
      error.value = (_c = (_b = (_a = e.data) == null ? void 0 : _a.message) != null ? _b : e.message) != null ? _c : "Failed to create user";
      return null;
    } finally {
      isLoading.value = false;
    }
  }
  async function updateUser(id, payload) {
    var _a, _b, _c;
    isLoading.value = true;
    error.value = null;
    try {
      return await fetchWithAuth(`/api/admin/users/${id}`, {
        method: "PUT",
        body: payload
      });
    } catch (err) {
      const e = err;
      error.value = (_c = (_b = (_a = e.data) == null ? void 0 : _a.message) != null ? _b : e.message) != null ? _c : "Failed to update user";
      return null;
    } finally {
      isLoading.value = false;
    }
  }
  async function deleteUser(id) {
    var _a, _b, _c;
    isLoading.value = true;
    error.value = null;
    try {
      return await fetchWithAuth(`/api/admin/users/${id}`, {
        method: "DELETE"
      });
    } catch (err) {
      const e = err;
      error.value = (_c = (_b = (_a = e.data) == null ? void 0 : _a.message) != null ? _b : e.message) != null ? _c : "Failed to delete user";
      return null;
    } finally {
      isLoading.value = false;
    }
  }
  return {
    isLoading,
    error,
    getUsers,
    createUser,
    updateUser,
    deleteUser
  };
}

export { useUsers as u };
//# sourceMappingURL=useUsers-rVqoph26.mjs.map
