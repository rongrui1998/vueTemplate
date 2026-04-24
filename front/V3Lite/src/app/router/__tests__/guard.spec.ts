import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory } from 'vue-router'

import { FORBIDDEN_ROUTE_PATH, LOGIN_ROUTE_PATH } from '@/constants/app'
import { createRouteGuard } from '@/app/router/setup-router'
import { createAppRouter } from '@/router'
import { usePermissionStore } from '@/stores/permission'
import { useUserStore } from '@/stores/user'
import { setAccessToken } from '@/utils/storage'

describe('route guard', () => {
  it('redirects unauthenticated users to login', async () => {
    setActivePinia(createPinia())

    const router = createAppRouter(createMemoryHistory())
    const guard = createRouteGuard(router)
    const target = router.resolve('/overview/analytics')

    const result = await guard(target)

    expect(result).toBe(LOGIN_ROUTE_PATH)
  })

  it('redirects to 403 when route permission is missing', async () => {
    setActivePinia(createPinia())

    const router = createAppRouter(createMemoryHistory())
    router.addRoute('Root', {
      component: { template: '<div />' },
      meta: {
        permissionCode: 'system:admin',
        requiresAuth: true,
        title: '系统管理',
      },
      name: 'SystemAdmin',
      path: '/system/admin',
    })

    const userStore = useUserStore()
    setAccessToken('token-demo')
    userStore.accessToken = 'token-demo'

    const permissionStore = usePermissionStore()
    permissionStore.routesReady = true
    permissionStore.accessCodes = ['demo:create']

    const guard = createRouteGuard(router)
    const target = router.resolve('/system/admin')

    const result = await guard(target)

    expect(result).toBe(FORBIDDEN_ROUTE_PATH)
  })

  it('restores the intended dynamic route after access initialization', async () => {
    setActivePinia(createPinia())

    const router = createAppRouter(createMemoryHistory())
    router.beforeEach(createRouteGuard(router))

    const userStore = useUserStore()
    setAccessToken('token-demo')
    userStore.accessToken = 'token-demo'

    await router.push('/')
    await router.isReady()

    expect(router.currentRoute.value.path).toBe('/overview/analytics')
  })

  it('keeps unknown routes on 404 after access initialization', async () => {
    setActivePinia(createPinia())

    const router = createAppRouter(createMemoryHistory())
    router.beforeEach(createRouteGuard(router))

    const userStore = useUserStore()
    setAccessToken('token-demo')
    userStore.accessToken = 'token-demo'

    await router.push('/not-existing-page')
    await router.isReady()

    expect(router.currentRoute.value.path).toBe('/404')
  })
})
