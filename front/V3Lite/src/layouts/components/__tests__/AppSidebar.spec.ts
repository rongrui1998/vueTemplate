import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { createMemoryHistory } from 'vue-router'

import AppSidebar from '@/layouts/components/AppSidebar.vue'
import { createAppRouter } from '@/router'
import { usePermissionStore } from '@/stores/permission'

describe('AppSidebar', () => {
  it('highlights only the selected leaf menu', async () => {
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
          name: 'DemoBasic',
          path: 'basic',
          children: [
            {
              component: { template: '<div />' },
              name: 'DemoForm',
              path: 'form',
            },
            {
              component: { template: '<div />' },
              name: 'DemoMenu',
              path: 'menu',
            },
          ],
        },
      ],
    })
    await router.push('/demo/basic/form')
    await router.isReady()

    const permissionStore = usePermissionStore()
    permissionStore.menuTree = [
      {
        children: [
          {
            children: [
              {
                component: 'demo/list',
                meta: {
                  icon: 'Tickets',
                  title: '表单演示',
                },
                name: 'DemoForm',
                path: '/demo/basic/form',
              },
              {
                component: 'demo/menu',
                meta: {
                  icon: 'Document',
                  title: '菜单演示',
                },
                name: 'DemoMenu',
                path: '/demo/basic/menu',
              },
            ],
            meta: {
              icon: 'FolderOpened',
              title: '基础示例',
            },
            name: 'DemoBasic',
            path: '/demo/basic',
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

    const wrapper = mount(AppSidebar, {
      global: {
        plugins: [pinia, router],
      },
    })
    await nextTick()
    await nextTick()

    const demoButton = wrapper.findAll('button').find((button) => button.text().includes('演示'))
    const basicButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('基础示例'))
    const formButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('表单演示'))

    expect(demoButton).toBeTruthy()
    expect(basicButton).toBeTruthy()
    expect(formButton).toBeTruthy()

    expect(demoButton!.classes()).not.toContain('menu-button--active')
    expect(basicButton!.classes()).not.toContain('menu-button--active')
    expect(formButton!.classes()).toContain('menu-button--active')
  })

  it('keeps only one submenu open at the same level', async () => {
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
          name: 'DemoBasic',
          path: 'basic',
          children: [
            {
              component: { template: '<div />' },
              name: 'DemoForm',
              path: 'form',
            },
            {
              component: { template: '<div />' },
              name: 'DemoMenu',
              path: 'menu',
            },
          ],
        },
      ],
    })
    await router.push('/overview/analytics')
    await router.isReady()

    const permissionStore = usePermissionStore()
    permissionStore.menuTree = [
      {
        children: [
          {
            component: 'dashboard/index',
            meta: {
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
            children: [
              {
                component: 'demo/list',
                meta: {
                  icon: 'Tickets',
                  title: '表单演示',
                },
                name: 'DemoForm',
                path: '/demo/basic/form',
              },
              {
                component: 'demo/menu',
                meta: {
                  icon: 'Document',
                  title: '菜单演示',
                },
                name: 'DemoMenu',
                path: '/demo/basic/menu',
              },
            ],
            meta: {
              icon: 'FolderOpened',
              title: '基础示例',
            },
            name: 'DemoBasic',
            path: '/demo/basic',
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

    const wrapper = mount(AppSidebar, {
      global: {
        plugins: [pinia, router],
      },
    })
    await nextTick()
    await nextTick()

    const overviewToggle = wrapper
      .findAll('button')
      .find((button) => button.text().includes('概览'))
    const demoToggle = wrapper.findAll('button').find((button) => button.text().includes('演示'))

    expect(wrapper.text()).toContain('分析页')
    expect(wrapper.text()).not.toContain('基础示例')

    await demoToggle?.trigger('click')
    expect(wrapper.text()).toContain('基础示例')
    expect(wrapper.text()).not.toContain('分析页')

    let nestedToggle = wrapper
      .findAll('button')
      .find((button) => button.text().includes('基础示例'))
    await nestedToggle?.trigger('click')
    expect(wrapper.text()).toContain('表单演示')

    await overviewToggle?.trigger('click')
    expect(wrapper.text()).toContain('分析页')
    expect(wrapper.text()).not.toContain('基础示例')

    await demoToggle?.trigger('click')
    expect(wrapper.text()).toContain('基础示例')
    expect(wrapper.text()).not.toContain('分析页')

    nestedToggle = wrapper.findAll('button').find((button) => button.text().includes('基础示例'))
    await nestedToggle?.trigger('click')
    expect(wrapper.text()).toContain('表单演示')

    nestedToggle = wrapper.findAll('button').find((button) => button.text().includes('基础示例'))
    await nestedToggle?.trigger('click')
    expect(wrapper.text()).not.toContain('表单演示')
  })
})
