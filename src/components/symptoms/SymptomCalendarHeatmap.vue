<template>
  <div class="bg-surface-card rounded-card shadow-sm p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-semibold text-content-primary">日曆熱力圖</h3>
      <div class="flex gap-2">
        <button @click="changeMonth(-1)" class="text-content-tertiary hover:text-content-primary text-sm">&laquo;</button>
        <span class="text-sm font-medium text-content-primary min-w-[80px] text-center">{{ monthLabel }}</span>
        <button @click="changeMonth(1)" class="text-content-tertiary hover:text-content-primary text-sm">&raquo;</button>
      </div>
    </div>
    <!-- Weekday headers -->
    <div class="grid grid-cols-7 gap-[2px] mb-1">
      <div v-for="d in ['日','一','二','三','四','五','六']" :key="d"
        class="text-[10px] text-content-tertiary text-center py-1">{{ d }}</div>
    </div>
    <!-- Calendar grid -->
    <div class="grid grid-cols-7 gap-[2px]">
      <div v-for="(cell, i) in calendarCells" :key="i"
        :class="['aspect-square rounded-[2px] flex items-center justify-center text-[10px] cursor-pointer transition',
          cell.isCurrentMonth ? 'hover:ring-1 hover:ring-accent' : 'opacity-30']"
        :style="{ backgroundColor: cell.color }"
        @click="cell.isCurrentMonth && cell.count > 0 && $emit('selectDate', cell.date)">
        <span :class="cell.count > 0 ? 'font-semibold text-content-primary' : 'text-content-tertiary'">
          {{ cell.day }}
        </span>
      </div>
    </div>
    <!-- Legend -->
    <div class="flex items-center gap-3 mt-3 text-[10px] text-content-tertiary">
      <span>少</span>
      <div class="w-3 h-3 rounded-[2px]" style="background: var(--status-success); opacity: 0.3"></div>
      <div class="w-3 h-3 rounded-[2px]" style="background: var(--status-warning); opacity: 0.4"></div>
      <div class="w-3 h-3 rounded-[2px]" style="background: var(--status-danger); opacity: 0.5"></div>
      <span>多/嚴重</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { CalendarDay } from '@/types/symptom'

const props = defineProps<{ calendar: CalendarDay[] }>()
defineEmits<{ (e: 'selectDate', date: string): void }>()

const currentMonth = ref(new Date())

const monthLabel = computed(() =>
  `${currentMonth.value.getFullYear()} 年 ${currentMonth.value.getMonth() + 1} 月`
)

function changeMonth(delta: number) {
  const d = new Date(currentMonth.value)
  d.setMonth(d.getMonth() + delta)
  currentMonth.value = d
}

function severityColor(maxSeverity: number): string {
  if (maxSeverity <= 0) return 'transparent'
  if (maxSeverity <= 3) return 'color-mix(in srgb, var(--status-success) 30%, transparent)'
  if (maxSeverity <= 6) return 'color-mix(in srgb, var(--status-warning) 40%, transparent)'
  return 'color-mix(in srgb, var(--status-danger) 50%, transparent)'
}

interface CalendarCell {
  day: number
  date: string
  isCurrentMonth: boolean
  count: number
  color: string
}

const calendarCells = computed((): CalendarCell[] => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const calMap = new Map<string, CalendarDay>()
  for (const c of props.calendar) calMap.set(c.date, c)

  const cells: CalendarCell[] = []

  // Previous month padding
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i
    cells.push({ day, date: '', isCurrentMonth: false, count: 0, color: 'transparent' })
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const cal = calMap.get(dateStr)
    cells.push({
      day: d,
      date: dateStr,
      isCurrentMonth: true,
      count: cal?.count ?? 0,
      color: severityColor(cal?.maxSeverity ?? 0),
    })
  }

  // Next month padding to fill grid
  const remaining = 7 - (cells.length % 7)
  if (remaining < 7) {
    for (let i = 1; i <= remaining; i++) {
      cells.push({ day: i, date: '', isCurrentMonth: false, count: 0, color: 'transparent' })
    }
  }

  return cells
})
</script>
