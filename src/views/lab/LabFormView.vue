<template>
  <AppLayout>
    <PageHeader title="新增檢驗紀錄">
      <RouterLink to="/lab" class="text-sm text-gray-500 hover:text-gray-700">返回列表</RouterLink>
    </PageHeader>
    <div class="bg-white rounded-xl shadow p-6 max-w-2xl">
      <div class="space-y-4 mb-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">檢驗日期</label>
          <input v-model="recordedAt" type="date" required
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>

      <!-- Add items -->
      <div class="border-t border-gray-100 pt-4">
        <h3 class="text-sm font-medium text-gray-700 mb-3">新增檢驗項目</h3>
        <div class="flex gap-2 mb-4">
          <select v-model="selectedPreset"
            class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">選擇檢驗項目...</option>
            <optgroup v-for="cat in categories" :key="cat" :label="cat">
              <option v-for="p in presetsByCategory[cat]" :key="p.itemCode" :value="p.itemCode">
                {{ p.itemName }}（{{ p.itemCode }}）{{ p.unit }}
              </option>
            </optgroup>
          </select>
          <button @click="addItem" :disabled="!selectedPreset"
            class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
            加入
          </button>
        </div>

        <!-- Item list -->
        <div v-if="items.length > 0" class="space-y-2">
          <div v-for="(item, idx) in items" :key="idx"
            class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div class="flex-1">
              <span class="text-sm font-medium text-gray-800">{{ item.itemName }}</span>
              <span class="text-xs text-gray-500 ml-2">{{ item.category }}</span>
            </div>
            <div class="flex items-center gap-2">
              <input v-if="item.isNumeric" v-model.number="item.valueNumeric" type="number" step="0.01"
                :placeholder="`${item.normalMin ?? ''} ~ ${item.normalMax ?? ''} ${item.unit}`"
                class="w-32 border border-gray-300 rounded px-2 py-1 text-sm" />
              <input v-else v-model="item.valueText" type="text"
                class="w-32 border border-gray-300 rounded px-2 py-1 text-sm" />
              <span class="text-xs text-gray-500">{{ item.unit }}</span>
              <button @click="items.splice(idx, 1)" class="text-red-400 hover:text-red-600 text-xs">移除</button>
            </div>
          </div>
        </div>
      </div>

      <p v-if="error" class="text-sm text-red-600 mt-4">{{ error }}</p>
      <div class="flex gap-3 mt-6">
        <button @click="handleSubmit" :disabled="loading || items.length === 0"
          class="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
          {{ loading ? '儲存中...' : '儲存' }}
        </button>
        <RouterLink to="/lab" class="px-6 py-2 rounded-lg text-sm border border-gray-300 text-gray-600 hover:bg-gray-50">
          取消
        </RouterLink>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/common/AppLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import { useLabStore } from '@/stores/lab'
import { LAB_PRESETS } from '@/constants/labPresets'
import type { CreateLabResultItem } from '@/types/lab'

const router = useRouter()
const store = useLabStore()

const recordedAt = ref(new Date().toISOString().slice(0, 10))
const selectedPreset = ref('')
const items = ref<CreateLabResultItem[]>([])
const loading = ref(false)
const error = ref('')

const categories = computed(() => [...new Set(LAB_PRESETS.map(p => p.category))])
const presetsByCategory = computed(() => {
  const map: Record<string, typeof LAB_PRESETS> = {}
  for (const p of LAB_PRESETS) {
    if (!map[p.category]) map[p.category] = []
    map[p.category].push(p)
  }
  return map
})

function addItem() {
  const preset = LAB_PRESETS.find(p => p.itemCode === selectedPreset.value)
  if (!preset) return
  if (items.value.find(i => i.itemCode === preset.itemCode)) return
  items.value.push({
    recordedAt: recordedAt.value,
    itemName: preset.itemName,
    itemCode: preset.itemCode,
    unit: preset.unit,
    category: preset.category,
    normalMin: preset.normalMin,
    normalMax: preset.normalMax,
    isNumeric: true,
    isAbnormal: false,
    valueNumeric: undefined,
    valueText: undefined,
  })
  selectedPreset.value = ''
}

async function handleSubmit() {
  loading.value = true
  error.value = ''
  try {
    // 同步所有 items 的 recordedAt 到目前選擇的日期
    const itemsWithDate = items.value.map(i => ({ ...i, recordedAt: recordedAt.value }))
    await store.createResults({ items: itemsWithDate })
    router.push('/lab')
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
