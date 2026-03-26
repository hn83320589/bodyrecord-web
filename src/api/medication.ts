import client from './client'
import type { MedicationRecord } from '@/types/medication'

interface PagedResult<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
}

export const medicationApi = {
  list: (params?: { page?: number; pageSize?: number; drugType?: string }): Promise<PagedResult<MedicationRecord>> =>
    client.get('/medications', { params }),
  delete: (id: number): Promise<void> => client.delete(`/medications/${id}`),
}
