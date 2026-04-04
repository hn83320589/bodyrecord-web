<template>
  <section v-if="lab.totalCount > 0">
    <h3 class="text-sm font-semibold text-content-tertiary uppercase tracking-widest mb-3">
      檢驗結果（{{ lab.totalCount }} 項，{{ lab.abnormalCount }} 項異常）
    </h3>

    <div v-for="group in lab.byCategory" :key="group.category" class="mb-4">
      <p class="text-xs font-semibold text-content-secondary mb-1 px-1">{{ group.category }}</p>
      <div class="bg-surface-card border border-border-default rounded-card overflow-hidden">
        <div
          v-for="(item, i) in group.items"
          :key="i"
          class="flex items-center gap-3 px-4 py-2 text-sm border-b border-border-default last:border-b-0"
          :class="isAbnormal(item.status) ? 'bg-status-danger-bg' : ''"
        >
          <span class="flex-1 text-content-primary">{{ item.displayName ?? '-' }}</span>
          <span class="font-data font-semibold min-w-[60px] text-right" :class="statusTextClass(item.status)">
            {{ item.value != null ? item.value : item.valueText ?? '-' }}
          </span>
          <span class="text-content-tertiary text-xs min-w-[40px]">{{ item.unit ?? '' }}</span>
          <span class="w-2 h-2 rounded-full shrink-0" :class="statusDotClass(item.status)"></span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { VisitSummaryLab } from '@/types/visitSummary'

defineProps<{ lab: VisitSummaryLab }>()

function isAbnormal(status: string) {
  return status === 'high' || status === 'low'
}

function statusDotClass(status: string) {
  if (status === 'high' || status === 'low') return 'bg-status-danger'
  if (status === 'normal') return 'bg-status-success'
  return 'bg-content-tertiary'
}

function statusTextClass(status: string) {
  if (status === 'high' || status === 'low') return 'text-status-danger'
  if (status === 'normal') return 'text-status-success'
  return 'text-content-secondary'
}
</script>
