# Skill: 檢驗趨勢圖（ECharts）

## 安裝
```bash
npm install echarts vue-echarts
```

## LabTrendChart.vue

```vue
<template>
  <v-chart :option="option" :loading="loading" autoresize style="height:320px" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { TooltipComponent, GridComponent, MarkAreaComponent, MarkPointComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import type { LabTrendResponse } from '@/types/lab'
import { formatDate } from '@/utils/dateTime'

use([CanvasRenderer, LineChart, TooltipComponent, GridComponent, MarkAreaComponent, MarkPointComponent, LegendComponent])

const props = defineProps<{ trends: LabTrendResponse[]; loading?: boolean }>()

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#f87171', '#2dd4bf']

const option = computed(() => {
  // 合併所有 trends 的時間點，排序去重
  const allDates = [...new Set(
    props.trends.flatMap(t => t.points.map(p => p.recordedAt))
  )].sort()

  return {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any[]) => {
        const date = formatDate(allDates[params[0].dataIndex])
        const lines = params.map((p, i) => {
          const t = props.trends[i]
          const pt = t.points.find(x => x.recordedAt === allDates[p.dataIndex])
          if (p.value == null) return ''
          const flag = t.normalMax != null && p.value > t.normalMax ? ' ↑'
                     : t.normalMin != null && p.value < t.normalMin ? ' ↓' : ''
          const col = flag === ' ↑' ? '#ef4444' : flag === ' ↓' ? '#3b82f6' : p.color
          const src = pt?.source === 'nhi_import' && pt?.hospital
            ? `<span style="color:#9ca3af;font-size:10px"> · ${pt.hospital}</span>` : ''
          return `<span style="color:${col}">${t.itemCode}：${p.value} ${t.unit}${flag}</span>${src}`
        }).filter(Boolean)
        return `<b>${date}</b><br/>${lines.join('<br/>')}`
      },
    },
    legend: { data: props.trends.map(t => `${t.itemCode}（${t.unit}）`) },
    grid: { left: 50, right: 20, top: 40, bottom: 36 },
    xAxis: {
      type: 'category',
      data: allDates.map(d => formatDate(d, 'short')),
      axisLabel: { rotate: 30, fontSize: 11 },
    },
    yAxis: { type: 'value' },
    series: props.trends.map((t, i) => ({
      name: `${t.itemCode}（${t.unit}）`,
      type: 'line',
      smooth: true,
      data: allDates.map(d => t.points.find(p => p.recordedAt === d)?.value ?? null),
      itemStyle: { color: COLORS[i % COLORS.length] },
      lineStyle: { color: COLORS[i % COLORS.length], width: 2 },
      // 正常範圍色帶（直接從 trend 的 normalMin / normalMax 取）
      markArea: (t.normalMin != null || t.normalMax != null) ? {
        silent: true,
        itemStyle: { color: COLORS[i % COLORS.length], opacity: 0.06 },
        data: [[{ yAxis: t.normalMin ?? 0 }, { yAxis: t.normalMax ?? 'max' }]],
      } : undefined,
      // 異常點標紅
      markPoint: {
        data: t.points.filter(p => p.isAbnormal).map(p => ({
          coord: [formatDate(p.recordedAt, 'short'), p.value],
          itemStyle: { color: '#ef4444' },
          symbol: 'circle', symbolSize: 8,
        })),
      },
    })),
  }
})
</script>
```

## LabValueBadge.vue（定量/定性通用）

```vue
<template>
  <span :style="{ color, fontWeight: isAbnormal ? 600 : 400 }">
    <template v-if="isNumeric">{{ valueNumeric }} {{ unit }}{{ dirSymbol }}</template>
    <template v-else>{{ valueText }}</template>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{
  isNumeric: boolean
  valueNumeric?: number
  valueText?: string
  unit: string
  normalMin?: number
  normalMax?: number
  isAbnormal: boolean
}>()

const dir = computed(() => {
  if (!props.isNumeric || props.valueNumeric == null) return 'qualitative'
  if (props.normalMax != null && props.valueNumeric > props.normalMax) return 'high'
  if (props.normalMin != null && props.valueNumeric < props.normalMin) return 'low'
  return 'normal'
})
const color = computed(() => ({ high: '#ef4444', low: '#3b82f6', normal: '#22c55e', qualitative: '#6b7280' }[dir.value]))
const dirSymbol = computed(() => ({ high: ' ↑', low: ' ↓', normal: '', qualitative: '' }[dir.value]))
</script>
```
