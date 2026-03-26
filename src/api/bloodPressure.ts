import client from './client'
import type { BloodPressureRecord, CreateBloodPressureRequest, BloodPressureChartPoint } from '@/types/bloodPressure'

interface PagedResult<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
}

export const bloodPressureApi = {
  list: (params?: { page?: number; pageSize?: number }): Promise<PagedResult<BloodPressureRecord>> =>
    client.get('/blood-pressure', { params }),
  create: (data: CreateBloodPressureRequest): Promise<BloodPressureRecord> =>
    client.post('/blood-pressure', data),
  delete: (id: number): Promise<void> => client.delete(`/blood-pressure/${id}`),
  chartData: (period: string = '30d'): Promise<BloodPressureChartPoint[]> =>
    client.get('/blood-pressure/chart-data', { params: { period } }),
}
