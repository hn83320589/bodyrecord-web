import client from './client'
import type { VisitTimelineItem, VisitRelatedResponse } from '@/types/visit'

export const visitApi = {
  getTimeline: (startDate?: string, endDate?: string): Promise<VisitTimelineItem[]> =>
    client.get('/visits/timeline', { params: { startDate, endDate } }),

  getRelated: (id: number): Promise<VisitRelatedResponse> =>
    client.get(`/visits/${id}/related`),
}
