import type { RouteRecordRaw } from 'vue-router'

import RouteView from '@/components/common/RouteView.vue'
import type { MenuItem } from '@/types/permission'

const viewModules = import.meta.glob('/src/views/**/*.vue')
const fallbackView = () => import('@/views/error/route-missing.vue')

function resolveRouteComponent(component?: string) {
  if (!component) {
    return RouteView
  }

  const match = viewModules[`/src/views/${component}.vue`]

  return match ?? fallbackView
}

function transformSingleMenu(menu: MenuItem): RouteRecordRaw {
  return {
    children: menu.children?.map(transformSingleMenu),
    component: resolveRouteComponent(menu.component),
    meta: {
      ...menu.meta,
      requiresAuth: menu.meta.requiresAuth ?? true,
    },
    name: menu.name,
    path: menu.path,
    redirect: menu.redirect,
  }
}

export function transformMenusToRoutes(menus: MenuItem[]) {
  return menus.map(transformSingleMenu)
}
