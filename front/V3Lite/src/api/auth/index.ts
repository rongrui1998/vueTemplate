import type { LoginPayload, LoginResult } from '@/types/api'
import type { AccessContext, MenuItem, UserInfo } from '@/types/permission'

const demoUser: UserInfo = {
  avatar:
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
  nickname: '系统管理员',
  roles: ['admin'],
  userId: 'u-001',
  username: 'admin',
}

const demoMenus: MenuItem[] = [
  {
    children: [
      {
        component: 'dashboard/index',
        meta: {
          affix: true,
          icon: 'DataAnalysis',
          title: '分析页',
        },
        name: 'Analytics',
        path: '/overview/analytics',
      },
      {
        component: 'workspace/index',
        meta: {
          icon: 'Briefcase',
          title: '工作台',
        },
        name: 'Workspace',
        path: '/overview/workspace',
      },
    ],
    meta: {
      icon: 'Grid',
      title: '概览',
    },
    name: 'Overview',
    path: '/overview',
    redirect: '/overview/analytics',
  },
  {
    children: [
      {
        component: 'demo/list',
        meta: {
          icon: 'Tickets',
          permissionCode: 'demo:list',
          title: '表单演示',
        },
        name: 'DemoList',
        path: '/demo/list',
      },
    ],
    meta: {
      icon: 'Operation',
      title: '演示',
    },
    name: 'Demo',
    path: '/demo',
    redirect: '/demo/list',
  },
]

const demoAccessContext: AccessContext = {
  accessCodes: ['dashboard:view', 'workspace:view', 'demo:list', 'demo:create'],
  menuTree: demoMenus,
}

function wait(time = 180) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, time)
  })
}

export async function loginApi(payload: LoginPayload): Promise<LoginResult> {
  await wait()

  if (payload.username !== 'admin' || payload.password !== 'admin123') {
    throw new Error('用户名或密码错误，请使用演示账号 admin / admin123')
  }

  return {
    accessToken: 'v3lite-demo-access-token',
  }
}

export async function fetchUserInfoApi(): Promise<UserInfo> {
  await wait()

  return demoUser
}

export async function fetchAccessContextApi(): Promise<AccessContext> {
  await wait()

  return demoAccessContext
}
