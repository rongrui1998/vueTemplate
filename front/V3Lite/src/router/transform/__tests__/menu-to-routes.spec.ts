import { transformMenusToRoutes } from '@/router/transform/menu-to-routes'
import type { MenuItem } from '@/types/permission'

describe('menu to routes', () => {
  it('transforms nested menus into route records', () => {
    const menus: MenuItem[] = [
      {
        children: [
          {
            meta: {
              icon: 'Tickets',
              title: '基础示例',
            },
            name: 'DemoBasic',
            path: '/demo/basic',
            redirect: '/demo/basic/form',
            children: [
              {
                component: 'dashboard/index',
                meta: {
                  icon: 'DataBoard',
                  title: '分析页',
                },
                name: 'Analytics',
                path: '/demo/basic/form',
              },
            ],
          },
        ],
        meta: {
          icon: 'Grid',
          title: '演示',
        },
        name: 'Demo',
        path: '/demo',
        redirect: '/demo/basic/form',
      },
    ]

    const routes = transformMenusToRoutes(menus)

    expect(routes).toHaveLength(1)
    expect(routes[0]?.path).toBe('/demo')
    expect(routes[0]?.children).toHaveLength(1)
    expect(routes[0]?.children?.[0]?.name).toBe('DemoBasic')
    expect(routes[0]?.children?.[0]?.children?.[0]?.name).toBe('Analytics')
  })
})
