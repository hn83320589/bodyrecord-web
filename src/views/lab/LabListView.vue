<template>
  <AppLayout>
    <PageHeader title="檢驗紀錄">
      <div class="flex gap-2">
        <RouterLink to="/lab/trend" class="border border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50">
          趨勢圖
        </RouterLink>
        <RouterLink to="/lab/new" class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
          新增紀錄
        </RouterLink>
      </div>
    </PageHeader>
    <LoadingSpinner v-if="store.loading" />
    <div v-else class="space-y-4">
      <div v-for="group in store.groups" :key="group.date" class="bg-white rounded-xl shadow overflow-hidden">
        <div class="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
          <span class="font-medium text-gray-800">{{ group.date }}</span>
          <SourceBadge v-if="group.items[0]" :source="group.items[0].source" />
        </div>
        <table class="w-full text-sm">
          <tbody>
            <tr v-for="item in group.items" :key="item.id" class="border-t border-gray-100 first:border-0">
              <td class="px-4 py-2 text-gray-700 w-1/4">{{ item.itemName }}</td>
              <td class="px-4 py-2 text-gray-500 w-1/4">{{ item.category }}</td>
              <td class="px-4 py-2 w-1/4">
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
              <td class="px-4 py-2 text-gray-400 text-xs">
                參考值：{{ item.normalMin ?? '-' }} ~ {{ item.normalMax ?? '-' }} {{ item.unit }}
              </td>
              <td class="px-4 py-2">
                <button v-if="item.source === 'manual'" @click="deleteItem(item.id)"
                  class="text-red-400 hover:text-red-600 text-xs">刪除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-if="store.groups.length === 0" class="text-center py-12 text-gray-400">尚無檢驗紀錄</p>
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
import { formatDate } from '@/utils/dateTime'

const store = useLabStore()

async function deleteItem(id: number) {
  if (!confirm('確定刪除此筆檢驗？')) return
  await store.deleteItem(id)
}

onMounted(() => store.fetchGroups())
</script>
