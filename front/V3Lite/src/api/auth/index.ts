import type { ApiResponse, LoginPayload, LoginResult } from '@/types/api'
import type { AccessContext, UserInfo } from '@/types/permission'

import { appEnv } from '@/constants/env'
import { requestClient } from '@/utils/request'
import { demoLoginPayload, demoLoginResult, demoUser } from '../../../mock/auth'
import { demoAccessContext } from '../../../mock/menu'

function wait(time = 180) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, time)
  })
}

async function unwrapResponse<T>(request: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  const response = await request

  return response.data.data
}

export async function loginApi(payload: LoginPayload): Promise<LoginResult> {
  if (!appEnv.useMock) {
    return unwrapResponse(requestClient.post<ApiResponse<LoginResult>>('/auth/login', payload))
  }

  await wait()

  if (
    payload.username !== demoLoginPayload.username ||
    payload.password !== demoLoginPayload.password
  ) {
    throw new Error('用户名或密码错误，请使用演示账号 admin / admin123')
  }

  return demoLoginResult
}

export async function fetchUserInfoApi(): Promise<UserInfo> {
  if (!appEnv.useMock) {
    return unwrapResponse(requestClient.get<ApiResponse<UserInfo>>('/auth/user-info'))
  }

  await wait()

  return demoUser
}

export async function fetchAccessContextApi(): Promise<AccessContext> {
  if (!appEnv.useMock) {
    return unwrapResponse(requestClient.get<ApiResponse<AccessContext>>('/auth/access-context'))
  }

  await wait()

  return demoAccessContext
}
