<template>
  <div class="flex items-center gap-2">
    <div class="flex-1 h-2 bg-surface-alt rounded-full overflow-hidden">
      <div class="h-full rounded-full transition-all" :style="barStyle"></div>
    </div>
    <span class="text-xs font-data font-semibold min-w-[18px] text-right" :style="{ color: barColor }">
      {{ severity }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ severity: number }>()

const barColor = computed(() => {
  if (props.severity <= 3) return 'var(--status-success)'
  if (props.severity <= 6) return 'var(--status-warning)'
  return 'var(--status-danger)'
})

const barStyle = computed(() => ({
  width: `${props.severity * 10}%`,
  backgroundColor: barColor.value,
}))
</script>
