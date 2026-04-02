<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-5xl mx-auto px-4 flex items-center h-14">
        <RouterLink to="/" class="font-bold text-indigo-600 text-lg mr-6">BodyRecord</RouterLink>
        <div class="flex gap-4 text-sm">
          <RouterLink to="/records" class="text-gray-600 hover:text-indigo-600" active-class="text-indigo-600 font-medium">血壓</RouterLink>
          <RouterLink to="/stats" class="text-gray-600 hover:text-indigo-600" active-class="text-indigo-600 font-medium">統計</RouterLink>
          <RouterLink to="/lab" class="text-gray-600 hover:text-indigo-600" active-class="text-indigo-600 font-medium">檢驗</RouterLink>
          <RouterLink to="/lab/items" class="text-gray-600 hover:text-indigo-600" active-class="text-indigo-600 font-medium">檢驗項目</RouterLink>
          <RouterLink to="/health-records" class="text-gray-600 hover:text-indigo-600" active-class="text-indigo-600 font-medium">看診</RouterLink>
          <RouterLink to="/medications" class="text-gray-600 hover:text-indigo-600" active-class="text-indigo-600 font-medium">用藥</RouterLink>
          <RouterLink to="/nhi" class="text-gray-600 hover:text-indigo-600" active-class="text-indigo-600 font-medium">匯入</RouterLink>
        </div>
        <div class="ml-auto flex items-center gap-3">
          <RouterLink to="/profile" class="text-sm text-gray-600 hover:text-indigo-600">{{ authStore.userName }}</RouterLink>
          <button @click="logout" class="text-sm text-red-500 hover:text-red-700">登出</button>
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

const authStore = useAuthStore()
const router = useRouter()

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>
