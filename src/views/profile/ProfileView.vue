<template>
  <AppLayout>
    <PageHeader title="個人資料" />
    <LoadingSpinner v-if="store.loading" />
    <div v-else-if="store.profile" class="space-y-6 max-w-2xl">
      <!-- Basic Info -->
      <div class="bg-white rounded-xl shadow p-6">
        <h3 class="text-sm font-semibold text-gray-700 mb-4">基本資料</h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs text-gray-500 mb-1">顯示名稱</label>
            <input v-model="form.displayName" type="text"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">性別</label>
            <select v-model="form.gender"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option value="">未填寫</option>
              <option value="M">男</option>
              <option value="F">女</option>
            </select>
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">出生日期</label>
            <input v-model="form.birthDate" type="date"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">血型</label>
            <select v-model="form.bloodType"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option value="">未知</option>
              <option>A</option><option>B</option><option>O</option><option>AB</option>
            </select>
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">身高 (cm)</label>
            <input v-model.number="form.heightCm" type="number"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">體重 (kg)</label>
            <input v-model.number="form.weightKg" type="number" step="0.1"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>
        <div class="mt-4">
          <label class="block text-xs text-gray-500 mb-1">慢性病史</label>
          <textarea v-model="form.chronicConditions" rows="2" placeholder="例：高血壓、糖尿病"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        </div>
        <div class="mt-3">
          <label class="block text-xs text-gray-500 mb-1">過敏史</label>
          <textarea v-model="form.allergies" rows="2" placeholder="例：盤尼西林、花生"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        </div>
        <button @click="saveProfile" :disabled="saving"
          class="mt-4 bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50">
          {{ saving ? '儲存中...' : '儲存' }}
        </button>
      </div>

      <!-- Emergency Contacts -->
      <div class="bg-white rounded-xl shadow p-6">
        <h3 class="text-sm font-semibold text-gray-700 mb-4">緊急聯絡人</h3>
        <div class="space-y-2 mb-4">
          <div v-for="c in contacts" :key="c.id"
            class="flex items-center justify-between text-sm py-2 border-b border-gray-100 last:border-0">
            <div>
              <span class="font-medium text-gray-800">{{ c.name }}</span>
              <span class="text-gray-500 ml-2">{{ c.relationship }}</span>
              <span class="text-gray-600 ml-2">{{ c.phone }}</span>
            </div>
            <button @click="deleteContact(c.id)" class="text-red-400 hover:text-red-600 text-xs">移除</button>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-2">
          <input v-model="newContact.name" type="text" placeholder="姓名"
            class="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          <input v-model="newContact.relationship" type="text" placeholder="關係"
            class="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          <input v-model="newContact.phone" type="tel" placeholder="電話"
            class="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        </div>
        <button @click="addContact"
          class="mt-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200">
          新增聯絡人
        </button>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import AppLayout from '@/components/common/AppLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useProfileStore } from '@/stores/profile'
import { profileApi } from '@/api/profile'
import type { EmergencyContact } from '@/types/profile'

const store = useProfileStore()
const contacts = ref<EmergencyContact[]>([])
const saving = ref(false)

const form = ref({
  displayName: '',
  gender: '',
  birthDate: '',
  bloodType: '',
  heightCm: undefined as number | undefined,
  weightKg: undefined as number | undefined,
  chronicConditions: '',
  allergies: '',
})

const newContact = ref({ name: '', relationship: '', phone: '' })

watch(() => store.profile, (p) => {
  if (!p) return
  form.value = {
    displayName: p.displayName,
    gender: p.gender ?? '',
    birthDate: p.birthDate ?? '',
    bloodType: p.bloodType ?? '',
    heightCm: p.heightCm,
    weightKg: p.weightKg,
    chronicConditions: p.chronicConditions ?? '',
    allergies: p.allergies ?? '',
  }
}, { immediate: true })

async function saveProfile() {
  saving.value = true
  try {
    await profileApi.update({
      displayName: form.value.displayName,
      gender: form.value.gender || undefined,
      birthDate: form.value.birthDate || undefined,
      bloodType: form.value.bloodType || undefined,
      heightCm: form.value.heightCm,
      weightKg: form.value.weightKg,
      chronicConditions: form.value.chronicConditions || undefined,
      allergies: form.value.allergies || undefined,
    })
    await store.fetchProfile()
  } finally {
    saving.value = false
  }
}

async function loadContacts() {
  contacts.value = await profileApi.getEmergencyContacts()
}

async function addContact() {
  if (!newContact.value.name || !newContact.value.phone) return
  await profileApi.addEmergencyContact(newContact.value)
  newContact.value = { name: '', relationship: '', phone: '' }
  await loadContacts()
}

async function deleteContact(id: number) {
  await profileApi.deleteEmergencyContact(id)
  await loadContacts()
}

onMounted(async () => {
  await store.fetchProfile()
  await loadContacts()
})
</script>
