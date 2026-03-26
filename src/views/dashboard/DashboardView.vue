<template>
  <AppLayout>
    <PageHeader title="總覽" />
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- 最近血壓 -->
      <div class="bg-white rounded-xl shadow p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">最近血壓</h2>
        <LoadingSpinner v-if="bpStore.loading" />
        <div v-else-if="latestBP">
          <div class="flex items-end gap-2">
            <span class="text-4xl font-bold text-gray-900">{{ latestBP.systolic }}/{{ latestBP.diastolic }}</span>
            <span class="text-lg text-gray-500 mb-1">mmHg</span>
          </div>
          <p class="text-sm text-gray-500 mt-1">{{ formatDateTime(latestBP.recordedAt) }}</p>
          <RouterLink to="/records" class="mt-4 text-sm text-indigo-600 hover:underline block">查看全部</RouterLink>
        </div>
        <p v-else class="text-sm text-gray-400">尚無血壓紀錄</p>
      </div>

      <!-- 最近異常檢驗 -->
      <div class="bg-white rounded-xl shadow p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">最近異常檢驗</h2>
        <LoadingSpinner v-if="labStore.loading" />
        <div v-else-if="abnormalItems.length > 0">
          <div v-for="item in abnormalItems.slice(0, 3)" :key="item.id" class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
            <div>
              <span class="text-sm font-medium text-gray-800">{{ item.itemName }}</span>
              <SourceBadge :source="item.source" :hospital="item.hospital" class="ml-2" />
            </div>
            <LabValueBadge
              :is-numeric="item.isNumeric"
              :value-numeric="item.valueNumeric"
              :value-text="item.valueText"
              :unit="item.unit"
              :normal-min="item.normalMin"
              :normal-max="item.normalMax"
              :is-abnormal="item.isAbnormal"
            />
          </div>
          <RouterLink to="/lab" class="mt-4 text-sm text-indigo-600 hover:underline block">查看全部</RouterLink>
        </div>
        <p v-else class="text-sm text-gray-400">無異常檢驗值</p>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import AppLayout from '@/components/common/AppLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import SourceBadge from '@/components/common/SourceBadge.vue'
import LabValueBadge from '@/components/charts/LabValueBadge.vue'
import { useBloodPressureStore } from '@/stores/bloodPressure'
import { useLabStore } from '@/stores/lab'
import { formatDateTime } from '@/utils/dateTime'

const bpStore = useBloodPressureStore()
const labStore = useLabStore()

const latestBP = computed(() => bpStore.records[0] ?? null)
const abnormalItems = computed(() =>
  labStore.groups.flatMap(g => g.items).filter(i => i.isAbnormal)
)

onMounted(() => {
  bpStore.fetchRecords()
  labStore.fetchGroups()
})
</script>
