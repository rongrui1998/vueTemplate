import type { App } from 'vue'

import { LOGIN_ROUTE_PATH } from '@/constants/app'
import { router } from '@/router'
import { pinia } from '@/stores'
import { usePermissionStore } from '@/stores/permission'
import { useUserStore } from '@/stores/user'

function setupGuards() {
  router.beforeEach(async (to) => {
    const userStore = useUserStore(pinia)
    const permissionStore = usePermissionStore(pinia)

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
      await permissionStore.initializeAccess(router)
      return to.fullPath
    }

    return true
  })
}

export async function setupRouter(app: App<Element>) {
  setupGuards()
  app.use(router)
  await router.isReady()
}
