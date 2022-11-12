import { computed, unref } from 'vue'
import { useAppSetting } from './useAppSetting'

export const useSiderSetting = () => {
  const { getSiderSetting, setSiderSetting, getIsMobile } = useAppSetting()

  const getSiderCollapsed = computed(() => unref(getSiderSetting).collapsed)
  const getSiderAccordion = computed(() => unref(getSiderSetting).accordion)
  const getSiderWidth = computed(() => unref(getSiderSetting).width)
  const getSiderInverted = computed(() => unref(getSiderSetting).inverted)
  const getSiderMinWidth = computed(() => {
    return unref(getIsMobile) ? 0 : unref(getSiderSetting).minWidth
  })

  const setSiderCollapsed = (collapsed: boolean) => {
    setSiderSetting({
      collapsed,
    })
  }

  const setSiderWidth = (width: number) => {
    setSiderSetting({
      width,
    })
  }

  const setSiderMinWidth = (minWidth: number) => {
    setSiderSetting({
      minWidth,
    })
  }

  const setSiderAccordion = (accordion: boolean) => {
    setSiderSetting({
      accordion,
    })
  }

  const setSiderInverted = (inverted: boolean) => {
    setSiderSetting({ inverted })
  }

  return {
    getSiderCollapsed,
    getSiderAccordion,
    getSiderWidth,
    getSiderMinWidth,
    getSiderInverted,
    setSiderCollapsed,
    setSiderMinWidth,
    setSiderAccordion,
    setSiderWidth,
    setSiderInverted,
  }
}
