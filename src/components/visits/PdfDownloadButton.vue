<template>
  <button
    @click="handleDownload"
    :disabled="downloading"
    class="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent-dark disabled:opacity-50 transition"
  >
    <svg v-if="!downloading" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
    <span v-if="downloading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
    {{ downloading ? '生成中...' : '下載 PDF' }}
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { visitSummaryApi } from '@/api/visitSummary'

const props = defineProps<{ visitId: number }>()
const downloading = ref(false)

async function handleDownload() {
  downloading.value = true
  try {
    await visitSummaryApi.downloadPdf(props.visitId)
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : '未知錯誤'
    alert('PDF 下載失敗：' + message)
  } finally {
    downloading.value = false
  }
}
</script>
