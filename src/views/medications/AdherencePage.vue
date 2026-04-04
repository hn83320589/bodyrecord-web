<template>
  <AppLayout>
    <PageHeader title="服藥率報告">
      <RouterLink to="/medications/reminders" class="text-sm text-content-tertiary hover:text-content-secondary">返回提醒</RouterLink>
    </PageHeader>

    <LoadingSpinner v-if="loading" />
    <div v-else-if="data" class="space-y-6 max-w-3xl">
      <!-- Overall ring -->
      <div class="bg-surface-card rounded-card shadow-sm p-6 flex justify-center">
        <AdherenceRing :rate="data.overallRate" :size="160" :stroke-width="14" label="整體服藥率" />
      </div>

      <!-- By medication -->
      <div class="bg-surface-card rounded-card shadow-sm p-6">
        <h3 class="text-sm font-semibold text-content-primary mb-4">各藥物服藥率</h3>
        <div class="space-y-3">
          <div v-for="m in data.byMedication" :key="m.medicationName" class="flex items-center gap-3">
            <span class="text-sm text-content-primary flex-1">{{ m.medicationName }}</span>
            <div class="w-32 h-2 bg-surface-alt rounded-full overflow-hidden">
              <div class="h-full rounded-full" :style="{ width: `${m.rate * 100}%`, backgroundColor: rateColor(m.rate) }"></div>
            </div>
            <span class="text-xs font-data w-10 text-right" :style="{ color: rateColor(m.rate) }">
              {{ Math.round(m.rate * 100) }}%
            </span>
          </div>
        </div>
      </div>

      <!-- Daily trend -->
      <div class="bg-surface-card rounded-card shadow-sm p-6">
        <h3 class="text-sm font-semibold text-content-primary mb-4">每日趨勢</h3>
        <v-chart v-if="data.dailyTrend.length" :option="trendOption" autoresize style="height: 240px" />
        <p v-else class="text-sm text-content-tertiary text-center py-8">資料不足</p>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { TooltipComponent, GridComponent, MarkLineComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import AppLayout from '@/components/common/AppLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import AdherenceRing from '@/components/medications/AdherenceRing.vue'
import { medicationLogApi } from '@/api/medicationLog'
import type { AdherenceResponse } from '@/types/medicationReminder'
import { formatDate } from '@/utils/dateTime'

use([CanvasRenderer, LineChart, TooltipComponent, GridComponent, MarkLineComponent])

const loading = ref(false)
const data = ref<AdherenceResponse | null>(null)

function rateColor(rate: number) {
  if (rate >= 0.9) return 'var(--status-success)'
  if (rate >= 0.7) return 'var(--status-warning)'
  return 'var(--status-danger)'
}

const trendOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    formatter: (p: any) => `${p[0].axisValue}<br/>服藥率: ${Math.round(p[0].value * 100)}%`,
  },
  grid: { left: 40, right: 16, top: 16, bottom: 28 },
  xAxis: {
    type: 'category',
    data: data.value?.dailyTrend.map(d => formatDate(d.date, 'short')) ?? [],
    axisLabel: { fontSize: 10, color: 'var(--text-tertiary)' },
    axisLine: { lineStyle: { color: 'var(--border-default)' } },
  },
  yAxis: {
    type: 'value', min: 0, max: 1,
    axisLabel: {
      fontSize: 10,
      color: 'var(--text-tertiary)',
      formatter: (v: number) => `${Math.round(v * 100)}%`,
    },
    splitLine: { lineStyle: { color: 'var(--border-default)', type: 'dashed' as const } },
  },
  series: [{
    type: 'line',
    smooth: true,
    data: data.value?.dailyTrend.map(d => d.rate) ?? [],
    itemStyle: { color: 'var(--accent)' },
    lineStyle: { color: 'var(--accent)', width: 2 },
    areaStyle: { color: 'var(--accent-light)', opacity: 0.3 },
    markLine: {
      silent: true,
      data: [{ yAxis: 0.8 }],
      lineStyle: { type: 'dashed' as const, color: 'var(--status-warning)', width: 1 },
      label: { formatter: '80%', fontSize: 10, color: 'var(--status-warning)' },
    },
  }],
}))

onMounted(async () => {
  loading.value = true
  try { data.value = await medicationLogApi.getAdherence(30) }
  finally { loading.value = false }
})
</script>
