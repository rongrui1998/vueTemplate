import type { LoginPayload } from '@/types/api'

import { fetchAccessContextApi, fetchUserInfoApi, loginApi } from '@/api/auth'

export async function loginByPassword(payload: LoginPayload) {
  return loginApi(payload)
}

export async function fetchCurrentUser() {
  return fetchUserInfoApi()
}

export async function fetchCurrentAccessContext() {
  return fetchAccessContextApi()
}
