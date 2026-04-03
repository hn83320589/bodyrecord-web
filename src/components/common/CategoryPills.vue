<template>
  <div class="flex gap-2 flex-wrap">
    <button v-for="opt in options" :key="opt.value"
      @click="$emit('update:modelValue', opt.value)"
      :class="['px-3 py-1.5 rounded-full text-xs font-medium transition',
        modelValue === opt.value
          ? 'bg-accent text-white'
          : 'bg-surface-alt text-content-secondary hover:bg-border-default']">
      {{ opt.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  options: { label: string; value: string }[]
}>()
defineEmits<{ (e: 'update:modelValue', v: string): void }>()
</script>
