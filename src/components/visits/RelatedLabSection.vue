<template>
  <div class="bg-surface-card rounded-card shadow-sm p-6">
    <h3 class="text-sm font-semibold text-content-primary mb-4">
      檢驗結果
      <span class="text-content-tertiary font-normal ml-2">
        {{ labCount }} 項<template v-if="abnormalCount">，{{ abnormalCount }} 項異常</template>
      </span>
    </h3>

    <div v-if="groupedLabs.length === 0" class="text-sm text-content-tertiary">無檢驗資料</div>

    <div v-for="group in groupedLabs" :key="group.category" class="mb-3 last:mb-0">
      <details open>
        <summary class="text-xs font-semibold text-content-secondary cursor-pointer select-none mb-2 uppercase tracking-wide">
          {{ group.category }}
        </summary>
        <div class="space-y-0.5">
          <div v-for="lab in group.items" :key="lab.id"
            :class="['flex items-center justify-between px-3 py-1.5 rounded text-sm',
              lab.status === 'high' || lab.status === 'low' ? 'bg-status-danger-bg' : '']">
            <span class="text-content-secondary flex-1">{{ lab.displayName ?? lab.itemName }}</span>
            <div class="flex items-center gap-2">
              <div class="w-1.5 h-1.5 rounded-full shrink-0" :class="dotClass(lab.status)"></div>
              <span class="font-data font-semibold w-20 text-right" :class="textClass(lab.status)">
                {{ lab.isNumeric ? lab.value : lab.valueText ?? '-' }}
              </span>
              <span class="text-xs text-content-tertiary w-16">{{ lab.unit ?? '' }}</span>
            </div>
          </div>
        </div>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { LabResultWithStatus } from '@/types/visit'

const props = defineProps<{ labs: LabResultWithStatus[] }>()

const labCount = computed(() => props.labs.length)
const abnormalCount = computed(() => props.labs.filter(l => l.status === 'high' || l.status === 'low').length)

const groupedLabs = computed(() => {
  const map: Record<string, LabResultWithStatus[]> = {}
  for (const lab of props.labs) {
    const cat = lab.category ?? '其他'
    if (!map[cat]) map[cat] = []
    map[cat].push(lab)
  }
  return Object.entries(map).map(([category, items]) => ({ category, items }))
})

function dotClass(status: string) {
  return status === 'high' || status === 'low' ? 'bg-status-danger' : status === 'normal' ? 'bg-status-success' : 'bg-content-tertiary'
}
function textClass(status: string) {
  return status === 'high' || status === 'low' ? 'text-status-danger' : status === 'normal' ? 'text-status-success' : 'text-content-secondary'
}
</script>
