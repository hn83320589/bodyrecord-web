import client from './client'
import type { MedicationLog, AdherenceResponse } from '@/types/medicationReminder'

export const medicationLogApi = {
  getToday: (): Promise<MedicationLog[]> => {
    // Handle both array and PagedResult responses
    return client.get('/medication-logs/today').then((data: any) =>
      Array.isArray(data) ? data : (data?.items ?? [])
    )
  },

  take: (id: number): Promise<MedicationLog> =>
    client.post(`/medication-logs/${id}/take`),

  skip: (id: number, note?: string): Promise<MedicationLog> =>
    client.post(`/medication-logs/${id}/skip`, { note }),

  undo: (id: number): Promise<MedicationLog> =>
    client.post(`/medication-logs/${id}/undo`),

  getAdherence: (days: number = 30): Promise<AdherenceResponse> =>
    client.get('/medication-logs/adherence', { params: { days } }),
}
