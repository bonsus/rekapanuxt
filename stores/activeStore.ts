import { defineStore } from 'pinia'
import type { Store } from '~/types'

export const useActiveStoreStore = defineStore('activeStore', () => {
  const store = ref<Store | null>(null)

  function setStore(s: Store) {
    store.value = s
    if (import.meta.client) {
      localStorage.setItem('active_store', JSON.stringify(s))
    }
  }

  function clearStore() {
    store.value = null
    if (import.meta.client) {
      localStorage.removeItem('active_store')
    }
  }

  function loadFromStorage() {
    if (!import.meta.client) return false
    const raw = localStorage.getItem('active_store')
    if (raw) {
      try {
        store.value = JSON.parse(raw) as Store
        return true
      } catch {
        clearStore()
        return false
      }
    }
    return false
  }

  return { store, setStore, clearStore, loadFromStorage }
})
