<template>
  <div class="relative flex items-center justify-center" :style="{ width: size + 'px', height: size + 'px' }">
    <svg :width="size" :height="size" class="-rotate-90 absolute">
      <circle :cx="center" :cy="center" :r="radius" fill="none"
        stroke="var(--surface-alt)" :stroke-width="strokeWidth" />
      <circle :cx="center" :cy="center" :r="radius" fill="none"
        :stroke="ringColor" :stroke-width="strokeWidth"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="circumference * (1 - clampedRate)"
        stroke-linecap="round" class="transition-all duration-500" />
    </svg>
    <div class="flex flex-col items-center">
      <span class="text-2xl font-bold font-data text-content-primary">{{ Math.round(rate * 100) }}%</span>
      <span v-if="label" class="text-xs text-content-tertiary">{{ label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  rate: number  // 0-1
  size?: number
  strokeWidth?: number
  label?: string
}>(), { size: 120, strokeWidth: 10 })

const center = computed(() => props.size / 2)
const radius = computed(() => (props.size - props.strokeWidth) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const clampedRate = computed(() => Math.max(0, Math.min(1, props.rate)))

const ringColor = computed(() => {
  const pct = clampedRate.value * 100
  if (pct >= 90) return 'var(--status-success)'
  if (pct >= 70) return 'var(--status-warning)'
  return 'var(--status-danger)'
})
</script>
