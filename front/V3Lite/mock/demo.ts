export interface DemoRecord {
  id: string
  name: string
  owner: string
  status: '进行中' | '待确认' | '已完成'
}

export const demoRecords: DemoRecord[] = [
  { id: 'D-1001', name: '模板权限演示', owner: 'Admin', status: '进行中' },
  { id: 'D-1002', name: '列表页规范草稿', owner: 'Taylor', status: '待确认' },
  { id: 'D-1003', name: '动态菜单联调', owner: 'Jordan', status: '已完成' },
  { id: 'D-1004', name: '登录页视觉压缩', owner: 'Admin', status: '进行中' },
  { id: 'D-1005', name: '布局密度校准', owner: 'Taylor', status: '待确认' },
]
