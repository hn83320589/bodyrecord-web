import { defineStore } from 'pinia'
import { ref } from 'vue'
import { profileApi } from '@/api/profile'
import type { UserProfile } from '@/types/profile'

export const useProfileStore = defineStore('profile', () => {
  const profile = ref<UserProfile | null>(null)
  const loading = ref(false)

  async function fetchProfile() {
    loading.value = true
    try {
      profile.value = await profileApi.get()
    } finally {
      loading.value = false
    }
  }

  return { profile, loading, fetchProfile }
})
