import type { AccessContext, MenuItem } from '../src/types/permission'

export const demoMenus: MenuItem[] = [
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
        children: [
          {
            component: 'demo/list',
            meta: {
              icon: 'Tickets',
              permissionCode: 'demo:list',
              title: '表单演示',
            },
            name: 'DemoForm',
            path: '/demo/basic/form',
          },
          {
            component: 'demo/menu',
            meta: {
              icon: 'Document',
              permissionCode: 'demo:menu',
              title: '菜单演示',
            },
            name: 'DemoMenu',
            path: '/demo/basic/menu',
          },
        ],
        meta: {
          icon: 'FolderOpened',
          title: '基础示例',
        },
        name: 'DemoBasic',
        path: '/demo/basic',
        redirect: '/demo/basic/form',
      },
    ],
    meta: {
      icon: 'Operation',
      title: '演示',
    },
    name: 'Demo',
    path: '/demo',
    redirect: '/demo/basic/form',
  },
]

export const demoAccessCodes = [
  'dashboard:view',
  'workspace:view',
  'demo:list',
  'demo:create',
  'demo:menu',
]

export const demoAccessContext: AccessContext = {
  accessCodes: demoAccessCodes,
  menuTree: demoMenus,
}
