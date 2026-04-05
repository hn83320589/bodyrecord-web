<template>
  <AppLayout>
    <PageHeader :title="detail?.nhiInstitution ?? '看診詳情'">
      <div class="flex gap-2">
        <RouterLink to="/health-records" class="text-sm text-content-tertiary hover:text-content-secondary">返回列表</RouterLink>
        <button v-if="detail?.source === 'nhi_import'" @click="handleDelete"
          class="text-sm text-status-danger hover:opacity-80 border border-status-danger/30 px-3 py-1 rounded-lg">
          刪除此筆紀錄
        </button>
      </div>
    </PageHeader>
    <LoadingSpinner v-if="store.loading" />
    <div v-else-if="detail" class="space-y-6">
      <!-- Basic Info -->
      <div class="bg-surface-card rounded-card shadow-sm p-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div><span class="text-content-tertiary">日期：</span><span class="text-content-primary">{{ formatDate(detail.recordedAt) }}</span></div>
          <div><span class="text-content-tertiary">機構：</span><span class="text-content-primary">{{ detail.nhiInstitution ?? '-' }}</span></div>
          <div><span class="text-content-tertiary">類型：</span><span class="text-content-primary">{{ detail.recordType ?? '-' }}</span></div>
          <div><span class="text-content-tertiary">來源：</span><span class="text-content-primary">{{ detail.source }}</span></div>
          <div v-if="detail.note"><span class="text-content-tertiary">備註：</span><span class="text-content-primary">{{ detail.note }}</span></div>
        </div>
      </div>

      <!-- Medications -->
      <div v-if="detail.medications && detail.medications.length > 0" class="bg-surface-card rounded-card shadow-sm p-6">
        <h3 class="text-sm font-semibold text-content-secondary mb-3">用藥清單</h3>
        <div class="space-y-2">
          <div v-for="m in detail.medications" :key="m.id" class="flex items-center justify-between text-sm">
            <span class="text-content-primary">{{ m.medicationName }}</span>
            <span class="text-content-tertiary font-data">{{ m.quantity ?? '' }} {{ m.durationDays ? `× ${m.durationDays}天` : '' }}</span>
          </div>
        </div>
      </div>

      <!-- Lab Results -->
      <div v-if="detail.labResults && detail.labResults.length > 0" class="bg-surface-card rounded-card shadow-sm p-6">
        <h3 class="text-sm font-semibold text-content-secondary mb-3">檢驗結果</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <tbody>
              <tr v-for="item in detail.labResults" :key="item.id" class="border-t border-border-default first:border-0">
                <td class="py-2 text-content-secondary max-w-[200px] truncate">{{ item.itemName }}</td>
                <td class="py-2 font-data">
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
                <td class="py-2 text-content-tertiary text-xs font-data whitespace-nowrap">{{ item.normalMin ?? '-' }} ~ {{ item.normalMax ?? '-' }} {{ item.unit }}</td>
              </tr>
            </tbody>
          </table>
        </div>
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

async function handleDelete() {
  if (!detail.value) return
  if (!confirm(`確定刪除此筆紀錄？相關用藥與檢驗資料也將一併刪除。`)) return
  await store.deleteRecord(detail.value.id)
  router.push('/health-records')
}

onMounted(() => store.fetchDetail(Number(route.params.id)))
</script>
