import type {
  Store,
  StoreFilters,
  CreateStorePayload,
  UpdateStorePayload,
  PaginatedApiResponse,
  ApiResponse,
} from '~/types'

export function useStores() {
  const { fetchWithAuth } = useApi()

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function getStores(filters: StoreFilters = {}) {
    isLoading.value = true
    error.value = null

    try {
      const params: Record<string, unknown> = {}
      if (filters.page) params.page = filters.page
      if (filters.limit) params.limit = filters.limit
      if (filters.search) params.search = filters.search
      if (filters.type) params.type = filters.type

      return await fetchWithAuth<PaginatedApiResponse<Store>>('/api/stores', { params })
    } catch (err: unknown) {
      const e = err as { data?: { message?: string }; message?: string }
      error.value = e.data?.message ?? e.message ?? 'Failed to fetch stores'
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function getStore(id: string) {
    isLoading.value = true
    error.value = null

    try {
      return await fetchWithAuth<ApiResponse<Store>>(`/api/stores/${id}`)
    } catch (err: unknown) {
      const e = err as { data?: { message?: string }; message?: string }
      error.value = e.data?.message ?? e.message ?? 'Failed to fetch store'
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function createStore(payload: CreateStorePayload) {
    isLoading.value = true
    error.value = null

    try {
      return await fetchWithAuth<ApiResponse<Store>>('/api/stores', {
        method: 'POST',
        body: payload as unknown as Record<string, unknown>,
      })
    } catch (err: unknown) {
      const e = err as { data?: { message?: string }; message?: string }
      error.value = e.data?.message ?? e.message ?? 'Failed to create store'
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function updateStore(id: string, payload: UpdateStorePayload) {
    isLoading.value = true
    error.value = null

    try {
      return await fetchWithAuth<ApiResponse<Store>>(`/api/stores/${id}`, {
        method: 'PUT',
        body: payload as unknown as Record<string, unknown>,
      })
    } catch (err: unknown) {
      const e = err as { data?: { message?: string }; message?: string }
      error.value = e.data?.message ?? e.message ?? 'Failed to update store'
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function deleteStore(id: string) {
    isLoading.value = true
    error.value = null

    try {
      return await fetchWithAuth<ApiResponse>(`/api/stores/${id}`, {
        method: 'DELETE',
      })
    } catch (err: unknown) {
      const e = err as { data?: { message?: string }; message?: string }
      error.value = e.data?.message ?? e.message ?? 'Failed to delete store'
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    getStores,
    getStore,
    createStore,
    updateStore,
    deleteStore,
  }
}
