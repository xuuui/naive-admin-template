import { HeaderSetting, SiderSetting, TransitionSetting } from '#/config'
import { ENavMode } from '@/enums/appEnum'
import { useAppStoreWithOut } from '@/store/modules/app'
import { storeToRefs } from 'pinia'
import { computed, unref } from 'vue'

export const useAppSetting = () => {
  const appStore = useAppStoreWithOut()

  const {
    getNavMode,
    getIsMobile,
    getMobileWidth,
    getSiderSetting,
    getHeaderSetting,
    getMultiTabSetting,
    getTransitionSetting,
    getPermissionMode,
    getShowThemeModeToggle,
    getShowSetting,
  } = storeToRefs(appStore)

  const getHeaderMenuShow = computed(() => {
    return (
      unref(getNavMode) === ENavMode.HORIZONTAL ||
      unref(getNavMode) === ENavMode.HORIZONTAL_MIX
    )
  })

  const getSiderMenuShow = computed(() => {
    return (
      unref(getNavMode) === ENavMode.VERTICAL ||
      unref(getNavMode) === ENavMode.HORIZONTAL_MIX
    )
  })

  const getLayoutMode = computed(() => {
    const navMode = unref(getNavMode)
    if (navMode === ENavMode.VERTICAL) {
      return ENavMode.VERTICAL
    } else {
      return ENavMode.HORIZONTAL
    }
  })

  const setIsMobile = (isMobile: boolean) => {
    appStore.setAppSetting({ isMobile })
  }

  const setSiderSetting = (siderSetting: DeepPartial<SiderSetting>): void => {
    appStore.setAppSetting({ siderSetting })
  }

  const setHeaderSetting = (
    headerSetting: DeepPartial<HeaderSetting>,
  ): void => {
    appStore.setAppSetting({ headerSetting })
  }

  const setTransitionSetting = (
    transitionSetting: DeepPartial<TransitionSetting>,
  ): void => {
    appStore.setAppSetting({ transitionSetting })
  }

  const setNavMode = (navMode: ENavMode): void => {
    appStore.setAppSetting({ navMode })
  }

  return {
    getNavMode,
    getIsMobile,
    getMobileWidth,
    getHeaderSetting,
    getSiderSetting,
    getSiderMenuShow,
    getHeaderMenuShow,
    getMultiTabSetting,
    getTransitionSetting,
    getPermissionMode,
    getShowThemeModeToggle,
    getShowSetting,
    getLayoutMode,
    setIsMobile,
    setSiderSetting,
    setHeaderSetting,
    setTransitionSetting,
    setNavMode,
  }
}
