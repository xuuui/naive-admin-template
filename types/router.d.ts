import 'vue-router'
import type { RouteRecordRaw, RouteMeta } from 'vue-router'
import type { DefineComponent, VNode } from 'vue'
import type { ERole } from '@/enums/sysEnum'

declare module 'vue-router' {
  interface RouteMeta extends AppRouteMeta {}
}

export type Component<T = any> =
  | ReturnType<DefineComponent>
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>)

export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'children'> {
  name: string
  component?: Component | string
  children?: AppRouteRecordRaw[]
  fullPath?: string
  redirect?: string
}

export interface AppRouteMeta
  extends Record<string | number | symbol, unknown> {
  // 菜单排序
  orderNo?: number
  // 路由标题  一般必填
  title?: string
  // 是否忽略权限，只在权限模式为Role的时候有效
  ignoreAuth?: boolean
  // 可以访问的角色，只在权限模式为Role的时候有效
  roles?: ERole[]
  // 是否忽略KeepAlive缓存
  ignoreKeepAlive?: boolean
  // 是否固定标签
  affix?: boolean
  // 图标，也是菜单图标
  icon?: string
  // 内嵌iframe的地址
  frameSrc?: string
  // 隐藏该路由在面包屑上面的显示
  hideBreadcrumb?: boolean
  // 隐藏所有子菜单
  hideChildrenInMenu?: boolean
  // 用于内部标记单级菜单
  single?: boolean
  // 当前激活的菜单。用于配置详情页时左侧激活的菜单路径
  currentActiveMenu?: string
  // 当前路由不再标签页显示
  hideTab?: boolean
  // 当前路由不再菜单显示
  hideMenu?: boolean
  // 忽略路由。用于在ROUTE_MAPPING以及BACK权限模式下，生成对应的菜单而忽略路由。
  ignoreRoute?: boolean
  // 是否在子级菜单的完整path中忽略本级path。
  hidePathForChildren?: boolean
  // 是否禁用菜单项
  disabled?: boolean
  // 内部标记是否加载
  loaded?: boolean
}

export interface Menu {
  // 菜单名称
  name: string
  // 菜单标题
  title: string
  // 菜单项的图标
  icon?: string | (() => VNode) | VNode
  // 路由路径
  path: string
  // 是否禁用菜单项
  disabled?: boolean
  // 子选项
  children?: Menu[]
  // 路由元信息
  meta?: RouteMeta
  // 是否显示菜单项
  show?: boolean
  // 带参数路径, 路由守卫里自动设置
  paramPath?: string
}
