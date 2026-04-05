<template>
  <section v-if="med.current.length > 0">
    <h3 class="text-sm font-semibold text-content-tertiary uppercase tracking-widest mb-3">目前用藥</h3>

    <div class="bg-surface-card border border-border-default rounded-card overflow-hidden overflow-x-auto">
      <!-- Header -->
      <div class="flex items-center gap-3 px-4 py-2 text-xs font-semibold text-content-tertiary border-b border-border-default bg-surface-alt min-w-0">
        <span class="flex-1 min-w-0 truncate">藥品名稱</span>
        <span class="w-24 text-center shrink-0">頻率</span>
        <span class="w-20 text-right shrink-0">服藥率</span>
      </div>

      <!-- Rows -->
      <div
        v-for="(item, i) in med.current"
        :key="i"
        class="flex items-center gap-3 px-4 py-2 text-sm border-b border-border-default last:border-b-0 min-w-0"
      >
        <span class="flex-1 text-content-primary min-w-0 truncate">{{ item.name }}</span>
        <span class="w-24 text-center text-content-secondary text-xs shrink-0">{{ item.frequency ?? '-' }}</span>
        <span class="w-20 text-right font-data font-semibold shrink-0" :class="adherenceClass(item.adherenceRate)">
          {{ formatPercent(item.adherenceRate) }}
        </span>
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-2 text-xs text-content-secondary text-right">
      整體服藥率
      <span class="font-data font-semibold ml-1" :class="adherenceClass(med.overallAdherenceRate)">
        {{ formatPercent(med.overallAdherenceRate) }}
      </span>
      <span class="text-content-tertiary ml-1">（近 {{ med.adherencePeriodDays }} 天）</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { VisitSummaryMed } from '@/types/visitSummary'

defineProps<{ med: VisitSummaryMed }>()

function adherenceClass(rate: number) {
  if (rate >= 0.9) return 'text-status-success'
  if (rate >= 0.7) return 'text-status-warning'
  return 'text-status-danger'
}

function formatPercent(rate: number) {
  return `${Math.round(rate * 100)}%`
}
</script>
