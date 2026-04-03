<template>
  <AppLayout>
    <PageHeader title="新增血壓紀錄">
      <RouterLink to="/records" class="text-sm text-content-tertiary hover:text-content-secondary">返回列表</RouterLink>
    </PageHeader>
    <div class="bg-surface-card rounded-card shadow-sm p-6 max-w-lg">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-content-secondary mb-1">收縮壓 (mmHg)</label>
            <input v-model.number="form.systolic" type="number" required min="60" max="250"
              class="w-full border border-border-default rounded-lg px-3 py-2 text-sm bg-surface-card text-content-primary focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
          <div>
            <label class="block text-sm font-medium text-content-secondary mb-1">舒張壓 (mmHg)</label>
            <input v-model.number="form.diastolic" type="number" required min="40" max="150"
              class="w-full border border-border-default rounded-lg px-3 py-2 text-sm bg-surface-card text-content-primary focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-content-secondary mb-1">脈搏 (bpm)</label>
          <input v-model.number="form.pulse" type="number" min="30" max="200"
            class="w-full border border-border-default rounded-lg px-3 py-2 text-sm bg-surface-card text-content-primary focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>
        <div>
          <label class="block text-sm font-medium text-content-secondary mb-1">測量時間</label>
          <input v-model="form.recordedAt" type="datetime-local" required
            class="w-full border border-border-default rounded-lg px-3 py-2 text-sm bg-surface-card text-content-primary focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>
        <div>
          <label class="block text-sm font-medium text-content-secondary mb-1">備註</label>
          <textarea v-model="form.note" rows="2"
            class="w-full border border-border-default rounded-lg px-3 py-2 text-sm bg-surface-card text-content-primary focus:outline-none focus:ring-2 focus:ring-accent"></textarea>
        </div>
        <p v-if="error" class="text-sm text-status-danger">{{ error }}</p>
        <div class="flex gap-3">
          <button type="submit" :disabled="loading"
            class="bg-accent text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-accent-dark disabled:opacity-50">
            {{ loading ? '儲存中...' : '儲存' }}
          </button>
          <RouterLink to="/records" class="px-6 py-2 rounded-lg text-sm border border-border-default text-content-secondary hover:bg-surface-alt">
            取消
          </RouterLink>
        </div>
      </form>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppLayout from '@/components/common/AppLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import { useBloodPressureStore } from '@/stores/bloodPressure'

const router = useRouter()
const route = useRoute()
const store = useBloodPressureStore()

const now = new Date()
const localISO = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16)

const form = ref({
  systolic: null as number | null,
  diastolic: null as number | null,
  pulse: null as number | null,
  recordedAt: localISO,
  note: '',
  healthRecordId: route.query.healthRecordId ? Number(route.query.healthRecordId) : null,
})
const loading = ref(false)
const error = ref('')

async function handleSubmit() {
  if (!form.value.systolic || !form.value.diastolic) return
  loading.value = true
  error.value = ''
  try {
    await store.createRecord({
      systolic: form.value.systolic,
      diastolic: form.value.diastolic,
      pulse: form.value.pulse ?? 0,
      recordedAt: form.value.recordedAt,
      note: form.value.note || undefined,
      healthRecordId: form.value.healthRecordId,
    })
    router.push('/records')
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
