import { DesignSetting } from '#/config'
import { THEME_COLOR_LIST, EThemeMode } from '@/enums/appEnum'

export const prefixCls = 'naive-vben'

export const designSetting: DesignSetting = {
  // 主题模式
  themeMode: EThemeMode.LIGHT,
  // 主题色
  themeColor: THEME_COLOR_LIST[0],
  //系统内置主题色列表
  themeColorList: THEME_COLOR_LIST,
}
