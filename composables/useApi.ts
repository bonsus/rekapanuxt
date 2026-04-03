import { useAuthStore } from '~/stores/auth'

// Singleton refresh promise to prevent parallel refresh calls
let activeRefresh: Promise<string | null> | null = null

export function useApi() {
  const authStore = useAuthStore()

  async function refreshAccessToken(): Promise<string | null> {
    if (activeRefresh) return activeRefresh

    activeRefresh = (async () => {
      try {
        const res = await $fetch<{
          success: boolean
          data: { accessToken: string }
        }>('/api/auth/refresh', { method: 'POST' })

        if (res.success) {
          authStore.setToken(res.data.accessToken)
          return res.data.accessToken
        }
        return null
      } catch {
        authStore.clearAuth()
        return null
      } finally {
        activeRefresh = null
      }
    })()

    return activeRefresh
  }

  async function fetchWithAuth<T>(
    url: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
      body?: Record<string, unknown>
      params?: Record<string, unknown>
    } = {},
  ): Promise<T> {
    const headers: Record<string, string> = {}

    if (authStore.accessToken) {
      headers['Authorization'] = `Bearer ${authStore.accessToken}`
    }

    try {
      return await $fetch<T>(url, {
        method: options.method ?? 'GET',
        body: options.body,
        params: options.params,
        headers,
      })
    } catch (err: unknown) {
      const error = err as { statusCode?: number; status?: number }
      const status = error.statusCode ?? error.status

      if (status === 401) {
        const newToken = await refreshAccessToken()

        if (newToken) {
          return await $fetch<T>(url, {
            method: options.method ?? 'GET',
            body: options.body,
            params: options.params,
            headers: { ...headers, Authorization: `Bearer ${newToken}` },
          })
        }

        if (import.meta.client) {
          await navigateTo('/login')
        }
      }

      throw err
    }
  }

  async function downloadWithAuth(
    url: string,
    filename: string,
    params?: Record<string, unknown>,
  ): Promise<void> {
    const headers: Record<string, string> = {}
    if (authStore.accessToken) {
      headers['Authorization'] = `Bearer ${authStore.accessToken}`
    }

    const qs = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : ''

    let response = await fetch(url + qs, { headers })

    if (response.status === 401) {
      const newToken = await refreshAccessToken()
      if (newToken) {
        response = await fetch(url + qs, {
          headers: { ...headers, Authorization: `Bearer ${newToken}` },
        })
      } else {
        if (import.meta.client) await navigateTo('/login')
        return
      }
    }

    if (!response.ok) {
      const text = await response.text().catch(() => '')
      throw new Error(text || `Download failed (${response.status})`)
    }

    const blob = await response.blob()
    const blobUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(blobUrl)
  }

  return { fetchWithAuth, downloadWithAuth }
}
