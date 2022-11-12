// 主题模式
export enum EThemeMode {
  DARK = 'dark',
  LIGHT = 'light',
}

// 导航模式
export enum ENavMode {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
  HORIZONTAL_MIX = 'horizontal-mix',
}

// 权限模式
export enum EPermissionMode {
  BACK = 'back',
  ROUTE_MAPPING = 'route_mapping',
}

// 过渡动画
export enum ETransitionName {
  ZOOM_FADE = 'zoom-fade',
  ZOOM_OUT = 'zoom-out',
  FADE_SIDE = 'fade-slide',
  FADE = 'fade',
  FADE_BOTTOM = 'fade-bottom',
  FADE_SCALE = 'fade-scale',
}

export const TRANSITION_NAME_OPTIONS = [
  { value: ETransitionName.ZOOM_FADE, label: '渐变' },
  { value: ETransitionName.ZOOM_OUT, label: '闪现' },
  { value: ETransitionName.FADE_SIDE, label: '滑动' },
  { value: ETransitionName.FADE, label: '消退' },
  { value: ETransitionName.FADE_BOTTOM, label: '底部消退' },
  { value: ETransitionName.FADE_SCALE, label: '缩放消退' },
]

// 内置主题色
export const THEME_COLOR_LIST: string[] = [
  '#2d8cf0',
  '#0960bd',
  '#0084f4',
  '#009688',
  '#536dfe',
  '#ff5c93',
  '#ee4f12',
  '#0096c7',
  '#9c27b0',
  '#ff9800',
  '#FF3D68',
  '#00C1D4',
  '#71EFA3',
  '#171010',
  '#78DEC7',
  '#1768AC',
  '#FB9300',
  '#FC5404',
]

export enum EMultiTabAction {
  RELOAD = 'reload',
  CLOSE_ALL = 'close-all',
  CLOSE_OTHER = 'close-other',
  CLOSE_LEFT = 'close-left',
  CLOSE_RIGHT = 'close-right',
  CLOSE = 'close',
}
