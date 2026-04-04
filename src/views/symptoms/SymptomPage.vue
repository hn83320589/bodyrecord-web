<template>
  <AppLayout>
    <PageHeader title="症狀日誌">
      <button @click="showForm = true"
        class="bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent-dark">
        快速記錄
      </button>
    </PageHeader>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      <StatCard label="本月紀錄" :value="summary?.totalCount ?? 0" sub="筆" />
      <StatCard label="最常見症狀" :value="summary?.mostCommonType ?? '-'"
        :sub="summary?.avgSeverity != null ? `平均嚴重度 ${summary.avgSeverity.toFixed(1)}` : ''" />
      <StatCard label="常見觸發因子" :value="summary?.mostCommonTrigger ?? '-'" />
    </div>

    <!-- Calendar Heatmap -->
    <SymptomCalendarHeatmap :calendar="summary?.calendar ?? []" @select-date="onSelectDate" class="mb-6" />

    <!-- Selected date detail -->
    <div v-if="selectedDateLogs.length > 0" class="bg-surface-card rounded-card shadow-sm p-4 mb-6">
      <h3 class="text-sm font-semibold text-content-primary mb-3">{{ selectedDate }} 的症狀</h3>
      <div v-for="log in selectedDateLogs" :key="log.id" class="flex items-center gap-3 py-2 border-t border-border-default first:border-0">
        <span class="px-2 py-0.5 rounded text-[10px] font-medium bg-cat-symptom-bg text-cat-symptom">
          {{ log.symptomType }}
        </span>
        <div class="flex-1"><SeverityBar :severity="log.severity" /></div>
        <span v-if="log.note" class="text-xs text-content-tertiary">{{ log.note }}</span>
        <button @click="deleteLog(log.id)" class="text-status-danger hover:opacity-80 text-xs">刪除</button>
      </div>
    </div>

    <!-- Timeline list -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex gap-2">
        <select v-model="typeFilter"
          class="border border-border-default rounded-lg px-3 py-1.5 text-sm bg-surface-card text-content-primary">
          <option value="">全部類型</option>
          <option v-for="t in types" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>
      <DateRangePicker v-model="range" />
    </div>

    <LoadingSpinner v-if="loading" />
    <div v-else-if="logs.length > 0" class="space-y-2">
      <div v-for="log in logs" :key="log.id"
        class="flex gap-3">
        <div class="flex flex-col items-center w-9 shrink-0 pt-1">
          <span class="text-[11px] font-semibold text-content-secondary leading-tight">{{ new Date(log.loggedAt).getDate() }}</span>
          <span class="text-[9px] text-content-tertiary">{{ weekday(log.loggedAt) }}</span>
          <div class="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-cat-symptom"></div>
          <div class="w-[1.5px] flex-1 mt-1 bg-timeline-line"></div>
        </div>
        <div class="flex-1 mb-2 bg-surface-card border border-border-default rounded-card px-4 py-3">
          <div class="flex items-center justify-between mb-1">
            <span class="text-sm font-semibold text-content-primary">{{ log.symptomType }}</span>
            <button @click="deleteLog(log.id)" class="text-status-danger hover:opacity-80 text-xs">刪除</button>
          </div>
          <SeverityBar :severity="log.severity" />
          <p v-if="log.note" class="text-xs text-content-tertiary mt-1">{{ log.note }}</p>
          <p v-if="log.triggers" class="text-xs text-content-tertiary mt-1">觸發：{{ log.triggers }}</p>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-12 text-content-tertiary">尚無症狀紀錄</div>

    <!-- Quick Form Modal -->
    <SymptomQuickForm :open="showForm" :types="types" @close="showForm = false" @created="reload" />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import AppLayout from '@/components/common/AppLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import StatCard from '@/components/common/StatCard.vue'
import DateRangePicker from '@/components/common/DateRangePicker.vue'
import SeverityBar from '@/components/symptoms/SeverityBar.vue'
import SymptomCalendarHeatmap from '@/components/symptoms/SymptomCalendarHeatmap.vue'
import SymptomQuickForm from '@/components/symptoms/SymptomQuickForm.vue'
import { symptomApi } from '@/api/symptom'
import type { SymptomLog, SymptomSummary } from '@/types/symptom'

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

const loading = ref(false)
const showForm = ref(false)
const logs = ref<SymptomLog[]>([])
const summary = ref<SymptomSummary | null>(null)
const types = ref<string[]>([])
const range = ref('3m')
const typeFilter = ref('')
const selectedDate = ref('')
const selectedDateLogs = ref<SymptomLog[]>([])

function weekday(date: string) { return WEEKDAYS[new Date(date).getDay()] }

function rangeToDate(r: string) {
  const now = new Date()
  const months: Record<string, number> = { '1m': 1, '3m': 3, '6m': 6, '1y': 12 }
  const start = new Date(now.getFullYear(), now.getMonth() - (months[r] ?? 3), now.getDate())
  return { startDate: start.toISOString().slice(0, 10), endDate: now.toISOString().slice(0, 10) }
}

async function fetchLogs() {
  loading.value = true
  try {
    const { startDate, endDate } = rangeToDate(range.value)
    logs.value = await symptomApi.list({ startDate, endDate, type: typeFilter.value || undefined })
  } catch { logs.value = [] }
  finally { loading.value = false }
}

async function reload() {
  await Promise.allSettled([
    fetchLogs(),
    symptomApi.getSummary(3).then(d => { summary.value = d }),
  ])
}

async function onSelectDate(date: string) {
  selectedDate.value = date
  try {
    selectedDateLogs.value = await symptomApi.list({ startDate: date, endDate: date })
  } catch { selectedDateLogs.value = [] }
}

async function deleteLog(id: number) {
  if (!confirm('確定刪除此筆症狀紀錄？')) return
  await symptomApi.delete(id)
  await reload()
  if (selectedDate.value) await onSelectDate(selectedDate.value)
}

watch([range, typeFilter], fetchLogs)

onMounted(async () => {
  await Promise.allSettled([
    fetchLogs(),
    symptomApi.getSummary(3).then(d => { summary.value = d }),
    symptomApi.getTypes().then(d => { types.value = d }),
  ])
})
</script>
