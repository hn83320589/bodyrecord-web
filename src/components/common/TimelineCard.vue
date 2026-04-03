<template>
  <div class="flex gap-3 group">
    <!-- Left column: date + dot + line -->
    <div class="flex flex-col items-center w-9 shrink-0 pt-1">
      <span class="text-[11px] font-semibold text-content-secondary leading-tight">{{ day }}</span>
      <span class="text-[9px] text-content-tertiary">{{ weekday }}</span>
      <div class="w-2 h-2 rounded-full mt-1.5 shrink-0" :style="{ background: dotColor }"></div>
      <div class="w-[1.5px] flex-1 mt-1 bg-timeline-line"></div>
    </div>
    <!-- Right: card -->
    <div class="flex-1 mb-3 bg-surface-card border border-border-default rounded-card px-4 py-3
                hover:border-border-active hover:shadow-md transition cursor-pointer"
      @click="$emit('click')">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-1.5 h-1.5 rounded-full shrink-0" :style="{ background: dotColor }"></div>
          <span class="text-sm font-semibold text-content-primary">{{ title }}</span>
        </div>
        <span class="px-2 py-0.5 rounded text-[10px] font-medium" :style="badgeStyle">{{ badge }}</span>
      </div>
      <div v-if="value" class="mt-1">
        <span class="text-xl font-bold text-content-primary font-data">{{ value }}</span>
        <span v-if="unit" class="text-xs text-content-tertiary ml-1">{{ unit }}</span>
        <span v-if="flag" class="text-xs ml-1" :class="flagClass">{{ flag }}</span>
      </div>
      <p v-if="description" class="text-xs text-content-secondary mt-1">{{ description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  day: string | number
  weekday: string
  title: string
  badge: string
  category: 'bp' | 'lab' | 'visit' | 'med'
  value?: string
  unit?: string
  flag?: string
  description?: string
}>()
defineEmits<{ (e: 'click'): void }>()

const colorMap = {
  bp: { dot: 'var(--cat-bp)', bg: 'var(--cat-bp-bg)', text: 'var(--cat-bp)' },
  lab: { dot: 'var(--cat-lab)', bg: 'var(--cat-lab-bg)', text: 'var(--cat-lab)' },
  visit: { dot: 'var(--cat-visit)', bg: 'var(--cat-visit-bg)', text: 'var(--cat-visit)' },
  med: { dot: 'var(--cat-med)', bg: 'var(--cat-med-bg)', text: 'var(--cat-med)' },
}

const dotColor = computed(() => colorMap[props.category].dot)
const badgeStyle = computed(() => ({
  background: colorMap[props.category].bg,
  color: colorMap[props.category].text,
}))
const flagClass = computed(() =>
  props.flag?.includes('↑') || props.flag?.includes('⚠') ? 'text-status-danger' : 'text-status-success'
)
</script>
