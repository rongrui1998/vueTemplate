import { transformMenusToRoutes } from '@/router/transform/menu-to-routes'
import type { MenuItem } from '@/types/permission'

describe('menu to routes', () => {
  it('transforms nested menus into route records', () => {
    const menus: MenuItem[] = [
      {
        children: [
          {
            component: 'dashboard/index',
            meta: {
              icon: 'DataBoard',
              title: '分析页',
            },
            name: 'Analytics',
            path: '/overview/analytics',
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
    ]

    const routes = transformMenusToRoutes(menus)

    expect(routes).toHaveLength(1)
    expect(routes[0]?.path).toBe('/overview')
    expect(routes[0]?.children).toHaveLength(1)
    expect(routes[0]?.children?.[0]?.name).toBe('Analytics')
  })
})
