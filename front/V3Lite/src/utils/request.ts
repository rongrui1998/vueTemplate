import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus/es/components/message/index'
import 'element-plus/es/components/message/style/css'

import { LOGIN_ROUTE_PATH } from '@/constants/app'
import { router } from '@/router'
import { pinia } from '@/stores'
import { usePermissionStore } from '@/stores/permission'
import { useUserStore } from '@/stores/user'
import type { ApiResponse } from '@/types/api'
import { getAccessToken } from '@/utils/storage'

export interface RequestConfig extends InternalAxiosRequestConfig {
  silent?: boolean
}

export class RequestError extends Error {
  code?: number
  status?: number

  constructor(message: string, options?: { code?: number; status?: number }) {
    super(message)
    this.name = 'RequestError'
    this.code = options?.code
    this.status = options?.status
  }
}

interface UnauthorizedDeps {
  notifyUnauthorized: (message: string) => void
  permissionStore: Pick<ReturnType<typeof usePermissionStore>, 'resetAccess'>
  router: Pick<typeof router, 'currentRoute' | 'replace'>
  userStore: Pick<ReturnType<typeof useUserStore>, 'logout'>
}

interface ResponseErrorDeps extends UnauthorizedDeps {
  handleUnauthorized: (deps: UnauthorizedDeps) => Promise<void>
  notifyError: (message: string) => void
}

function createDefaultDeps(): ResponseErrorDeps {
  return {
    handleUnauthorized: handleUnauthorized,
    notifyError: (message) => ElMessage.error(message),
    notifyUnauthorized: (message) => ElMessage.error(message),
    permissionStore: usePermissionStore(pinia),
    router,
    userStore: useUserStore(pinia),
  }
}

let isHandlingUnauthorized = false

export function injectAccessToken(config: RequestConfig, token = getAccessToken()) {
  if (!token) {
    return config
  }

  config.headers = config.headers ?? {}
  config.headers.Authorization = `Bearer ${token}`

  return config
}

export function resolveRequestErrorMessage(error: AxiosError<ApiResponse<unknown>>) {
  return error.response?.data?.message || error.message || '请求失败，请稍后重试'
}

export async function handleUnauthorized(deps: UnauthorizedDeps) {
  deps.userStore.logout()
  deps.permissionStore.resetAccess(router)

  if (deps.router.currentRoute.value.path !== LOGIN_ROUTE_PATH) {
    await deps.router.replace(LOGIN_ROUTE_PATH)
  }

  deps.notifyUnauthorized('登录已失效，请重新登录')
}

export async function handleResponseError(
  error: AxiosError<ApiResponse<unknown>>,
  overrides: Partial<ResponseErrorDeps> = {},
) {
  const deps = {
    ...createDefaultDeps(),
    ...overrides,
  } satisfies ResponseErrorDeps

  const message = resolveRequestErrorMessage(error)
  const status = error.response?.status
  const code = error.response?.data?.code
  const normalizedError = new RequestError(message, {
    code,
    status,
  })

  if (status === 401) {
    if (!isHandlingUnauthorized) {
      isHandlingUnauthorized = true

      try {
        await deps.handleUnauthorized({
          notifyUnauthorized: deps.notifyUnauthorized,
          permissionStore: deps.permissionStore,
          router: deps.router,
          userStore: deps.userStore,
        })
      } finally {
        isHandlingUnauthorized = false
      }
    }

    return Promise.reject(normalizedError)
  }

  if (!error.config?.silent) {
    deps.notifyError(message)
  }

  return Promise.reject(normalizedError)
}

function createHttpClient(): AxiosInstance {
  const instance = axios.create({
    baseURL: '/api',
    timeout: 10_000,
  })

  instance.interceptors.request.use((config) => injectAccessToken(config))
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiResponse<unknown>>) => handleResponseError(error),
  )

  return instance
}

export const requestClient = createHttpClient()
