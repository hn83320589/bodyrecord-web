<template>
  <section v-if="trends.length > 0">
    <h3 class="text-sm font-semibold text-content-tertiary uppercase tracking-widest mb-3">關鍵指標趨勢</h3>
    <v-chart :option="chartOption" autoresize style="height: 280px" />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { TooltipComponent, GridComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import type { VisitSummaryLabTrend } from '@/types/visitSummary'
import { formatDate } from '@/utils/dateTime'

use([CanvasRenderer, LineChart, TooltipComponent, GridComponent, LegendComponent])

const props = defineProps<{ trends: VisitSummaryLabTrend[] }>()

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6']

const directionArrow: Record<string, string> = {
  up: '\u2191',
  down: '\u2193',
  stable: '\u2192',
}

const chartOption = computed(() => {
  const visibleTrends = props.trends.slice(0, 4)

  // Collect all unique dates for x-axis
  const dateSet = new Set<string>()
  visibleTrends.forEach(t => t.points.forEach(p => dateSet.add(p.date)))
  const dates = [...dateSet].sort()

  return {
    tooltip: { trigger: 'axis' },
    legend: {
      data: visibleTrends.map(t => {
        const arrow = directionArrow[t.trendDirection] ?? ''
        return `${t.displayName ?? ''}${arrow}`
      }),
      bottom: 0,
      textStyle: { fontSize: 11 },
    },
    grid: { left: 50, right: 20, top: 16, bottom: 50 },
    xAxis: {
      type: 'category',
      data: dates.map(d => formatDate(d, 'short')),
      axisLabel: { rotate: 45, fontSize: 10 },
    },
    yAxis: { type: 'value' },
    series: visibleTrends.map((t, i) => {
      const arrow = directionArrow[t.trendDirection] ?? ''
      const name = `${t.displayName ?? ''}${arrow}`
      // Map points to dates array for alignment
      const valueMap = new Map(t.points.map(p => [p.date, p.value]))
      return {
        name,
        type: 'line',
        smooth: true,
        data: dates.map(d => valueMap.get(d) ?? null),
        connectNulls: true,
        itemStyle: { color: COLORS[i] },
        lineStyle: { color: COLORS[i], width: 2 },
      }
    }),
  }
})
</script>
