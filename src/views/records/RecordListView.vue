<template>
  <AppLayout>
    <PageHeader title="血壓紀錄">
      <RouterLink to="/records/new"
        class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
        新增紀錄
      </RouterLink>
    </PageHeader>
    <LoadingSpinner v-if="store.loading" />
    <div v-else class="bg-white rounded-xl shadow overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">時間</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">血壓</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">脈搏</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">來源</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">備註</th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in store.records" :key="r.id" class="border-t border-gray-100">
            <td class="px-4 py-3 text-gray-700">{{ formatDateTime(r.recordedAt) }}</td>
            <td class="px-4 py-3 font-medium" :class="bpColor(r.systolic, r.diastolic)">
              {{ r.systolic }}/{{ r.diastolic }}
            </td>
            <td class="px-4 py-3 text-gray-600">{{ r.pulse ?? '-' }}</td>
            <td class="px-4 py-3"><SourceBadge :source="r.source" /></td>
            <td class="px-4 py-3 text-gray-500">{{ r.note ?? '-' }}</td>
            <td class="px-4 py-3">
              <button @click="deleteRecord(r.id)"
                class="text-red-400 hover:text-red-600 text-xs">刪除</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="store.records.length === 0" class="text-center py-12 text-gray-400">尚無紀錄</p>
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
