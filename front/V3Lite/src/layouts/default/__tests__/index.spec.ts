import { createPinia, setActivePinia } from 'pinia'
import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory } from 'vue-router'

import DefaultLayout from '@/layouts/default/index.vue'
import { createAppRouter } from '@/router'
import { usePermissionStore } from '@/stores/permission'
import { useTabsStore } from '@/stores/tabs'
import { useUserStore } from '@/stores/user'

describe('DefaultLayout', () => {
  it('collapses the sidebar when the header toggle is clicked', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const router = createAppRouter(createMemoryHistory())
    router.addRoute('Root', {
      component: { template: '<div />' },
      meta: {
        title: '演示',
      },
      name: 'DemoRoot',
      path: '/demo',
      children: [
        {
          component: { template: '<div />' },
          meta: {
            title: '基础示例',
          },
          name: 'DemoBasic',
          path: 'basic',
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
        },
      ],
    })

    await router.push('/demo/basic/menu')
    await router.isReady()

    const permissionStore = usePermissionStore()
    permissionStore.menuTree = [
      {
        children: [
          {
            children: [
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

    const tabsStore = useTabsStore()
    tabsStore.syncRoute({
      fullPath: '/demo/basic/menu',
      meta: {
        icon: 'Document',
        title: '菜单演示',
      },
      name: 'DemoMenu',
      path: '/demo/basic/menu',
    })

    const userStore = useUserStore()
    userStore.userInfo = {
      avatar: 'https://example.com/avatar.png',
      nickname: '系统管理员',
      roles: ['admin'],
      userId: 'u-001',
      username: 'admin',
    }

    const wrapper = mount(DefaultLayout, {
      global: {
        plugins: [pinia, router],
      },
    })

    expect(wrapper.find('.layout-shell').classes()).not.toContain('layout-shell--sidebar-collapsed')

    const toggle = wrapper.find('[data-test="sidebar-toggle"]')
    const sidebar = wrapper.find('.layout-shell__sidebar')

    expect(toggle.exists()).toBe(true)
    expect(sidebar.attributes('style')).toBeUndefined()

    await toggle.trigger('click')
    await flushPromises()

    expect(wrapper.find('.layout-shell').classes()).toContain('layout-shell--sidebar-collapsed')
    expect(sidebar.attributes('style')).toBeUndefined()
  })
})
