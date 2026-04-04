<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="$emit('close')"></div>
      <div class="relative bg-surface-card rounded-card shadow-lg w-full max-w-md mx-4 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-content-primary">{{ editing ? '編輯提醒' : '新增提醒' }}</h2>
          <button @click="$emit('close')" class="text-content-tertiary hover:text-content-primary text-xl">&times;</button>
        </div>

        <!-- Medication name -->
        <div>
          <label class="text-xs text-content-tertiary mb-1 block">藥品名稱 *</label>
          <input v-model="form.medicationName" type="text" required
            class="w-full border border-border-default rounded-lg px-3 py-2 text-sm bg-surface-card text-content-primary" />
        </div>

        <!-- Dosage -->
        <div>
          <label class="text-xs text-content-tertiary mb-1 block">劑量</label>
          <input v-model="form.dosage" type="text" placeholder="如：5mg"
            class="w-full border border-border-default rounded-lg px-3 py-2 text-sm bg-surface-card text-content-primary" />
        </div>

        <!-- Frequency quick pick -->
        <div>
          <label class="text-xs text-content-tertiary mb-2 block">頻率</label>
          <div class="flex gap-2 mb-2">
            <button v-for="f in freqOptions" :key="f.label"
              @click="applyFreq(f)"
              :class="['px-3 py-1.5 rounded-full text-xs font-medium transition',
                form.frequency === f.label ? 'bg-accent text-white' : 'bg-surface-alt text-content-secondary hover:bg-border-default']">
              {{ f.label }}
            </button>
          </div>
        </div>

        <!-- Custom times -->
        <div>
          <label class="text-xs text-content-tertiary mb-1 block">服藥時間</label>
          <div class="space-y-2">
            <div v-for="(t, i) in form.remindTimes" :key="i" class="flex items-center gap-2">
              <input :value="t" @input="form.remindTimes[i] = ($event.target as HTMLInputElement).value"
                type="time" class="border border-border-default rounded-lg px-3 py-1.5 text-sm bg-surface-card text-content-primary font-data" />
              <button v-if="form.remindTimes.length > 1" @click="form.remindTimes.splice(i, 1)"
                class="text-status-danger hover:opacity-80 text-xs">移除</button>
            </div>
            <button @click="form.remindTimes.push('12:00')"
              class="text-xs text-accent hover:text-accent-dark">+ 新增時間</button>
          </div>
        </div>

        <!-- Days of week -->
        <div>
          <label class="text-xs text-content-tertiary mb-2 block">星期</label>
          <div class="flex gap-1">
            <button v-for="d in dayOptions" :key="d.value"
              @click="toggleDay(d.value)"
              :class="['w-9 h-9 rounded-full text-xs font-medium transition',
                form.daysOfWeek.includes(d.value) ? 'bg-accent text-white' : 'bg-surface-alt text-content-tertiary']">
              {{ d.label }}
            </button>
          </div>
        </div>

        <!-- Date range -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-xs text-content-tertiary mb-1 block">開始日期</label>
            <input v-model="form.startDate" type="date"
              class="w-full border border-border-default rounded-lg px-3 py-1.5 text-sm bg-surface-card text-content-primary" />
          </div>
          <div>
            <label class="text-xs text-content-tertiary mb-1 block">結束日期</label>
            <input v-model="form.endDate" type="date"
              class="w-full border border-border-default rounded-lg px-3 py-1.5 text-sm bg-surface-card text-content-primary" />
          </div>
        </div>

        <!-- Submit -->
        <button @click="handleSubmit" :disabled="!form.medicationName || submitting"
          class="w-full bg-accent text-white py-2.5 rounded-lg font-medium hover:bg-accent-dark disabled:opacity-50 transition">
          {{ submitting ? '儲存中...' : (editing ? '更新' : '新增') }}
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { medicationReminderApi } from '@/api/medicationReminder'
import type { MedicationReminder } from '@/types/medicationReminder'

const props = defineProps<{
  open: boolean
  editing?: MedicationReminder | null
}>()
const emit = defineEmits<{ (e: 'close'): void; (e: 'saved'): void }>()

const submitting = ref(false)
const form = reactive({
  medicationName: '',
  dosage: '',
  frequency: '',
  remindTimes: ['08:00'] as string[],
  daysOfWeek: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'] as string[],
  startDate: '',
  endDate: '',
})

const freqOptions = [
  { label: 'QD', times: ['08:00'] },
  { label: 'BID', times: ['08:00', '20:00'] },
  { label: 'TID', times: ['08:00', '14:00', '20:00'] },
]

const dayOptions = [
  { label: '日', value: 'SUN' }, { label: '一', value: 'MON' }, { label: '二', value: 'TUE' },
  { label: '三', value: 'WED' }, { label: '四', value: 'THU' }, { label: '五', value: 'FRI' },
  { label: '六', value: 'SAT' },
]

function applyFreq(f: { label: string; times: string[] }) {
  form.frequency = f.label
  form.remindTimes = [...f.times]
}

function toggleDay(day: string) {
  const idx = form.daysOfWeek.indexOf(day)
  if (idx >= 0) form.daysOfWeek.splice(idx, 1)
  else form.daysOfWeek.push(day)
}

watch(() => props.editing, (r) => {
  if (r) {
    form.medicationName = r.medicationName
    form.dosage = r.dosage ?? ''
    form.frequency = r.frequency ?? ''
    form.remindTimes = [...r.remindTimes]
    form.daysOfWeek = r.daysOfWeek ? r.daysOfWeek.split(',') : ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
    form.startDate = r.startDate ?? ''
    form.endDate = r.endDate ?? ''
  } else {
    form.medicationName = ''
    form.dosage = ''
    form.frequency = ''
    form.remindTimes = ['08:00']
    form.daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
    form.startDate = ''
    form.endDate = ''
  }
}, { immediate: true })

async function handleSubmit() {
  if (!form.medicationName) return
  submitting.value = true
  try {
    const data = {
      medicationName: form.medicationName,
      dosage: form.dosage || undefined,
      frequency: form.frequency || undefined,
      remindTimes: form.remindTimes,
      daysOfWeek: form.daysOfWeek.join(','),
      startDate: form.startDate || undefined,
      endDate: form.endDate || undefined,
    }
    if (props.editing) {
      await medicationReminderApi.update(props.editing.id, data)
    } else {
      await medicationReminderApi.create(data)
    }
    emit('saved')
    emit('close')
  } finally {
    submitting.value = false
  }
}
</script>
