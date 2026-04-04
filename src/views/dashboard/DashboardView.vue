<template>
  <AppLayout>
    <!-- Today's medication mini card -->
    <RouterLink to="/medications/reminders"
      class="block bg-surface-card rounded-card shadow-sm p-4 mb-4 border border-border-default hover:border-border-active transition">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-accent"></div>
          <span class="text-sm font-semibold text-content-primary">今日服藥</span>
        </div>
        <span class="text-sm font-data text-content-primary">
          {{ todayMedTaken }}/{{ todayMedTotal }} 已完成
        </span>
      </div>
      <p v-if="todayMedNext" class="text-xs text-content-tertiary mt-1">下一個：{{ todayMedNext }}</p>
    </RouterLink>

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
import { visitApi } from '@/api/visit'
import { symptomApi } from '@/api/symptom'
import { medicationLogApi } from '@/api/medicationLog'
import type { VisitTimelineItem } from '@/types/visit'
import type { SymptomLog as SymptomLogType } from '@/types/symptom'
import type { MedicationLog as MedLogType } from '@/types/medicationReminder'
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
const visitItems = ref<VisitTimelineItem[]>([])
const symptomLogs = ref<SymptomLogType[]>([])
const todayMedLogs = ref<MedLogType[]>([])

const todayMedTaken = computed(() => todayMedLogs.value.filter(l => l.status === 'taken' || l.status === 'late').length)
const todayMedTotal = computed(() => todayMedLogs.value.length)
const todayMedNext = computed(() => {
  const pending = todayMedLogs.value
    .filter(l => l.status === 'pending')
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
  if (pending.length === 0) return ''
  const d = new Date(pending[0].scheduledAt)
  return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')} ${pending[0].medicationName}`
})

const categoryOptions = [
  { label: '全部', value: 'all' },
  { label: '血壓', value: 'bp' },
  { label: '檢驗', value: 'lab' },
  { label: '回診', value: 'visit' },
  { label: '用藥', value: 'med' },
  { label: '症狀', value: 'symptom' },
]

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

const bpRecords = computed(() => asArray(bpStore.records))
const labGroups = computed(() => asArray(labStore.groups))
const hrRecords = computed(() => asArray(hrStore.records))

const avgBp = computed(() => {
  if (bpRecords.value.length === 0) return null
  const avg = (arr: number[]) => Math.round(arr.reduce((a, b) => a + b, 0) / arr.length)
  return `${avg(bpRecords.value.map(r => r.systolic))}/${avg(bpRecords.value.map(r => r.diastolic))}`
})
const bpSub = computed(() => bpRecords.value.length > 0 ? `共 ${bpRecords.value.length} 筆` : '')

const latestCr = computed(() => {
  const crItems = labGroups.value
    .flatMap(g => asArray(g.items))
    .filter(i => i.itemCode?.includes('09015C') || i.itemName?.includes('肌酸酐') || i.itemName?.includes('CRE'))
  return crItems.length > 0 ? crItems[0].valueNumeric : null
})
const crSub = computed(() => {
  const crItems = labGroups.value.flatMap(g => asArray(g.items))
    .filter(i => i.itemCode?.includes('09015C') || i.itemName?.includes('肌酸酐') || i.itemName?.includes('CRE'))
  return crItems.length > 0 ? formatDate(crItems[0].recordedAt) : ''
})

const monthCount = computed(() => {
  const now = new Date()
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  return bpRecords.value.filter(r => r.recordedAt.startsWith(thisMonth)).length
})

const nextVisit = computed(() => {
  const future = hrRecords.value.filter(r => new Date(r.clinicDate) > new Date())
  if (future.length === 0) return '-'
  const next = future.sort((a, b) => new Date(a.clinicDate).getTime() - new Date(b.clinicDate).getTime())[0]
  return formatDate(next.clinicDate)
})
const nextVisitHospital = computed(() => {
  const future = hrRecords.value.filter(r => new Date(r.clinicDate) > new Date())
  if (future.length === 0) return ''
  return future.sort((a, b) => new Date(a.clinicDate).getTime() - new Date(b.clinicDate).getTime())[0].hospital ?? ''
})

const rangeStart = computed(() => {
  const now = new Date()
  const monthMap: Record<string, number> = { '1m': 1, '3m': 3, '6m': 6, '1y': 12 }
  const months = monthMap[range.value] ?? 3
  return new Date(now.getFullYear(), now.getMonth() - months, now.getDate())
})

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

