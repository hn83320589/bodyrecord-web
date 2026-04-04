<template>
  <section v-if="symptoms.totalCount > 0">
    <h3 class="text-sm font-semibold text-content-tertiary uppercase tracking-widest mb-3">
      近 {{ symptoms.periodDays }} 天症狀（{{ symptoms.totalCount }} 次）
    </h3>

    <div class="bg-surface-card border border-border-default rounded-card overflow-hidden">
      <!-- Header -->
      <div class="flex items-center gap-3 px-4 py-2 text-xs font-semibold text-content-tertiary border-b border-border-default bg-surface-alt">
        <span class="flex-1">類型</span>
        <span class="w-16 text-center">次數</span>
        <span class="w-24 text-right">平均嚴重度</span>
      </div>

      <!-- Rows -->
      <div
        v-for="(item, i) in symptoms.byType"
        :key="i"
        class="flex items-center gap-3 px-4 py-2 text-sm border-b border-border-default last:border-b-0"
      >
        <span class="flex-1 text-content-primary">{{ item.type }}</span>
        <span class="w-16 text-center font-data text-content-secondary">{{ item.count }}</span>
        <span class="w-24 text-right font-data font-semibold" :class="severityClass(item.avgSeverity)">
          {{ item.avgSeverity.toFixed(1) }}
        </span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { VisitSummarySymptoms } from '@/types/visitSummary'

defineProps<{ symptoms: VisitSummarySymptoms }>()

function severityClass(severity: number) {
  if (severity <= 3) return 'text-status-success'
  if (severity <= 6) return 'text-status-warning'
  return 'text-status-danger'
}
</script>
