import { useAuthStore } from '~/stores/auth'

/**
 * Auth middleware — protects routes from unauthenticated access.
 * Runs client-side only; on server we skip and let the client handle hydration.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return

  const authStore = useAuthStore()

  // Restore from localStorage if store is empty
  if (!authStore.accessToken) {
    authStore.loadFromStorage()
  }

  // Already authenticated — allow navigation
  if (authStore.isAuthenticated) return

  // Try silent token refresh via HttpOnly cookie
  try {
    const refreshRes = await $fetch<{
      success: boolean
      data: { accessToken: string }
    }>('/api/auth/refresh', { method: 'POST' })

    if (refreshRes.success) {
      authStore.setToken(refreshRes.data.accessToken)

      const meRes = await $fetch<{
        success: boolean
        data: { user: import('~/types').User }
      }>('/api/auth/me', {
        headers: { Authorization: `Bearer ${refreshRes.data.accessToken}` },
      })

      if (meRes.success) {
        authStore.setUser(meRes.data.user)
        return // allow navigation
      }
    }
  } catch {
    // Refresh failed — redirect to login
  }

  authStore.clearAuth()
  const loginPath = to.path.startsWith('/admin') ? '/admin/login' : '/login'
  return navigateTo(loginPath)
})
