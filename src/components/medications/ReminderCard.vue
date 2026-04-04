<template>
  <div :class="['bg-surface-card rounded-card shadow-sm p-4 border border-border-default transition',
    reminder.isEnabled ? '' : 'opacity-50']">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <span class="text-sm font-semibold text-content-primary">{{ reminder.medicationName }}</span>
        <span v-if="reminder.dosage" class="text-xs text-content-tertiary ml-2">{{ reminder.dosage }}</span>
      </div>
      <label class="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" :checked="reminder.isEnabled" @change="$emit('toggle')" class="sr-only" />
        <div :class="['w-9 h-5 rounded-full transition-colors',
          reminder.isEnabled ? 'bg-accent' : 'bg-surface-alt']">
          <div :class="['w-4 h-4 rounded-full bg-white shadow transform transition-transform mt-0.5',
            reminder.isEnabled ? 'translate-x-4 ml-0.5' : 'translate-x-0.5']"></div>
        </div>
      </label>
    </div>
    <div class="mt-2 flex items-center gap-3 text-xs text-content-secondary">
      <span class="font-data">{{ reminder.remindTimes.join(' · ') }}</span>
      <span v-if="reminder.frequency" class="text-content-tertiary">{{ reminder.frequency }}</span>
    </div>
    <div class="mt-2 flex gap-2">
      <button @click="$emit('edit')" class="text-xs text-accent hover:text-accent-dark">編輯</button>
      <button @click="$emit('delete')" class="text-xs text-status-danger hover:opacity-80">刪除</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MedicationReminder } from '@/types/medicationReminder'
defineProps<{ reminder: MedicationReminder }>()
defineEmits<{ (e: 'toggle'): void; (e: 'edit'): void; (e: 'delete'): void }>()
</script>
