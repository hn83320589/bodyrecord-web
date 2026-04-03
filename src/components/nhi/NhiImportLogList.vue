<template>
  <div class="bg-surface-card rounded-card shadow-sm overflow-hidden">
    <div class="px-4 py-3 bg-surface-alt border-b border-border-default">
      <h3 class="text-sm font-semibold text-content-secondary">匯入歷史</h3>
    </div>
    <div v-if="logs.length === 0" class="text-center py-8 text-sm text-content-tertiary">尚無匯入紀錄</div>
    <div v-else>
      <div v-for="log in logs" :key="log.id" class="border-t border-border-default first:border-0 px-4 py-3 flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-content-primary">{{ formatDate(log.importedAt) }} 匯入</p>
          <p v-if="log.fileName" class="text-xs text-content-tertiary mt-0.5">{{ log.fileName }}</p>
          <p class="text-xs text-content-tertiary mt-0.5">
            <template v-if="log.dataDate">資料日期：{{ log.dataDate }} ｜ </template>
            <template v-if="log.dateRangeStart">範圍：{{ log.dateRangeStart }} ~ {{ log.dateRangeEnd }}</template>
          </p>
          <p class="text-xs text-content-tertiary mt-0.5">
            看診 <span class="font-data">{{ log.visitCount }}</span> 筆 ／
            用藥 <span class="font-data">{{ log.medicationCount }}</span> 項 ／
            檢驗 <span class="font-data">{{ log.labCount }}</span> 筆
            <template v-if="log.skippedLabCount"> ／ 跳過 <span class="font-data">{{ log.skippedLabCount }}</span></template>
            <template v-if="log.duplicateLabCount"> ／ 重複 <span class="font-data">{{ log.duplicateLabCount }}</span></template>
            <template v-if="log.newItemCount"> ／ 新項目 <span class="font-data">{{ log.newItemCount }}</span></template>
          </p>
        </div>
        <button @click="emit('revoke', log.id)"
          class="text-xs text-status-danger hover:opacity-80 border border-status-danger/30 px-3 py-1 rounded-lg">
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
