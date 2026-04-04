<template>
  <div :class="['flex items-center gap-3 py-2.5 px-3 rounded-lg transition',
    log.status === 'missed' || (log.status === 'pending' && isPast) ? 'bg-status-danger-bg' : '']">
    <span class="text-xs font-data text-content-tertiary w-12 shrink-0">{{ time }}</span>
    <div class="flex-1">
      <span class="text-sm font-medium text-content-primary">{{ log.medicationName }}</span>
      <span v-if="log.dosage" class="text-xs text-content-tertiary ml-2">{{ log.dosage }}</span>
    </div>
    <template v-if="log.status === 'taken'">
      <span class="px-3 py-1 rounded-lg text-xs font-medium bg-status-success-bg text-status-success">✓ 已服</span>
    </template>
    <template v-else-if="log.status === 'late'">
      <span class="px-3 py-1 rounded-lg text-xs font-medium bg-status-warning-bg text-status-warning">遲服</span>
    </template>
    <template v-else-if="log.status === 'skipped'">
      <span class="px-3 py-1 rounded-lg text-xs font-medium bg-surface-alt text-content-tertiary line-through">已跳過</span>
    </template>
    <template v-else-if="log.status === 'missed'">
      <button @click="$emit('take')" class="px-3 py-1 rounded-lg text-xs font-medium bg-status-danger text-white hover:opacity-80">已錯過</button>
    </template>
    <template v-else-if="log.status === 'pending' && isPast">
      <button @click="$emit('take')" class="px-3 py-1 rounded-lg text-xs font-medium bg-accent text-white hover:bg-accent-dark">服藥</button>
    </template>
    <template v-else>
      <span class="px-3 py-1 rounded-lg text-xs font-medium bg-surface-alt text-content-tertiary">待服藥</span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MedicationLog } from '@/types/medicationReminder'

const props = defineProps<{ log: MedicationLog }>()
defineEmits<{ (e: 'take'): void; (e: 'skip'): void; (e: 'undo'): void }>()

const time = computed(() => {
  const d = new Date(props.log.scheduledAt)
  return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`
})

const isPast = computed(() => new Date(props.log.scheduledAt) < new Date())
</script>
