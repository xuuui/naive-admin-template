import type {
  ENavModeEnum,
  EPermissionModeEnum,
  EThemeMode,
  ETransitionName,
} from '@/enums/appEnum'
import type { ECacheType } from '@/enums/cacheEnum'

// 顶部
export interface HeaderSetting {
  // 是否固定
  fixed: boolean
  // 开启反转色
  inverted: boolean
  // 面包屑设置
  crumb: CrumbSetting
}

// 边栏
export interface SiderSetting {
  // 最小宽度
  minWidth: number
  // 宽度
  width: number
  // 是否折叠
  collapsed: boolean
  // 开启反转色
  inverted: boolean
  // 手风琴模式，只展示一个菜单
  accordion: boolean
}

// 面包屑
export interface CrumbSetting {
  // 是否显示
  show: boolean
  // 显示图标
  showIcon: boolean
}

// 多标签
export interface MultiTabSetting {
  // 固定多标签
  fixed: boolean
  // 是否显示
  show: boolean
  // 是否缓存
  cached: boolean
}

// 主题样式
export interface DesignSetting {
  // 主题模式
  themeMode: EThemeMode
  // 主题色
  themeColor: string
  // 内置主题色
  themeColorList: string[]
}

// 过渡
export interface TransitionSetting {
  // 是否开启过渡
  enable: boolean
  // 过渡动画名称
  transitionName: ETransitionName
  // 是否开加载
  openPageLoading: boolean
  //是否打开顶部进度条
  openProgress: boolean
}

// 应用设置
export interface AppSetting {
  // 是否处于移动端
  isMobile: boolean
  // 触发移动端宽度
  mobileWidth: number
  // 导航栏模式
  navMode: ENavModeEnum
  // 权限模式
  permissionMode: EPermissionModeEnum
  // 是否显示主题切换按钮
  showThemeModeToggle: boolean
  // 是否显示项目设置
  showSetting: boolean
  // 权限缓存类型
  permissionCacheType: ECacheType
  // 是否使用全局错误捕获
  useErrorHandle: boolean
  // 切换界面的时候是否删除未关闭的message及notify
  closeMessageOnSwitch: boolean
  // 切换界面的时候是否取消已经发送但是未响应的http请求。
  // 如果开启,想对单独接口覆盖。可以在单独接口设置
  removeAllHttpPending: boolean
  // 顶栏设置
  headerSetting: HeaderSetting
  // 侧边栏设置
  siderSetting: SiderSetting
  // 多标签
  multiTabSetting: MultiTabSetting
  // 过渡设置
  transitionSetting: TransitionSetting
}
