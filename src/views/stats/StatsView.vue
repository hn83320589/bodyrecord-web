<template>
  <AppLayout>
    <PageHeader title="血壓統計">
      <RouterLink to="/records" class="text-sm text-content-tertiary hover:text-content-secondary">返回列表</RouterLink>
    </PageHeader>
    <div class="bg-surface-card rounded-card shadow-sm p-6">
      <div class="flex gap-2 mb-6">
        <button v-for="opt in rangeOptions" :key="opt.value"
          @click="selectedRange = opt.value; loadTrend()"
          :class="['px-4 py-1.5 rounded-full text-sm font-medium transition',
            selectedRange === opt.value ? 'bg-accent text-white' : 'bg-surface-alt text-content-secondary hover:bg-border-default']">
          {{ opt.label }}
        </button>
      </div>
      <BPTrendChart :points="store.chartPoints" :loading="store.loading" />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppLayout from '@/components/common/AppLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import BPTrendChart from '@/components/charts/BPTrendChart.vue'
import { useBloodPressureStore } from '@/stores/bloodPressure'

const store = useBloodPressureStore()
const selectedRange = ref<'7d' | '30d' | 'all'>('30d')
const rangeOptions = [
  { label: '7 天', value: '7d' as const },
  { label: '30 天', value: '30d' as const },
  { label: '全部', value: 'all' as const },
]

function loadTrend() { store.fetchChartData(selectedRange.value) }
onMounted(loadTrend)
</script>
