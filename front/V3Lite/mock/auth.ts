import type { LoginPayload, LoginResult } from '../src/types/api'
import type { UserInfo } from '../src/types/permission'

export const demoLoginPayload: LoginPayload = {
  password: 'admin123',
  username: 'admin',
}

export const demoLoginResult: LoginResult = {
  accessToken: 'v3lite-demo-access-token',
}

export const demoUser: UserInfo = {
  avatar:
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
  nickname: '系统管理员',
  roles: ['admin'],
  userId: 'u-001',
  username: 'admin',
}
