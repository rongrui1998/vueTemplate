import { createPinia, setActivePinia } from 'pinia'
import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory } from 'vue-router'
import { vi } from 'vitest'

import AppHeader from '@/layouts/components/AppHeader.vue'
import { createAppRouter } from '@/router'
import { usePermissionStore } from '@/stores/permission'
import { useTabsStore } from '@/stores/tabs'
import { useUserStore } from '@/stores/user'

describe('AppHeader', () => {
  it('renders a compact toolbar and vben-like tabs shell', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const router = createAppRouter(createMemoryHistory())
    router.addRoute('Root', {
      component: { template: '<div />' },
      meta: {
        title: '概览',
      },
      name: 'Overview',
      path: '/overview',
      children: [
        {
          component: { template: '<div />' },
          meta: {
            affix: true,
            icon: 'DataAnalysis',
            title: '分析页',
          },
          name: 'Analytics',
          path: 'analytics',
        },
      ],
    })
    router.addRoute('Root', {
      component: { template: '<div />' },
      meta: {
        title: '演示',
      },
      name: 'Demo',
      path: '/demo',
      children: [
        {
          component: { template: '<div />' },
          meta: {
            icon: 'Tickets',
            title: '表单演示',
          },
          name: 'DemoForm',
          path: 'form',
        },
      ],
    })
    await router.push('/demo/form')
    await router.isReady()

    const permissionStore = usePermissionStore()
    permissionStore.menuTree = [
      {
        children: [
          {
            component: 'dashboard/index',
            meta: {
              affix: true,
              icon: 'DataAnalysis',
              title: '分析页',
            },
            name: 'Analytics',
            path: '/overview/analytics',
          },
        ],
        meta: {
          icon: 'Grid',
          title: '概览',
        },
        name: 'Overview',
        path: '/overview',
      },
      {
        children: [
          {
            component: 'demo/list',
            meta: {
              icon: 'Tickets',
              title: '表单演示',
            },
            name: 'DemoForm',
            path: '/demo/form',
          },
        ],
        meta: {
          icon: 'Operation',
          title: '演示',
        },
        name: 'Demo',
        path: '/demo',
      },
    ]
    const tabsStore = useTabsStore()
    tabsStore.initializeAffixTabs([
      {
        affix: true,
        icon: 'DataAnalysis',
        name: 'Analytics',
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

    const userStore = useUserStore()
    userStore.userInfo = {
      avatar: 'https://example.com/avatar.png',
      nickname: '系统管理员',
      roles: ['admin'],
      userId: 'u-001',
      username: 'admin',
    }

    const wrapper = mount(AppHeader, {
      global: {
        plugins: [pinia, router],
      },
    })

    expect(wrapper.find('.header-main').exists()).toBe(true)
    expect(wrapper.find('.header-toolbar').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('搜索')
    expect(wrapper.text()).toContain('演示')
    expect(wrapper.text()).toContain('表单演示')
    expect(wrapper.findAll('.tab-link')).toHaveLength(2)
    expect(wrapper.find('[data-test="tab-affix"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="tab-close"]').exists()).toBe(true)
  })

  it('closes the active tab and returns to the previous visited tab', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

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
            icon: 'DataAnalysis',
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
            icon: 'Tickets',
            title: '表单演示',
          },
          name: 'DemoForm',
          path: 'form',
        },
      ],
    })

    const permissionStore = usePermissionStore()
    permissionStore.menuTree = [
      {
        children: [
          {
            component: 'dashboard/index',
            meta: {
              affix: true,
              icon: 'DataAnalysis',
              title: '分析页',
            },
            name: 'Analytics',
            path: '/overview/analytics',
          },
        ],
        meta: {
          icon: 'Grid',
          title: '概览',
        },
        name: 'Overview',
        path: '/overview',
      },
      {
        children: [
          {
            component: 'demo/list',
            meta: {
              icon: 'Tickets',
              title: '表单演示',
            },
            name: 'DemoForm',
            path: '/demo/form',
          },
        ],
        meta: {
          icon: 'Operation',
          title: '演示',
        },
        name: 'Demo',
        path: '/demo',
      },
    ]

    const tabsStore = useTabsStore()
    tabsStore.initializeAffixTabs([
      {
        affix: true,
        icon: 'DataAnalysis',
        name: 'Analytics',
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

    await router.push('/demo/form')
    await router.isReady()

    const userStore = useUserStore()
    userStore.userInfo = {
      avatar: 'https://example.com/avatar.png',
      nickname: '系统管理员',
      roles: ['admin'],
      userId: 'u-001',
      username: 'admin',
    }

    const wrapper = mount(AppHeader, {
      global: {
        plugins: [pinia, router],
      },
    })

    const closeButtons = wrapper.findAll('[data-test="tab-close"]')
    await closeButtons[0]?.trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.path).toBe('/overview/analytics')
    expect(wrapper.text()).not.toContain('表单演示')
  })

  it('reloads the current page when the refresh button is clicked', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const router = createAppRouter(createMemoryHistory())
    router.addRoute('Root', {
      component: { template: '<div />' },
      name: 'DemoRoot',
      path: '/demo',
      children: [
        {
          component: { template: '<div />' },
          meta: {
            icon: 'Document',
            title: '菜单演示',
          },
          name: 'DemoMenu',
          path: 'menu',
        },
      ],
    })

    await router.push('/demo/menu')
    await router.isReady()

    const permissionStore = usePermissionStore()
    permissionStore.menuTree = [
      {
        children: [
          {
            component: 'demo/menu',
            meta: {
              icon: 'Document',
              title: '菜单演示',
            },
            name: 'DemoMenu',
            path: '/demo/menu',
          },
        ],
        meta: {
          icon: 'Operation',
          title: '演示',
        },
        name: 'Demo',
        path: '/demo',
      },
    ]

    const tabsStore = useTabsStore()
    tabsStore.syncRoute({
      fullPath: '/demo/menu',
      meta: {
        icon: 'Document',
        title: '菜单演示',
      },
      name: 'DemoMenu',
      path: '/demo/menu',
    })

    const userStore = useUserStore()
    userStore.userInfo = {
      avatar: 'https://example.com/avatar.png',
      nickname: '系统管理员',
      roles: ['admin'],
      userId: 'u-001',
      username: 'admin',
    }

    const goSpy = vi.spyOn(router, 'go')

    const wrapper = mount(AppHeader, {
      global: {
        plugins: [pinia, router],
      },
    })

    const refreshButton = wrapper.find('[data-test="page-refresh"]')

    expect(refreshButton.exists()).toBe(true)

    await refreshButton.trigger('click')

    expect(goSpy).toHaveBeenCalledWith(0)
  })

  it('toggles between dark and light themes from the toolbar button', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const router = createAppRouter(createMemoryHistory())
    router.addRoute('Root', {
      component: { template: '<div />' },
      meta: {
        title: '演示',
      },
      name: 'Demo',
      path: '/demo',
      children: [
        {
          component: { template: '<div />' },
          meta: {
            icon: 'Tickets',
            title: '表单演示',
          },
          name: 'DemoForm',
          path: 'form',
        },
      ],
    })

    await router.push('/demo/form')
    await router.isReady()

    const permissionStore = usePermissionStore()
    permissionStore.menuTree = [
      {
        children: [
          {
            component: 'demo/list',
            meta: {
              icon: 'Tickets',
              title: '表单演示',
            },
            name: 'DemoForm',
            path: '/demo/form',
          },
        ],
        meta: {
          icon: 'Operation',
          title: '演示',
        },
        name: 'Demo',
        path: '/demo',
      },
    ]

    const tabsStore = useTabsStore()
    tabsStore.syncRoute({
      fullPath: '/demo/form',
      meta: {
        icon: 'Tickets',
        title: '表单演示',
      },
      name: 'DemoForm',
      path: '/demo/form',
    })

    const userStore = useUserStore()
    userStore.userInfo = {
      avatar: 'https://example.com/avatar.png',
      nickname: '系统管理员',
      roles: ['admin'],
      userId: 'u-001',
      username: 'admin',
    }

    const wrapper = mount(AppHeader, {
      global: {
        plugins: [pinia, router],
      },
    })

    const themeToggle = wrapper.find('[data-test="theme-toggle"]')

    expect(themeToggle.exists()).toBe(true)
    expect(document.documentElement.dataset.theme || 'dark').toBe('dark')

    await themeToggle.trigger('click')

    expect(document.documentElement.dataset.theme).toBe('light')
    expect(localStorage.getItem('v3lite-theme-mode')).toBe('light')

    await themeToggle.trigger('click')

    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(localStorage.getItem('v3lite-theme-mode')).toBe('dark')
  })

  it('toggles the browser fullscreen mode from the toolbar button', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const router = createAppRouter(createMemoryHistory())
    router.addRoute('Root', {
      component: { template: '<div />' },
      meta: {
        title: '演示',
      },
      name: 'Demo',
      path: '/demo',
      children: [
        {
          component: { template: '<div />' },
          meta: {
            icon: 'Document',
            title: '菜单演示',
          },
          name: 'DemoMenu',
          path: 'menu',
        },
      ],
    })

    await router.push('/demo/menu')
    await router.isReady()

    const permissionStore = usePermissionStore()
    permissionStore.menuTree = [
      {
        children: [
          {
            component: 'demo/menu',
            meta: {
              icon: 'Document',
              title: '菜单演示',
            },
            name: 'DemoMenu',
            path: '/demo/menu',
          },
        ],
        meta: {
          icon: 'Operation',
          title: '演示',
        },
        name: 'Demo',
        path: '/demo',
      },
    ]

    const tabsStore = useTabsStore()
    tabsStore.syncRoute({
      fullPath: '/demo/menu',
      meta: {
        icon: 'Document',
        title: '菜单演示',
      },
      name: 'DemoMenu',
      path: '/demo/menu',
    })

    const userStore = useUserStore()
    userStore.userInfo = {
      avatar: 'https://example.com/avatar.png',
      nickname: '系统管理员',
      roles: ['admin'],
      userId: 'u-001',
      username: 'admin',
    }

    const requestFullscreen = vi.fn().mockResolvedValue(undefined)
    const exitFullscreen = vi.fn().mockResolvedValue(undefined)

    Object.defineProperty(document.documentElement, 'requestFullscreen', {
      configurable: true,
      value: requestFullscreen,
    })

    Object.defineProperty(document, 'exitFullscreen', {
      configurable: true,
      value: exitFullscreen,
    })

    let fullscreenElement: Element | null = null

    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      get: () => fullscreenElement,
    })

    const wrapper = mount(AppHeader, {
      global: {
        plugins: [pinia, router],
      },
    })

    const fullscreenToggle = wrapper.find('[data-test="fullscreen-toggle"]')

    expect(fullscreenToggle.exists()).toBe(true)

    await fullscreenToggle.trigger('click')

    expect(requestFullscreen).toHaveBeenCalledTimes(1)
    expect(exitFullscreen).not.toHaveBeenCalled()

    fullscreenElement = document.documentElement

    await fullscreenToggle.trigger('click')

    expect(exitFullscreen).toHaveBeenCalledTimes(1)
  })

  it('shows a message list panel when the notification button is clicked', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const router = createAppRouter(createMemoryHistory())
    router.addRoute('Root', {
      component: { template: '<div />' },
      meta: {
        title: '演示',
      },
      name: 'Demo',
      path: '/demo',
      children: [
        {
          component: { template: '<div />' },
          meta: {
            icon: 'Document',
            title: '菜单演示',
          },
          name: 'DemoMenu',
          path: 'menu',
        },
      ],
    })

    await router.push('/demo/menu')
    await router.isReady()

    const permissionStore = usePermissionStore()
    permissionStore.menuTree = [
      {
        children: [
          {
            component: 'demo/menu',
            meta: {
              icon: 'Document',
              title: '菜单演示',
            },
            name: 'DemoMenu',
            path: '/demo/menu',
          },
        ],
        meta: {
          icon: 'Operation',
          title: '演示',
        },
        name: 'Demo',
        path: '/demo',
      },
    ]

    const tabsStore = useTabsStore()
    tabsStore.syncRoute({
      fullPath: '/demo/menu',
      meta: {
        icon: 'Document',
        title: '菜单演示',
      },
      name: 'DemoMenu',
      path: '/demo/menu',
    })

    const userStore = useUserStore()
    userStore.userInfo = {
      avatar: 'https://example.com/avatar.png',
      nickname: '系统管理员',
      roles: ['admin'],
      userId: 'u-001',
      username: 'admin',
    }

    const wrapper = mount(AppHeader, {
      global: {
        plugins: [pinia, router],
      },
    })

    const messageToggle = wrapper.find('[data-test="message-toggle"]')

    expect(messageToggle.exists()).toBe(true)
    expect(wrapper.find('[data-test="message-panel"]').exists()).toBe(false)

    await messageToggle.trigger('click')

    expect(wrapper.find('[data-test="message-panel"]').exists()).toBe(true)
    expect(wrapper.findAll('[data-test="message-item"]')).toHaveLength(3)
    expect(wrapper.text()).toContain('消息中心')
    expect(wrapper.text()).toContain('权限发布已完成')

    await messageToggle.trigger('click')

    expect(wrapper.find('[data-test="message-panel"]').exists()).toBe(false)
  })
})
