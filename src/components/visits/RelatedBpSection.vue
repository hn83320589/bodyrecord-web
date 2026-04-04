<template>
  <div class="bg-surface-card rounded-card shadow-sm p-6">
    <h3 class="text-sm font-semibold text-content-primary mb-4">
      血壓趨勢
      <span class="text-content-tertiary font-normal ml-2">±3 天</span>
    </h3>

    <div v-if="bps.length === 0" class="text-sm text-content-tertiary">此期間無血壓紀錄</div>

    <template v-else>
      <v-chart :option="chartOption" autoresize style="height: 240px" />
      <p class="text-xs text-content-tertiary mt-3 text-center">
        平均 <span class="font-data font-semibold text-content-primary">{{ avgSystolic }}/{{ avgDiastolic }}</span> mmHg · {{ bps.length }} 筆
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { TooltipComponent, GridComponent, MarkLineComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import type { BloodPressureWithDate } from '@/types/visit'
import { formatDate } from '@/utils/dateTime'

use([CanvasRenderer, LineChart, TooltipComponent, GridComponent, MarkLineComponent, LegendComponent])

const props = defineProps<{
  bps: BloodPressureWithDate[]
  visitDate: string
}>()

const sorted = computed(() => [...props.bps].sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime()))

const avgSystolic = computed(() => {
  if (props.bps.length === 0) return 0
  return Math.round(props.bps.reduce((s, b) => s + b.systolic, 0) / props.bps.length)
})
const avgDiastolic = computed(() => {
  if (props.bps.length === 0) return 0
  return Math.round(props.bps.reduce((s, b) => s + b.diastolic, 0) / props.bps.length)
})

const chartOption = computed(() => {
  const dates = sorted.value.map(b => formatDate(b.recordedAt, 'short'))
  const visitDateShort = formatDate(props.visitDate, 'short')

  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['收縮壓', '舒張壓'], textStyle: { color: 'var(--text-secondary)' } },
    grid: { left: 40, right: 16, top: 36, bottom: 28 },
    xAxis: {
      type: 'category',
      data: dates,
      axisLine: { lineStyle: { color: 'var(--border-default)' } },
      axisLabel: { fontSize: 11, color: 'var(--text-tertiary)' },
    },
    yAxis: {
      type: 'value',
      min: 40,
      axisLine: { lineStyle: { color: 'var(--border-default)' } },
      splitLine: { lineStyle: { color: 'var(--border-default)', type: 'dashed' } },
      axisLabel: { fontSize: 11, color: 'var(--text-tertiary)' },
    },
    series: [
      {
        name: '收縮壓',
        type: 'line',
        smooth: true,
        data: sorted.value.map(b => b.systolic),
        itemStyle: { color: 'var(--accent)' },
        lineStyle: { color: 'var(--accent)', width: 2 },
        markLine: {
          silent: true,
          data: [{ xAxis: visitDateShort }],
          lineStyle: { type: 'dashed', color: 'var(--cat-visit)', width: 1.5 },
          label: { formatter: '回診', fontSize: 10, color: 'var(--cat-visit)' },
        },
      },
      {
        name: '舒張壓',
        type: 'line',
        smooth: true,
        data: sorted.value.map(b => b.diastolic),
        itemStyle: { color: 'var(--status-success)' },
        lineStyle: { color: 'var(--status-success)', width: 2 },
      },
    ],
  }
})
</script>
