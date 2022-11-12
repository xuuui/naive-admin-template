import type { AppRouteRecordRaw, Menu } from '#/router'

import { mapTree } from '@/utils/helper/treeHelper'
import { cloneDeep } from 'lodash-es'
import { renderIcon } from '@/components/Icon'

// 将路由转换成菜单
export function transformRoutesToMenu(routes: AppRouteRecordRaw[]) {
  const list = cloneDeep(routes)
  const routeList: AppRouteRecordRaw[] = []

  // 对路由项进行修改
  list.forEach((item) => {
    if (item.meta?.hideChildrenInMenu && typeof item.redirect === 'string') {
      item.path = item.redirect
    }
    if (item.meta?.single) {
      const realRoute = item?.children?.[0]
      realRoute && routeList.push(realRoute)
    } else {
      routeList.push(item)
    }
  })
  const mapFn = (route: AppRouteRecordRaw): Menu => {
    const {
      meta: {
        title = '',
        icon = undefined,
        disabled = false,
        hideMenu = false,
      } = {},
    } = route
    return {
      name: route.name,
      title,
      icon: icon ? () => renderIcon(icon) : undefined,
      path: route.fullPath!,
      disabled: disabled,
      show: !hideMenu,
      meta: route.meta,
      ...(route.redirect ? { redirect: route.redirect } : {}),
    }
  }
  return mapTree<AppRouteRecordRaw, Menu>(routeList, mapFn)
}
