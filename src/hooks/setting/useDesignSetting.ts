import { EThemeMode } from '@/enums/appEnum'
import { useDesignStoreWithOut } from '@/store/modules/design'
import { storeToRefs } from 'pinia'

export const useDesignSetting = () => {
  const designStore = useDesignStoreWithOut()

  const { getThemeMode, getThemeColor, getThemeColorList } =
    storeToRefs(designStore)

  const setThemeMode = (themeMode: EThemeMode) => {
    designStore.setDesignSetting({ themeMode })
  }

  const setThemeColor = (themeColor: string) => {
    designStore.setDesignSetting({ themeColor })
  }

  return {
    getThemeMode,
    getThemeColor,
    getThemeColorList,
    setThemeMode,
    setThemeColor,
  }
}
