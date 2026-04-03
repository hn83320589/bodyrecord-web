<template>
  <div class="min-h-screen bg-surface-primary flex items-center justify-center">
    <div class="bg-surface-card rounded-card shadow-sm p-8 w-full max-w-sm">
      <h1 class="text-2xl font-bold text-content-primary mb-6">登入 BodyRecord</h1>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-content-secondary mb-1">Email</label>
          <input v-model="form.email" type="email" required
            class="w-full border border-border-default rounded-lg px-3 py-2 text-sm bg-surface-card text-content-primary focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>
        <div>
          <label class="block text-sm font-medium text-content-secondary mb-1">密碼</label>
          <input v-model="form.password" type="password" required
            class="w-full border border-border-default rounded-lg px-3 py-2 text-sm bg-surface-card text-content-primary focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>
        <p v-if="error" class="text-sm text-status-danger">{{ error }}</p>
        <button type="submit" :disabled="loading"
          class="w-full bg-accent text-white rounded-lg py-2 text-sm font-medium hover:bg-accent-dark disabled:opacity-50">
          {{ loading ? '登入中...' : '登入' }}
        </button>
      </form>
      <p class="mt-4 text-sm text-center text-content-tertiary">
        還沒有帳號？<RouterLink to="/register" class="text-accent hover:underline">立即註冊</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({ email: '', password: '' })
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''
  try {
    await authStore.login(form.value)
    router.push('/')
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
