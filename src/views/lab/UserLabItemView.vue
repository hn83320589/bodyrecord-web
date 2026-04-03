<template>
  <AppLayout>
    <PageHeader title="檢驗項目管理" subtitle="管理您的檢驗項目參考值與單位">
      <RouterLink to="/lab" class="text-sm text-content-tertiary hover:text-content-secondary">返回列表</RouterLink>
    </PageHeader>

    <!-- 新增自訂項目 -->
    <div class="bg-surface-card rounded-card shadow-sm p-6 mb-6">
      <h3 class="text-sm font-semibold text-content-secondary mb-4">新增自訂項目</h3>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div>
          <label class="block text-xs text-content-tertiary mb-1">申報代碼</label>
          <input v-model="newItem.itemCode" type="text" placeholder="如：09015C"
            class="w-full border border-border-default rounded-lg px-3 py-2 text-sm bg-surface-card text-content-primary" />
        </div>
        <div>
          <label class="block text-xs text-content-tertiary mb-1">項目名稱</label>
          <input v-model="newItem.itemName" type="text" placeholder="如：CRE(肌酸酐)"
            class="w-full border border-border-default rounded-lg px-3 py-2 text-sm bg-surface-card text-content-primary" />
        </div>
        <div>
          <label class="block text-xs text-content-tertiary mb-1">單位</label>
          <input v-model="newItem.unit" type="text" placeholder="如：mg/dL"
            class="w-full border border-border-default rounded-lg px-3 py-2 text-sm bg-surface-card text-content-primary" />
        </div>
        <div>
          <label class="block text-xs text-content-tertiary mb-1">類別</label>
          <input v-model="newItem.category" type="text" placeholder="如：腎功能"
            class="w-full border border-border-default rounded-lg px-3 py-2 text-sm bg-surface-card text-content-primary" />
        </div>
        <div>
          <label class="block text-xs text-content-tertiary mb-1">正常下限</label>
          <input v-model.number="newItem.normalMin" type="number" step="0.01"
            class="w-full border border-border-default rounded-lg px-3 py-2 text-sm bg-surface-card text-content-primary" />
        </div>
        <div>
          <label class="block text-xs text-content-tertiary mb-1">正常上限</label>
          <input v-model.number="newItem.normalMax" type="number" step="0.01"
            class="w-full border border-border-default rounded-lg px-3 py-2 text-sm bg-surface-card text-content-primary" />
        </div>
      </div>
      <p v-if="createError" class="text-sm text-status-danger mt-2">{{ createError }}</p>
      <button @click="handleCreate" :disabled="creating || !newItem.itemCode || !newItem.itemName"
        class="mt-4 bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent-dark disabled:opacity-50">
        {{ creating ? '新增中...' : '新增項目' }}
      </button>
    </div>

    <!-- 項目列表 -->
    <LoadingSpinner v-if="loading" />
    <div v-else class="bg-surface-card rounded-card shadow-sm overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-surface-alt">
          <tr>
            <th class="text-left px-4 py-3 text-content-secondary font-medium">申報代碼</th>
            <th class="text-left px-4 py-3 text-content-secondary font-medium">項目名稱</th>
            <th class="text-left px-4 py-3 text-content-secondary font-medium">單位</th>
            <th class="text-left px-4 py-3 text-content-secondary font-medium">類別</th>
            <th class="text-left px-4 py-3 text-content-secondary font-medium">正常範圍</th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id" class="border-t border-border-default">
            <td class="px-4 py-3 text-content-tertiary font-mono text-xs">
              {{ item.itemCode }}
              <span v-if="item.isPreset" class="ml-1 text-content-tertiary" title="系統預設">🔒</span>
            </td>
            <td class="px-4 py-3 text-content-primary font-medium">{{ item.itemName }}</td>

            <!-- 編輯模式 -->
            <template v-if="editingId === item.id">
              <td class="px-2 py-2">
                <input v-model="editForm.unit" type="text"
                  class="w-20 border border-accent rounded px-2 py-1 text-sm bg-surface-card text-content-primary" />
              </td>
              <td class="px-2 py-2">
                <input v-model="editForm.category" type="text"
                  class="w-24 border border-accent rounded px-2 py-1 text-sm bg-surface-card text-content-primary" />
              </td>
              <td class="px-2 py-2">
                <div class="flex items-center gap-1">
                  <input v-model.number="editForm.normalMin" type="number" step="0.01" placeholder="min"
                    class="w-20 border border-accent rounded px-2 py-1 text-sm bg-surface-card text-content-primary" />
                  <span class="text-content-tertiary">~</span>
                  <input v-model.number="editForm.normalMax" type="number" step="0.01" placeholder="max"
                    class="w-20 border border-accent rounded px-2 py-1 text-sm bg-surface-card text-content-primary" />
                </div>
              </td>
              <td class="px-4 py-2">
                <div class="flex gap-2">
                  <button @click="handleUpdate(item.id)"
                    class="text-accent hover:text-accent-dark text-xs font-medium">儲存</button>
                  <button @click="editingId = null"
                    class="text-content-tertiary hover:text-content-secondary text-xs">取消</button>
                </div>
              </td>
            </template>

            <!-- 顯示模式 -->
            <template v-else>
              <td class="px-4 py-3 text-content-secondary">{{ item.unit }}</td>
              <td class="px-4 py-3 text-content-tertiary">{{ item.category }}</td>
              <td class="px-4 py-3 text-content-tertiary text-xs font-data">
                {{ item.normalMin ?? '-' }} ~ {{ item.normalMax ?? '-' }}
              </td>
              <td class="px-4 py-3">
                <div class="flex gap-3">
                  <button @click="startEdit(item)"
                    class="text-accent hover:text-accent-dark text-xs">編輯</button>
                  <button v-if="!item.isPreset" @click="handleDelete(item.id)"
                    class="text-status-danger hover:opacity-80 text-xs">刪除</button>
                </div>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
      <p v-if="items.length === 0" class="text-center py-12 text-content-tertiary">尚無檢驗項目</p>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppLayout from '@/components/common/AppLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { userLabItemApi } from '@/api/userLabItem'
