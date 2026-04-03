import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const accessToken = ref(null);
  const isAuthenticated = computed(() => !!accessToken.value && !!user.value);
  const isAdmin = computed(() => {
    var _a;
    return ((_a = user.value) == null ? void 0 : _a.role) === "ADMIN";
  });
  const isUser = computed(() => {
    var _a;
    return ((_a = user.value) == null ? void 0 : _a.role) === "USER";
  });
  function setAuth(newUser, token) {
    user.value = newUser;
    accessToken.value = token;
  }
  function setToken(token) {
    accessToken.value = token;
  }
  function setUser(newUser) {
    user.value = newUser;
  }
  function clearAuth() {
    user.value = null;
    accessToken.value = null;
  }
  function loadFromStorage() {
    return false;
  }
  return {
    user,
    accessToken,
    isAuthenticated,
    isAdmin,
    isUser,
    setAuth,
    setToken,
    setUser,
    clearAuth,
    loadFromStorage
  };
});

export { useAuthStore as u };
//# sourceMappingURL=auth-BWjTzQkA.mjs.map
