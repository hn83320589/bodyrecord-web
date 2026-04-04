<template>
  <div class="bg-surface-card rounded-card shadow-sm p-6">
    <h3 class="text-sm font-semibold text-content-primary mb-4">
      用藥
      <span class="text-content-tertiary font-normal ml-2">{{ meds.length }} 種</span>
    </h3>

    <div v-if="meds.length === 0" class="text-sm text-content-tertiary">無用藥資料</div>

    <table v-else class="w-full text-sm">
      <tbody>
        <tr v-for="med in meds" :key="med.id" class="border-t border-border-default first:border-0">
          <td class="py-2 text-content-primary">{{ med.medicationName }}</td>
          <td class="py-2 text-content-tertiary text-right font-data">
            {{ med.quantity ?? '-' }}
          </td>
          <td v-if="hasCopayment" class="py-2 text-content-tertiary text-right w-20 font-data">
            {{ med.copayment != null ? `$${med.copayment}` : '' }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { VisitMedication } from '@/types/visit'

const props = defineProps<{ meds: VisitMedication[] }>()

const hasCopayment = computed(() => props.meds.some(m => m.copayment != null))
</script>
