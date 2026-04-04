<template>
  <div class="bg-surface-card border border-border-default rounded-card px-4 py-3
              hover:border-border-active hover:shadow-md transition cursor-pointer"
    @click="$emit('click')">
    <!-- Row 1: date + institution + diagnosis -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="text-sm font-semibold text-content-primary">{{ institution ?? '未知機構' }}</span>
        <span class="text-xs text-content-tertiary">{{ formattedDate }}</span>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click.stop="handleDownloadPdf"
          :disabled="downloadingPdf"
          class="p-1 rounded text-content-tertiary hover:text-accent hover:bg-surface-alt transition disabled:opacity-50"
          title="下載摘要 PDF"
        >
          <svg v-if="!downloadingPdf" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span v-else class="block w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"></span>
        </button>
        <span class="px-2 py-0.5 rounded text-[10px] font-medium" style="background: var(--cat-visit-bg); color: var(--cat-visit)">
          回診
        </span>
      </div>
    </div>
    <p v-if="primaryDiagnosis" class="text-sm text-content-secondary mt-1">{{ primaryDiagnosis }}</p>

    <!-- Row 2: keyLabs preview -->
    <div v-if="keyLabs.length > 0" class="flex gap-3 mt-2">
      <div v-for="(lab, i) in keyLabs.slice(0, 3)" :key="i"
        class="flex items-center gap-1 text-xs">
        <div class="w-1.5 h-1.5 rounded-full shrink-0" :class="statusDotClass(lab.status)"></div>
        <span class="text-content-secondary">{{ lab.displayName }}</span>
        <span class="font-data font-semibold" :class="statusTextClass(lab.status)">
          {{ lab.value ?? '-' }}
        </span>
        <span v-if="lab.unit" class="text-content-tertiary">{{ lab.unit }}</span>
      </div>
    </div>

    <!-- Row 3: counts -->
    <p class="text-xs text-content-tertiary mt-2">
      檢驗 {{ labCount }} 項 · 用藥 {{ medicationCount }} 種
      <template v-if="bpOnDay"> · 血壓 {{ bpOnDay.systolic }}/{{ bpOnDay.diastolic }}</template>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { KeyLab, BloodPressureSimple } from '@/types/visit'
import { formatDate } from '@/utils/dateTime'
import { visitSummaryApi } from '@/api/visitSummary'

const props = defineProps<{
  visitId: number
  recordedAt: string
  institution?: string
  primaryDiagnosis?: string
  keyLabs: KeyLab[]
  labCount: number
  medicationCount: number
  bpOnDay?: BloodPressureSimple
}>()
defineEmits<{ (e: 'click'): void }>()

const downloadingPdf = ref(false)

async function handleDownloadPdf() {
  downloadingPdf.value = true
  try {
    await visitSummaryApi.downloadPdf(props.visitId)
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : '未知錯誤'
    alert('PDF 下載失敗：' + message)
  } finally {
    downloadingPdf.value = false
  }
}

const formattedDate = computed(() => formatDate(props.recordedAt))

function statusDotClass(status: string) {
  return status === 'high' || status === 'low' ? 'bg-status-danger' : status === 'normal' ? 'bg-status-success' : 'bg-content-tertiary'
}
function statusTextClass(status: string) {
  return status === 'high' || status === 'low' ? 'text-status-danger' : status === 'normal' ? 'text-status-success' : 'text-content-secondary'
}
</script>
