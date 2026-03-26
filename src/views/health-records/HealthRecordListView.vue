<template>
  <AppLayout>
    <PageHeader title="看診紀錄" />
    <LoadingSpinner v-if="store.loading" />
    <div v-else class="bg-white rounded-xl shadow overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">就醫日期</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">醫院</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">主診斷</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">來源</th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in store.records" :key="r.id" class="border-t border-gray-100 hover:bg-gray-50">
            <td class="px-4 py-3 text-gray-700">{{ formatDate(r.clinicDate) }}</td>
            <td class="px-4 py-3 text-gray-600">{{ r.hospital ?? '-' }}</td>
            <td class="px-4 py-3 text-gray-700">{{ r.primaryDiagnosis ?? '-' }}</td>
            <td class="px-4 py-3"><SourceBadge :source="r.source" :hospital="r.hospital" /></td>
            <td class="px-4 py-3">
              <RouterLink :to="`/health-records/${r.id}`" class="text-indigo-600 hover:underline text-xs">詳情</RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="store.records.length === 0" class="text-center py-12 text-gray-400">尚無看診紀錄</p>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import AppLayout from '@/components/common/AppLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import SourceBadge from '@/components/common/SourceBadge.vue'
import { useHealthRecordStore } from '@/stores/healthRecord'
import { formatDate } from '@/utils/dateTime'

const store = useHealthRecordStore()
onMounted(() => store.fetchRecords())
</script>
