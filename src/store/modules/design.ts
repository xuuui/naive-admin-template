import type { DesignSetting } from '#/config'

import { DESIGN_SET_KEY, THEME_MODE_KEY } from '@/enums/cacheEnum'
import { defineStore } from 'pinia'
import { store } from '@/store'
import { designSetting } from '@/settings/designSetting'
import { EThemeMode } from '@/enums/appEnum'
import { merge } from 'lodash-es'
import {
  darkTheme as NaiveDarkTheme,
  type GlobalThemeOverrides,
} from 'naive-ui'
import { lighten } from '@/utils/color'
import { setHtmlRootTheme } from '@/logics/theme'
import { Persistent } from '@/utils/storage/persistent'

interface DesignState {
  designSetting: DesignSetting
  light: GlobalThemeOverrides
  dark: GlobalThemeOverrides
}

export const useDesignStore = defineStore({
  id: 'app-design',
  state: (): DesignState => ({
    designSetting: Persistent.getLocal(DESIGN_SET_KEY) || designSetting,
    light: {
      common: {
        bodyColor: '#f5f7f9',
      },
    },
    dark: {},
  }),
  getters: {
    getDesignSetting(state): DesignSetting {
      return state.designSetting
    },
    getThemeMode(state): EThemeMode {
      return state.designSetting.themeMode
    },
    getThemeColor(state): string {
      return state.designSetting.themeColor
    },
    getThemeColorList(state): string[] {
      return state.designSetting.themeColorList
    },
    getDarkTheme(state) {
      return state.designSetting.themeMode === EThemeMode.DARK
        ? NaiveDarkTheme
        : null
    },
    getThemeOverrides(state): GlobalThemeOverrides {
      const { themeMode, themeColor } = state.designSetting
      const isDark = themeMode === EThemeMode.DARK
      const primaryColor = isDark ? lighten(themeColor, 25) : themeColor
      const primaryColorLight = lighten(primaryColor, 6)
      const currentTheme = isDark ? state.dark : state.light
      const base: GlobalThemeOverrides = {
        common: {
          primaryColor: primaryColor,
          primaryColorHover: primaryColorLight,
          primaryColorPressed: primaryColorLight,
          primaryColorSuppl: primaryColor,
        },
        LoadingBar: {
          colorLoading: primaryColor,
        },
      }
      return merge({}, base, currentTheme)
    },
  },
  actions: {
    setDesignSetting(setting: DeepPartial<DesignSetting>): void {
      this.designSetting = merge({}, this.designSetting, setting)

      setHtmlRootTheme(this.getThemeMode)

      localStorage.setItem(THEME_MODE_KEY, this.getThemeMode)
      Persistent.setLocal(DESIGN_SET_KEY, this.designSetting)
    },
  },
})

export function useDesignStoreWithOut() {
  return useDesignStore(store)
}
