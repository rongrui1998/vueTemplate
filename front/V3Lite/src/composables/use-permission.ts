import { storeToRefs } from 'pinia'

import { usePermissionStore } from '@/stores/permission'

export function usePermission() {
  const permissionStore = usePermissionStore()
  const { accessCodes } = storeToRefs(permissionStore)

  function hasPermission(permissionCode?: string) {
    return permissionStore.hasPermission(permissionCode)
  }

  function hasAnyPermission(permissionCodes: string[]) {
    return permissionCodes.some((permissionCode) => hasPermission(permissionCode))
  }

  function hasAllPermissions(permissionCodes: string[]) {
    return permissionCodes.every((permissionCode) => hasPermission(permissionCode))
  }

  return {
    accessCodes,
    hasAllPermissions,
    hasAnyPermission,
    hasPermission,
  }
}
