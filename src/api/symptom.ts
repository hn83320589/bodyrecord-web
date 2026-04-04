import client from './client'
import type { SymptomLog, CreateSymptomRequest, UpdateSymptomRequest, SymptomSummary } from '@/types/symptom'

interface PagedResult<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
}

export const symptomApi = {
  list: async (params?: { startDate?: string; endDate?: string; type?: string; pageSize?: number }): Promise<SymptomLog[]> => {
    const result: PagedResult<SymptomLog> | SymptomLog[] = await client.get('/symptoms', {
      params: { pageSize: 200, ...params },
    })
    return Array.isArray(result) ? result : (result.items ?? [])
  },
  create: (data: CreateSymptomRequest): Promise<SymptomLog> =>
    client.post('/symptoms', data),
  update: (id: number, data: UpdateSymptomRequest): Promise<SymptomLog> =>
    client.put(`/symptoms/${id}`, data),
  delete: (id: number): Promise<void> =>
    client.delete(`/symptoms/${id}`),
  getSummary: (months: number = 3): Promise<SymptomSummary> =>
    client.get('/symptoms/summary', { params: { months } }),
  getTypes: (): Promise<string[]> =>
    client.get('/symptoms/types'),
}
