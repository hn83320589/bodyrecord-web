<template>
  <div class="flex gap-2">
    <button v-for="opt in rangeOptions" :key="opt.value"
      @click="$emit('update:modelValue', opt.value)"
      :class="['px-3 py-1 rounded-full text-xs font-medium transition',
        modelValue === opt.value
          ? 'bg-accent text-white'
          : 'bg-surface-alt text-content-tertiary hover:text-content-secondary hover:bg-border-default']">
      {{ opt.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ modelValue: string }>()
defineEmits<{ (e: 'update:modelValue', v: string): void }>()

const rangeOptions = [
  { label: '1 月', value: '1m' },
  { label: '3 月', value: '3m' },
  { label: '6 月', value: '6m' },
  { label: '1 年', value: '1y' },
]
</script>
