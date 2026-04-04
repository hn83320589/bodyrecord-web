<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 bg-surface-primary overflow-y-auto">
      <!-- Header bar -->
      <div class="sticky top-0 z-10 bg-surface-card border-b border-border-default px-6 py-3 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-content-primary">回診摘要預覽</h2>
        <div class="flex items-center gap-3">
          <PdfDownloadButton v-if="data" :visit-id="visitId" />
          <button @click="$emit('close')" class="text-content-tertiary hover:text-content-primary text-2xl leading-none">&times;</button>
        </div>
      </div>

      <!-- Content -->
      <div class="max-w-3xl mx-auto px-6 py-8">
        <LoadingSpinner v-if="loading" />

        <div v-else-if="error" class="text-center py-12">
          <p class="text-status-danger text-sm">{{ error }}</p>
        </div>

        <template v-else-if="data">
          <!-- Visit info -->
          <div class="mb-8">
            <h3 class="text-sm font-semibold text-content-tertiary uppercase tracking-widest mb-2">回診資訊</h3>
            <p class="text-lg font-semibold text-content-primary">
              {{ formatDate(data.visit.date) }}
              <template v-if="data.visit.institution"> {{ data.visit.institution }}</template>
              <template v-if="data.visit.department"> {{ data.visit.department }}</template>
            </p>
            <div v-for="dx in data.visit.diagnoses" :key="dx.code" class="text-sm text-content-secondary mt-1">
              <span class="font-mono text-xs text-content-tertiary mr-2">{{ dx.code }}</span>{{ dx.name }}
            </div>
          </div>

          <SummaryBpSection :bp="data.bloodPressure" class="mb-8" />
          <SummaryLabTable :lab="data.labResults" class="mb-8" />
          <SummaryLabTrendChart :trends="data.labTrends" class="mb-8" />
          <SummaryMedTable :med="data.medications" class="mb-8" />
          <SummarySymptomSection :symptoms="data.symptoms" class="mb-8" />

          <!-- Footer -->
          <div class="border-t border-border-default pt-4 text-xs text-content-tertiary text-center">
            <p>生成時間：{{ formatDateTime(data.generatedAt) }}</p>
            <p class="mt-1">此報告由系統自動生成，內容僅供參考</p>
          </div>

          <!-- Bottom download button -->
          <div class="flex justify-center mt-6">
            <PdfDownloadButton :visit-id="visitId" />
          </div>
        </template>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import PdfDownloadButton from './PdfDownloadButton.vue'
import SummaryBpSection from './SummaryBpSection.vue'
import SummaryLabTable from './SummaryLabTable.vue'
import SummaryLabTrendChart from './SummaryLabTrendChart.vue'
import SummaryMedTable from './SummaryMedTable.vue'
import SummarySymptomSection from './SummarySymptomSection.vue'
import { visitSummaryApi } from '@/api/visitSummary'
import { formatDate, formatDateTime } from '@/utils/dateTime'
import type { VisitSummaryJson } from '@/types/visitSummary'

const props = defineProps<{ open: boolean; visitId: number }>()
defineEmits<{ (e: 'close'): void }>()

const loading = ref(false)
const error = ref('')
const data = ref<VisitSummaryJson | null>(null)

watch(() => props.open, async (isOpen) => {
  if (!isOpen) return
  loading.value = true
  error.value = ''
  data.value = null
  try {
    data.value = await visitSummaryApi.getJson(props.visitId)
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : '載入摘要失敗'
    error.value = message
  } finally {
    loading.value = false
  }
})
</script>
