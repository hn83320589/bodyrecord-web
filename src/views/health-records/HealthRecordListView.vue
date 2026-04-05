<template>
  <AppLayout>
    <PageHeader title="看診紀錄" />
    <LoadingSpinner v-if="store.loading" />
    <div v-else class="bg-surface-card rounded-card shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-surface-alt">
            <tr>
              <th class="text-left px-4 py-3 text-content-secondary font-medium">日期</th>
              <th class="text-left px-4 py-3 text-content-secondary font-medium">類型</th>
              <th class="text-left px-4 py-3 text-content-secondary font-medium">機構</th>
              <th class="text-left px-4 py-3 text-content-secondary font-medium">來源</th>
              <th class="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in store.records" :key="r.id" class="border-t border-border-default hover:bg-surface-alt">
              <td class="px-4 py-3 text-content-secondary whitespace-nowrap">{{ formatDate(r.recordedAt) }}</td>
              <td class="px-4 py-3 text-content-primary">{{ r.recordType ?? '-' }}</td>
              <td class="px-4 py-3 text-content-secondary max-w-[200px] truncate">{{ r.nhiInstitution ?? '-' }}</td>
              <td class="px-4 py-3"><SourceBadge :source="r.source" :hospital="r.nhiInstitution" /></td>
              <td class="px-4 py-3">
                <RouterLink :to="`/health-records/${r.id}`" class="text-accent hover:underline text-xs">詳情</RouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-if="store.records.length === 0" class="text-center py-12 text-content-tertiary">尚無看診紀錄</p>
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
