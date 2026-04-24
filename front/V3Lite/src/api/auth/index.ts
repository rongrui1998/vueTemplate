import type { LoginPayload, LoginResult } from '@/types/api'
import type { AccessContext, UserInfo } from '@/types/permission'

import { demoLoginPayload, demoLoginResult, demoUser } from '../../../mock/auth'
import { demoAccessContext } from '../../../mock/menu'

function wait(time = 180) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, time)
  })
}

export async function loginApi(payload: LoginPayload): Promise<LoginResult> {
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
  await wait()

  return demoUser
}

export async function fetchAccessContextApi(): Promise<AccessContext> {
  await wait()

  return demoAccessContext
}
