import { defineStore } from 'pinia'
import { ref } from 'vue'
import { bloodPressureApi } from '@/api/bloodPressure'
import type { BloodPressureRecord, CreateBloodPressureRequest, BloodPressureChartPoint } from '@/types/bloodPressure'

export const useBloodPressureStore = defineStore('bloodPressure', () => {
  const records = ref<BloodPressureRecord[]>([])
  const chartPoints = ref<BloodPressureChartPoint[]>([])
  const loading = ref(false)

  async function fetchRecords(pageSize = 50) {
    loading.value = true
    try {
      const result = await bloodPressureApi.list({ pageSize })
      records.value = result.items
    } finally {
      loading.value = false
    }
  }

  async function fetchChartData(period: string = '30d') {
    loading.value = true
    try {
      chartPoints.value = await bloodPressureApi.chartData(period)
    } finally {
      loading.value = false
    }
  }

  async function createRecord(data: CreateBloodPressureRequest) {
    const record = await bloodPressureApi.create(data)
    records.value.unshift(record)
    return record
  }

  async function deleteRecord(id: number) {
    await bloodPressureApi.delete(id)
    records.value = records.value.filter(r => r.id !== id)
  }

  return { records, chartPoints, loading, fetchRecords, fetchChartData, createRecord, deleteRecord }
})
