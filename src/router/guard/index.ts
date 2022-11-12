import type { Router } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'
import { AxiosCanceler } from '@/utils/http/axios/axiosCancel'
import { createPermissionGuard } from './permissionGuard'
import { createStateGuard } from './stateGuard'
import { createMenuParamPathGuard } from './menuParamPathGuard'
import { useWeb } from '@/hooks/web/useWeb'
import { useMultiTabStore } from '@/store/modules/multiTab'

export function setupRouterGuard(router: Router) {
  createPageGuard(router)
  createPageLoadingGuard(router)
  createHttpGuard(router)
  createMessageGuard(router)
  createProgressGuard(router)
  createPermissionGuard(router)
  createMenuParamPathGuard(router)
  createStateGuard(router)
}

function createPageGuard(router: Router) {
  const loadedPageMap = new Map<string, boolean>()

  router.beforeEach(async (to) => {
    const multiTabStore = useMultiTabStore()
    to.meta.loaded =
      !!loadedPageMap.get(to.path) &&
      !!multiTabStore.getTabList.find((item) => item.fullPath === to.path)
    return true
  })

  router.afterEach((to) => {
    loadedPageMap.set(to.path, true)
  })
}

function createPageLoadingGuard(router: Router) {
  router.beforeEach(async (to) => {
    const userStore = useUserStore()
    const appStore = useAppStore()
    const { openPageLoading } = appStore.getTransitionSetting

    if (!userStore.isLogin || to.meta?.loaded) {
      return
    }

    if (openPageLoading) {
      appStore.setPageLoadingAction(true)
      return
    }

    return
  })
  router.afterEach(async () => {
    const appStore = useAppStore()
    const { openPageLoading } = appStore.getTransitionSetting

    if (openPageLoading) {
      setTimeout(() => {
        appStore.setPageLoading(false)
      }, 220)
    }
    return
  })
}

function createHttpGuard(router: Router) {
  router.beforeEach(async () => {
    const appStore = useAppStore()
    const { removeAllHttpPending } = appStore.getAppSetting

    if (removeAllHttpPending) {
      const axiosCanceler = new AxiosCanceler()
      axiosCanceler?.removeAllPending()
    }

    return
  })
}

export function createMessageGuard(router: Router) {
  const appStore = useAppStore()
  const { closeMessageOnSwitch } = appStore.getAppSetting

  router.beforeEach(async () => {
    const { dialog, notification } = useWeb()

    if (closeMessageOnSwitch) {
      dialog.destroyAll()
      notification.destroyAll()
    }

    return
  })
}

export function createProgressGuard(router: Router) {
  router.beforeEach(async (to) => {
    const appStore = useAppStore()
    const { openProgress } = appStore.getTransitionSetting
    const { loadingBar } = useWeb()

    if (to.meta?.loaded) {
      return
    }
    openProgress && loadingBar.start()
    return
  })

  router.afterEach(async () => {
    const appStore = useAppStore()
    const { openProgress } = appStore.getTransitionSetting
    const { loadingBar } = useWeb()

    openProgress && loadingBar.finish()
    return
  })
}
