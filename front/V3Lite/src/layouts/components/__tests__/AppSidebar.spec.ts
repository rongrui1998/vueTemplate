import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { createMemoryHistory } from 'vue-router'

import AppSidebar from '@/layouts/components/AppSidebar.vue'
import { createAppRouter } from '@/router'
import { usePermissionStore } from '@/stores/permission'

describe('AppSidebar', () => {
  it('toggles a nested submenu open and closed', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const router = createAppRouter(createMemoryHistory())
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

    const rootToggle = wrapper.findAll('button').find((button) => button.text().includes('演示'))
    await rootToggle?.trigger('click')
    expect(wrapper.text()).toContain('基础示例')

    const nestedToggle = wrapper
      .findAll('button')
      .find((button) => button.text().includes('基础示例'))
    await nestedToggle?.trigger('click')
    expect(wrapper.text()).toContain('表单演示')

    await nestedToggle?.trigger('click')
    expect(wrapper.text()).not.toContain('表单演示')
  })
})
