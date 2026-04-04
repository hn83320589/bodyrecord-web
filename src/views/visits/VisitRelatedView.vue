<template>
  <AppLayout>
    <PageHeader :title="data?.visit.institution ?? '回診詳情'">
      <div class="flex items-center gap-3">
        <button
          v-if="data"
          @click="showSummary = true"
          class="text-sm text-accent hover:text-accent-dark font-medium transition"
        >匯出摘要</button>
        <RouterLink to="/visits/timeline" class="text-sm text-content-tertiary hover:text-content-secondary">返回時間軸</RouterLink>
      </div>
    </PageHeader>

    <LoadingSpinner v-if="loading" />
    <div v-else-if="data" class="space-y-6 max-w-3xl">
      <!-- 回診資訊 -->
      <div class="bg-surface-card rounded-card shadow-sm p-6">
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-content-tertiary">就醫日期</span>
            <p class="text-content-primary font-semibold mt-0.5">{{ formatDate(data.visit.recordedAt) }}</p>
          </div>
          <div>
            <span class="text-content-tertiary">機構</span>
            <p class="text-content-primary font-semibold mt-0.5">{{ data.visit.institution ?? '-' }}</p>
          </div>
          <div v-if="data.visit.medicalCost != null">
            <span class="text-content-tertiary">費用點數</span>
            <p class="text-content-primary font-data mt-0.5">{{ data.visit.medicalCost }}</p>
          </div>
          <div v-if="data.visit.copaymentCode">
            <span class="text-content-tertiary">部分負擔代碼</span>
            <p class="text-content-secondary mt-0.5">{{ data.visit.copaymentCode }}</p>
          </div>
        </div>

        <!-- 診斷列表 -->
        <div v-if="data.visit.diagnoses.length > 0" class="mt-4 border-t border-border-default pt-4">
          <p class="text-xs font-semibold text-content-tertiary uppercase tracking-wide mb-2">診斷</p>
          <div class="space-y-1">
            <div v-for="(dx, i) in data.visit.diagnoses.slice(0, 5)" :key="i" class="text-sm flex gap-2">
              <span class="text-content-tertiary font-mono text-xs min-w-[50px]">{{ dx.code }}</span>
              <span class="text-content-primary">{{ dx.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 檢驗結果 -->
      <RelatedLabSection :labs="data.labResults" />

      <!-- 用藥 -->
      <RelatedMedSection :meds="data.medications" />

      <!-- 血壓趨勢 -->
      <RelatedBpSection :bps="data.bloodPressures" :visit-date="data.visit.recordedAt" />
    </div>

    <VisitSummaryModal
      :open="showSummary"
      :visit-id="Number(route.params.id)"
      @close="showSummary = false"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import VisitSummaryModal from '@/components/visits/VisitSummaryModal.vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/common/AppLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import RelatedLabSection from '@/components/visits/RelatedLabSection.vue'
import RelatedMedSection from '@/components/visits/RelatedMedSection.vue'
import RelatedBpSection from '@/components/visits/RelatedBpSection.vue'
import { visitApi } from '@/api/visit'
import { formatDate } from '@/utils/dateTime'
import type { VisitRelatedResponse } from '@/types/visit'

const route = useRoute()
const loading = ref(false)
const data = ref<VisitRelatedResponse | null>(null)
const showSummary = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    data.value = await visitApi.getRelated(Number(route.params.id))
  } finally {
    loading.value = false
  }
})
</script>
