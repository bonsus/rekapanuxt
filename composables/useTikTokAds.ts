import type { TikTokAd, TikTokAdSummary, TikTokAdListQuery, TikTokAdGroupRow } from '~/types'

export function useTikTokAds() {
  const { fetchWithAuth } = useApi()
  const loading = ref(false)

  async function getAds(query: TikTokAdListQuery) {
    loading.value = true
    try {
      const params = new URLSearchParams()
      Object.entries(query).forEach(([k, v]) => {
        if (v !== undefined && v !== '') params.set(k, String(v))
      })
      return await fetchWithAuth<{ data: TikTokAd[]; total: number; page: number; limit: number }>(
        `/api/tiktok-ads?${params.toString()}`,
      )
    } finally {
      loading.value = false
    }
  }

  async function getSummary(storeId: string, dateFrom?: string, dateTo?: string, campaignId?: string) {
    const params = new URLSearchParams({ storeId })
    if (dateFrom)   params.set('dateFrom', dateFrom)
    if (dateTo)     params.set('dateTo', dateTo)
    if (campaignId) params.set('campaignId', campaignId)
    return fetchWithAuth<TikTokAdSummary>(`/api/tiktok-ads/summary?${params.toString()}`)
  }

  async function deleteAd(id: string) {
    return fetchWithAuth<{ success: boolean }>(`/api/tiktok-ads/${id}`, { method: 'DELETE' })
  }

  async function getGrouped(storeId: string, groupBy: 'campaign' | 'adGroup', dateFrom?: string, dateTo?: string) {
    loading.value = true
    try {
      const params = new URLSearchParams({ storeId, groupBy })
      if (dateFrom) params.set('dateFrom', dateFrom)
      if (dateTo)   params.set('dateTo', dateTo)
      return await fetchWithAuth<TikTokAdGroupRow[]>(`/api/tiktok-ads/group?${params.toString()}`)
    } finally {
      loading.value = false
    }
  }

  async function importAds(storeId: string, file: File) {
    const authStore = useAuthStore()
    const form = new FormData()
    form.append('storeId', storeId)
    form.append('file', file)
    return $fetch<{ success: boolean; imported: number; skipped: number; total: number; errors: string[] }>(
      '/api/tiktok-ads/import',
      {
        method: 'POST',
        body: form,
        headers: authStore.accessToken ? { Authorization: `Bearer ${authStore.accessToken}` } : {},
      },
    )
  }

  return { getAds, getSummary, deleteAd, getGrouped, importAds, loading }
}
