<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
    <div>
      <h1 class="text-xl font-semibold text-content-primary">{{ title }}</h1>
      <p v-if="subtitle" class="text-sm text-content-secondary mt-1">{{ subtitle }}</p>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; subtitle?: string }>()
</script>
