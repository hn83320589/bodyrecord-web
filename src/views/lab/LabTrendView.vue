<template>
  <AppLayout>
    <PageHeader title="檢驗趨勢" />
    <div class="bg-white rounded-xl shadow p-6">
      <div v-if="loadingItems" class="text-sm text-gray-400 mb-4">載入項目中...</div>
      <div v-else class="flex gap-2 mb-6 flex-wrap">
        <button v-for="item in userLabItems" :key="`${item.itemCode}-${item.itemName}`"
          @click="selectItem(item)"
          :class="['px-3 py-1 rounded-full text-xs font-medium transition',
            isSelected(item) ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']">
          {{ item.itemName }}
        </button>
      </div>
      <LabTrendChart v-if="trendData && !store.loading" :trends="[trendData]" :loading="store.loading" />
      <p v-else-if="!store.loading" class="text-center text-gray-400 py-12">選擇指標查看趨勢</p>
      <LoadingSpinner v-else />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AppLayout from '@/components/common/AppLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import LabTrendChart from '@/components/charts/LabTrendChart.vue'
import { useLabStore } from '@/stores/lab'
import { userLabItemApi } from '@/api/userLabItem'
import type { UserLabItem } from '@/types/userLabItem'
import type { LabTrendResponse } from '@/types/lab'

const store = useLabStore()
const userLabItems = ref<UserLabItem[]>([])
const loadingItems = ref(false)
const selectedItem = ref<UserLabItem | null>(null)

function isSelected(item: UserLabItem) {
  return selectedItem.value?.itemCode === item.itemCode &&
         selectedItem.value?.itemName === item.itemName
}

// 組合 UserLabItem 資訊 + raw points 成 chart 需要的格式
const trendData = computed((): LabTrendResponse | null => {
  if (!selectedItem.value || store.trendPoints.length === 0) return null
  const item = selectedItem.value
  return {
    itemCode: item.itemCode,
    itemName: item.itemName,
    unit: item.unit,
    normalMin: item.normalMin,
    normalMax: item.normalMax,
    points: store.trendPoints.map(p => ({
      recordedAt: p.recordedAt,
      value: Number(p.value),
      isAbnormal:
        (item.normalMax != null && Number(p.value) > item.normalMax) ||
        (item.normalMin != null && Number(p.value) < item.normalMin),
    })),
  }
})

function selectItem(item: UserLabItem) {
  selectedItem.value = item
  store.fetchTrend(item.itemCode, item.itemName)
}

onMounted(async () => {
  loadingItems.value = true
  try {
    userLabItems.value = await userLabItemApi.getAll()
  } finally {
    loadingItems.value = false
  }
})
</script>
