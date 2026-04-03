import { useAuthStore } from '~/stores/auth'

/**
 * Admin middleware — protects routes requiring ADMIN role.
 * Extends the auth middleware with an additional role check.
 */
export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return

  const authStore = useAuthStore()

  if (!authStore.accessToken) {
    authStore.loadFromStorage()
  }

  if (!authStore.isAuthenticated) {
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
        }
      }
    } catch {
      authStore.clearAuth()
      return navigateTo('/admin/login')
    }
  }

  if (!authStore.isAuthenticated) {
    return navigateTo('/admin/login')
  }

  if (!authStore.isAdmin) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Access Denied: Admin role required',
    })
  }
})
