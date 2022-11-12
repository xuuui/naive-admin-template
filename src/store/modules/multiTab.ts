import { EXPECTION_NAME, LOGIN_NAME, REDIRECT_NAME } from '@/router/constant'
import type { MultiTab } from '../types'
import {
  findRealRouteByPath,
  transformRouteToMultiTab,
} from '@/utils/helper/routeHelper'
import { EPageRoute } from '@/enums/pageEnum'
import { MULTI_TAB_KEY } from '@/enums/cacheEnum'
import { Persistent } from '@/utils/storage/persistent'
import { defineStore } from 'pinia'
import { router } from '@/router'
import { store } from '@/store'
import { useAppStore } from './app'
import { warn } from '@/utils/log'
import { uniqWith } from 'lodash-es'

interface MultiTabState {
  tabList: MultiTab[]
  cachedTabs: Set<string>
  whiteList: string[]
}

export const useMultiTabStore = defineStore({
  id: 'app-multi-tab',
  state: (): MultiTabState => ({
    tabList: [],
    cachedTabs: new Set(),
    whiteList: [EXPECTION_NAME, LOGIN_NAME, REDIRECT_NAME],
  }),
  getters: {
    getTabList(state) {
      return state.tabList
    },
    getCachedTabList(state): string[] {
      return Array.from(state.cachedTabs)
    },
  },
  actions: {
    initTabs() {
      const { cached } = useAppStore().getMultiTabSetting
      let storageTabList = cached
        ? Persistent.getLocal(MULTI_TAB_KEY) || []
        : []
      const cachedTabNames = storageTabList.map((item) => item.name)
      const routes = router.getRoutes()
      const realHomeRoute = findRealRouteByPath(routes, EPageRoute.BASE_HOME)
      storageTabList = routes
        .filter((route) => {
          const name = route.name as string

          return (
            cachedTabNames.includes(name) && route.name !== realHomeRoute?.name
          )
        })
        .map((item) => transformRouteToMultiTab(item))

      if (realHomeRoute) {
        storageTabList.unshift(transformRouteToMultiTab(realHomeRoute))
      } else {
        warn('未找到首页')
      }
      this.setTabList(storageTabList)
    },
    setTabList(list: MultiTab[]) {
      this.tabList = uniqWith(list, (a, b) => a.fullPath === b.fullPath)
      this.updateCachedTabs()
      this.updateStorage()
    },
    updateCachedTabs() {
      const cacheMap: Set<string> = new Set()

      for (const tab of this.tabList) {
        const needCache = !!tab.meta?.ignoreKeepAlive
        if (needCache) {
          continue
        }
        const name = tab.name
        cacheMap.add(name)
      }
      this.cachedTabs = cacheMap
    },
    updateStorage() {
      const { cached } = useAppStore().getMultiTabSetting
      cached && Persistent.setLocal(MULTI_TAB_KEY, this.tabList)
    },
    addTab(tab: MultiTab) {
      if (this.whiteList.includes(tab.name)) return false
      const isExist = this.tabList.find((item) => item.fullPath == tab.fullPath)
      if (isExist) {
        return
      }

      this.tabList.push(tab)
      this.updateCachedTabs()
      this.updateStorage()
    },
    closeLeftTabs(tab: MultiTab) {
      const index = this.tabList.findIndex(
        (item) => item.fullPath == tab.fullPath,
      )
      this.tabList = this.tabList.filter(
        (item, i) => i >= index || (item?.meta?.affix ?? false),
      )
      this.updateCachedTabs()
      this.updateStorage()
    },
    closeRightTabs(tab: MultiTab) {
      const index = this.tabList.findIndex(
        (item) => item.fullPath == tab.fullPath,
      )
      this.tabList = this.tabList.filter(
        (item, i) => i <= index || (item?.meta?.affix ?? false),
      )
      this.updateCachedTabs()
      this.updateStorage()
    },
    closeOtherTabs(tab: MultiTab) {
      this.tabList = this.tabList.filter(
        (item) => item.fullPath == tab.fullPath || (item?.meta?.affix ?? false),
      )
      this.updateCachedTabs()
      this.updateStorage()
    },
    closeCurrentTab(tab: MultiTab) {
      const index = this.tabList.findIndex(
        (item) => item.fullPath == tab.fullPath,
      )
      this.tabList.splice(index, 1)
      this.updateCachedTabs()
      this.updateStorage()
    },
    closeAllTabs() {
      this.tabList = this.tabList.filter((item) => item?.meta?.affix ?? false)
      this.clearCachedTabs()
      this.updateStorage()
      router.push({ path: EPageRoute.BASE_HOME })
    },
    clearCachedTabs() {
      this.cachedTabs = new Set()
    },
    resetState() {
      this.tabList = []
      this.cachedTabs = new Set()
    },
  },
})

export function useMultiTabStoreWithOut() {
  return useMultiTabStore(store)
}
