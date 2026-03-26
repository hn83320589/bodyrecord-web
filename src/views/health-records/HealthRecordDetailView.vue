<template>
  <AppLayout>
    <PageHeader :title="detail?.hospital ?? '看診詳情'">
      <div class="flex gap-2">
        <RouterLink to="/health-records" class="text-sm text-gray-500 hover:text-gray-700">返回列表</RouterLink>
        <button v-if="detail?.source === 'nhi_import'" @click="handleDelete"
          class="text-sm text-red-500 hover:text-red-700 border border-red-200 px-3 py-1 rounded-lg">
          刪除此次看診
        </button>
      </div>
    </PageHeader>
    <LoadingSpinner v-if="store.loading" />
    <div v-else-if="detail" class="space-y-6">
      <!-- Basic Info -->
      <div class="bg-white rounded-xl shadow p-6">
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div><span class="text-gray-500">就醫日期：</span><span class="text-gray-800">{{ formatDate(detail.clinicDate) }}</span></div>
          <div><span class="text-gray-500">醫院：</span><span class="text-gray-800">{{ detail.hospital ?? '-' }}</span></div>
          <div><span class="text-gray-500">主診斷代碼：</span><span class="text-gray-800">{{ detail.primaryIcdCode ?? '-' }}</span></div>
          <div><span class="text-gray-500">主診斷：</span><span class="text-gray-800 font-medium">{{ detail.primaryDiagnosis ?? '-' }}</span></div>
          <div v-if="detail.copay"><span class="text-gray-500">部分負擔：</span><span class="text-gray-800">{{ detail.copay }} 元</span></div>
        </div>
      </div>

      <!-- Secondary Diagnoses -->
      <div v-if="secondaryDiagnoses.length" class="bg-white rounded-xl shadow p-6">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">次診斷</h3>
        <div class="space-y-1">
          <div v-for="d in secondaryDiagnoses" :key="d.code" class="text-sm">
            <span class="text-gray-500">{{ d.code }}</span>
            <span class="text-gray-800 ml-2">{{ d.name }}</span>
          </div>
        </div>
      </div>

      <!-- Medications -->
      <div class="bg-white rounded-xl shadow p-6">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">用藥清單</h3>
        <div v-if="medications.length > 0" class="space-y-2">
          <div v-for="m in medications" :key="m.id" class="flex items-center justify-between text-sm">
            <span class="text-gray-800">{{ m.drugName }}</span>
            <span class="text-gray-500">{{ m.quantity ? `${m.quantity} 顆` : '' }} {{ m.days ? `× ${m.days}天` : '' }}</span>
          </div>
        </div>
        <p v-else class="text-sm text-gray-400">無用藥紀錄</p>
      </div>

      <!-- Lab Results -->
      <div class="bg-white rounded-xl shadow p-6">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">檢驗結果</h3>
        <div v-if="detail.labResults.length > 0">
          <table class="w-full text-sm">
            <tbody>
              <tr v-for="item in detail.labResults" :key="item.id" class="border-t border-gray-100 first:border-0">
                <td class="py-2 text-gray-700">{{ item.itemName }}</td>
                <td class="py-2">
                  <LabValueBadge
                    :is-numeric="item.isNumeric"
                    :value-numeric="item.valueNumeric"
                    :value-text="item.valueText"
                    :unit="item.unit"
                    :normal-min="item.normalMin"
                    :normal-max="item.normalMax"
                    :is-abnormal="item.isAbnormal"
                  />
                </td>
                <td class="py-2 text-gray-400 text-xs">{{ item.normalMin ?? '-' }} ~ {{ item.normalMax ?? '-' }} {{ item.unit }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="text-sm text-gray-400">無檢驗紀錄</p>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/common/AppLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import LabValueBadge from '@/components/charts/LabValueBadge.vue'
import { useHealthRecordStore } from '@/stores/healthRecord'
import { formatDate } from '@/utils/dateTime'

const route = useRoute()
const router = useRouter()
const store = useHealthRecordStore()

const detail = computed(() => store.currentDetail)
const medications = computed(() => detail.value?.medications.filter(m => m.drugType === 'medication') ?? [])

const secondaryDiagnoses = computed((): { code: string; name: string }[] => {
  const raw = detail.value?.secondaryDiagnoses
  if (!raw) return []
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
})

async function handleDelete() {
  if (!detail.value) return
  if (!confirm(`確定刪除 ${formatDate(detail.value.clinicDate)} ${detail.value.hospital ?? ''} 的看診紀錄？\n相關用藥與檢驗資料也將一併刪除。`)) return
  await store.deleteRecord(detail.value.id)
  router.push('/health-records')
}

onMounted(() => store.fetchDetail(Number(route.params.id)))
</script>
