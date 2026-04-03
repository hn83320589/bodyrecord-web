<template>
  <div class="min-h-screen bg-surface-primary">
    <nav class="bg-surface-card border-b border-border-default sticky top-0 z-10">
      <div class="max-w-5xl mx-auto px-4 flex items-center h-14">
        <RouterLink to="/" class="font-bold text-accent text-lg mr-6">BodyRecord</RouterLink>
        <div class="flex gap-1 text-sm">
          <RouterLink v-for="link in navLinks" :key="link.to" :to="link.to"
            class="px-3 py-1.5 rounded-lg text-content-secondary hover:text-content-primary hover:bg-surface-alt transition"
            active-class="!text-accent !bg-accent-light font-medium">
            {{ link.label }}
          </RouterLink>
        </div>
        <div class="ml-auto flex items-center gap-3">
          <ThemeToggle />
          <RouterLink to="/profile" class="text-sm text-content-secondary hover:text-content-primary">{{ authStore.userName }}</RouterLink>
          <button @click="logout" class="text-sm text-status-danger hover:opacity-80">登出</button>
        </div>
      </div>
    </nav>
    <main class="max-w-5xl mx-auto px-4 py-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import ThemeToggle from '@/components/common/ThemeToggle.vue'

const authStore = useAuthStore()
const router = useRouter()

const navLinks = [
  { to: '/records', label: '血壓' },
  { to: '/stats', label: '統計' },
  { to: '/lab', label: '檢驗' },
  { to: '/lab/items', label: '項目' },
  { to: '/health-records', label: '看診' },
  { to: '/medications', label: '用藥' },
  { to: '/nhi', label: '匯入' },
]

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>
