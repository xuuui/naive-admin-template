import type { AppRouteRecordRaw, Menu } from '#/router'
import type { RouteParams, RouteRecordRaw } from 'vue-router'

import { afterRoutes, asyncRoutes } from '@/router/routes'
import {
  filterRoutesByIngnoreRoute,
  filterRoutesByRoles,
  filterUrlRoutes,
  flatMultiLevelRoutes,
  mergeRoutes,
  patchHomeAffix,
  sortRoutes,
  transformObjToVueRoute,
  transformResourceToRoute,
} from '@/utils/helper/routeHelper'
import { EPermissionMode } from '@/enums/appEnum'
import { GET_MENU_TREE } from '@/api/sys/resource'
import { defineStore } from 'pinia'
import { router } from '@/router'
import { store } from '@/store'
import { transformRoutesToMenu } from '@/utils/helper/menuHelper'
import { useAppStore } from './app'
import { useUserStore } from './user'
import { useWeb } from '@/hooks/web/useWeb'
import { GET_PERM_CODE } from '@/api/sys/auth'

interface PermissionState {
  // 权限代码列表
  permCodeList: string[] | number[]
  // 路由是否动态添加
  isDynamicAddedRoute: boolean
  // 触发菜单更新
  lastBuildMenuTime: number
  // 菜单列表
  menuList: Menu[]
}

export const usePermissionStore = defineStore({
  id: 'app-permission',
  state: (): PermissionState => ({
    // 权限代码列表
    permCodeList: [],
    // 路由是否动态添加
    isDynamicAddedRoute: false,
    // 触发菜单更新
    lastBuildMenuTime: 0,
    // 后台菜单列表
    menuList: [],
  }),
  getters: {
    getPermCodeList(state) {
      return state.permCodeList
    },
    getMenuList(state) {
      return state.menuList
    },
    getLastBuildMenuTime(state) {
      return state.lastBuildMenuTime
    },
    getIsDynamicAddedRoute(state) {
      return state.isDynamicAddedRoute
    },
  },
  actions: {
    setPermCodeList(codeList: string[] | number[]) {
      this.permCodeList = codeList
    },
    setMenuList(list: Menu[]) {
      this.menuList = list
      list?.length && this.setLastBuildMenuTime()
    },
    setLastBuildMenuTime() {
      this.lastBuildMenuTime = new Date().getTime()
    },
    setDynamicAddedRoute(added: boolean) {
      this.isDynamicAddedRoute = added
    },
    resetState() {
      this.isDynamicAddedRoute = false
      this.permCodeList = []
      this.menuList = []
      this.lastBuildMenuTime = 0
    },
    setMenusParamPath(params: RouteParams) {
      const menuParamRegex = /(?::)([\s\S]+?)((?=\/)|$)/g
      const setMenuParamPath = (menu: Menu, params: RouteParams) => {
        const { path, paramPath } = menu
        let realPath = paramPath ? paramPath : path
        const matchArr = realPath.match(menuParamRegex)
        matchArr?.forEach((it) => {
          const realIt = it.substr(1)
          if (params[realIt]) {
            realPath = realPath.replace(`:${realIt}`, params[realIt] as string)
          }
        })
        if (!paramPath && matchArr && matchArr.length > 0) {
          menu.paramPath = path
        }
        menu.path = realPath
        menu.children?.forEach((item) => setMenuParamPath(item, params))
      }
      this.menuList.forEach((item) => {
        setMenuParamPath(item, params)
      })
    },
    async changePermissionCode() {
      const codeList = await GET_PERM_CODE()
      this.setPermCodeList(codeList)
    },
    async buildRoutesAction(): Promise<AppRouteRecordRaw[]> {
      const userStore = useUserStore()
      const appStore = useAppStore()
      const { message } = useWeb()
      const permissionMode = appStore.getPermissionMode
      let routes: AppRouteRecordRaw[] = []

      const menuLoading = message.loading('菜单加载中...', { duration: 0 })
      switch (permissionMode) {
        case EPermissionMode.ROUTE_MAPPING:
          routes = [...asyncRoutes, ...afterRoutes]
          // 合并重复
          routes = mergeRoutes(routes)
          // 过滤角色
          const roleList = userStore.getRoleList
          routes = filterRoutesByRoles(routes, roleList)
          break
        case EPermissionMode.BACK:
          await this.changePermissionCode()
          const resources = await GET_MENU_TREE()
          routes = [
            ...asyncRoutes,
            ...transformResourceToRoute(resources),
            ...afterRoutes,
          ]
          // 合并重复路由
          routes = mergeRoutes(routes)
          break
      }
      // 路由排序
      routes = sortRoutes(routes)
      // 动态引入组件
      routes = transformObjToVueRoute(routes)
      // 将路由转换成菜单
      this.setMenuList(transformRoutesToMenu(routes))
      routes = filterUrlRoutes(routes)
      // 移除掉 ignoreRoute: true 的路由
      routes = filterRoutesByIngnoreRoute(routes)
      // 将多级路由转换为 2 级路由
      routes = flatMultiLevelRoutes(routes)
      // 修复首页
      routes = patchHomeAffix(routes)
      console.log('routeList', routes)

      routes.forEach((route) => {
        router.addRoute(route as RouteRecordRaw)
      })
      this.setDynamicAddedRoute(true)
      setTimeout(() => {
        menuLoading.destroy()
      }, 30)
      return routes
    },
  },
})

export function usePermissionStoreWithOut() {
  return usePermissionStore(store)
}
