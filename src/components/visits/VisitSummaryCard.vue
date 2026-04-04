<template>
  <div class="bg-surface-card border border-border-default rounded-card px-4 py-3
              hover:border-border-active hover:shadow-md transition cursor-pointer"
    @click="$emit('click')">
    <!-- Row 1: date + institution + diagnosis -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="text-sm font-semibold text-content-primary">{{ institution ?? '未知機構' }}</span>
        <span class="text-xs text-content-tertiary">{{ formattedDate }}</span>
      </div>
      <span class="px-2 py-0.5 rounded text-[10px] font-medium" style="background: var(--cat-visit-bg); color: var(--cat-visit)">
        回診
      </span>
    </div>
    <p v-if="primaryDiagnosis" class="text-sm text-content-secondary mt-1">{{ primaryDiagnosis }}</p>

    <!-- Row 2: keyLabs preview -->
    <div v-if="keyLabs.length > 0" class="flex gap-3 mt-2">
      <div v-for="(lab, i) in keyLabs.slice(0, 3)" :key="i"
        class="flex items-center gap-1 text-xs">
        <div class="w-1.5 h-1.5 rounded-full shrink-0" :class="statusDotClass(lab.status)"></div>
        <span class="text-content-secondary">{{ lab.displayName }}</span>
        <span class="font-data font-semibold" :class="statusTextClass(lab.status)">
          {{ lab.value ?? '-' }}
        </span>
        <span v-if="lab.unit" class="text-content-tertiary">{{ lab.unit }}</span>
      </div>
    </div>

    <!-- Row 3: counts -->
    <p class="text-xs text-content-tertiary mt-2">
      檢驗 {{ labCount }} 項 · 用藥 {{ medicationCount }} 種
      <template v-if="bpOnDay"> · 血壓 {{ bpOnDay.systolic }}/{{ bpOnDay.diastolic }}</template>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { KeyLab, BloodPressureSimple } from '@/types/visit'
import { formatDate } from '@/utils/dateTime'

const props = defineProps<{
  recordedAt: string
  institution?: string
  primaryDiagnosis?: string
  keyLabs: KeyLab[]
  labCount: number
  medicationCount: number
  bpOnDay?: BloodPressureSimple
}>()
defineEmits<{ (e: 'click'): void }>()

const formattedDate = computed(() => formatDate(props.recordedAt))

function statusDotClass(status: string) {
  return status === 'high' || status === 'low' ? 'bg-status-danger' : status === 'normal' ? 'bg-status-success' : 'bg-content-tertiary'
}
function statusTextClass(status: string) {
  return status === 'high' || status === 'low' ? 'text-status-danger' : status === 'normal' ? 'text-status-success' : 'text-content-secondary'
}
</script>
