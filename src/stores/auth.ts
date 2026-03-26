import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth'
import type { LoginRequest, RegisterRequest } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const userId = ref<number | null>(Number(localStorage.getItem('userId')) || null)
  const userName = ref<string | null>(localStorage.getItem('userName'))
  const userEmail = ref<string | null>(localStorage.getItem('userEmail'))

  const isLoggedIn = computed(() => !!token.value)

  async function login(data: LoginRequest) {
    const res = await authApi.login(data)
    token.value = res.accessToken
    userId.value = res.userId
    userName.value = res.displayName
    userEmail.value = res.email
    localStorage.setItem('token', res.accessToken)
    localStorage.setItem('userId', String(res.userId))
    localStorage.setItem('userName', res.displayName)
    localStorage.setItem('userEmail', res.email)
  }

  async function register(data: RegisterRequest) {
    const res = await authApi.register(data)
    token.value = res.accessToken
    userId.value = res.userId
    userName.value = res.displayName
    userEmail.value = res.email
    localStorage.setItem('token', res.accessToken)
    localStorage.setItem('userId', String(res.userId))
    localStorage.setItem('userName', res.displayName)
    localStorage.setItem('userEmail', res.email)
  }

  function logout() {
    token.value = null
    userId.value = null
    userName.value = null
    userEmail.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')
  }

  return { token, userId, userName, userEmail, isLoggedIn, login, register, logout }
})
