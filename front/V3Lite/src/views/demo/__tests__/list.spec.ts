import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'

import DemoListPage from '@/views/demo/list.vue'
import { usePermissionStore } from '@/stores/permission'

describe('DemoListPage', () => {
  function mountPage(accessCodes: string[] = ['demo:create']) {
    const pinia = createPinia()
    setActivePinia(pinia)

    const permissionStore = usePermissionStore()
    permissionStore.accessCodes = accessCodes

    return mount(DemoListPage, {
      global: {
        plugins: [pinia],
        stubs: {
          teleport: true,
          transition: false,
        },
      },
    })
  }

  it('filters rows by keyword', async () => {
    const wrapper = mountPage()

    const keywordInput = wrapper.find('[data-testid="keyword-input"] input')
    await keywordInput.setValue('规范')
    await wrapper.get('[data-testid="search-button"]').trigger('click')
    await nextTick()

    expect(wrapper.text()).toContain('列表页规范草稿')
    expect(wrapper.text()).not.toContain('模板权限演示')
  })

  it('shows create action only when permission exists and opens dialog', async () => {
    const wrapper = mountPage(['demo:create'])

    expect(wrapper.find('[data-testid="create-button"]').exists()).toBe(true)

    await wrapper.get('[data-testid="create-button"]').trigger('click')
    await nextTick()

    expect(wrapper.text()).toContain('新增记录')
  })

  it('hides create action without permission', () => {
    const wrapper = mountPage([])

    expect(wrapper.find('[data-testid="create-button"]').exists()).toBe(false)
  })
})
