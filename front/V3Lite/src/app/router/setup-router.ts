import { getActivePinia } from 'pinia'
import type { App } from 'vue'
import type { NavigationGuardWithThis, RouteLocationNormalizedLoaded, Router } from 'vue-router'

import { appEnv } from '@/constants/env'
import { FORBIDDEN_ROUTE_PATH, LOGIN_ROUTE_PATH, NOT_FOUND_ROUTE_PATH } from '@/constants/app'
import { router } from '@/router'
import { pinia } from '@/stores'
import { usePermissionStore } from '@/stores/permission'
import { useTabsStore } from '@/stores/tabs'
import { useUserStore } from '@/stores/user'

function hasRoutePermission(
  to: RouteLocationNormalizedLoaded,
  permissionStore: ReturnType<typeof usePermissionStore>,
) {
  return permissionStore.hasPermission(to.meta.permissionCode as string | undefined)
}

function isResolvedNotFound(targetPath: string, routerInstance: Router) {
  const resolved = routerInstance.resolve(targetPath)

  return resolved.path === NOT_FOUND_ROUTE_PATH || resolved.name === 'NotFound'
}

function resolveRetryPath(
  to: RouteLocationNormalizedLoaded,
  routerInstance: Router,
  permissionStore: ReturnType<typeof usePermissionStore>,
) {
  const redirectedPath = to.redirectedFrom?.fullPath

  if (redirectedPath) {
    return isResolvedNotFound(redirectedPath, routerInstance)
      ? NOT_FOUND_ROUTE_PATH
      : redirectedPath
  }

  if (to.path === NOT_FOUND_ROUTE_PATH) {
    return NOT_FOUND_ROUTE_PATH
  }

  return isResolvedNotFound(to.fullPath, routerInstance) ? permissionStore.homePath : to.fullPath
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
      return resolveRetryPath(to, routerInstance, permissionStore)
    }

    if (!hasRoutePermission(to, permissionStore) && to.path !== FORBIDDEN_ROUTE_PATH) {
      return FORBIDDEN_ROUTE_PATH
    }

    return true
  }
}

function setupGuards() {
  router.beforeEach(createRouteGuard(router))
  router.afterEach((to) => {
    const activePinia = getActivePinia() ?? pinia
    const tabsStore = useTabsStore(activePinia)

    tabsStore.syncRoute(to)
    document.title = to.meta.title ? `${String(to.meta.title)} - ${appEnv.title}` : appEnv.title
  })
}

export async function setupRouter(app: App<Element>) {
  setupGuards()
  app.use(router)
  await router.isReady()
}
