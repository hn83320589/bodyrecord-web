<template>
  <div>
    <p class="text-sm text-content-secondary mb-2">觸發因子</p>
    <div class="flex gap-2 flex-wrap">
      <button v-for="t in presetTriggers" :key="t"
        @click="toggleTrigger(t)"
        :class="['px-3 py-1 rounded-full text-xs font-medium transition',
          selected.includes(t) ? 'bg-accent text-white' : 'bg-surface-alt text-content-secondary hover:bg-border-default']">
        {{ t }}
      </button>
      <button @click="showCustom = !showCustom"
        :class="['px-3 py-1 rounded-full text-xs font-medium transition',
          showCustom ? 'bg-accent text-white' : 'bg-surface-alt text-content-secondary hover:bg-border-default']">
        其他
      </button>
    </div>
    <input v-if="showCustom" v-model="customTrigger" type="text" placeholder="自訂觸發因子"
      @keyup.enter="addCustom"
      class="mt-2 w-full border border-border-default rounded-lg px-3 py-2 text-sm bg-surface-card text-content-primary" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ modelValue: string[] }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string[]): void }>()

const presetTriggers = ['睡眠不足', '天氣變化', '壓力大', '經期前', '飲食', '運動']
const selected = ref<string[]>([...props.modelValue])
const showCustom = ref(false)
const customTrigger = ref('')

function toggleTrigger(t: string) {
  const idx = selected.value.indexOf(t)
  if (idx >= 0) selected.value.splice(idx, 1)
  else selected.value.push(t)
  emit('update:modelValue', [...selected.value])
}

function addCustom() {
  if (customTrigger.value.trim() && !selected.value.includes(customTrigger.value.trim())) {
    selected.value.push(customTrigger.value.trim())
    emit('update:modelValue', [...selected.value])
    customTrigger.value = ''
  }
}

watch(() => props.modelValue, (v) => { selected.value = [...v] })
</script>
