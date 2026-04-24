import { defineStore } from 'pinia'

import { useTabsStore } from '@/stores/tabs'
import type { LoginPayload } from '@/types/api'
import type { UserInfo } from '@/types/permission'

import { fetchCurrentUser, loginByPassword } from '@/modules/auth/service'
import { clearAccessToken, getAccessToken, setAccessToken } from '@/utils/storage'

interface UserState {
  accessToken: string
  loading: boolean
  userInfo: UserInfo | null
}

export const useUserStore = defineStore('user', {
  actions: {
    async fetchUserInfo() {
      const userInfo = await fetchCurrentUser()
      this.userInfo = userInfo

      return userInfo
    },
    async login(payload: LoginPayload) {
      this.loading = true

      try {
        const { accessToken } = await loginByPassword(payload)
        setAccessToken(accessToken)
        this.accessToken = accessToken

        await this.fetchUserInfo()
      } finally {
        this.loading = false
      }
    },
    logout() {
      const tabsStore = useTabsStore()

      clearAccessToken()
      tabsStore.reset()
      this.accessToken = ''
      this.userInfo = null
    },
  },
  getters: {
    isLoggedIn: (state) => Boolean(state.accessToken),
  },
  state: (): UserState => ({
    accessToken: getAccessToken(),
    loading: false,
    userInfo: null,
  }),
})
