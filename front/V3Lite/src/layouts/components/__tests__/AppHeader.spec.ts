import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { createMemoryHistory } from 'vue-router'

import AppHeader from '@/layouts/components/AppHeader.vue'
import { createAppRouter } from '@/router'
import { usePermissionStore } from '@/stores/permission'
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
    expect(wrapper.find('.search-pill').exists()).toBe(true)
    expect(wrapper.text()).toContain('演示')
    expect(wrapper.text()).toContain('表单演示')
    expect(wrapper.findAll('.tab-link')).toHaveLength(2)
    expect(wrapper.find('[data-test="tab-affix"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="tab-close"]').exists()).toBe(true)
  })
})
