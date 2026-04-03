import type {
  Order,
  OrderFilters,
  CreateOrderPayload,
  UpdateOrderPayload,
  SkuSearchResult,
} from '~/types'

export function useOrders() {
  const { fetchWithAuth } = useApi()
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function getOrders(filters: OrderFilters) {
    loading.value = true
    error.value = null
    try {
      const params: Record<string, unknown> = { storeId: filters.storeId }
      if (filters.search) params.search = filters.search
      if (filters.status) params.status = filters.status
      if (filters.dateFrom) params.dateFrom = filters.dateFrom
      if (filters.dateTo) params.dateTo = filters.dateTo
      if (filters.page) params.page = filters.page
      if (filters.limit) params.limit = filters.limit
      return await fetchWithAuth<{ success: boolean; data: Order[]; total: number; page: number; limit: number }>(
        '/api/orders', { params }
      )
    } catch (e: unknown) {
      error.value = (e as { data?: { message?: string } })?.data?.message ?? 'Failed to load orders'
      return null
    } finally {
      loading.value = false
    }
  }

  async function getOrder(id: string) {
    loading.value = true
    error.value = null
    try {
      const res = await fetchWithAuth<{ success: boolean; data: Order }>(`/api/orders/${id}`)
      return res.data
    } catch (e: unknown) {
      error.value = (e as { data?: { message?: string } })?.data?.message ?? 'Failed to load order'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createOrder(payload: CreateOrderPayload) {
    loading.value = true
    error.value = null
    try {
      const res = await fetchWithAuth<{ success: boolean; data: Order; message: string }>('/api/orders', {
        method: 'POST',
        body: payload as unknown as Record<string, unknown>,
      })
      return res.data
    } catch (e: unknown) {
      error.value = (e as { data?: { message?: string } })?.data?.message ?? 'Failed to create order'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateOrder(id: string, payload: UpdateOrderPayload) {
    loading.value = true
    error.value = null
    try {
      const res = await fetchWithAuth<{ success: boolean; data: Order; message: string }>(`/api/orders/${id}`, {
        method: 'PUT',
        body: payload as unknown as Record<string, unknown>,
      })
      return res.data
    } catch (e: unknown) {
      error.value = (e as { data?: { message?: string } })?.data?.message ?? 'Failed to update order'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteOrder(id: string) {
    loading.value = true
    error.value = null
    try {
      await fetchWithAuth(`/api/orders/${id}`, { method: 'DELETE' })
    } catch (e: unknown) {
      error.value = (e as { data?: { message?: string } })?.data?.message ?? 'Failed to delete order'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function searchSkus(storeId: string, q: string): Promise<SkuSearchResult[]> {
    try {
      const res = await fetchWithAuth<{ success: boolean; data: SkuSearchResult[] }>(
        '/api/orders/sku-search',
        { params: { storeId, q } }
      )
      return res.data ?? []
    } catch {
      return []
    }
  }

  return { loading, error, getOrders, getOrder, createOrder, updateOrder, deleteOrder, searchSkus }
}

