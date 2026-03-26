<template>
  <AppLayout>
    <PageHeader title="檢驗趨勢" />
    <div class="bg-white rounded-xl shadow p-6">
      <div class="flex gap-2 mb-6 flex-wrap">
        <button v-for="p in LAB_PRESETS" :key="p.itemCode"
          @click="selectItem(p.itemCode)"
          :class="['px-3 py-1 rounded-full text-xs font-medium transition',
            selectedCode === p.itemCode ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']">
          {{ p.itemCode }}
        </button>
      </div>
      <LabTrendChart v-if="trendData && !store.loading" :trends="[trendData]" :loading="store.loading" />
      <p v-else-if="!store.loading" class="text-center text-gray-400 py-12">選擇指標查看趨勢</p>
      <LoadingSpinner v-else />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AppLayout from '@/components/common/AppLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import LabTrendChart from '@/components/charts/LabTrendChart.vue'
import { useLabStore } from '@/stores/lab'
import { LAB_PRESETS } from '@/constants/labPresets'
import type { LabTrendResponse } from '@/types/lab'

const store = useLabStore()
const selectedCode = ref('')

const selectedPreset = computed(() => LAB_PRESETS.find(p => p.itemCode === selectedCode.value))

// 組合 preset 資訊 + raw points 成 chart 需要的格式
const trendData = computed((): LabTrendResponse | null => {
  if (!selectedPreset.value || store.trendPoints.length === 0) return null
  const preset = selectedPreset.value
  return {
    itemCode: preset.itemCode,
    itemName: preset.itemName,
    unit: preset.unit,
    normalMin: preset.normalMin,
    normalMax: preset.normalMax,
    points: store.trendPoints.map(p => ({
      recordedAt: p.recordedAt,
      value: Number(p.value),
      isAbnormal:
        (preset.normalMax != null && Number(p.value) > preset.normalMax) ||
        (preset.normalMin != null && Number(p.value) < preset.normalMin),
    })),
  }
})

function selectItem(code: string) {
  selectedCode.value = code
  store.fetchTrend(code)
}
</script>
