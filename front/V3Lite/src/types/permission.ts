export interface UserInfo {
  avatar?: string
  nickname: string
  roles: string[]
  userId: string
  username: string
}

export interface MenuMeta {
  affix?: boolean
  hidden?: boolean
  icon?: string
  keepAlive?: boolean
  order?: number
  permissionCode?: string
  requiresAuth?: boolean
  title: string
}

export interface MenuItem {
  children?: MenuItem[]
  component?: string
  meta: MenuMeta
  name: string
  path: string
  redirect?: string
}

export type PermissionCode = string

export interface AccessContext {
  accessCodes: PermissionCode[]
  menuTree: MenuItem[]
}
