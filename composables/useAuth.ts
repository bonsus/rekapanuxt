import { useAuthStore } from '~/stores/auth'
import type { LoginCredentials, User } from '~/types'

export function useAuth() {
  const authStore = useAuthStore()
  const { fetchWithAuth } = useApi()

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function login(credentials: LoginCredentials) {
    isLoading.value = true
    error.value = null

    try {
      const res = await $fetch<{
        success: boolean
        data: { accessToken: string; user: User }
      }>('/api/auth/login', {
        method: 'POST',
        body: credentials,
      })

      if (res.success) {
        authStore.setAuth(res.data.user, res.data.accessToken)
        return { success: true, user: res.data.user }
      }

      return { success: false, error: 'Login failed' }
    } catch (err: unknown) {
      const e = err as { data?: { message?: string }; message?: string }
      const msg = e.data?.message ?? e.message ?? 'Login failed'
      error.value = msg
      return { success: false, error: msg }
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } catch {
      // ignore errors, still clear client state
    } finally {
      authStore.clearAuth()
      await navigateTo('/login')
    }
  }

  async function logoutAdmin() {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } catch {
      // ignore errors
    } finally {
      authStore.clearAuth()
      await navigateTo('/admin/login')
    }
  }

  async function fetchMe(): Promise<User | null> {
    try {
      const res = await fetchWithAuth<{ success: boolean; data: { user: User } }>(
        '/api/auth/me',
      )
      if (res.success) {
        authStore.setUser(res.data.user)
        return res.data.user
      }
      return null
    } catch {
      authStore.clearAuth()
      return null
    }
  }

  return {
    isLoading,
    error,
    login,
    logout,
    logoutAdmin,
    fetchMe,
  }
}
