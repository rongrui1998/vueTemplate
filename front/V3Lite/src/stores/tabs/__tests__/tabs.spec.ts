import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory } from 'vue-router'

import { createAppRouter } from '@/router'
import { useTabsStore } from '@/stores/tabs'

describe('tabs store', () => {
  it('records affix tabs and the current visited tab', () => {
    setActivePinia(createPinia())

    const tabsStore = useTabsStore()

    tabsStore.initializeAffixTabs([
      {
        affix: true,
        icon: 'DataAnalysis',
        path: '/overview/analytics',
        title: '分析页',
      },
    ])

    tabsStore.syncRoute({
      fullPath: '/demo/form',
      meta: {
        icon: 'Tickets',
        title: '表单演示',
      },
      name: 'DemoForm',
      path: '/demo/form',
    })

    expect(tabsStore.items.map((item) => item.path)).toEqual(['/overview/analytics', '/demo/form'])
    expect(tabsStore.items[0]?.affix).toBe(true)
    expect(tabsStore.items[1]?.title).toBe('表单演示')
  })

  it('closes the active tab and falls back to the previous available tab', async () => {
    setActivePinia(createPinia())

    const router = createAppRouter(createMemoryHistory())
    router.addRoute('Root', {
      component: { template: '<div />' },
      name: 'OverviewRoot',
      path: '/overview',
      children: [
        {
          component: { template: '<div />' },
          meta: {
            affix: true,
            title: '分析页',
          },
          name: 'Analytics',
          path: 'analytics',
        },
      ],
    })
    router.addRoute('Root', {
      component: { template: '<div />' },
      name: 'DemoRoot',
      path: '/demo',
      children: [
        {
          component: { template: '<div />' },
          meta: {
            title: '表单演示',
          },
          name: 'DemoForm',
          path: 'form',
        },
      ],
    })

    const tabsStore = useTabsStore()
    tabsStore.initializeAffixTabs([
      {
        affix: true,
        path: '/overview/analytics',
        title: '分析页',
      },
    ])
    tabsStore.syncRoute({
      fullPath: '/demo/form',
      meta: {
        title: '表单演示',
      },
      name: 'DemoForm',
      path: '/demo/form',
    })

    await router.push('/demo/form')
    await router.isReady()

    await tabsStore.closeTab({
      currentPath: router.currentRoute.value.path,
      path: '/demo/form',
      router,
    })

    expect(router.currentRoute.value.path).toBe('/overview/analytics')
    expect(tabsStore.items.map((item) => item.path)).toEqual(['/overview/analytics'])
  }, 10_000)
})