// 安全取陣列（API 可能回傳 {} 或 null）
const asArray = <T>(v: unknown): T[] => Array.isArray(v) ? v : []

const timelineItems = computed((): TimelineItem[] => {
  const items: Omit<TimelineItem, 'showMonth' | 'monthLabel'>[] = []
  const start = rangeStart.value

  if (category.value === 'all' || category.value === 'bp') {
    for (const r of asArray(bpStore.records)) {
      const d = new Date(r.recordedAt)
      if (d < start) continue
      const cat = classifyBP(r.systolic, r.diastolic)
      items.push({
        date: d, day: d.getDate(), weekday: WEEKDAYS[d.getDay()],
        title: '血壓量測', badge: '血壓', category: 'bp',
        value: `${r.systolic}/${r.diastolic}`, unit: 'mmHg',
        flag: cat === 'high2' || cat === 'crisis' ? '⚠' : undefined,
        description: r.note ?? undefined,
        onClick: () => router.push('/records'),
      })
    }
  }

  if (category.value === 'all' || category.value === 'lab') {
    for (const g of asArray(labStore.groups)) {
      const d = new Date(g.date)
      if (d < start) continue
      const abnormal = g.items.filter(i => i.isAbnormal)
      items.push({
        date: d, day: d.getDate(), weekday: WEEKDAYS[d.getDay()],
        title: g.items[0]?.category ?? '檢驗紀錄', badge: '檢驗', category: 'lab',
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

  if (category.value === 'all' || category.value === 'visit') {
    for (const v of asArray(visitItems.value)) {
      const d = new Date(v.recordedAt)
      if (d < start) continue
      const keyLabPreview = v.keyLabs.slice(0, 2)
        .map(l => `${l.displayName ?? ''} ${l.value ?? ''}${l.unit ?? ''}`)
        .filter(Boolean).join('、')
      items.push({
        date: d, day: d.getDate(), weekday: WEEKDAYS[d.getDay()],
        title: v.primaryDiagnosis ?? v.institution ?? '門診', badge: '回診', category: 'visit',
        value: v.bpOnDay ? `${v.bpOnDay.systolic}/${v.bpOnDay.diastolic}` : undefined,
        unit: v.bpOnDay ? 'mmHg' : undefined,
        description: [v.institution, keyLabPreview, `檢驗 ${v.labCount} 項 · 用藥 ${v.medicationCount} 種`]
          .filter(Boolean).join(' · '),
        onClick: () => router.push(`/visits/${v.visitId}`),
      })
    }
  }

  if (category.value === 'all' || category.value === 'med') {
    for (const m of asArray(medStore.medications)) {
      const d = new Date(m.recordedAt)
      if (d < start) continue
      items.push({
        date: d, day: d.getDate(), weekday: WEEKDAYS[d.getDay()],
        title: m.drugName, badge: '用藥', category: 'med',
        description: m.days ? `${m.days} 天` : undefined,
        onClick: () => router.push('/medications'),
      })
    }
  }

  if (category.value === 'all' || category.value === 'symptom') {
    for (const s of asArray(symptomLogs.value)) {
      const d = new Date(s.loggedAt)
      if (d < start) continue
      items.push({
        date: d, day: d.getDate(), weekday: WEEKDAYS[d.getDay()],
        title: s.symptomType, badge: '症狀', category: 'visit' as const,
        value: `嚴重度 ${s.severity}`,
        flag: s.severity >= 7 ? '⚠' : undefined,
        description: s.note ?? undefined,
        onClick: () => router.push('/symptoms'),
      })
    }
  }

  items.sort((a, b) => b.date.getTime() - a.date.getTime())

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
  try {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth() - 12, now.getDate())
    const dateRange = { start: start.toISOString().slice(0, 10), end: now.toISOString().slice(0, 10) }
    await Promise.allSettled([
      bpStore.fetchRecords(),
      labStore.fetchGroups(),
      hrStore.fetchRecords(),
      medStore.fetchMedications(),
      visitApi.getTimeline(dateRange.start, dateRange.end)
        .then(data => { visitItems.value = data }).catch(() => {}),
      symptomApi.list({ startDate: dateRange.start, endDate: dateRange.end })
        .then(data => { symptomLogs.value = data }).catch(() => {}),
      medicationLogApi.getToday()
        .then(d => { todayMedLogs.value = d }).catch(() => {}),
    ])
  } finally {
    loading.value = false
  }
})
</script>
