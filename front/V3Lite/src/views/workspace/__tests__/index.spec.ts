import { mount } from '@vue/test-utils'

import WorkspacePage from '@/views/workspace/index.vue'

describe('WorkspacePage', () => {
  it('uses the shared business page shell classes', () => {
    const wrapper = mount(WorkspacePage)

    expect(wrapper.find('section.app-page').exists()).toBe(true)
    expect(wrapper.findAll('.app-panel').length).toBeGreaterThanOrEqual(3)
    expect(wrapper.find('.app-panel--feature').exists()).toBe(true)
    expect(wrapper.find('.app-table-panel').exists()).toBe(true)
    expect(wrapper.findAll('.app-table-row').length).toBe(3)
  })
})
