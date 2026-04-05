<template>
  <AppLayout>
    <PageHeader title="檢驗紀錄">
      <div class="flex gap-2">
        <RouterLink to="/lab/trend" class="border border-accent text-accent px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent-light">
          趨勢圖
        </RouterLink>
        <RouterLink to="/lab/new" class="bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent-dark">
          新增紀錄
        </RouterLink>
      </div>
    </PageHeader>
    <LoadingSpinner v-if="store.loading" />
    <div v-else class="space-y-4">
      <div v-for="group in store.groups" :key="group.date" class="bg-surface-card rounded-card shadow-sm overflow-hidden">
        <div class="px-4 py-3 bg-surface-alt border-b border-border-default flex items-center gap-3">
          <span class="font-medium text-content-primary">{{ group.date }}</span>
          <SourceBadge v-if="group.items[0]" :source="group.items[0].source" />
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <tbody>
              <tr v-for="item in group.items" :key="item.id" class="border-t border-border-default first:border-0">
                <td class="px-4 py-2 text-content-secondary w-1/4 max-w-[200px] truncate">{{ item.itemName }}</td>
                <td class="px-4 py-2 text-content-tertiary w-1/4">{{ item.category }}</td>
                <td class="px-4 py-2 w-1/4 font-data">
                  <LabValueBadge
                    :is-numeric="item.isNumeric"
                    :value-numeric="item.valueNumeric"
                    :value-text="item.valueText"
                    :unit="item.unit"
                    :normal-min="item.normalMin"
                    :normal-max="item.normalMax"
                    :is-abnormal="item.isAbnormal"
                  />
                </td>
                <td class="px-4 py-2 text-content-tertiary text-xs font-data whitespace-nowrap">
                  參考值：{{ item.normalMin ?? '-' }} ~ {{ item.normalMax ?? '-' }} {{ item.unit }}
                </td>
                <td class="px-4 py-2">
                  <button v-if="item.source === 'manual'" @click="deleteItem(item.id)"
                    class="text-status-danger hover:opacity-80 text-xs">刪除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <p v-if="store.groups.length === 0" class="text-center py-12 text-content-tertiary">尚無檢驗紀錄</p>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import AppLayout from '@/components/common/AppLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import SourceBadge from '@/components/common/SourceBadge.vue'
import LabValueBadge from '@/components/charts/LabValueBadge.vue'
import { useLabStore } from '@/stores/lab'

const store = useLabStore()

async function deleteItem(id: number) {
  if (!confirm('確定刪除此筆檢驗？')) return
  await store.deleteItem(id)
}

onMounted(() => store.fetchGroups())
</script>
