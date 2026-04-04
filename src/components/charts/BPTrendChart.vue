<template>
  <v-chart :option="option" :loading="loading" autoresize style="height:320px" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { TooltipComponent, GridComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import type { BloodPressureChartPoint } from '@/types/bloodPressure'
import { formatDate } from '@/utils/dateTime'

use([CanvasRenderer, LineChart, TooltipComponent, GridComponent, LegendComponent])

const props = defineProps<{ points: BloodPressureChartPoint[]; loading?: boolean }>()

const option = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['收縮壓', '舒張壓', '脈搏'], bottom: 0 },
  grid: { left: 50, right: 20, top: 20, bottom: 60 },
  xAxis: {
    type: 'category',
    data: props.points.map(p => formatDate(p.recordedAt, 'short')),
    axisLabel: { rotate: 45, fontSize: 10, margin: 8 },
  },
  yAxis: { type: 'value', min: 40 },
  series: [
    {
      name: '收縮壓',
      type: 'line',
      smooth: true,
      data: props.points.map(p => p.systolic),
      itemStyle: { color: '#ef4444' },
      lineStyle: { color: '#ef4444', width: 2 },
    },
    {
      name: '舒張壓',
      type: 'line',
      smooth: true,
      data: props.points.map(p => p.diastolic),
      itemStyle: { color: '#6366f1' },
      lineStyle: { color: '#6366f1', width: 2 },
    },
    {
      name: '脈搏',
      type: 'line',
      smooth: true,
      data: props.points.map(p => p.pulse),
      itemStyle: { color: '#22c55e' },
      lineStyle: { color: '#22c55e', width: 1.5, type: 'dashed' },
    },
  ],
}))
</script>
