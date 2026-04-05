<template>
  <div class="min-h-screen bg-surface-primary">
    <nav class="bg-surface-card border-b border-border-default sticky top-0 z-10">
      <div class="max-w-5xl mx-auto px-4 flex items-center h-14">
        <RouterLink to="/" class="font-bold text-accent text-lg mr-6">BodyRecord</RouterLink>
        <!-- Desktop nav -->
        <div class="hidden md:flex gap-1 text-sm">
          <RouterLink v-for="link in navLinks" :key="link.to" :to="link.to"
            class="px-3 py-1.5 rounded-lg text-content-secondary hover:text-content-primary hover:bg-surface-alt transition"
            active-class="!text-accent !bg-accent-light font-medium">
            {{ link.label }}
          </RouterLink>
        </div>
        <div class="ml-auto hidden md:flex items-center gap-3">
          <ThemeToggle />
          <RouterLink to="/profile" class="text-sm text-content-secondary hover:text-content-primary">{{ authStore.userName }}</RouterLink>
          <button @click="logout" class="text-sm text-status-danger hover:opacity-80">登出</button>
        </div>
        <!-- Mobile hamburger button -->
        <button @click="mobileMenuOpen = !mobileMenuOpen" class="ml-auto md:hidden p-2 text-content-secondary hover:text-content-primary" aria-label="選單">
          <svg v-if="!mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <!-- Mobile menu dropdown -->
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-border-default bg-surface-card">
        <div class="max-w-5xl mx-auto px-4 py-3 space-y-1">
          <RouterLink v-for="link in navLinks" :key="link.to" :to="link.to"
            class="block px-3 py-2 rounded-lg text-sm text-content-secondary hover:text-content-primary hover:bg-surface-alt transition"
            active-class="!text-accent !bg-accent-light font-medium"
            @click="mobileMenuOpen = false">
            {{ link.label }}
          </RouterLink>
          <div class="border-t border-border-default my-2"></div>
          <div class="flex items-center justify-between px-3 py-2">
            <RouterLink to="/profile" class="text-sm text-content-secondary hover:text-content-primary" @click="mobileMenuOpen = false">
              {{ authStore.userName }}
            </RouterLink>
            <div class="flex items-center gap-3">
              <ThemeToggle />
              <button @click="logout" class="text-sm text-status-danger hover:opacity-80">登出</button>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <main class="max-w-5xl mx-auto px-4 py-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import ThemeToggle from '@/components/common/ThemeToggle.vue'

const authStore = useAuthStore()
const router = useRouter()
const mobileMenuOpen = ref(false)

const navLinks = [
  { to: '/records', label: '血壓' },
  { to: '/lab', label: '檢驗' },
  { to: '/lab/items', label: '項目' },
  { to: '/health-records', label: '看診' },
  { to: '/visits/timeline', label: '回診' },
  { to: '/symptoms', label: '症狀' },
  { to: '/medications', label: '用藥' },
  { to: '/nhi', label: '匯入' },
]

function logout() {
  mobileMenuOpen.value = false
  authStore.logout()
  router.push('/login')
}
</script>
