<template>
  <AppLayout>
    <PageHeader title="血壓紀錄">
      <div class="flex gap-2">
        <RouterLink to="/stats" class="border border-accent text-accent px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent-light">
          統計圖表
        </RouterLink>
        <RouterLink to="/records/new" class="bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent-dark">
          新增紀錄
        </RouterLink>
      </div>
    </PageHeader>
    <LoadingSpinner v-if="store.loading" />
    <div v-else class="bg-surface-card rounded-card shadow-sm overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-surface-alt">
          <tr>
            <th class="text-left px-4 py-3 text-content-secondary font-medium">時間</th>
            <th class="text-left px-4 py-3 text-content-secondary font-medium">血壓</th>
            <th class="text-left px-4 py-3 text-content-secondary font-medium">脈搏</th>
            <th class="text-left px-4 py-3 text-content-secondary font-medium">來源</th>
            <th class="text-left px-4 py-3 text-content-secondary font-medium">備註</th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in store.records" :key="r.id" class="border-t border-border-default">
            <td class="px-4 py-3 text-content-secondary">{{ formatDateTime(r.recordedAt) }}</td>
            <td class="px-4 py-3 font-medium font-data" :class="bpColor(r.systolic, r.diastolic)">
              {{ r.systolic }}/{{ r.diastolic }}
            </td>
            <td class="px-4 py-3 text-content-secondary font-data">{{ r.pulse ?? '-' }}</td>
            <td class="px-4 py-3"><SourceBadge :source="r.source" /></td>
            <td class="px-4 py-3 text-content-tertiary">{{ r.note ?? '-' }}</td>
            <td class="px-4 py-3">
              <button @click="deleteRecord(r.id)"
                class="text-status-danger hover:opacity-80 text-xs">刪除</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="store.records.length === 0" class="text-center py-12 text-content-tertiary">尚無紀錄</p>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import AppLayout from '@/components/common/AppLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import SourceBadge from '@/components/common/SourceBadge.vue'
import { useBloodPressureStore } from '@/stores/bloodPressure'
import { formatDateTime } from '@/utils/dateTime'
import { classifyBP, BP_CATEGORY_COLOR } from '@/utils/bpClassify'

const store = useBloodPressureStore()

function bpColor(s: number, d: number) {
  return BP_CATEGORY_COLOR[classifyBP(s, d)]
}

async function deleteRecord(id: number) {
  if (!confirm('確定刪除此筆血壓紀錄？')) return
  await store.deleteRecord(id)
}

onMounted(() => store.fetchRecords())
</script>
