import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

import { permissionDirective } from '@/directives/permission'
import { usePermissionStore } from '@/stores/permission'

describe('permissionDirective', () => {
  function mountFixture(accessCodes: string[]) {
    const pinia = createPinia()
    setActivePinia(pinia)

    const permissionStore = usePermissionStore()
    permissionStore.accessCodes = accessCodes

    return mount(
      {
        template: `
          <div>
            <button v-permission="'demo:create'" data-testid="create-button">Create</button>
          </div>
        `,
      },
      {
        global: {
          directives: {
            permission: permissionDirective,
          },
          plugins: [pinia],
        },
      },
    )
  }

  it('removes element when permission is missing', () => {
    const wrapper = mountFixture([])

    expect(wrapper.find('[data-testid="create-button"]').exists()).toBe(false)
  })

  it('keeps element when permission is present', () => {
    const wrapper = mountFixture(['demo:create'])

    expect(wrapper.find('[data-testid="create-button"]').exists()).toBe(true)
  })
})
