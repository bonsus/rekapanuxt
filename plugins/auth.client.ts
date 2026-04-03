/**
 * Client-side plugin — initialises auth state from localStorage and
 * attempts a silent token refresh on every page load.
 */
export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()

  // 1. Restore whatever is in localStorage
  authStore.loadFromStorage()

  // 2. Always try to get a fresh access token via the HttpOnly refresh cookie
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
    // No valid refresh token — user remains unauthenticated (not an error)
  }
})
