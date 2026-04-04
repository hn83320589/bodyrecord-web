<template>
  <div class="bg-surface-card rounded-card shadow-sm p-6">
    <h3 class="text-sm font-semibold text-content-primary mb-4">
      症狀日誌
      <span class="text-content-tertiary font-normal ml-2">+/-7 天</span>
    </h3>

    <div v-if="symptoms.length === 0" class="text-sm text-content-tertiary">此期間無症狀紀錄</div>

    <div v-else class="space-y-2">
      <div v-for="s in symptoms" :key="s.id"
        class="flex items-center gap-3 py-2 border-t border-border-default first:border-0">
        <span class="text-xs text-content-tertiary w-12 shrink-0">
          {{ s.daysFromVisit > 0 ? `+${s.daysFromVisit}天` : s.daysFromVisit === 0 ? '當天' : `${s.daysFromVisit}天` }}
        </span>
        <span class="px-2 py-0.5 rounded text-[10px] font-medium shrink-0 bg-cat-symptom-bg text-cat-symptom">
          {{ s.symptomType }}
        </span>
        <div class="flex-1"><SeverityBar :severity="s.severity" /></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SeverityBar from '@/components/symptoms/SeverityBar.vue'

export interface RelatedSymptom {
  id: number
  loggedAt: string
  symptomType: string
  severity: number
  daysFromVisit: number
}

defineProps<{ symptoms: RelatedSymptom[] }>()
</script>
