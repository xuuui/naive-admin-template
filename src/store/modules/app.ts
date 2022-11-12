import type {
  HeaderSetting,
  MultiTabSetting,
  AppSetting,
  SiderSetting,
  TransitionSetting,
} from '#/config'

import { APP_SET_KEY } from '@/enums/cacheEnum'
import { defineStore } from 'pinia'
import { store } from '@/store'
import { ENavMode, EPermissionMode } from '@/enums/appEnum'
import { merge } from 'lodash-es'
import { resetRouter } from '@/router'
import { Persistent } from '@/utils/storage/persistent'
import { appSetting } from '@/settings/appSetting'

interface AppState {
  // 应用设置
  appSetting: AppSetting
  // 页面加载
  pageLoading: boolean
}

let pageLoadingTimeId: TimeoutHandle

export const useAppStore = defineStore({
  id: 'app',
  state: (): AppState => ({
    appSetting: Persistent.getLocal(APP_SET_KEY) || appSetting,
    pageLoading: false,
  }),
  getters: {
    getPageLoading(state): boolean {
      return state.pageLoading
    },
    getAppSetting(state): AppSetting {
      return state.appSetting
    },
    getNavMode(state): ENavMode {
      return state.appSetting.navMode
    },
    getIsMobile(state): boolean {
      return state.appSetting.isMobile
    },
    getMobileWidth(state): number {
      return state.appSetting.mobileWidth
    },
    getShowThemeModeToggle(state): boolean {
      return state.appSetting.showThemeModeToggle
    },
    getShowSetting(state): boolean {
      return state.appSetting.showSetting
    },
    getHeaderSetting(state): HeaderSetting {
      return state.appSetting.headerSetting
    },
    getSiderSetting(state): SiderSetting {
      return state.appSetting.siderSetting
    },
    getMultiTabSetting(state): MultiTabSetting {
      return state.appSetting.multiTabSetting
    },
    getTransitionSetting(state): TransitionSetting {
      return state.appSetting.transitionSetting
    },
    getPermissionMode(state): EPermissionMode {
      return state.appSetting.permissionMode
    },
  },
  actions: {
    setPageLoading(pageLoading: boolean) {
      this.pageLoading = pageLoading
    },
    async setPageLoadingAction(pageLoading: boolean) {
      if (pageLoading) {
        clearTimeout(pageLoadingTimeId)
        pageLoadingTimeId = setTimeout(() => {
          this.setPageLoading(pageLoading)
        }, 50)
      } else {
        this.setPageLoading(pageLoading)
        clearTimeout(pageLoadingTimeId)
      }
    },
    setAppSetting(setting: DeepPartial<AppSetting>): void {
      this.appSetting = merge({}, this.appSetting, setting)

      Persistent.setLocal(APP_SET_KEY, this.appSetting)
    },
    async resetState() {
      resetRouter()
    },
  },
})

export function useAppStoreWithOut() {
  return useAppStore(store)
}
