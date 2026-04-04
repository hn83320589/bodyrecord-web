import client from './client'
import axios from 'axios'
import type { VisitSummaryJson } from '@/types/visitSummary'

export const visitSummaryApi = {
  getJson(visitId: number): Promise<VisitSummaryJson> {
    return client.get(`/visits/${visitId}/summary-json`)
  },

  async downloadPdf(visitId: number): Promise<void> {
    const token = localStorage.getItem('token')
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/visits/${visitId}/summary-pdf`,
      {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `visit-summary-${visitId}.pdf`
    link.click()
    window.URL.revokeObjectURL(url)
  },
}
