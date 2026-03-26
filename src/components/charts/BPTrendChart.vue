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
  legend: { data: ['收縮壓', '舒張壓'] },
  grid: { left: 50, right: 20, top: 40, bottom: 36 },
  xAxis: {
    type: 'category',
    data: props.points.map(p => formatDate(p.recordedAt, 'short')),
    axisLabel: { rotate: 30, fontSize: 11 },
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
  ],
}))
</script>
