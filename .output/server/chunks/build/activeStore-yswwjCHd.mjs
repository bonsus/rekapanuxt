import { defineStore } from 'pinia';
import { ref } from 'vue';

const useActiveStoreStore = defineStore("activeStore", () => {
  const store = ref(null);
  function setStore(s) {
    store.value = s;
  }
  function clearStore() {
    store.value = null;
  }
  function loadFromStorage() {
    return false;
  }
  return { store, setStore, clearStore, loadFromStorage };
});

export { useActiveStoreStore as u };
//# sourceMappingURL=activeStore-yswwjCHd.mjs.map
