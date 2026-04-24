import type { App } from 'vue'

import { permissionDirective } from './permission'

export function setupDirectives(app: App<Element>) {
  app.directive('permission', permissionDirective)
}
