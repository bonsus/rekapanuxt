import type {
  User,
  UserFilters,
  CreateUserPayload,
  UpdateUserPayload,
  PaginatedApiResponse,
  ApiResponse,
} from '~/types'

export function useUsers() {
  const { fetchWithAuth } = useApi()

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function getUsers(filters: UserFilters = {}) {
    isLoading.value = true
    error.value = null

    try {
      const params: Record<string, unknown> = {}
      if (filters.page) params.page = filters.page
      if (filters.limit) params.limit = filters.limit
      if (filters.search) params.search = filters.search
      if (filters.role) params.role = filters.role
      if (filters.status) params.status = filters.status

      return await fetchWithAuth<PaginatedApiResponse<User>>('/api/admin/users', {
        params,
      })
    } catch (err: unknown) {
      const e = err as { data?: { message?: string }; message?: string }
      error.value = e.data?.message ?? e.message ?? 'Failed to fetch users'
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function createUser(payload: CreateUserPayload) {
    isLoading.value = true
    error.value = null

    try {
      return await fetchWithAuth<ApiResponse<User>>('/api/admin/users', {
        method: 'POST',
        body: payload as unknown as Record<string, unknown>,
      })
    } catch (err: unknown) {
      const e = err as { data?: { message?: string }; message?: string }
      error.value = e.data?.message ?? e.message ?? 'Failed to create user'
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function updateUser(id: string, payload: UpdateUserPayload) {
    isLoading.value = true
    error.value = null

    try {
      return await fetchWithAuth<ApiResponse<User>>(`/api/admin/users/${id}`, {
        method: 'PUT',
        body: payload as unknown as Record<string, unknown>,
      })
    } catch (err: unknown) {
      const e = err as { data?: { message?: string }; message?: string }
      error.value = e.data?.message ?? e.message ?? 'Failed to update user'
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function deleteUser(id: string) {
    isLoading.value = true
    error.value = null

    try {
      return await fetchWithAuth<ApiResponse>(`/api/admin/users/${id}`, {
        method: 'DELETE',
      })
    } catch (err: unknown) {
      const e = err as { data?: { message?: string }; message?: string }
      error.value = e.data?.message ?? e.message ?? 'Failed to delete user'
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
  }
}
