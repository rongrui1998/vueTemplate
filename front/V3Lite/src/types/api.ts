export interface ApiResponse<T> {
  code: number
  data: T
  message: string
}

export interface LoginPayload {
  password: string
  username: string
}

export interface LoginResult {
  accessToken: string
  refreshToken?: string
}
