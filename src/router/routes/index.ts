import type { AppRouteRecordRaw } from '#/router'
import {
  EXPECTION_ROUTE,
  LOGIN_ROUTE,
  REDIRECT_ROUTE,
  ROOT_ROUTE,
} from './basic'
import { mainOutRoutes } from './mainOut'

const modules: Recordable<Recordable> = import.meta.glob('./modules/**/*.ts', {
  eager: true,
})
const routeModuleList: AppRouteRecordRaw[] = []

// 加入到路由集合中
Object.keys(modules).forEach((key) => {
  const mod = modules[key].default || {}
  const modList = Array.isArray(mod) ? [...mod] : [mod]
  routeModuleList.push(...modList)
})

export const asyncRoutes = [...routeModuleList]

// 未经许可的基本路由
export const basicRoutes = [
  ROOT_ROUTE,
  LOGIN_ROUTE,
  ...mainOutRoutes,
  REDIRECT_ROUTE,
]
export const basicRouteNames = basicRoutes.map((item) => item.name)

export const afterRoutes = [EXPECTION_ROUTE]
