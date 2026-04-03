<template>
  <AppLayout>
    <PageHeader title="新增檢驗紀錄">
      <RouterLink to="/lab" class="text-sm text-content-tertiary hover:text-content-secondary">返回列表</RouterLink>
    </PageHeader>
    <div class="bg-surface-card rounded-card shadow-sm p-6 max-w-2xl">
      <div class="space-y-4 mb-6">
        <div>
          <label class="block text-sm font-medium text-content-secondary mb-1">檢驗日期</label>
          <input v-model="recordedAt" type="date" required
            class="w-full border border-border-default rounded-lg px-3 py-2 text-sm bg-surface-card text-content-primary focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>
      </div>

      <!-- Add items -->
      <div class="border-t border-border-default pt-4">
        <h3 class="text-sm font-medium text-content-secondary mb-3">新增檢驗項目</h3>
        <div class="flex gap-2 mb-4">
          <select v-model="selectedItemId" :disabled="loadingItems"
            class="flex-1 border border-border-default rounded-lg px-3 py-2 text-sm bg-surface-card text-content-primary focus:outline-none focus:ring-2 focus:ring-accent">
            <option value="">{{ loadingItems ? '載入中...' : '選擇檢驗項目...' }}</option>
            <optgroup v-for="cat in categories" :key="cat" :label="cat">
              <option v-for="item in itemsByCategory[cat]" :key="item.id" :value="item.id">
                {{ item.itemName }}（{{ item.itemCode }}）{{ item.unit }}
              </option>
            </optgroup>
          </select>
          <button @click="addItem" :disabled="!selectedItemId"
            class="bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent-dark disabled:opacity-50">
            加入
          </button>
        </div>

        <!-- Item list -->
        <div v-if="items.length > 0" class="space-y-2">
          <div v-for="(item, idx) in items" :key="idx"
            class="flex items-center gap-3 p-3 bg-surface-alt rounded-lg">
            <div class="flex-1">
              <span class="text-sm font-medium text-content-primary">{{ item.itemName }}</span>
              <span class="text-xs text-content-tertiary ml-2">{{ item.category }}</span>
            </div>
            <div class="flex items-center gap-2">
              <input v-if="item.isNumeric" v-model.number="item.valueNumeric" type="number" step="0.01"
                :placeholder="`${item.normalMin ?? ''} ~ ${item.normalMax ?? ''} ${item.unit}`"
                class="w-32 border border-border-default rounded px-2 py-1 text-sm bg-surface-card text-content-primary" />
              <input v-else v-model="item.valueText" type="text"
                class="w-32 border border-border-default rounded px-2 py-1 text-sm bg-surface-card text-content-primary" />
              <span class="text-xs text-content-tertiary">{{ item.unit }}</span>
              <button @click="items.splice(idx, 1)" class="text-status-danger hover:opacity-80 text-xs">移除</button>
            </div>
          </div>
        </div>
      </div>

      <p v-if="error" class="text-sm text-status-danger mt-4">{{ error }}</p>
      <div class="flex gap-3 mt-6">
        <button @click="handleSubmit" :disabled="loading || items.length === 0"
          class="bg-accent text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-accent-dark disabled:opacity-50">
          {{ loading ? '儲存中...' : '儲存' }}
        </button>
        <RouterLink to="/lab" class="px-6 py-2 rounded-lg text-sm border border-border-default text-content-secondary hover:bg-surface-alt">
          取消
        </RouterLink>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/common/AppLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import { useLabStore } from '@/stores/lab'
import { userLabItemApi } from '@/api/userLabItem'
import type { UserLabItem } from '@/types/userLabItem'
import type { CreateLabResultItem } from '@/types/lab'

const router = useRouter()
const store = useLabStore()

const recordedAt = ref(new Date().toISOString().slice(0, 10))
const selectedItemId = ref<number | ''>('')
const userLabItems = ref<UserLabItem[]>([])
const loadingItems = ref(false)
const items = ref<CreateLabResultItem[]>([])
const loading = ref(false)
const error = ref('')

const categories = computed(() => [...new Set(userLabItems.value.map(p => p.category))])
const itemsByCategory = computed(() => {
  const map: Record<string, UserLabItem[]> = {}
  for (const item of userLabItems.value) {
    if (!map[item.category]) map[item.category] = []
    map[item.category].push(item)
  }
  return map
})

function addItem() {
  const labItem = userLabItems.value.find(i => i.id === selectedItemId.value)
  if (!labItem) return
  if (items.value.find(i => i.itemCode === labItem.itemCode && i.itemName === labItem.itemName)) return
  items.value.push({
    recordedAt: recordedAt.value,
    itemName: labItem.itemName,
    itemCode: labItem.itemCode,
    unit: labItem.unit,
    category: labItem.category,
    normalMin: labItem.normalMin,
    normalMax: labItem.normalMax,
    isNumeric: true,
    isAbnormal: false,
    valueNumeric: undefined,
    valueText: undefined,
  })
  selectedItemId.value = ''
}

async function handleSubmit() {
  loading.value = true
  error.value = ''
  try {
    const itemsWithDate = items.value.map(i => ({ ...i, recordedAt: recordedAt.value }))
    await store.createResults({ items: itemsWithDate })
    router.push('/lab')
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  loadingItems.value = true
  try {
    userLabItems.value = await userLabItemApi.getAll()
  } finally {
    loadingItems.value = false
  }
})
</script>
