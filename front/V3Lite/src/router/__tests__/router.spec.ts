import { createMemoryHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'

import { createAppRouter } from '@/router'

describe('app router', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('exposes login and root routes', () => {
    const router = createAppRouter(createMemoryHistory())

    expect(router.resolve('/login').name).toBe('Login')
    expect(router.resolve('/').matched[0]?.name).toBe('Root')
  })
})
