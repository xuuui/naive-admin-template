import { EPermissionMode } from '@/enums/appEnum'
import { ERole } from '@/enums/sysEnum'
import { resetRouter } from '@/router'
import { useAppStore } from '@/store/modules/app'
import { useMultiTabStore } from '@/store/modules/multiTab'
import { usePermissionStore } from '@/store/modules/permission'
import { useUserStore } from '@/store/modules/user'
import { intersection, isArray } from 'lodash-es'

export function usePermission() {
  const userStore = useUserStore()
  const appStore = useAppStore()
  const permissionStore = usePermissionStore()

  function hasPermission(
    value?: ERole | ERole[] | string | string[],
    def = true,
  ): boolean {
    if (!value) {
      return def
    }

    const permMode = appStore.getPermissionMode

    if ([EPermissionMode.ROUTE_MAPPING].includes(permMode)) {
      if (!isArray(value)) {
        return userStore.getRoleList?.includes(value as ERole)
      }
      return intersection(value as ERole[], userStore.getRoleList).length > 0
    }

    if (EPermissionMode.BACK === permMode) {
      if (userStore.getIsSuperAdmin) {
        return true
      }
      const allCodeList = permissionStore.getPermCodeList as string[]
      if (!isArray(value)) {
        return allCodeList.includes(value as string)
      }
      return intersection(value as string[], allCodeList).length > 0
    }
    return true
  }

  async function resume() {
    const tabStore = useMultiTabStore()
    resetRouter()
    await permissionStore.buildRoutesAction()
    permissionStore.setLastBuildMenuTime()
    tabStore.closeAllTabs()
  }

  async function refreshMenu() {
    await resume()
  }

  return { hasPermission, refreshMenu }
}
