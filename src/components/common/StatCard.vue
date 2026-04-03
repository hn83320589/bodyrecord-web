<template>
  <div class="bg-surface-card rounded-card shadow-sm p-4 border border-border-default">
    <p class="text-xs font-medium text-content-tertiary uppercase tracking-wide">{{ label }}</p>
    <p class="text-2xl font-semibold text-content-primary font-data mt-1">
      {{ value ?? '-' }}
      <span v-if="unit" class="text-xs font-normal text-content-tertiary ml-0.5">{{ unit }}</span>
    </p>
    <p v-if="sub" class="text-xs text-content-tertiary mt-1">{{ sub }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value?: string | number | null
  unit?: string
  sub?: string
}>()
</script>
