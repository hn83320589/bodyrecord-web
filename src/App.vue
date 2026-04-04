<template>
  <RouterView />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useNotification } from '@/composables/useNotification'

const { requestPermission, scheduleCheck } = useNotification()

onMounted(async () => {
  const granted = await requestPermission()
  if (granted) scheduleCheck()
})
</script>
