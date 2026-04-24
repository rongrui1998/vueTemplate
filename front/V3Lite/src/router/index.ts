import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
  type Router,
  type RouterHistory,
} from 'vue-router'

import { staticRoutes } from '@/router/routes/static'

export function createAppRouter(history?: RouterHistory) {
  return createRouter({
    history: history ?? createWebHistory(import.meta.env.BASE_URL),
    routes: staticRoutes as RouteRecordRaw[],
    scrollBehavior: () => ({ left: 0, top: 0 }),
  })
}

export const router: Router = createAppRouter()
