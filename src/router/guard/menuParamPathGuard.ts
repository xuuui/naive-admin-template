import type { Router } from 'vue-router'
import { usePermissionStore } from '@/store/modules/permission'

export function createMenuParamPathGuard(router: Router) {
  router.beforeEach(async (to) => {
    const permissionStore = usePermissionStore()

    if (!to.name) {
      return
    }
    if (!permissionStore.getIsDynamicAddedRoute) {
      return
    }
    permissionStore.setMenusParamPath(to.params)
    return
  })
}
