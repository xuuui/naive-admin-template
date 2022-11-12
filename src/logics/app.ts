import type { AppSetting, DesignSetting } from '#/config'
import { designSetting } from '@/settings/designSetting'
import { appSetting } from '@/settings/appSetting'
import { useAppStore } from '@/store/modules/app'
import { useDesignStore } from '@/store/modules/design'
import { merge } from 'lodash-es'

export function initApp() {
  const appStore = useAppStore()
  const designStore = useDesignStore()
  let appSet: AppSetting = appStore.getAppSetting
  let designSet: DesignSetting = designStore.getDesignSetting

  appSet = merge({}, appSetting, appSet, {
    mobileWidth: appSetting.mobileWidth,
    showThemeModeToggle: appSetting.showThemeModeToggle,
    showSetting: appSetting.showSetting,
    permissionMode: appSetting.permissionMode,
    permissionCacheType: appSetting.permissionCacheType,
    useErrorHandle: appSetting.useErrorHandle,
    closeMessageOnSwitch: appSetting.closeMessageOnSwitch,
    removeAllHttpPending: appSetting.removeAllHttpPending,
    multiTabSetting: {
      cached: appSetting.multiTabSetting.cached,
    },
  })
  designSet = merge({}, designSetting, designSet)

  appStore.setAppSetting(appSet)
  designStore.setDesignSetting(designSet)
}

export function loadMapScript(key: string) {
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = `https://map.qq.com/api/gljs?v=1.exp&key=${key}`
  document.body.appendChild(script)
}
