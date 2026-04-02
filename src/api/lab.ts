import client from './client'
import type { LabResultGroup, CreateLabResultsRequest, LabTrendRawPoint, LabResultDetail } from '@/types/lab'

interface PagedResult<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
}

export const labApi = {
  listByDate: (): Promise<LabResultGroup[]> => client.get('/lab-results/by-date'),
  list: (params?: { page?: number; pageSize?: number }): Promise<PagedResult<LabResultDetail>> =>
    client.get('/lab-results', { params }),
  create: (data: CreateLabResultsRequest): Promise<void> => client.post('/lab-results', data),
  delete: (id: number): Promise<void> => client.delete(`/lab-results/${id}`),
  trend: (itemCode: string, itemName: string): Promise<LabTrendRawPoint[]> =>
    client.get('/lab-results/trend', { params: { itemCode, itemName } }),
}
