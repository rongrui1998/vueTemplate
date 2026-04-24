import { createPinia, setActivePinia } from 'pinia'

import { usePermission } from '@/composables/use-permission'
import { usePermissionStore } from '@/stores/permission'

describe('usePermission', () => {
  it('returns permission helpers based on access codes', () => {
    setActivePinia(createPinia())

    const permissionStore = usePermissionStore()
    permissionStore.accessCodes = ['demo:create', 'demo:menu']

    const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermission()

    expect(hasPermission('demo:create')).toBe(true)
    expect(hasPermission('demo:delete')).toBe(false)
    expect(hasAnyPermission(['demo:delete', 'demo:menu'])).toBe(true)
    expect(hasAllPermissions(['demo:create', 'demo:menu'])).toBe(true)
    expect(hasAllPermissions(['demo:create', 'demo:delete'])).toBe(false)
  })
})
