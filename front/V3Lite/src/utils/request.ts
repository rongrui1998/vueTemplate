import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

import { getAccessToken } from '@/utils/storage'

export function injectAccessToken(config: InternalAxiosRequestConfig, token = getAccessToken()) {
  if (!token) {
    return config
  }

  config.headers = config.headers ?? {}
  config.headers.Authorization = `Bearer ${token}`

  return config
}

function createHttpClient(): AxiosInstance {
  const instance = axios.create({
    baseURL: '/api',
    timeout: 10_000,
  })

  instance.interceptors.request.use((config) => injectAccessToken(config))

  return instance
}

export const requestClient = createHttpClient()
