import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const isCollapse = ref(false)
  const theme = ref('light')
  const language = ref('zh-CN')

  const toggleCollapse = () => {
    isCollapse.value = !isCollapse.value
  }

  const setTheme = (value) => {
    theme.value = value
  }

  const setLanguage = (value) => {
    language.value = value
  }

  return {
    isCollapse,
    theme,
    language,
    toggleCollapse,
    setTheme,
    setLanguage
  }
})