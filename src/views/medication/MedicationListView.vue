<template>
  <AppLayout>
    <PageHeader title="用藥紀錄">
      <RouterLink to="/medications/reminders" class="border border-accent text-accent px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent-light">
        服藥提醒
      </RouterLink>
    </PageHeader>
    <LoadingSpinner v-if="store.loading" />
    <div v-else-if="groupedMeds.length > 0" class="space-y-4">
      <div v-for="group in groupedMeds" :key="group.date"
        class="bg-surface-card rounded-card shadow-sm overflow-hidden">
        <div class="px-4 py-3 bg-surface-alt border-b border-border-default flex items-center justify-between">
          <span class="text-sm font-semibold text-content-primary">{{ group.date }}</span>
          <span class="text-xs text-content-tertiary">{{ group.items.length }} 項</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <tbody>
              <tr v-for="m in group.items" :key="m.id" class="border-t border-border-default first:border-0">
                <td class="px-4 py-2.5 text-content-primary max-w-[200px] truncate">{{ m.medicationName }}</td>
                <td class="px-4 py-2.5 text-content-secondary font-data text-right whitespace-nowrap">{{ m.quantity ?? '-' }}</td>
                <td class="px-4 py-2.5 text-content-tertiary text-right whitespace-nowrap">{{ m.durationDays ? `${m.durationDays} 天` : '-' }}</td>
                <td class="px-3 py-2.5 whitespace-nowrap"><SourceBadge :source="m.source" /></td>
                <td class="px-3 py-2.5 whitespace-nowrap">
                  <button v-if="m.source === 'nhi_import'" @click="deleteMed(m.id)"
                    class="text-status-danger hover:opacity-80 text-xs">刪除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <p v-else class="text-center py-12 text-content-tertiary">尚無用藥紀錄</p>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import AppLayout from '@/components/common/AppLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import SourceBadge from '@/components/common/SourceBadge.vue'
import { useMedicationStore } from '@/stores/medication'
import { formatDate } from '@/utils/dateTime'
import type { MedicationRecord } from '@/types/medication'

const store = useMedicationStore()

const groupedMeds = computed(() => {
  const map = new Map<string, MedicationRecord[]>()
  for (const m of store.medications) {
    const date = formatDate(m.recordedAt)
    if (!map.has(date)) map.set(date, [])
    map.get(date)!.push(m)
  }
  return Array.from(map.entries()).map(([date, items]) => ({ date, items }))
})

async function deleteMed(id: number) {
  if (!confirm('確定刪除此筆用藥紀錄？')) return
  await store.deleteMedication(id)
}

onMounted(() => store.fetchMedications())
</script>
