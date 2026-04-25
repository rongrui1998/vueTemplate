import type { ApiResponse, LoginPayload, LoginResult } from '@/types/api'
import type { AccessContext, UserInfo } from '@/types/permission'

import { appEnv } from '@/constants/env'
import { requestClient } from '@/utils/request'

import { demoLoginPayload, demoLoginResult, demoUser } from '../../../../mock/auth'
import { demoAccessContext } from '../../../../mock/menu'
import { fetchAccessContextApi, fetchUserInfoApi, loginApi } from '../index'

vi.mock('@/constants/env', () => ({
  appEnv: {
    useMock: true,
  },
}))

vi.mock('@/utils/request', () => ({
  requestClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

describe('auth api', () => {
  beforeEach(() => {
    appEnv.useMock = true
    vi.useFakeTimers()
    vi.mocked(requestClient.get).mockReset()
    vi.mocked(requestClient.post).mockReset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns the local login result in mock mode without calling requestClient', async () => {
    const resultPromise = loginApi(demoLoginPayload)

    await vi.runAllTimersAsync()

    await expect(resultPromise).resolves.toEqual(demoLoginResult)
    expect(requestClient.post).not.toHaveBeenCalled()
  })

  it("calls requestClient.post('/auth/login') in request mode", async () => {
    const payload: LoginPayload = {
      password: 'request-password',
      username: 'request-user',
    }
    const response: ApiResponse<LoginResult> = {
      code: 0,
      data: {
        accessToken: 'request-access-token',
      },
      message: 'ok',
    }

    appEnv.useMock = false
    vi.mocked(requestClient.post).mockResolvedValue({
      data: response,
    })

    await expect(loginApi(payload)).resolves.toEqual(response.data)
    expect(requestClient.post).toHaveBeenCalledWith('/auth/login', payload)
  })

  it("calls requestClient.get('/auth/user-info') in request mode", async () => {
    const response: ApiResponse<UserInfo> = {
      code: 0,
      data: {
        ...demoUser,
        nickname: '请求用户',
      },
      message: 'ok',
    }

    appEnv.useMock = false
    vi.mocked(requestClient.get).mockResolvedValueOnce({
      data: response,
    })

    await expect(fetchUserInfoApi()).resolves.toEqual(response.data)
    expect(requestClient.get).toHaveBeenCalledWith('/auth/user-info')
  })

  it("calls requestClient.get('/auth/access-context') in request mode", async () => {
    const response: ApiResponse<AccessContext> = {
      code: 0,
      data: {
        ...demoAccessContext,
        accessCodes: ['request:access'],
      },
      message: 'ok',
    }

    appEnv.useMock = false
    vi.mocked(requestClient.get).mockResolvedValueOnce({
      data: response,
    })

    await expect(fetchAccessContextApi()).resolves.toEqual(response.data)
    expect(requestClient.get).toHaveBeenCalledWith('/auth/access-context')
  })
})
