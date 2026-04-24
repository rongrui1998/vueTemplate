import type { InternalAxiosRequestConfig } from 'axios'

import { injectAccessToken } from '@/utils/request'

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
})
