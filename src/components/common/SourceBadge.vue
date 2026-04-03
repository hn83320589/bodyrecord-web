<template>
  <span :class="cls">{{ label }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ source: string; hospital?: string }>()

const label = computed(() =>
  props.source === 'nhi_import' ? `健保存摺${props.hospital ? ' · ' + props.hospital : ''}`
  : props.source === 'healthkit' ? 'Apple Health'
  : '手動輸入'
)
const cls = computed(() => [
  'px-2 py-0.5 rounded text-xs font-medium',
  props.source === 'nhi_import' ? 'bg-accent-light text-accent'
  : props.source === 'healthkit' ? 'bg-status-success-bg text-status-success'
  : 'bg-surface-alt text-content-secondary',
])
</script>
