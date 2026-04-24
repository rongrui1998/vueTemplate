import { getActivePinia } from 'pinia'
import type { App } from 'vue'
import type { NavigationGuardWithThis, RouteLocationNormalizedLoaded, Router } from 'vue-router'

import { FORBIDDEN_ROUTE_PATH, LOGIN_ROUTE_PATH } from '@/constants/app'
import { router } from '@/router'
import { pinia } from '@/stores'
import { usePermissionStore } from '@/stores/permission'
import { useUserStore } from '@/stores/user'

function hasRoutePermission(
  to: RouteLocationNormalizedLoaded,
  permissionStore: ReturnType<typeof usePermissionStore>,
) {
  return permissionStore.hasPermission(to.meta.permissionCode as string | undefined)
}

export function createRouteGuard(routerInstance: Router): NavigationGuardWithThis<undefined> {
  return async (to) => {
    const activePinia = getActivePinia() ?? pinia
    const userStore = useUserStore(activePinia)
    const permissionStore = usePermissionStore(activePinia)

    if (!userStore.accessToken && to.path !== LOGIN_ROUTE_PATH && to.meta.requiresAuth !== false) {
      return LOGIN_ROUTE_PATH
    }

    if (!userStore.accessToken) {
      return true
    }

    if (to.path === LOGIN_ROUTE_PATH) {
      return permissionStore.homePath
    }

    if (!permissionStore.routesReady) {
      await permissionStore.initializeAccess(routerInstance)
      return to.fullPath
    }

    if (!hasRoutePermission(to, permissionStore) && to.path !== FORBIDDEN_ROUTE_PATH) {
      return FORBIDDEN_ROUTE_PATH
    }

    return true
  }
}

function setupGuards() {
  router.beforeEach(createRouteGuard(router))
}

export async function setupRouter(app: App<Element>) {
  setupGuards()
  app.use(router)
  await router.isReady()
}
