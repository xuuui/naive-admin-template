import { type InjectionKey, ref, type Ref, unref } from 'vue'
import { createContext, useContext } from '@/hooks/core/useContext'
import { useRoute } from 'vue-router'
import { ENavMode } from '@/enums/appEnum'
import { useAppSetting } from '../setting/useAppSetting'

export interface LayoutProviderContextProps {
  siderSelectedKey: Ref<string>
  headerSelectedKey: Ref<string>
  setSiderSelectedKey: (val: string) => void
  setHeaderSelectedKey: (val: string) => void
}

const key: InjectionKey<LayoutProviderContextProps> = Symbol()

export function useLayoutProvider() {
  const route = useRoute()
  const { getNavMode } = useAppSetting()

  const getDefHeaderKey = () => {
    if (unref(getNavMode) === ENavMode.HORIZONTAL_MIX) {
      const rootPath = route.matched?.[0]?.path ?? route.path
      return rootPath
    } else {
      return ''
    }
  }

  const siderSelectedKey = ref(route.path || '')
  const headerSelectedKey = ref(getDefHeaderKey() || '')

  const setSiderSelectedKey = (val: string) => {
    siderSelectedKey.value = val
  }
  const setHeaderSelectedKey = (val: string) => {
    headerSelectedKey.value = val
  }

  const context = {
    siderSelectedKey,
    headerSelectedKey,
    setSiderSelectedKey,
    setHeaderSelectedKey,
  }

  return createContext<LayoutProviderContextProps>(context, key, {
    native: true,
  })
}

export function useLayoutInject() {
  return useContext<LayoutProviderContextProps>(key)
}
