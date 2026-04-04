<template>
  <AppLayout>
    <PageHeader title="回診時間軸">
      <DateRangePicker v-model="range" />
    </PageHeader>

    <LoadingSpinner v-if="loading" />
    <div v-else-if="items.length > 0" class="space-y-3">
      <template v-for="(item, idx) in itemsWithMonth" :key="item.visitId">
        <div v-if="item.showMonth" class="flex items-center gap-3 mb-1" :class="idx > 0 ? 'mt-4' : ''">
          <span class="text-xs font-semibold text-content-tertiary uppercase tracking-widest">{{ item.monthLabel }}</span>
          <div class="flex-1 h-px bg-border-default"></div>
        </div>
        <div class="flex gap-3">
          <div class="flex flex-col items-center w-9 shrink-0 pt-1">
            <span class="text-[11px] font-semibold text-content-secondary leading-tight">{{ item.day }}</span>
            <span class="text-[9px] text-content-tertiary">{{ item.weekday }}</span>
            <div class="w-2 h-2 rounded-full mt-1.5 shrink-0" style="background: var(--cat-visit)"></div>
            <div class="w-[1.5px] flex-1 mt-1 bg-timeline-line"></div>
          </div>
          <div class="flex-1 mb-3">
            <VisitSummaryCard
              :recorded-at="item.recordedAt"
              :institution="item.institution"
              :primary-diagnosis="item.primaryDiagnosis"
              :key-labs="item.keyLabs"
              :lab-count="item.labCount"
              :medication-count="item.medicationCount"
              :bp-on-day="item.bpOnDay"
              @click="router.push(`/visits/${item.visitId}`)"
            />
          </div>
        </div>
      </template>
    </div>
    <div v-else class="text-center py-16 text-content-tertiary">
      <p class="text-lg mb-1">此期間無回診紀錄</p>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/common/AppLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import DateRangePicker from '@/components/common/DateRangePicker.vue'
import VisitSummaryCard from '@/components/visits/VisitSummaryCard.vue'
import { visitApi } from '@/api/visit'
import type { VisitTimelineItem } from '@/types/visit'

const router = useRouter()
const loading = ref(false)
const items = ref<VisitTimelineItem[]>([])
const range = ref('3m')

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

function rangeToDate(r: string): { startDate: string; endDate: string } {
  const now = new Date()
  const months: Record<string, number> = { '1m': 1, '3m': 3, '6m': 6, '1y': 12 }
  const start = new Date(now.getFullYear(), now.getMonth() - (months[r] ?? 3), now.getDate())
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: now.toISOString().slice(0, 10),
  }
}

async function fetchTimeline() {
  loading.value = true
  try {
    const { startDate, endDate } = rangeToDate(range.value)
    items.value = await visitApi.getTimeline(startDate, endDate)
  } catch {
    items.value = []
  } finally {
    loading.value = false
  }
}

interface TimelineItemWithMonth extends VisitTimelineItem {
  day: number
  weekday: string
  showMonth: boolean
  monthLabel: string
}

const itemsWithMonth = computed((): TimelineItemWithMonth[] => {
  let lastMonth = ''
  return items.value.map(item => {
    const d = new Date(item.recordedAt)
    const monthKey = `${d.getFullYear()}-${d.getMonth()}`
    const monthLabel = `${d.getFullYear()} 年 ${d.getMonth() + 1} 月`
    const showMonth = monthKey !== lastMonth
    lastMonth = monthKey
    return {
      ...item,
      day: d.getDate(),
      weekday: WEEKDAYS[d.getDay()],
      showMonth,
      monthLabel,
    }
  })
})

watch(range, fetchTimeline)
onMounted(fetchTimeline)
</script>
