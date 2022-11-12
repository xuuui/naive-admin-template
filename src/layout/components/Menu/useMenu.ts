import type { Menu } from '#/router'

import { usePermissionStore } from '@/store/modules/permission'
import { computed, unref } from 'vue'
import { storeToRefs } from 'pinia'
import { useGo } from '@/hooks/web/usePage'
import { findTreeParents } from '@/utils/helper/treeHelper'

export const useMenu = () => {
  const permissionStore = usePermissionStore()
  const { getMenuList } = storeToRefs(permissionStore)
  const go = useGo()

  const getMenus = computed(() => {
    let menus: Menu[] = unref(getMenuList)
    menus = menus.filter((item) => !item.meta?.hideMenu)
    return menus
  })

  const getParentPaths = (path: string) => {
    return (
      findTreeParents<Menu>(unref(getMenus), (item) => item.path === path)
        ?.filter((item) => item.path !== path)
        ?.map((item) => item.path) ?? []
    )
  }

  const handleMenuGo = (path: string) => {
    go(path)
  }

  return {
    getMenus,
    getParentPaths,
    handleMenuGo,
  }
}
