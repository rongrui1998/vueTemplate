import type { RouteLocationNormalizedLoaded, RouteMeta, Router } from 'vue-router'

import { defineStore } from 'pinia'

import { clearVisitedTabs, getVisitedTabs, setVisitedTabs } from '@/utils/storage'

export interface TabItem {
  affix: boolean
  icon?: string
  name?: string
  path: string
  title: string
}

interface CloseTabPayload {
  currentPath: string
  path: string
  router: Router
}

type RouteLike = Pick<RouteLocationNormalizedLoaded, 'fullPath' | 'meta' | 'name' | 'path'>

function normalizeTab(input: {
  affix?: boolean
  icon?: string
  name?: string
  path: string
  title: string
}): TabItem {
  return {
    affix: Boolean(input.affix),
    icon: input.icon,
    name: input.name,
    path: input.path,
    title: input.title,
  }
}

function shouldTrackRoute(path: string, meta: RouteMeta) {
  return !meta.hidden && Boolean(meta.title)
}

export const useTabsStore = defineStore('tabs', {
  actions: {
    async closeTab(payload: CloseTabPayload) {
      const target = this.items.find((item) => item.path === payload.path)

      if (!target || target.affix) {
        return
      }

      this.items = this.items.filter((item) => item.path !== payload.path)
      this.persist()

      if (payload.path !== payload.currentPath) {
        return
      }

      const fallback = this.items.at(-1)

      if (fallback) {
        await payload.router.push(fallback.path)
      }
    },
    initializeAffixTabs(tabs: TabItem[]) {
      const affixTabs = tabs
        .filter((tab) => tab.affix)
        .map((tab) => normalizeTab(tab))
        .filter((tab, index, list) => list.findIndex((item) => item.path === tab.path) === index)

      const visitedTabs = this.items.filter((tab) => !tab.affix)

      this.items = [
        ...affixTabs,
        ...visitedTabs.filter((tab) => !affixTabs.some((item) => item.path === tab.path)),
      ]
      this.persist()
    },
    persist() {
      setVisitedTabs(this.items)
    },
    reset() {
      this.items = []
      clearVisitedTabs()
    },
    syncRoute(route: RouteLike) {
      if (!shouldTrackRoute(route.path, route.meta)) {
        return
      }

      const nextTab = normalizeTab({
        affix: Boolean(route.meta.affix),
        icon: route.meta.icon as string | undefined,
        name: route.name ? String(route.name) : undefined,
        path: route.fullPath,
        title: String(route.meta.title),
      })

      const currentIndex = this.items.findIndex((item) => item.path === nextTab.path)

      if (currentIndex >= 0) {
        this.items.splice(currentIndex, 1, nextTab)
        this.persist()
        return
      }

      this.items.push(nextTab)
      this.persist()
    },
  },
  state: () => ({
    items: getVisitedTabs(),
  }),
})
