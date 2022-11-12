import { useThemeVars } from 'naive-ui'
import { useDesignStoreWithOut } from '@/store/modules/design'
import { storeToRefs } from 'pinia'

export const useTheme = () => {
  const designStore = useDesignStoreWithOut()
  const { getDarkTheme, getThemeOverrides } = storeToRefs(designStore)

  const getInvertedHoverSty = (inverted: boolean) => {
    if (inverted) {
      return {
        '--hover-color': 'rgba(255, 255, 255, 0.09)',
      }
    }
    return {}
  }

  return {
    themeVars: useThemeVars(),
    getDarkTheme,
    getThemeOverrides,
    getInvertedHoverSty,
  }
}
