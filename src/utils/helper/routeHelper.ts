import type {
  RouteMeta,
  Router,
  RouteRecordNormalized,
  RouteRecordRaw,
} from 'vue-router'
import type { AppRouteRecordRaw, Component } from '#/router'

import {
  getParentLayout,
  LAYOUT,
  EXCEPTION_COMPONENT,
  IFRAME,
} from '@/router/constant'
import { cloneDeep, isString, omit, merge } from 'lodash-es'
import { warn } from '@/utils/log'
import { createRouter, createWebHashHistory } from 'vue-router'
import { isUrl } from '../is'
import { filterTree, sortTree } from './treeHelper'
import { ERole } from '@/enums/sysEnum'
import { EPageRoute } from '@/enums/pageEnum'
import { type ResourceModel } from '@/models/sys/resource.model'

const LayoutMap = new Map<string, () => Promise<typeof import('*.vue')>>()

LayoutMap.set('LAYOUT', LAYOUT)
LayoutMap.set('IFRAME', IFRAME)

let dynamicViewsModules: Record<string, () => Promise<Recordable>>

function dynamicImport(
  dynamicViewsModules: Record<string, () => Promise<Recordable>>,
  component: string,
) {
  const keys = Object.keys(dynamicViewsModules || {})
  const matchKeys = keys.filter((key) => {
    const k = key.replace('../../views', '')
    const startFlag = component?.startsWith('/')
    const endFlag = component?.endsWith('.vue') || component?.endsWith('.tsx')
    const startIndex = startFlag ? 0 : 1
    const lastIndex = endFlag ? k.length : k.lastIndexOf('.')
    return k.substring(startIndex, lastIndex) === component
  })
  if (matchKeys?.length === 1) {
    const matchKey = matchKeys[0]
    return dynamicViewsModules[matchKey]
  } else if (matchKeys?.length > 1) {
    warn(
      'Please do not create `.vue` and `.TSX` files with the same file name in the same hierarchical directory under the views folder. This will cause dynamic introduction failure',
    )
    return
  } else {
    warn(
      '在src/views/下找不到`' +
        component +
        '.vue` 或 `' +
        component +
        '.tsx`, 请自行创建!',
    )
    return EXCEPTION_COMPONENT
  }
}

function asyncImportRoute(routes: AppRouteRecordRaw[] | undefined) {
  dynamicViewsModules =
    dynamicViewsModules || import.meta.glob('../../views/**/*.{vue,tsx}')

  if (!routes) return []

  return routes.map((item) => {
    let component: Component = item.component
    let children: AppRouteRecordRaw[] = item.children || []

    if (!component && item.meta?.frameSrc) {
      component = 'IFRAME'
    }

    if (isString(component)) {
      if (component) {
        const layoutFound = LayoutMap.get(component.toUpperCase())
        if (layoutFound) {
          component = layoutFound
        } else {
          component = dynamicImport(dynamicViewsModules, component as string)
        }
      } else if (item.name) {
        component = getParentLayout()
      }
    }

    if (children?.length) {
      children = asyncImportRoute(children)
    }

    return {
      ...item,
      component,
      children,
    }
  })
}

// 排序路由
export function sortRoutes(routes: AppRouteRecordRaw[]) {
  const sortFn = (a: AppRouteRecordRaw, b: AppRouteRecordRaw) => {
    return (a.meta?.orderNo || 0) - (b.meta?.orderNo || 0)
  }
  return sortTree(routes, sortFn)
}

// 通过角色过滤路由
export function filterRoutesByRoles(
  routes: AppRouteRecordRaw[],
  roleList: ERole[],
) {
  const filterFn = (route: AppRouteRecordRaw) => {
    const { roles } = route?.meta ?? {}
    if (!roles?.length) return true
    return roleList.some((role) => roles.includes(role))
  }
  return filterTree(routes, filterFn)
}

// 修复主页固定
export function patchHomeAffix(routes: AppRouteRecordRaw[]) {
  const home = findRealRouteByPath(
    routes as RouteRecordRaw[],
    EPageRoute.BASE_HOME,
  )
  if (home) {
    home.meta = { ...home.meta, affix: true }
  }
  return routes
}

// 查找最后的真实路径
export function findRealRouteByPath(
  routes: RouteRecordRaw[],
  searchPath: string,
  parentPath = '',
): RouteRecordRaw | null {
  if (!routes?.length) return null

  let result: RouteRecordRaw | null = null

  if (parentPath) parentPath = parentPath + '/'

  for (const route of routes) {
    const { path, children, redirect } = route
    const currentPath = path?.startsWith('/') ? path : parentPath + path

    if (currentPath === searchPath) {
      if (redirect) {
        searchPath = route.redirect! as string
      } else {
        result = route
        break
      }
    }

    if (children?.length) {
      result = findRealRouteByPath(children, searchPath, currentPath)
      if (result) break
    }
  }
  return result
}

