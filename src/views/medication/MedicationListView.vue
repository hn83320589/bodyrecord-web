<template>
  <AppLayout>
    <PageHeader title="用藥紀錄" />
    <LoadingSpinner v-if="store.loading" />
    <div v-else class="bg-surface-card rounded-card shadow-sm overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-surface-alt">
          <tr>
            <th class="text-left px-4 py-3 text-content-secondary font-medium">藥品名稱</th>
            <th class="text-left px-4 py-3 text-content-secondary font-medium">數量</th>
            <th class="text-left px-4 py-3 text-content-secondary font-medium">天數</th>
            <th class="text-left px-4 py-3 text-content-secondary font-medium">來源</th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in store.medications" :key="m.id" class="border-t border-border-default">
            <td class="px-4 py-3 text-content-primary">{{ m.drugName }}</td>
            <td class="px-4 py-3 text-content-secondary font-data">{{ m.quantity ? `${m.quantity} 顆` : '-' }}</td>
            <td class="px-4 py-3 text-content-secondary font-data">{{ m.days ? `${m.days} 天` : '-' }}</td>
            <td class="px-4 py-3"><SourceBadge :source="m.source" /></td>
            <td class="px-4 py-3">
              <button v-if="m.source === 'nhi_import'" @click="deleteMed(m.id)"
                class="text-status-danger hover:opacity-80 text-xs">刪除</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="store.medications.length === 0" class="text-center py-12 text-content-tertiary">尚無用藥紀錄</p>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import AppLayout from '@/components/common/AppLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import SourceBadge from '@/components/common/SourceBadge.vue'
import { useMedicationStore } from '@/stores/medication'

const store = useMedicationStore()

async function deleteMed(id: number) {
  if (!confirm('確定刪除此筆用藥紀錄？')) return
  await store.deleteMedication(id)
}

onMounted(() => store.fetchMedications('medication'))
</script>
