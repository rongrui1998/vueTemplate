import type { Router } from 'vue-router'

import { defineStore } from 'pinia'

import { DEFAULT_HOME_PATH, ROOT_ROUTE_NAME } from '@/constants/app'
import { fetchCurrentAccessContext } from '@/modules/auth/service'
import { transformMenusToRoutes } from '@/router/transform/menu-to-routes'
import { useTabsStore } from '@/stores/tabs'
import type { MenuItem, PermissionCode } from '@/types/permission'

function flattenLeaves(menus: MenuItem[]): MenuItem[] {
  return menus.flatMap((menu) => {
    if (menu.children?.length) {
      return flattenLeaves(menu.children)
    }

    return menu.meta.hidden ? [] : [menu]
  })
}

interface PermissionState {
  accessCodes: PermissionCode[]
  dynamicRouteNames: string[]
  menuTree: MenuItem[]
  routesReady: boolean
}

export const usePermissionStore = defineStore('permission', {
  actions: {
    applyDynamicRoutes(router: Router) {
      const routes = transformMenusToRoutes(this.menuTree)

      routes.forEach((route) => {
        if (!router.hasRoute(route.name!)) {
          router.addRoute(ROOT_ROUTE_NAME, route)
          this.dynamicRouteNames.push(String(route.name))
        }
      })
    },
    async initializeAccess(router: Router) {
      if (this.routesReady) {
        return
      }

      const accessContext = await fetchCurrentAccessContext()
      const tabsStore = useTabsStore()

      this.accessCodes = accessContext.accessCodes
      this.menuTree = accessContext.menuTree
      this.applyDynamicRoutes(router)
      tabsStore.initializeAffixTabs(
        flattenLeaves(this.menuTree).map((menu) => ({
          affix: Boolean(menu.meta.affix),
          icon: menu.meta.icon,
          name: menu.name,
          path: menu.path,
          title: menu.meta.title,
        })),
      )
      this.routesReady = true
    },
    resetAccess(router?: Router) {
      this.dynamicRouteNames.forEach((routeName) => {
        if (router?.hasRoute(routeName)) {
          router.removeRoute(routeName)
        }
      })

      this.accessCodes = []
      this.dynamicRouteNames = []
      this.menuTree = []
      this.routesReady = false
    },
  },
  getters: {
    flatLeafMenus: (state) => flattenLeaves(state.menuTree),
    homePath: (state) => flattenLeaves(state.menuTree)[0]?.path ?? DEFAULT_HOME_PATH,
    hasPermission: (state) => (permissionCode?: string) =>
      !permissionCode || state.accessCodes.includes(permissionCode),
  },
  state: (): PermissionState => ({
    accessCodes: [],
    dynamicRouteNames: [],
    menuTree: [],
    routesReady: false,
  }),
})
