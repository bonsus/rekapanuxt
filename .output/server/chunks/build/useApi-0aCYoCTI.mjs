import { u as useAuthStore } from './auth-BWjTzQkA.mjs';

let activeRefresh = null;
function useApi() {
  const authStore = useAuthStore();
  async function refreshAccessToken() {
    if (activeRefresh) return activeRefresh;
    activeRefresh = (async () => {
      try {
        const res = await $fetch("/api/auth/refresh", { method: "POST" });
        if (res.success) {
          authStore.setToken(res.data.accessToken);
          return res.data.accessToken;
        }
        return null;
      } catch {
        authStore.clearAuth();
        return null;
      } finally {
        activeRefresh = null;
      }
    })();
    return activeRefresh;
  }
  async function fetchWithAuth(url, options = {}) {
    var _a, _b, _c;
    const headers = {};
    if (authStore.accessToken) {
      headers["Authorization"] = `Bearer ${authStore.accessToken}`;
    }
    try {
      return await $fetch(url, {
        method: (_a = options.method) != null ? _a : "GET",
        body: options.body,
        params: options.params,
        headers
      });
    } catch (err) {
      const error = err;
      const status = (_b = error.statusCode) != null ? _b : error.status;
      if (status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          return await $fetch(url, {
            method: (_c = options.method) != null ? _c : "GET",
            body: options.body,
            params: options.params,
            headers: { ...headers, Authorization: `Bearer ${newToken}` }
          });
        }
      }
      throw err;
    }
  }
  async function downloadWithAuth(url, filename, params) {
    const headers = {};
    if (authStore.accessToken) {
      headers["Authorization"] = `Bearer ${authStore.accessToken}`;
    }
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    let response = await fetch(url + qs, { headers });
    if (response.status === 401) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        response = await fetch(url + qs, {
          headers: { ...headers, Authorization: `Bearer ${newToken}` }
        });
      } else {
        return;
      }
    }
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(text || `Download failed (${response.status})`);
    }
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = (void 0).createElement("a");
    a.href = blobUrl;
    a.download = filename;
    (void 0).body.appendChild(a);
    a.click();
    (void 0).body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  }
  return { fetchWithAuth, downloadWithAuth };
}

export { useApi as u };
//# sourceMappingURL=useApi-0aCYoCTI.mjs.map
