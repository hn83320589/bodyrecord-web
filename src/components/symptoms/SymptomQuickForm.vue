<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="$emit('close')"></div>
      <div class="relative bg-surface-card rounded-card shadow-lg w-full max-w-md mx-4 p-6 space-y-5">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-content-primary">記錄症狀</h2>
          <button @click="$emit('close')" class="text-content-tertiary hover:text-content-primary text-xl">&times;</button>
        </div>

        <!-- Step 1: Type -->
        <div>
          <p class="text-sm text-content-secondary mb-2">症狀類型</p>
          <div class="flex gap-2 flex-wrap">
            <button v-for="t in types" :key="t"
              @click="form.symptomType = t"
              :class="['px-3 py-1.5 rounded-full text-xs font-medium transition',
                form.symptomType === t ? 'bg-accent text-white' : 'bg-surface-alt text-content-secondary hover:bg-border-default']">
              {{ t }}
            </button>
            <button @click="showCustomType = !showCustomType"
              :class="['px-3 py-1.5 rounded-full text-xs font-medium transition',
                showCustomType ? 'bg-accent text-white' : 'bg-surface-alt text-content-secondary hover:bg-border-default']">
              其他
            </button>
          </div>
          <input v-if="showCustomType" v-model="form.symptomType" type="text" placeholder="自訂症狀類型"
            class="mt-2 w-full border border-border-default rounded-lg px-3 py-2 text-sm bg-surface-card text-content-primary" />
        </div>

        <!-- Step 2: Severity -->
        <SeveritySlider v-model="form.severity" />

        <!-- Step 3: Details (collapsible) -->
        <details>
          <summary class="text-sm text-accent cursor-pointer select-none">展開詳細資訊</summary>
          <div class="mt-3 space-y-3">
            <div>
              <label class="text-xs text-content-tertiary mb-1 block">身體部位</label>
              <input v-model="form.bodyLocation" type="text" placeholder="如：左膝、頭部"
                class="w-full border border-border-default rounded-lg px-3 py-2 text-sm bg-surface-card text-content-primary" />
            </div>
            <div>
              <label class="text-xs text-content-tertiary mb-1 block">持續時間（分鐘）</label>
              <input v-model.number="form.durationMinutes" type="number" min="0" placeholder="分鐘"
                class="w-full border border-border-default rounded-lg px-3 py-2 text-sm bg-surface-card text-content-primary" />
            </div>
            <TriggerPills v-model="selectedTriggers" />
            <div>
              <label class="text-xs text-content-tertiary mb-1 block">備註</label>
              <textarea v-model="form.note" rows="2"
                class="w-full border border-border-default rounded-lg px-3 py-2 text-sm bg-surface-card text-content-primary" />
            </div>
          </div>
        </details>

        <!-- Submit -->
        <button @click="handleSubmit" :disabled="!form.symptomType || submitting"
          class="w-full bg-accent text-white py-2.5 rounded-lg font-medium hover:bg-accent-dark disabled:opacity-50 transition">
          {{ submitting ? '記錄中...' : '記錄' }}
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import SeveritySlider from './SeveritySlider.vue'
import TriggerPills from './TriggerPills.vue'
import { symptomApi } from '@/api/symptom'

defineProps<{ open: boolean; types: string[] }>()
const emit = defineEmits<{ (e: 'close'): void; (e: 'created'): void }>()

const showCustomType = ref(false)
const selectedTriggers = ref<string[]>([])
const submitting = ref(false)

const form = reactive({
  symptomType: '',
  severity: 5,
  bodyLocation: '',
  durationMinutes: undefined as number | undefined,
  note: '',
})

async function handleSubmit() {
  if (!form.symptomType) return
  submitting.value = true
  try {
    await symptomApi.create({
      loggedAt: new Date().toISOString(),
      symptomType: form.symptomType,
      severity: form.severity,
      bodyLocation: form.bodyLocation || undefined,
      durationMinutes: form.durationMinutes,
      triggers: selectedTriggers.value.length > 0 ? selectedTriggers.value.join(',') : undefined,
      note: form.note || undefined,
    })
    // Reset form
    form.symptomType = ''
    form.severity = 5
    form.bodyLocation = ''
    form.durationMinutes = undefined
    form.note = ''
    selectedTriggers.value = []
    showCustomType.value = false
    emit('created')
    emit('close')
  } finally {
    submitting.value = false
  }
}
</script>