// 转换路由为多标签
export function transformRouteToMultiTab(route: {
  name?: any
  fullPath?: string
  path: string
  meta?: RouteMeta
}) {
  return {
    name: route.name as string,
    fullPath: route?.fullPath || route?.path,
    meta: route.meta!,
  }
}

// 过滤忽略路由
export function filterRoutesByIngnoreRoute(routes: AppRouteRecordRaw[]) {
  return filterTree(routes, (route) => {
    const { ignoreRoute } = route?.meta ?? {}
    return !ignoreRoute
  })
}

// 过滤连接路由
export function filterUrlRoutes(routes: AppRouteRecordRaw[]) {
  return filterTree(routes, (route) => {
    return !isUrl(route.path)
  })
}

// 合并重复路由
export const mergeRoutes = (routes: AppRouteRecordRaw[]) => {
  const routeMap = new Map<string, AppRouteRecordRaw>()

  routes.forEach((route: AppRouteRecordRaw) => {
    if (!routeMap.get(route.name)) {
      routeMap.set(route.name, route)
      return
    }
    const pre = routeMap.get(route.name)
    const { children, ...rest } = route
    merge(pre, { ...rest, children: mergeRoutes(children || []) })
  })
  return routes
}

// 设置路由完整路径
function setRoutesFullPath(routes: AppRouteRecordRaw[], parentPath = '') {
  return routes.map((route) => {
    route.fullPath = route.path
    if (!(route?.fullPath?.startsWith('/') || isUrl(route?.fullPath))) {
      route.fullPath = `${parentPath}/${route.fullPath}`
    }
    if (route.children?.length && !route.redirect) {
      route.redirect = `${route.fullPath}/${route.children[0].path}`
    }
    if (route?.children?.length) {
      route.children = setRoutesFullPath(
        route.children,
        route.meta?.hidePathForChildren ? parentPath : route.fullPath,
      )
    }
    return route
  })
}

export function transformResourceToRoute(
  resources: ResourceModel[],
): AppRouteRecordRaw[] {
  return resources.map((item) => {
    return {
      path: item.path,
      name: item.name,
      component: item.component,
      meta: {
        title: item.title,
        icon: item.icon,
        ignoreKeepAlive: !item.isCache,
        hideMenu: !item.isVisible,
        disabled: !item.state,
      },
      children: transformResourceToRoute(item.children || []),
    }
  })
}

// 将背景对象变成路由对象
export function transformObjToVueRoute(
  routes: AppRouteRecordRaw[],
): AppRouteRecordRaw[] {
  routes = routes.map((route) => {
    const component = route.component as string

    if (component) {
      if (isString(component)) {
        if (component.toUpperCase() === 'LAYOUT') {
          route.component = LayoutMap.get(component.toUpperCase())
        } else {
          const realRoute = cloneDeep(route)
          route.children = [realRoute]
          route.component = LAYOUT
          route.name = `${realRoute.name}Parent`
          route.path = ''
          route.redirect = realRoute.path
          const meta = realRoute.meta || {}
          route.meta = {
            ...meta,
            single: true,
            affix: false,
          }
        }
      }
      if (isUrl(route.path)) {
        route.path = `/${route.path.replace(/\//g, '')}`
      }
    } else {
      warn('请正确配置路由：' + route?.name + '的component属性')
    }
    if (route.children?.length) {
      route.children = asyncImportRoute(route.children)
    }
    return route
  })
  routes = setRoutesFullPath(routes)
  return routes
}

// 路由降级为二级
export function flatMultiLevelRoutes(routes: AppRouteRecordRaw[]) {
  const routeList: AppRouteRecordRaw[] = cloneDeep(routes)
  for (const route of routeList) {
    if (!isMultipleRoute(route)) {
      continue
    }

    let router: Router | null = createRouter({
      routes: [route as unknown as RouteRecordNormalized],
      history: createWebHashHistory(),
    })
    const list = router.getRoutes()
    route.children = addToChildren(list, route.children || [], route)
    router = null
    route.children = route.children?.map((item) => omit(item, 'children'))
  }
  return routeList
}

function addToChildren(
  routes: RouteRecordNormalized[],
  children: AppRouteRecordRaw[],
  route: AppRouteRecordRaw,
) {
  const reusult: AppRouteRecordRaw[] = []
  for (const child of children) {
    const routeRecord = routes.find((item) => item.name === child.name)
    if (!routeRecord) {
      reusult.push(child)
      continue
    }
    if (!route.children?.find((item) => item.name === routeRecord.name)) {
      route.children?.push(routeRecord as unknown as AppRouteRecordRaw)
    }
    if (child.children?.length) {
      child.children = addToChildren(routes, child.children, route)
    }
    reusult.push(child)
  }
  return reusult
}

function isMultipleRoute(route: AppRouteRecordRaw) {
  if (!route || !route.children?.length) {
    return false
  }

  let flag = false
  for (let index = 0; index < route.children.length; index++) {
    const child = route.children[index]
    if (child.children?.length) {
      flag = true
      break
    }
  }
  return flag
}
