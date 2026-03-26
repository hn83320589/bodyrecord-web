import { defineStore } from 'pinia'
import { ref } from 'vue'
import { labApi } from '@/api/lab'
import type { LabResultGroup, CreateLabResultsRequest, LabTrendRawPoint } from '@/types/lab'

export const useLabStore = defineStore('lab', () => {
  const groups = ref<LabResultGroup[]>([])
  const trendPoints = ref<LabTrendRawPoint[]>([])
  const loading = ref(false)

  async function fetchGroups() {
    loading.value = true
    try {
      groups.value = await labApi.listByDate()
    } finally {
      loading.value = false
    }
  }

  async function createResults(data: CreateLabResultsRequest) {
    await labApi.create(data)
    await fetchGroups()
  }

  async function fetchTrend(itemCode: string) {
    loading.value = true
    try {
      trendPoints.value = await labApi.trend(itemCode)
    } finally {
      loading.value = false
    }
  }

  async function deleteItem(id: number) {
    await labApi.delete(id)
    groups.value = groups.value
      .map(g => ({ ...g, items: g.items.filter(i => i.id !== id) }))
      .filter(g => g.items.length > 0)
  }

  return { groups, trendPoints, loading, fetchGroups, createResults, fetchTrend, deleteItem }
})