import type { UserLabItem } from '@/types/userLabItem'

const items = ref<UserLabItem[]>([])
const loading = ref(false)
const editingId = ref<number | null>(null)
const editForm = ref({ unit: '', category: '', normalMin: undefined as number | undefined, normalMax: undefined as number | undefined })
const newItem = ref({ itemCode: '', itemName: '', unit: '', category: '', normalMin: undefined as number | undefined, normalMax: undefined as number | undefined })
const creating = ref(false)
const createError = ref('')

async function loadItems() {
  loading.value = true
  try {
    items.value = await userLabItemApi.getAll()
  } finally {
    loading.value = false
  }
}

function startEdit(item: UserLabItem) {
  editingId.value = item.id
  editForm.value = {
    unit: item.unit,
    category: item.category,
    normalMin: item.normalMin,
    normalMax: item.normalMax,
  }
}

async function handleUpdate(id: number) {
  await userLabItemApi.update(id, {
    unit: editForm.value.unit,
    category: editForm.value.category,
    normalMin: editForm.value.normalMin,
    normalMax: editForm.value.normalMax,
  })
  editingId.value = null
  await loadItems()
}

async function handleDelete(id: number) {
  if (!confirm('確定刪除此項目？')) return
  await userLabItemApi.delete(id)
  items.value = items.value.filter(i => i.id !== id)
}

async function handleCreate() {
  if (!newItem.value.itemCode || !newItem.value.itemName) return
  creating.value = true
  createError.value = ''
  try {
    await userLabItemApi.create({
      itemCode: newItem.value.itemCode,
      itemName: newItem.value.itemName,
      unit: newItem.value.unit,
      category: newItem.value.category,
      normalMin: newItem.value.normalMin,
      normalMax: newItem.value.normalMax,
    })
    newItem.value = { itemCode: '', itemName: '', unit: '', category: '', normalMin: undefined, normalMax: undefined }
    await loadItems()
  } catch (e: any) {
    createError.value = e.message
  } finally {
    creating.value = false
  }
}

onMounted(loadItems)
</script>
