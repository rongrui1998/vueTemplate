import type { RouteRecordRaw } from 'vue-router'

import { DEFAULT_HOME_PATH, ROOT_ROUTE_NAME } from '@/constants/app'

export const staticRoutes: RouteRecordRaw[] = [
  {
    component: () => import('@/layouts/default/index.vue'),
    meta: {
      requiresAuth: true,
      title: 'Root',
    },
    name: ROOT_ROUTE_NAME,
    path: '/',
    redirect: DEFAULT_HOME_PATH,
  },
  {
    component: () => import('@/views/auth/login.vue'),
    meta: {
      hidden: true,
      title: '登录',
    },
    name: 'Login',
    path: '/login',
  },
  {
    component: () => import('@/views/error/403.vue'),
    meta: {
      hidden: true,
      title: '无权限',
    },
    name: 'Forbidden',
    path: '/403',
  },
  {
    component: () => import('@/views/error/404.vue'),
    meta: {
      hidden: true,
      title: '页面不存在',
    },
    name: 'NotFound',
    path: '/404',
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
]
