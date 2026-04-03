<template>
  <AppLayout>
    <!-- Stat Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <StatCard label="平均血壓" :value="avgBp" unit="mmHg" :sub="bpSub" />
      <StatCard label="最近 Cr" :value="latestCr" unit="mg/dL" :sub="crSub" />
      <StatCard label="本月量測" :value="monthCount" sub="筆紀錄" />
      <StatCard label="下次回診" :value="nextVisit" :sub="nextVisitHospital" />
    </div>

    <!-- Filters -->
    <div class="flex items-center justify-between mb-4">
      <CategoryPills v-model="category" :options="categoryOptions" />
      <DateRangePicker v-model="range" />
    </div>

    <!-- Timeline -->
    <LoadingSpinner v-if="loading" />
    <div v-else-if="timelineItems.length > 0">
      <template v-for="(item, idx) in timelineItems" :key="idx">
        <!-- Month separator -->
        <div v-if="item.showMonth" class="flex items-center gap-3 mb-3" :class="idx > 0 ? 'mt-4' : ''">
          <span class="text-xs font-semibold text-content-tertiary uppercase tracking-widest">{{ item.monthLabel }}</span>
          <div class="flex-1 h-px bg-border-default"></div>
        </div>
        <TimelineCard
          :day="item.day"
          :weekday="item.weekday"
          :title="item.title"
          :badge="item.badge"
          :category="item.category"
          :value="item.value"
          :unit="item.unit"
          :flag="item.flag"
          :description="item.description"
          @click="item.onClick?.()"
        />
      </template>
    </div>
    <div v-else class="text-center py-16 text-content-tertiary">
      <p class="text-lg mb-1">尚無紀錄</p>
      <p class="text-sm">開始記錄血壓或匯入健保存摺</p>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/common/AppLayout.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import StatCard from '@/components/common/StatCard.vue'
import CategoryPills from '@/components/common/CategoryPills.vue'
import DateRangePicker from '@/components/common/DateRangePicker.vue'
import TimelineCard from '@/components/common/TimelineCard.vue'
import { useBloodPressureStore } from '@/stores/bloodPressure'
import { useLabStore } from '@/stores/lab'
import { useHealthRecordStore } from '@/stores/healthRecord'
import { useMedicationStore } from '@/stores/medication'
import { formatDate } from '@/utils/dateTime'
import { classifyBP } from '@/utils/bpClassify'

const router = useRouter()
const bpStore = useBloodPressureStore()
const labStore = useLabStore()
const hrStore = useHealthRecordStore()
const medStore = useMedicationStore()

const category = ref('all')
const range = ref('3m')
const loading = ref(true)

const categoryOptions = [
  { label: '全部', value: 'all' },
  { label: '血壓', value: 'bp' },
  { label: '檢驗', value: 'lab' },
  { label: '回診', value: 'visit' },
  { label: '用藥', value: 'med' },
]

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

// ── Stat card values ──
const avgBp = computed(() => {
  if (bpStore.records.length === 0) return null
  const avg = (arr: number[]) => Math.round(arr.reduce((a, b) => a + b, 0) / arr.length)
  return `${avg(bpStore.records.map(r => r.systolic))}/${avg(bpStore.records.map(r => r.diastolic))}`
})
const bpSub = computed(() => bpStore.records.length > 0 ? `共 ${bpStore.records.length} 筆` : '')

const latestCr = computed(() => {
  const crItems = labStore.groups
    .flatMap(g => g.items)
    .filter(i => i.itemCode?.includes('09015C') || i.itemName?.includes('肌酸酐') || i.itemName?.includes('CRE'))
  return crItems.length > 0 ? crItems[0].valueNumeric : null
})
const crSub = computed(() => {
  const crItems = labStore.groups.flatMap(g => g.items)
    .filter(i => i.itemCode?.includes('09015C') || i.itemName?.includes('肌酸酐') || i.itemName?.includes('CRE'))
  return crItems.length > 0 ? formatDate(crItems[0].recordedAt) : ''
})

const monthCount = computed(() => {
  const now = new Date()
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  return bpStore.records.filter(r => r.recordedAt.startsWith(thisMonth)).length
})

const nextVisit = computed(() => {
  const future = hrStore.records.filter(r => new Date(r.clinicDate) > new Date())
  if (future.length === 0) return '-'
  const next = future.sort((a, b) => new Date(a.clinicDate).getTime() - new Date(b.clinicDate).getTime())[0]
  return formatDate(next.clinicDate)
})
const nextVisitHospital = computed(() => {
  const future = hrStore.records.filter(r => new Date(r.clinicDate) > new Date())
  if (future.length === 0) return ''
  return future.sort((a, b) => new Date(a.clinicDate).getTime() - new Date(b.clinicDate).getTime())[0].hospital ?? ''
})

