import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth.token) config.headers.Authorization = `Bearer ${auth.token}`
  return config
})

client.interceptors.response.use(
  (res) => {
    if (!res.data.success) return Promise.reject(new Error(res.data.message || '操作失敗'))
    return res.data.data
  },
  (err) => {
    if (err.response?.status === 401) { useAuthStore().logout(); router.push('/login') }
    return Promise.reject(new Error(err.response?.data?.message || err.message || '網路錯誤'))
  }
)

export default client
