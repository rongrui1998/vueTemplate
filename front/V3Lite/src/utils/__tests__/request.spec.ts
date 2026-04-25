import type { AxiosError, InternalAxiosRequestConfig } from 'axios'

import { LOGIN_ROUTE_PATH } from '@/constants/app'
import { handleResponseError, injectAccessToken } from '@/utils/request'

function createAxiosError(input: {
  message?: string
  responseMessage?: string
  silent?: boolean
  status?: number
}) {
  return {
    config: {
      silent: input.silent,
    },
    message: input.message ?? 'Request failed',
    response: {
      data: {
        code: input.status ?? 500,
        data: null,
        message: input.responseMessage ?? '请求失败',
      },
      status: input.status ?? 500,
    },
  } as AxiosError
}

describe('request helpers', () => {
  it('adds bearer token into authorization header', () => {
    const config = injectAccessToken(
      {
        headers: {},
      } as InternalAxiosRequestConfig,
      'token-demo',
    )

    expect(config.headers.Authorization).toBe('Bearer token-demo')
  })

  it('shows a default error message for non-silent requests', async () => {
    const notifyError = vi.fn()
    const handleUnauthorized = vi.fn()

    await expect(
      handleResponseError(createAxiosError({ responseMessage: '保存失败' }), {
        handleUnauthorized,
        notifyError,
      }),
    ).rejects.toMatchObject({
      message: '保存失败',
      status: 500,
    })

    expect(notifyError).toHaveBeenCalledWith('保存失败')
    expect(handleUnauthorized).not.toHaveBeenCalled()
  })

  it('skips the default error message when the request is silent', async () => {
    const notifyError = vi.fn()

    await expect(
      handleResponseError(createAxiosError({ responseMessage: '静默失败', silent: true }), {
        handleUnauthorized: vi.fn(),
        notifyError,
      }),
    ).rejects.toMatchObject({
      message: '静默失败',
      status: 500,
    })

    expect(notifyError).not.toHaveBeenCalled()
  })

  it('logs out and redirects to login on 401 responses', async () => {
    const logout = vi.fn()
    const resetAccess = vi.fn()
    const replace = vi.fn().mockResolvedValue(undefined)
    const notifyUnauthorized = vi.fn()

    await expect(
      handleResponseError(createAxiosError({ responseMessage: '未授权', status: 401 }), {
        notifyError: vi.fn(),
        notifyUnauthorized,
        permissionStore: {
          resetAccess,
        },
        router: {
          currentRoute: {
            value: {
              path: '/overview/analytics',
            },
          },
          replace,
        },
        userStore: {
          logout,
        },
      }),
    ).rejects.toMatchObject({
      message: '未授权',
      status: 401,
    })

    expect(logout).toHaveBeenCalledTimes(1)
    expect(resetAccess).toHaveBeenCalledTimes(1)
    expect(replace).toHaveBeenCalledWith(LOGIN_ROUTE_PATH)
    expect(notifyUnauthorized).toHaveBeenCalledWith('登录已失效，请重新登录')
  })
})
