import { createPinia, setActivePinia } from 'pinia'

import { THEME_MODE_KEY } from '@/constants/app'
import { useThemeStore } from '@/stores/theme'

describe('theme store', () => {
  it('hydrates the saved theme mode from localStorage', () => {
    setActivePinia(createPinia())
    localStorage.setItem(THEME_MODE_KEY, 'light')

    const themeStore = useThemeStore()

    themeStore.initializeTheme()

    expect(themeStore.mode).toBe('light')
    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('toggles the theme mode and persists the latest choice', () => {
    setActivePinia(createPinia())

    const themeStore = useThemeStore()

    themeStore.toggleTheme()

    expect(themeStore.mode).toBe('light')
    expect(localStorage.getItem(THEME_MODE_KEY)).toBe('light')
    expect(document.documentElement.dataset.theme).toBe('light')

    themeStore.toggleTheme()

    expect(themeStore.mode).toBe('dark')
    expect(localStorage.getItem(THEME_MODE_KEY)).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })
})
