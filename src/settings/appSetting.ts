import type { AppSetting } from '#/config'

import { ETransitionName, EPermissionMode, ENavMode } from '@/enums/appEnum'
import { EStorageType } from '@/enums/cacheEnum'

export const appSetting: AppSetting = {
  // 是否处于移动端模式
  isMobile: false,
  // 触发移动端宽度
  mobileWidth: 800,
  // 导航模式 vertical 左侧菜单模式 horizontal 顶部菜单模式
  navMode: ENavMode.VERTICAL,
  // 是否显示主题切换按钮
  showThemeModeToggle: true,
  // 是否显示项目设置
  showSetting: true,
  // 权限模式
  permissionMode: EPermissionMode.BACK,
  // 权限缓存类型
  permissionCacheType: EStorageType.SESSION,
  // 是否使用全局错误捕获
  useErrorHandle: false,
  // 切换界面的时候是否删除未关闭的message及notify
  closeMessageOnSwitch: true,
  // 切换界面的时候是否取消已经发送但是未响应的http请求。
  // 如果开启,想对单独接口覆盖。可以在单独接口设置
  removeAllHttpPending: true,
  // 顶栏设置
  headerSetting: {
    // 固定顶部
    fixed: true,
    // 开启反转色
    inverted: false,
    // 面包屑
    crumb: {
      // 是否显示
      show: true,
      // 显示图标
      showIcon: false,
    },
  },
  // 侧边栏设置
  siderSetting: {
    // 最小宽度
    minWidth: 64,
    // 菜单宽度
    width: 200,
    // 是否折叠
    collapsed: false,
    // 手风琴模式，只展示一个菜单
    accordion: false,
    // 开启反转色
    inverted: true,
  },
  // 多标签
  multiTabSetting: {
    // 是否显示
    show: true,
    // 固定多标签
    fixed: true,
    // 是否缓存
    cached: true,
  },
  // 过渡
  transitionSetting: {
    //  是否开启过渡动画
    enable: true,
    // 默认动画
    transitionName: ETransitionName.ZOOM_FADE,
    // 是否打开页面切换loading
    openPageLoading: true,
    //是否打开页面切换顶部进度条
    openProgress: true,
  },
}
