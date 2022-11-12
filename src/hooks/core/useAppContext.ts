import { type InjectionKey, ref, type Ref } from 'vue'
import { createContext, useContext } from '@/hooks/core/useContext'
import { prefixCls as defPrefixCls } from '@/settings/designSetting'

export interface AppProviderContextProps {
  prefixCls: Ref<string>
  layoutContentHeight: Ref<number>
  showSettingDrawer: Ref<boolean>
  setShowSettingDrawer: (val: boolean) => void
  setLayoutContentHeight: (val: number) => void
}

const key: InjectionKey<AppProviderContextProps> = Symbol()

export function useAppProvider() {
  const prefixCls = ref(defPrefixCls)
  const layoutContentHeight = ref(0)
  const showSettingDrawer = ref(false)

  const setShowSettingDrawer = (value: boolean) => {
    showSettingDrawer.value = value
  }

  const setLayoutContentHeight = (value: number) => {
    layoutContentHeight.value = value
  }

  const context = {
    prefixCls,
    showSettingDrawer,
    setShowSettingDrawer,
    layoutContentHeight,
    setLayoutContentHeight,
  }

  return createContext<AppProviderContextProps>(context, key, {
    native: true,
    readonly: true,
  })
}

export function useAppInject() {
  return useContext<AppProviderContextProps>(key)
}
