<template>
  <section v-if="bp.totalMeasurements > 0">
    <h3 class="text-sm font-semibold text-content-tertiary uppercase tracking-widest mb-3">血壓概況</h3>

    <!-- Stats row -->
    <div class="bg-surface-alt rounded-card p-4 mb-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
      <div>
        <span class="text-content-tertiary">平均</span>
        <span class="font-data font-semibold text-content-primary ml-1">{{ bp.recentAvg.systolic }}/{{ bp.recentAvg.diastolic }}</span>
      </div>
      <div>
        <span class="text-content-tertiary">最高</span>
        <span class="font-data font-semibold text-status-danger ml-1">{{ bp.recentMax.systolic }}/{{ bp.recentMax.diastolic }}</span>
      </div>
      <div>
        <span class="text-content-tertiary">最低</span>
        <span class="font-data font-semibold text-status-success ml-1">{{ bp.recentMin.systolic }}/{{ bp.recentMin.diastolic }}</span>
      </div>
      <div class="text-content-secondary">
        {{ bp.totalMeasurements }} 筆 / {{ bp.periodMonths }} 個月
      </div>
    </div>

    <!-- Trend chart -->
    <v-chart v-if="bp.trend.length > 0" :option="chartOption" autoresize style="height: 240px" />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { TooltipComponent, GridComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import type { VisitSummaryBp } from '@/types/visitSummary'
import { formatDate } from '@/utils/dateTime'

use([CanvasRenderer, LineChart, TooltipComponent, GridComponent, LegendComponent])

const props = defineProps<{ bp: VisitSummaryBp }>()

const chartOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['收縮壓', '舒張壓'], bottom: 0 },
  grid: { left: 50, right: 20, top: 16, bottom: 50 },
  xAxis: {
    type: 'category',
    data: props.bp.trend.map(t => formatDate(t.weekStart, 'short')),
    axisLabel: { rotate: 45, fontSize: 10 },
  },
  yAxis: { type: 'value', name: 'mmHg' },
  series: [
    {
      name: '收縮壓',
      type: 'line',
      smooth: true,
      data: props.bp.trend.map(t => t.avgSystolic),
      itemStyle: { color: 'var(--accent)' },
      lineStyle: { color: 'var(--accent)', width: 2 },
    },
    {
      name: '舒張壓',
      type: 'line',
      smooth: true,
      data: props.bp.trend.map(t => t.avgDiastolic),
      itemStyle: { color: 'var(--accent-dark)' },
      lineStyle: { color: 'var(--accent-dark)', width: 2 },
    },
  ],
}))
</script>
