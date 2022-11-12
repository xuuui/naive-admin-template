import { computed, unref } from 'vue'
import { useAppSetting } from './useAppSetting'

export const useHeaderSetting = () => {
  const { getHeaderSetting, setHeaderSetting } = useAppSetting()

  const getHeaderFixed = computed(() => unref(getHeaderSetting).fixed)
  const getHeaderInverted = computed(() => unref(getHeaderSetting).inverted)

  const getBreadcrumbShow = computed(() => unref(getHeaderSetting).crumb.show)
  const getBreadcrumbIconShow = computed(
    () => unref(getHeaderSetting).crumb.showIcon,
  )

  const setHeaderFixed = (fixed: boolean) => {
    setHeaderSetting({ fixed })
  }

  const setHeaderInverted = (inverted: boolean) => {
    setHeaderSetting({ inverted })
  }

  const setBreadcrumbShow = (show: boolean) => {
    setHeaderSetting({ crumb: { show } })
  }

  const setBreadcrumbIconShow = (showIcon: boolean) => {
    setHeaderSetting({ crumb: { showIcon } })
  }

  return {
    getHeaderFixed,
    getHeaderInverted,
    getBreadcrumbShow,
    getBreadcrumbIconShow,
    setHeaderFixed,
    setHeaderInverted,
    setBreadcrumbShow,
    setBreadcrumbIconShow,
  }
}
