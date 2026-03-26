<template>
  <div class="bg-white rounded-xl shadow overflow-hidden">
    <div class="px-4 py-3 bg-gray-50 border-b border-gray-100">
      <h3 class="text-sm font-semibold text-gray-700">匯入歷史</h3>
    </div>
    <div v-if="logs.length === 0" class="text-center py-8 text-sm text-gray-400">尚無匯入紀錄</div>
    <div v-else>
      <div v-for="log in logs" :key="log.id" class="border-t border-gray-100 first:border-0 px-4 py-3 flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-800">{{ formatDate(log.importedAt) }} 匯入</p>
          <p class="text-xs text-gray-500 mt-0.5">
            資料日期：{{ log.dataDate }} ｜
            範圍：{{ log.dateRangeStart }} ~ {{ log.dateRangeEnd }}
          </p>
          <p class="text-xs text-gray-500 mt-0.5">
            看診 {{ log.healthRecordCount }} 筆 ／ 用藥 {{ log.medicationCount }} 項 ／ 檢驗 {{ log.labCount }} 筆
          </p>
        </div>
        <button @click="emit('revoke', log.id)"
          class="text-xs text-red-400 hover:text-red-600 border border-red-200 px-3 py-1 rounded-lg">
          撤銷
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NhiImportLog } from '@/types/nhi'
import { formatDate } from '@/utils/dateTime'

defineProps<{ logs: NhiImportLog[] }>()
const emit = defineEmits<{ (e: 'revoke', logId: number): void }>()
</script>
