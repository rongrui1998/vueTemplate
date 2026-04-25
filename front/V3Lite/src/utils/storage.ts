import { ACCESS_TOKEN_KEY, THEME_MODE_KEY, VISITED_TABS_KEY } from '@/constants/app'

import type { TabItem } from '@/stores/tabs'
export type ThemeMode = 'dark' | 'light'

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY) ?? ''
}

export function setAccessToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

export function getVisitedTabs() {
  const raw = sessionStorage.getItem(VISITED_TABS_KEY)

  if (!raw) {
    return [] as TabItem[]
  }

  try {
    return JSON.parse(raw) as TabItem[]
  } catch {
    sessionStorage.removeItem(VISITED_TABS_KEY)
    return [] as TabItem[]
  }
}

export function setVisitedTabs(tabs: TabItem[]) {
  sessionStorage.setItem(VISITED_TABS_KEY, JSON.stringify(tabs))
}

export function clearVisitedTabs() {
  sessionStorage.removeItem(VISITED_TABS_KEY)
}

export function getThemeMode(): ThemeMode {
  return localStorage.getItem(THEME_MODE_KEY) === 'light' ? 'light' : 'dark'
}

export function setThemeMode(mode: ThemeMode) {
  localStorage.setItem(THEME_MODE_KEY, mode)
}
