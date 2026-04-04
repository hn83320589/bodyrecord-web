<template>
  <div class="bg-surface-card rounded-card shadow-sm p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-semibold text-content-primary">今日服藥</h3>
      <span class="text-xs text-content-tertiary font-data">
        {{ takenCount }}/{{ logs.length }} 已完成
      </span>
    </div>
    <div v-if="logs.length === 0" class="text-sm text-content-tertiary text-center py-4">今日無排定服藥</div>
    <div v-else class="space-y-1">
      <MedLogItem v-for="log in logs" :key="log.id" :log="log"
        @take="$emit('take', log.id)"
        @skip="$emit('skip', log.id)"
        @undo="$emit('undo', log.id)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MedLogItem from './MedLogItem.vue'
import type { MedicationLog } from '@/types/medicationReminder'

const props = defineProps<{ logs: MedicationLog[] }>()
defineEmits<{ (e: 'take', id: number): void; (e: 'skip', id: number): void; (e: 'undo', id: number): void }>()

const takenCount = computed(() => props.logs.filter(l => l.status === 'taken' || l.status === 'late').length)
</script>