// ── Range filter ──
const rangeStart = computed(() => {
  const now = new Date()
  const monthMap: Record<string, number> = { '1m': 1, '3m': 3, '6m': 6, '1y': 12 }
  const months = monthMap[range.value] ?? 3
  return new Date(now.getFullYear(), now.getMonth() - months, now.getDate())
})

// ── Timeline items ──
interface TimelineItem {
  date: Date
  day: number
  weekday: string
  monthLabel: string
  showMonth: boolean
  title: string
  badge: string
  category: 'bp' | 'lab' | 'visit' | 'med'
  value?: string
  unit?: string
  flag?: string
  description?: string
  onClick?: () => void
}

const timelineItems = computed((): TimelineItem[] => {
  const items: Omit<TimelineItem, 'showMonth' | 'monthLabel'>[] = []
  const start = rangeStart.value

  // Blood Pressure
  if (category.value === 'all' || category.value === 'bp') {
    for (const r of bpStore.records) {
      const d = new Date(r.recordedAt)
      if (d < start) continue
      const cat = classifyBP(r.systolic, r.diastolic)
      items.push({
        date: d,
        day: d.getDate(),
        weekday: WEEKDAYS[d.getDay()],
        title: '血壓量測',
        badge: '血壓',
        category: 'bp',
        value: `${r.systolic}/${r.diastolic}`,
        unit: 'mmHg',
        flag: cat === 'high2' || cat === 'crisis' ? '⚠' : undefined,
        description: r.note ?? undefined,
        onClick: () => router.push('/records'),
      })
    }
  }

  // Lab Results
  if (category.value === 'all' || category.value === 'lab') {
    for (const g of labStore.groups) {
      const d = new Date(g.date)
      if (d < start) continue
      const abnormal = g.items.filter(i => i.isAbnormal)
      const firstItem = g.items[0]
      items.push({
        date: d,
        day: d.getDate(),
        weekday: WEEKDAYS[d.getDay()],
        title: firstItem?.category ?? '檢驗紀錄',
        badge: '檢驗',
        category: 'lab',
        value: abnormal.length > 0
          ? `${abnormal[0].itemName} ${abnormal[0].valueNumeric ?? abnormal[0].valueText ?? ''}`
          : `${g.items.length} 項`,
        unit: abnormal.length > 0 ? abnormal[0].unit : undefined,
        flag: abnormal.length > 0 ? '↑' : undefined,
        description: abnormal.length > 1 ? `另有 ${abnormal.length - 1} 項異常` : undefined,
        onClick: () => router.push('/lab'),
      })
    }
  }

  // Health Records (visits)
  if (category.value === 'all' || category.value === 'visit') {
    for (const r of hrStore.records) {
      const d = new Date(r.clinicDate)
      if (d < start) continue
      items.push({
        date: d,
        day: d.getDate(),
        weekday: WEEKDAYS[d.getDay()],
        title: r.primaryDiagnosis ?? '門診',
        badge: '回診',
        category: 'visit',
        description: r.hospital ?? undefined,
        onClick: () => router.push(`/health-records/${r.id}`),
      })
    }
  }

  // Medications
  if (category.value === 'all' || category.value === 'med') {
    for (const m of medStore.medications) {
      const d = new Date(m.recordedAt)
      if (d < start) continue
      items.push({
        date: d,
        day: d.getDate(),
        weekday: WEEKDAYS[d.getDay()],
        title: m.drugName,
        badge: '用藥',
        category: 'med',
        description: m.days ? `${m.days} 天` : undefined,
        onClick: () => router.push('/medications'),
      })
    }
  }

  // Sort by date descending
  items.sort((a, b) => b.date.getTime() - a.date.getTime())

  // Add month separators
  let lastMonth = ''
  return items.map(item => {
    const monthKey = `${item.date.getFullYear()}-${item.date.getMonth()}`
    const monthLabel = `${item.date.getFullYear()} 年 ${item.date.getMonth() + 1} 月`
    const showMonth = monthKey !== lastMonth
    lastMonth = monthKey
    return { ...item, showMonth, monthLabel }
  })
})

onMounted(async () => {
  loading.value = true
  await Promise.all([
    bpStore.fetchRecords(),
    labStore.fetchGroups(),
    hrStore.fetchRecords(),
    medStore.fetchMedications(),
  ])
  loading.value = false
})
</script>
