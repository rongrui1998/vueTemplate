import { defineStore } from 'pinia'

import { getThemeMode, setThemeMode, type ThemeMode } from '@/utils/storage'

function applyTheme(mode: ThemeMode) {
  document.documentElement.dataset.theme = mode
  document.documentElement.style.colorScheme = mode
}

export const useThemeStore = defineStore('theme', {
  actions: {
    initializeTheme() {
      this.mode = getThemeMode()
      applyTheme(this.mode)
    },
    setMode(mode: ThemeMode) {
      this.mode = mode
      setThemeMode(mode)
      applyTheme(mode)
    },
    toggleTheme() {
      this.setMode(this.mode === 'dark' ? 'light' : 'dark')
    },
  },
  state: () => ({
    mode: 'dark' as ThemeMode,
  }),
})
