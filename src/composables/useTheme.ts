import { ref } from 'vue'

const isDark = ref(localStorage.getItem('theme') === 'dark')

// 初始化時立即套用 class（同步，不使用 watchEffect）
document.documentElement.classList.toggle('dark', isDark.value)

export function useTheme() {
  const toggle = () => {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark', isDark.value)
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }
  return { isDark, toggle }
}
