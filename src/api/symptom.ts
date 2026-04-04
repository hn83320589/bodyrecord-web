import client from './client'
import type { SymptomLog, CreateSymptomRequest, UpdateSymptomRequest, SymptomSummary } from '@/types/symptom'

export const symptomApi = {
  list: (params?: { startDate?: string; endDate?: string; type?: string }): Promise<SymptomLog[]> =>
    client.get('/symptoms', { params }),
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
