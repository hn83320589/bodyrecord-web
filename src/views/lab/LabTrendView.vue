<template>
  <AppLayout>
    <PageHeader title="檢驗趨勢">
      <RouterLink to="/lab" class="text-sm text-content-tertiary hover:text-content-secondary">返回列表</RouterLink>
    </PageHeader>
    <div class="bg-surface-card rounded-card shadow-sm p-6">
      <div v-if="loadingItems" class="text-sm text-content-tertiary mb-4">載入項目中...</div>
      <div v-else class="flex gap-2 mb-6 flex-wrap">
        <button v-for="item in itemsWithData" :key="`${item.itemCode}-${item.itemName}`"
          @click="selectItem(item)"
          :class="['px-3 py-1 rounded-full text-xs font-medium transition',
            isSelected(item) ? 'bg-accent text-white' : 'bg-surface-alt text-content-secondary hover:bg-border-default']">
          {{ item.itemName }}
        </button>
      </div>
      <LabTrendChart v-if="trendData && !store.loading" :trends="[trendData]" :loading="store.loading" />
      <p v-else-if="!store.loading" class="text-center text-content-tertiary py-12">選擇指標查看趨勢</p>
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

// 只顯示實際有檢驗紀錄的項目
const itemsWithData = computed(() => {
  const recordedKeys = new Set<string>()
  for (const g of (Array.isArray(store.groups) ? store.groups : [])) {
    for (const item of (Array.isArray(g.items) ? g.items : [])) {
      recordedKeys.add(`${item.itemCode}|${item.itemName}`)
    }
  }
  return userLabItems.value.filter(i => recordedKeys.has(`${i.itemCode}|${i.itemName}`))
})

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
    await Promise.allSettled([
      userLabItemApi.getAll().then(d => { userLabItems.value = d }),
      store.fetchGroups(),
    ])
  } finally {
    loadingItems.value = false
  }
})
</script>
