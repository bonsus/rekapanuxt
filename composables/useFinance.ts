import type {
  FinanceTransaction,
  FinanceSummary,
  CreateFinancePayload,
  UpdateFinancePayload,
  FinanceListQuery,
} from '~/types'
import { useApi } from '~/composables/useApi'

export function useFinance() {
  const { fetchWithAuth } = useApi()
  const loading = ref(false)

  async function getTransactions(params: FinanceListQuery) {
    loading.value = true
    try {
      return await fetchWithAuth<{ data: FinanceTransaction[]; total: number; page: number; limit: number }>(
        '/api/finance',
        { params: params as unknown as Record<string, unknown> },
      )
    } finally {
      loading.value = false
    }
  }

  async function getSummary(storeId: string, dateFrom?: string, dateTo?: string) {
    return fetchWithAuth<FinanceSummary>('/api/finance/summary', {
      params: { storeId, dateFrom, dateTo } as Record<string, unknown>,
    })
  }

  async function createTransaction(payload: CreateFinancePayload) {
    return fetchWithAuth<{ success: boolean; data: FinanceTransaction }>('/api/finance', {
      method: 'POST',
      body: payload as unknown as Record<string, unknown>,
    })
  }

  async function updateTransaction(id: string, payload: UpdateFinancePayload) {
    return fetchWithAuth<{ success: boolean; data: FinanceTransaction }>(`/api/finance/${id}`, {
      method: 'PUT',
      body: payload as unknown as Record<string, unknown>,
    })
  }

  async function deleteTransaction(id: string) {
    return fetchWithAuth<{ success: boolean }>(`/api/finance/${id}`, { method: 'DELETE' })
  }

  async function importFinance(storeId: string, file: File) {
    const form = new FormData()
    form.append('storeId', storeId)
    form.append('file', file)
    return fetchWithAuth<{ success: boolean; imported: number; skipped: number; updated: number; total: number; errors: string[] }>(
      '/api/finance/import',
      { method: 'POST', body: form as unknown as Record<string, unknown> },
    )
  }

  return { loading, getTransactions, getSummary, createTransaction, updateTransaction, deleteTransaction, importFinance }
}
