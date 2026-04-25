import { defineStore } from 'pinia'

export const useLayoutStore = defineStore('layout', {
  actions: {
    setSidebarCollapsed(collapsed: boolean) {
      this.sidebarCollapsed = collapsed
    },
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },
  },
  state: () => ({
    sidebarCollapsed: false,
  }),
})
