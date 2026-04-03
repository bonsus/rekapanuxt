import { u as useAuthStore } from './auth-BWjTzQkA.mjs';
import { u as useApi } from './useApi-0aCYoCTI.mjs';
import { ref } from 'vue';
import { n as navigateTo } from './server.mjs';

function useAuth() {
  const authStore = useAuthStore();
  const { fetchWithAuth } = useApi();
  const isLoading = ref(false);
  const error = ref(null);
  async function login(credentials) {
    var _a, _b, _c;
    isLoading.value = true;
    error.value = null;
    try {
      const res = await $fetch("/api/auth/login", {
        method: "POST",
        body: credentials
      });
      if (res.success) {
        authStore.setAuth(res.data.user, res.data.accessToken);
        return { success: true, user: res.data.user };
      }
      return { success: false, error: "Login failed" };
    } catch (err) {
      const e = err;
      const msg = (_c = (_b = (_a = e.data) == null ? void 0 : _a.message) != null ? _b : e.message) != null ? _c : "Login failed";
      error.value = msg;
      return { success: false, error: msg };
    } finally {
      isLoading.value = false;
    }
  }
  async function logout() {
    try {
      await $fetch("/api/auth/logout", { method: "POST" });
    } catch {
    } finally {
      authStore.clearAuth();
      await navigateTo("/login");
    }
  }
  async function logoutAdmin() {
    try {
      await $fetch("/api/auth/logout", { method: "POST" });
    } catch {
    } finally {
      authStore.clearAuth();
      await navigateTo("/admin/login");
    }
  }
  async function fetchMe() {
    try {
      const res = await fetchWithAuth(
        "/api/auth/me"
      );
      if (res.success) {
        authStore.setUser(res.data.user);
        return res.data.user;
      }
      return null;
    } catch {
      authStore.clearAuth();
      return null;
    }
  }
  return {
    isLoading,
    error,
    login,
    logout,
    logoutAdmin,
    fetchMe
  };
}

export { useAuth as u };
//# sourceMappingURL=useAuth-D6UPIiIl.mjs.map
