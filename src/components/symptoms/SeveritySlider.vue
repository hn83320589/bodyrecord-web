<template>
  <div>
    <div class="flex items-center justify-between mb-1">
      <span class="text-sm text-content-secondary">嚴重度</span>
      <span class="text-xl font-data font-bold" :style="{ color: sliderColor }">{{ modelValue }}</span>
    </div>
    <input type="range" min="1" max="10" :value="modelValue"
      @input="$emit('update:modelValue', Number(($event.target as HTMLInputElement).value))"
      class="w-full h-2 rounded-full appearance-none cursor-pointer"
      :style="sliderStyle" />
    <div class="flex justify-between text-[10px] text-content-tertiary mt-1">
      <span>輕微</span><span>中等</span><span>嚴重</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ modelValue: number }>()
defineEmits<{ (e: 'update:modelValue', v: number): void }>()

const sliderColor = computed(() => {
  if (props.modelValue <= 3) return 'var(--status-success)'
  if (props.modelValue <= 6) return 'var(--status-warning)'
  return 'var(--status-danger)'
})

const sliderStyle = computed(() => ({
  background: `linear-gradient(to right, ${sliderColor.value} 0%, ${sliderColor.value} ${(props.modelValue - 1) / 9 * 100}%, var(--surface-alt) ${(props.modelValue - 1) / 9 * 100}%, var(--surface-alt) 100%)`,
  accentColor: sliderColor.value,
}))
</script>
