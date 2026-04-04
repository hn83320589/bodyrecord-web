<template>
  <AppLayout>
    <PageHeader title="服藥提醒">
      <button @click="openForm(null)" class="bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent-dark">
        + 新增提醒
      </button>
    </PageHeader>

    <!-- Today's medications -->
    <TodayMedCard :logs="todayLogs" @take="takeMed" @skip="skipMed" @undo="undoMed" class="mb-6" />

    <!-- Adherence stats -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-surface-card rounded-card shadow-sm p-4 flex items-center justify-center">
        <AdherenceRing :rate="adherence?.overallRate ?? 0" label="服藥率" />
      </div>
      <StatCard label="本月最佳" :value="adherence?.bestMedication ?? '-'" />
      <StatCard label="本月最差" :value="adherence?.worstMedication ?? '-'" />
    </div>

    <!-- Reminder list -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-semibold text-content-primary">提醒設定</h3>
      <RouterLink to="/medications/adherence" class="text-xs text-accent hover:text-accent-dark">詳細報告</RouterLink>
    </div>

    <LoadingSpinner v-if="loadingReminders" />
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <ReminderCard v-for="r in reminders" :key="r.id" :reminder="r"
        @toggle="toggleReminder(r.id)"
        @edit="openForm(r)"
        @delete="deleteReminder(r.id)" />
    </div>
    <p v-if="!loadingReminders && reminders.length === 0" class="text-center py-8 text-content-tertiary text-sm">
      尚無提醒設定
    </p>

    <ReminderFormModal :open="showForm" :editing="editingReminder" @close="showForm = false" @saved="reload" />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppLayout from '@/components/common/AppLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import StatCard from '@/components/common/StatCard.vue'
import TodayMedCard from '@/components/medications/TodayMedCard.vue'
import ReminderCard from '@/components/medications/ReminderCard.vue'
import ReminderFormModal from '@/components/medications/ReminderFormModal.vue'
import AdherenceRing from '@/components/medications/AdherenceRing.vue'
import { medicationReminderApi } from '@/api/medicationReminder'
import { medicationLogApi } from '@/api/medicationLog'
import type { MedicationReminder, MedicationLog, AdherenceResponse } from '@/types/medicationReminder'

const todayLogs = ref<MedicationLog[]>([])
const reminders = ref<MedicationReminder[]>([])
const adherence = ref<AdherenceResponse | null>(null)
const loadingReminders = ref(false)
const showForm = ref(false)
const editingReminder = ref<MedicationReminder | null>(null)

function openForm(r: MedicationReminder | null) {
  editingReminder.value = r
  showForm.value = true
}

async function takeMed(id: number) {
  await medicationLogApi.take(id)
  todayLogs.value = await medicationLogApi.getToday()
}

async function skipMed(id: number) {
  await medicationLogApi.skip(id)
  todayLogs.value = await medicationLogApi.getToday()
}

async function undoMed(id: number) {
  await medicationLogApi.undo(id)
  todayLogs.value = await medicationLogApi.getToday()
}

async function toggleReminder(id: number) {
  await medicationReminderApi.toggle(id)
  reminders.value = await medicationReminderApi.getAll()
}

async function deleteReminder(id: number) {
  if (!confirm('確定刪除此提醒？')) return
  await medicationReminderApi.delete(id)
  reminders.value = reminders.value.filter(r => r.id !== id)
}

async function reload() {
  await Promise.allSettled([
    medicationLogApi.getToday().then(d => { todayLogs.value = d }),
    medicationReminderApi.getAll().then(d => { reminders.value = Array.isArray(d) ? d : [] }),
    medicationLogApi.getAdherence(30).then(d => { adherence.value = d }),
  ])
}

onMounted(async () => {
  loadingReminders.value = true
  try { await reload() }
  finally { loadingReminders.value = false }
})
</script>
