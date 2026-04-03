<template>
  <div
    @dragover.prevent
    @drop.prevent="onDrop"
    @click="fileInput?.click()"
    :class="['border-2 border-dashed rounded-card p-8 text-center cursor-pointer transition',
      isDragging ? 'border-accent bg-accent-light' : 'border-border-default hover:border-accent hover:bg-surface-alt']"
    @dragenter="isDragging = true"
    @dragleave="isDragging = false">
    <input ref="fileInput" type="file" accept=".json" class="hidden" @change="onFileChange" />
    <div v-if="!file">
      <div class="text-4xl mb-3">📁</div>
      <p class="text-content-secondary font-medium">拖曳 JSON 檔案至此處</p>
      <p class="text-sm text-content-tertiary mt-1">或點擊選擇檔案（僅接受 .json）</p>
    </div>
    <div v-else class="text-left">
      <p class="text-sm font-medium text-content-primary">{{ file.name }}</p>
      <p class="text-xs text-content-tertiary mt-0.5">{{ (file.size / 1024).toFixed(1) }} KB</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{ (e: 'select', file: File): void }>()

const fileInput = ref<HTMLInputElement>()
const file = ref<File | null>(null)
const isDragging = ref(false)

function onDrop(e: DragEvent) {
  isDragging.value = false
  const f = e.dataTransfer?.files[0]
  if (f && f.name.endsWith('.json')) { file.value = f; emit('select', f) }
}
function onFileChange(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (f) { file.value = f; emit('select', f) }
}
</script>
