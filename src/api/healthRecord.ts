import client from './client'
import type { HealthRecord, HealthRecordDetail } from '@/types/healthRecord'

interface PagedResult<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
}

export const healthRecordApi = {
  list: (params?: { page?: number; pageSize?: number }): Promise<PagedResult<HealthRecord>> =>
    client.get('/health-records', { params }),
  get: (id: number): Promise<HealthRecordDetail> => client.get(`/health-records/${id}`),
  delete: (id: number): Promise<void> => client.delete(`/health-records/${id}`),
}
