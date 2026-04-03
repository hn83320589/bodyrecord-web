<template>
  <AppLayout>
    <PageHeader title="健保存摺匯入" subtitle="匯入健保存摺 JSON 檔案，自動整理看診、用藥與檢驗紀錄" />
    <div class="space-y-6 max-w-2xl">
      <div class="bg-surface-card rounded-card shadow-sm p-6">
        <NhiImportUploader @select="onFileSelect" />
        <div v-if="selectedFile" class="mt-4">
          <button @click="handleImport" :disabled="importing"
            class="w-full bg-accent text-white py-2.5 rounded-lg font-medium hover:bg-accent-dark disabled:opacity-50">
            {{ importing ? '匯入中...' : '開始匯入' }}
          </button>
        </div>
        <p v-if="importError" class="mt-3 text-sm text-status-danger">{{ importError }}</p>

        <!-- Import Result -->
        <div v-if="importResult" class="mt-4 bg-status-success-bg border border-status-success/30 rounded-lg p-4">
          <p class="text-sm font-semibold text-status-success mb-2">匯入成功！</p>
          <div class="text-sm text-status-success space-y-1">
            <p>看診：<span class="font-data">{{ importResult.visitCount }}</span> 筆</p>
            <p>用藥：<span class="font-data">{{ importResult.medicationCount }}</span> 項</p>
            <p>檢驗：<span class="font-data">{{ importResult.labCount }}</span> 筆</p>
            <p v-if="importResult.newItemCount">新增項目：<span class="font-data">{{ importResult.newItemCount }}</span> 個</p>
            <p v-if="importResult.skippedLabCount">跳過：<span class="font-data">{{ importResult.skippedLabCount }}</span> 項</p>
            <p v-if="importResult.duplicateLabCount">重複：<span class="font-data">{{ importResult.duplicateLabCount }}</span> 項</p>
            <p v-if="importResult.dateRangeStart">日期範圍：{{ importResult.dateRangeStart }} ~ {{ importResult.dateRangeEnd }}</p>
          </div>
        </div>
      </div>

      <!-- History -->
      <NhiImportLogList :logs="logs" @revoke="handleRevoke" />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppLayout from '@/components/common/AppLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import NhiImportUploader from '@/components/nhi/NhiImportUploader.vue'
import NhiImportLogList from '@/components/nhi/NhiImportLogList.vue'
import { nhiApi } from '@/api/nhi'
import type { NhiImportResult, NhiImportLog } from '@/types/nhi'

const selectedFile = ref<File | null>(null)
const importing = ref(false)
const importError = ref('')
const importResult = ref<NhiImportResult | null>(null)
const logs = ref<NhiImportLog[]>([])

function onFileSelect(file: File) { selectedFile.value = file; importResult.value = null; importError.value = '' }

async function handleImport() {
  if (!selectedFile.value) return
  importing.value = true
  importError.value = ''
  try {
    importResult.value = await nhiApi.import(selectedFile.value)
    await loadLogs()
  } catch (e: any) {
    importError.value = e.message
  } finally {
    importing.value = false
  }
}

async function handleRevoke(logId: number) {
  if (!confirm('確定撤銷此次匯入？相關看診、用藥與檢驗資料將一併刪除。')) return
  await nhiApi.deleteLog(logId)
  await loadLogs()
}

async function loadLogs() { logs.value = await nhiApi.getLogs() }
onMounted(loadLogs)
</script>
