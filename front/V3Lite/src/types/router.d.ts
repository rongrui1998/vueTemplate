import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    affix?: boolean
    hidden?: boolean
    icon?: string
    keepAlive?: boolean
    order?: number
    permissionCode?: string
    requiresAuth?: boolean
    title?: string
  }
}
