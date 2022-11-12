import type { Router } from 'vue-router'
import { EPageRoute } from '@/enums/pageEnum'
import { useUserStore } from '@/store/modules/user'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import { useMultiTabStore } from '@/store/modules/multiTab'

export function createStateGuard(router: Router) {
  router.afterEach((to) => {
    if (to.path === EPageRoute.BASE_LOGIN) {
      const userStore = useUserStore()
      const appStore = useAppStore()
      const permissionStore = usePermissionStore()
      const multiTabStore = useMultiTabStore()
      appStore.resetState()
      permissionStore.resetState()
      multiTabStore.resetState()
      userStore.resetState()
    }
  })
}
