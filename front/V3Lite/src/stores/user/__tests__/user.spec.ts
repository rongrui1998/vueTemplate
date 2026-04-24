import { createPinia, setActivePinia } from 'pinia'

import { useUserStore } from '@/stores/user'
import { getAccessToken } from '@/utils/storage'

describe('user store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('persists the access token after login', async () => {
    const store = useUserStore()

    await store.login({
      password: 'admin123',
      username: 'admin',
    })

    expect(store.accessToken).toBeTruthy()
    expect(getAccessToken()).toBe(store.accessToken)
    expect(store.userInfo?.username).toBe('admin')
  })
})
