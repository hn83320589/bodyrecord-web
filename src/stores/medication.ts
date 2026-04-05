import { defineStore } from 'pinia'
import { ref } from 'vue'
import { medicationApi } from '@/api/medication'
import type { MedicationRecord } from '@/types/medication'

export const useMedicationStore = defineStore('medication', () => {
  const medications = ref<MedicationRecord[]>([])
  const loading = ref(false)

  async function fetchMedications() {
    loading.value = true
    try {
      const result = await medicationApi.list()
      medications.value = Array.isArray(result) ? result : (result.items ?? [])
    } finally {
      loading.value = false
    }
  }

  async function deleteMedication(id: number) {
    await medicationApi.delete(id)
    medications.value = medications.value.filter(m => m.id !== id)
  }

  return { medications, loading, fetchMedications, deleteMedication }
})
