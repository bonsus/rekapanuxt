import type {
  Product,
  ProductFilters,
  CreateProductPayload,
  UpdateProductPayload,
  PaginatedApiResponse,
  ApiResponse,
} from '~/types'

export function useProducts() {
  const { fetchWithAuth } = useApi()

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function getProducts(filters: ProductFilters) {
    isLoading.value = true
    error.value = null
    try {
      const params: Record<string, unknown> = { storeId: filters.storeId }
      if (filters.page) params.page = filters.page
      if (filters.limit) params.limit = filters.limit
      if (filters.search) params.search = filters.search
      if (filters.status) params.status = filters.status
      return await fetchWithAuth<PaginatedApiResponse<Product>>('/api/products', { params })
    } catch (err: unknown) {
      const e = err as { data?: { message?: string }; message?: string }
      error.value = e.data?.message ?? e.message ?? 'Failed to fetch products'
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function getProduct(id: string) {
    isLoading.value = true
    error.value = null
    try {
      return await fetchWithAuth<ApiResponse<Product>>(`/api/products/${id}`)
    } catch (err: unknown) {
      const e = err as { data?: { message?: string }; message?: string }
      error.value = e.data?.message ?? e.message ?? 'Failed to fetch product'
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function createProduct(payload: CreateProductPayload) {
    isLoading.value = true
    error.value = null
    try {
      return await fetchWithAuth<ApiResponse<Product>>('/api/products', {
        method: 'POST',
        body: payload as unknown as Record<string, unknown>,
      })
    } catch (err: unknown) {
      const e = err as { data?: { message?: string }; message?: string }
      error.value = e.data?.message ?? e.message ?? 'Failed to create product'
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function updateProduct(id: string, payload: UpdateProductPayload) {
    isLoading.value = true
    error.value = null
    try {
      return await fetchWithAuth<ApiResponse<Product>>(`/api/products/${id}`, {
        method: 'PUT',
        body: payload as unknown as Record<string, unknown>,
      })
    } catch (err: unknown) {
      const e = err as { data?: { message?: string }; message?: string }
      error.value = e.data?.message ?? e.message ?? 'Failed to update product'
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function deleteProduct(id: string) {
    isLoading.value = true
    error.value = null
    try {
      return await fetchWithAuth<ApiResponse>(`/api/products/${id}`, { method: 'DELETE' })
    } catch (err: unknown) {
      const e = err as { data?: { message?: string }; message?: string }
      error.value = e.data?.message ?? e.message ?? 'Failed to delete product'
      return null
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, error, getProducts, getProduct, createProduct, updateProduct, deleteProduct }
}
