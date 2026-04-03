import type { ShopeeAd, ShopeeAdSummary, ShopeeAdGroupRow, ShopeeAdListQuery } from '~/types'

export function useShopeeAds() {
  const { fetchWithAuth } = useApi()
  const loading = ref(false)

  async function getAds(query: ShopeeAdListQuery) {
    loading.value = true
    try {
      const params = new URLSearchParams()
      Object.entries(query).forEach(([k, v]) => {
        if (v !== undefined && v !== '') params.set(k, String(v))
      })
      return await fetchWithAuth<{ data: ShopeeAd[]; total: number; page: number; limit: number }>(
        `/api/shopee-ads?${params.toString()}`,
      )
    } finally {
      loading.value = false
    }
  }

  async function getSummary(storeId: string, dateFrom?: string, dateTo?: string) {
    const params = new URLSearchParams({ storeId })
    if (dateFrom) params.set('dateFrom', dateFrom)
    if (dateTo)   params.set('dateTo', dateTo)
    return fetchWithAuth<ShopeeAdSummary>(`/api/shopee-ads/summary?${params.toString()}`)
  }

  async function getGrouped(storeId: string, groupBy: 'ad' | 'adType' | 'adPlacement', dateFrom?: string, dateTo?: string) {
    loading.value = true
    try {
      const params = new URLSearchParams({ storeId, groupBy })
      if (dateFrom) params.set('dateFrom', dateFrom)
      if (dateTo)   params.set('dateTo', dateTo)
      return await fetchWithAuth<ShopeeAdGroupRow[]>(`/api/shopee-ads/group?${params.toString()}`)
    } finally {
      loading.value = false
    }
  }

  async function importAds(storeId: string, files: File[]) {
    const authStore = useAuthStore()
    const form = new FormData()
    form.append('storeId', storeId)
    for (const f of files) form.append('files', f, f.name)
    return $fetch<{ success: boolean; imported: number; skipped: number; total: number; errors: string[] }>(
      '/api/shopee-ads/import',
      {
        method: 'POST',
        body: form,
        headers: authStore.accessToken ? { Authorization: `Bearer ${authStore.accessToken}` } : {},
      },
    )
  }

  return { getAds, getSummary, getGrouped, importAds, loading }
}
