<template>
  <span :style="{ color, fontWeight: isAbnormal ? 600 : 400 }">
    <template v-if="isNumeric">{{ valueNumeric }} {{ unit }}{{ dirSymbol }}</template>
    <template v-else>{{ valueText }}</template>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{
  isNumeric: boolean
  valueNumeric?: number
  valueText?: string
  unit: string
  normalMin?: number
  normalMax?: number
  isAbnormal: boolean
}>()

const dir = computed(() => {
  if (!props.isNumeric || props.valueNumeric == null) return 'qualitative'
  if (props.normalMax != null && props.valueNumeric > props.normalMax) return 'high'
  if (props.normalMin != null && props.valueNumeric < props.normalMin) return 'low'
  return 'normal'
})
const color = computed(() => ({ high: '#ef4444', low: '#3b82f6', normal: '#22c55e', qualitative: '#6b7280' }[dir.value]))
const dirSymbol = computed(() => ({ high: ' ↑', low: ' ↓', normal: '', qualitative: '' }[dir.value]))
</script>
