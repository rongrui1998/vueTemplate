import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'

import * as demoApi from '@/api/demo'
import { permissionDirective } from '@/directives/permission'
import { usePermissionStore } from '@/stores/permission'
import DemoListPage from '@/views/demo/list.vue'

describe('DemoListPage', () => {
  function mountPage(accessCodes: string[] = ['demo:create']) {
    const pinia = createPinia()
    setActivePinia(pinia)

    const permissionStore = usePermissionStore()
    permissionStore.accessCodes = accessCodes

    return mount(DemoListPage, {
      global: {
        directives: {
          permission: permissionDirective,
        },
        plugins: [pinia],
        stubs: {
          teleport: true,
          transition: false,
        },
      },
    })
  }

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('loads rows from the demo api', async () => {
    const fetchSpy = vi
      .spyOn(demoApi, 'fetchDemoRecordsApi')
      .mockResolvedValue([
        { id: 'D-9001', name: '来自接口的数据', owner: 'Codex', status: '进行中' },
      ])

    const wrapper = mountPage()
    await flushPromises()

    expect(fetchSpy).toHaveBeenCalledTimes(1)
    expect(wrapper.text()).toContain('来自接口的数据')
  })

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

  it('renders the custom dark pagination shell', () => {
    const wrapper = mountPage()

    expect(wrapper.find('[data-testid="table-pagination"]').classes()).toContain('table-pagination')
    expect(wrapper.find('.demo-pagination').exists()).toBe(true)
    expect(wrapper.find('[data-testid="query-panel"]').classes()).toContain('query-shell')
    expect(wrapper.find('[data-testid="result-chip"]').classes()).toContain('result-chip')
    expect(wrapper.text()).toContain('编辑')
    expect(wrapper.find('[data-testid="search-button"]').classes()).toContain('query-button')
    expect(wrapper.find('[data-testid="search-button"]').classes()).toContain(
      'query-button--primary',
    )
    expect(wrapper.find('[data-testid="reset-button"]').classes()).toContain('query-button')
    expect(wrapper.find('[data-testid="reset-button"]').classes()).toContain(
      'query-button--secondary',
    )
  })
})
