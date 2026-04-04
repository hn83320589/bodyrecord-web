<template>
  <AppLayout>
    <PageHeader title="症狀趨勢分析">
      <RouterLink to="/symptoms" class="text-sm text-content-tertiary hover:text-content-secondary">返回列表</RouterLink>
    </PageHeader>

    <LoadingSpinner v-if="loading" />
    <div v-else class="space-y-6 max-w-3xl">
      <!-- Severity Trend -->
      <div class="bg-surface-card rounded-card shadow-sm p-6">
        <h3 class="text-sm font-semibold text-content-primary mb-4">每週平均嚴重度</h3>
        <v-chart v-if="summary?.severityTrend.length" :option="severityOption" autoresize style="height: 240px" />
        <p v-else class="text-sm text-content-tertiary text-center py-8">資料不足</p>
      </div>

      <!-- Type Distribution -->
      <div class="bg-surface-card rounded-card shadow-sm p-6">
        <h3 class="text-sm font-semibold text-content-primary mb-4">類型分佈</h3>
        <v-chart v-if="summary?.typeDistribution.length" :option="typeOption" autoresize style="height: 280px" />
        <p v-else class="text-sm text-content-tertiary text-center py-8">資料不足</p>
      </div>

      <!-- Top Triggers -->
      <div class="bg-surface-card rounded-card shadow-sm p-6">
        <h3 class="text-sm font-semibold text-content-primary mb-4">觸發因子排行</h3>
        <div v-if="summary?.topTriggers.length" class="space-y-2">
          <div v-for="(t, i) in summary.topTriggers" :key="t.trigger" class="flex items-center gap-3">
            <span class="text-xs font-semibold text-content-tertiary w-4">{{ i + 1 }}</span>
            <span class="text-sm text-content-primary flex-1">{{ t.trigger }}</span>
            <div class="w-24 h-2 bg-surface-alt rounded-full overflow-hidden">
              <div class="h-full bg-accent rounded-full" :style="{ width: `${barWidth(t.count)}%` }"></div>
            </div>
            <span class="text-xs text-content-tertiary font-data w-8 text-right">{{ t.count }}</span>
          </div>
        </div>
        <p v-else class="text-sm text-content-tertiary text-center py-8">無觸發因子資料</p>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, PieChart } from 'echarts/charts'
import { TooltipComponent, GridComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import AppLayout from '@/components/common/AppLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { symptomApi } from '@/api/symptom'
import type { SymptomSummary } from '@/types/symptom'

use([CanvasRenderer, LineChart, PieChart, TooltipComponent, GridComponent, LegendComponent])

const loading = ref(false)
const summary = ref<SymptomSummary | null>(null)

const TYPE_COLORS = ['#3B82F6', '#F59E0B', '#10B981', '#EC4899', '#8B5CF6', '#EF4444', '#06B6D4', '#84CC16']

const severityOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: 40, right: 16, top: 16, bottom: 28 },
  xAxis: {
    type: 'category',
    data: summary.value?.severityTrend.map(p => p.week) ?? [],
    axisLabel: { fontSize: 10, color: 'var(--text-tertiary)' },
    axisLine: { lineStyle: { color: 'var(--border-default)' } },
  },
  yAxis: {
    type: 'value', min: 0, max: 10,
    axisLabel: { fontSize: 10, color: 'var(--text-tertiary)' },
    splitLine: { lineStyle: { color: 'var(--border-default)', type: 'dashed' } },
  },
  series: [{
    type: 'line', smooth: true,
    data: summary.value?.severityTrend.map(p => p.avgSeverity) ?? [],
    itemStyle: { color: 'var(--accent)' },
    lineStyle: { color: 'var(--accent)', width: 2 },
    areaStyle: { color: 'var(--accent-light)', opacity: 0.3 },
  }],
}))

const typeOption = computed(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  legend: { bottom: 0, textStyle: { color: 'var(--text-secondary)', fontSize: 11 } },
  series: [{
    type: 'pie', radius: ['45%', '70%'],
    label: { show: false },
    data: summary.value?.typeDistribution.map((t, i) => ({
      name: t.type, value: t.count,
      itemStyle: { color: TYPE_COLORS[i % TYPE_COLORS.length] },
    })) ?? [],
  }],
}))

function barWidth(count: number) {
  const max = Math.max(...(summary.value?.topTriggers.map(t => t.count) ?? [1]))
  return (count / max) * 100
}

onMounted(async () => {
  loading.value = true
  try { summary.value = await symptomApi.getSummary(6) }
  finally { loading.value = false }
})
</script>
