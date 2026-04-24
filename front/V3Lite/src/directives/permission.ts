import { getActivePinia } from 'pinia'
import type { Directive } from 'vue'

import { pinia } from '@/stores'
import { usePermissionStore } from '@/stores/permission'

function checkPermission(value: string | string[] | undefined) {
  const permissionStore = usePermissionStore(getActivePinia() ?? pinia)

  if (!value) {
    return true
  }

  if (Array.isArray(value)) {
    return value.some((permissionCode) => permissionStore.hasPermission(permissionCode))
  }

  return permissionStore.hasPermission(value)
}

function updateVisibility(el: HTMLElement, value: string | string[] | undefined) {
  if (checkPermission(value)) {
    return
  }

  el.remove()
}

export const permissionDirective: Directive<HTMLElement, string | string[]> = {
  mounted(el, binding) {
    updateVisibility(el, binding.value)
  },
  updated(el, binding) {
    updateVisibility(el, binding.value)
  },
}
