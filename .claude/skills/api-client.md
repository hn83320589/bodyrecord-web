# Skill: Axios API Client

## client.ts

```typescript
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
```

## types/lab.ts（無 labItemId）

```typescript
// 手動新增 request
export interface CreateLabResultsRequest {
  healthRecordId?: number | null   // null = 單獨輸入，不關聯看診
  recordedAt: string
  note?: string
  items: LabResultItemRequest[]
}

export interface LabResultItemRequest {
  itemName: string       // '肌酸酐'（從 labPresets 帶入）
  itemCode: string       // 'Cr'
  unit: string           // 'mg/dL'
  category: string       // '腎功能'
  normalMin?: number
  normalMax?: number
  isNumeric: boolean
  valueNumeric?: number
  valueText?: string
}

// 單筆 response
export interface LabResultDetail {
  id: number
  userId: number
  healthRecordId: number | null
  nhiImportLogId: number | null
  recordedAt: string
  itemName: string
  itemCode: string
  unit: string
  category: string
  normalMin?: number
  normalMax?: number
  isNumeric: boolean
  valueNumeric?: number
  valueText?: string
  isAbnormal: boolean
  source: 'manual' | 'nhi_import'
  hospital?: string    // 來源醫院（nhi_import 才有）
  note?: string
}

// 依日期分組
export interface LabResultGroup {
  recordedAt: string
  source: 'manual' | 'nhi_import'
  hospital?: string
  healthRecordId?: number
  items: LabResultDetail[]
}

// 趨勢圖
export interface LabTrendResponse {
  itemCode: string
  itemName: string
  unit: string
  normalMin?: number
  normalMax?: number
  points: LabTrendPoint[]
}

export interface LabTrendPoint {
  recordedAt: string
  value: number
  isAbnormal: boolean
  source: string
  hospital?: string
}
```

## types/healthRecord.ts

```typescript
export interface HealthRecord {
  id: number
  clinicDate: string
  hospital?: string
  hospitalCode?: string
  primaryIcdCode?: string
  primaryDiagnosis?: string
  secondaryDiagnoses?: { code: string; name: string }[]
  copay?: number
  totalPoints?: number
  source: 'manual' | 'nhi_import'
  nhiImportLogId?: number
}

export interface HealthRecordDetail extends HealthRecord {
  medications: MedicationRecord[]
  labResults: LabResultDetail[]
}
```

## types/nhi.ts

```typescript
export interface NhiImportResult {
  healthRecordCount: number
  medicationCount: number
  labCount: number
  skippedLabs: number
  dateRangeStart: string    // '2023-01-01'
  dateRangeEnd: string      // '2026-03-24'
  dataDate: string          // '20260324'
}

export interface NhiImportLog {
  id: number
  importedAt: string
  dataDate: string
  dateRangeStart: string
  dateRangeEnd: string
  healthRecordCount: number
  medicationCount: number
  labCount: number
  skippedLabs: number
}
```

## api/nhi.ts（multipart 上傳）

```typescript
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import type { NhiImportResult, NhiImportLog } from '@/types/nhi'

const nhiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 60000,
})

nhiClient.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth.token) config.headers.Authorization = `Bearer ${auth.token}`
  return config
})

nhiClient.interceptors.response.use(
  (res) => { if (!res.data.success) return Promise.reject(new Error(res.data.message)); return res.data.data },
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
```

## SourceBadge.vue

```vue
<template>
  <span :class="cls">{{ label }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ source: string; hospital?: string }>()

const label = computed(() =>
  props.source === 'nhi_import' ? `健保存摺${props.hospital ? ' · ' + props.hospital : ''}`
  : props.source === 'healthkit' ? 'Apple Health'
  : '手動輸入'
)
const cls = computed(() => [
  'px-2 py-0.5 rounded text-xs font-medium',
  props.source === 'nhi_import' ? 'bg-blue-100 text-blue-700'
  : props.source === 'healthkit' ? 'bg-green-100 text-green-700'
  : 'bg-gray-100 text-gray-600',
])
</script>
```
