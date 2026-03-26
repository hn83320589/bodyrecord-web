import { defineStore } from 'pinia'
import { ref } from 'vue'
import { healthRecordApi } from '@/api/healthRecord'
import type { HealthRecord, HealthRecordDetail } from '@/types/healthRecord'

export const useHealthRecordStore = defineStore('healthRecord', () => {
  const records = ref<HealthRecord[]>([])
  const currentDetail = ref<HealthRecordDetail | null>(null)
  const loading = ref(false)

  async function fetchRecords() {
    loading.value = true
    try {
      const result = await healthRecordApi.list({ pageSize: 100 })
      records.value = result.items
    } finally {
      loading.value = false
    }
  }

  async function fetchDetail(id: number) {
    loading.value = true
    try {
      currentDetail.value = await healthRecordApi.get(id)
    } finally {
      loading.value = false
    }
  }

  async function deleteRecord(id: number) {
    await healthRecordApi.delete(id)
    records.value = records.value.filter(r => r.id !== id)
    if (currentDetail.value?.id === id) currentDetail.value = null
  }

  return { records, currentDetail, loading, fetchRecords, fetchDetail, deleteRecord }
})
