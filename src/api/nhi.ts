import axios from 'axios'
import type { NhiImportResult, NhiImportLog } from '@/types/nhi'

const nhiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 60000,
})

nhiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

nhiClient.interceptors.response.use(
  (res) => {
    if (!res.data.success) return Promise.reject(new Error(res.data.message))
    return res.data.data
  },
  (err) => Promise.reject(new Error(err.response?.data?.message || '匯入失敗'))
)

export const nhiApi = {
  import: (file: File): Promise<NhiImportResult> => {
    const form = new FormData()
    form.append('file', file)
    return nhiClient.post('/nhi/import', form, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  getLogs: (): Promise<NhiImportLog[]> => nhiClient.get('/nhi/import/logs'),
  deleteLog: (logId: number): Promise<void> => nhiClient.delete(`/nhi/import/${logId}`),
}
