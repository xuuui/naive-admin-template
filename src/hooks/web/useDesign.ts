import { computed, unref } from 'vue'
import { useAppInject } from '../core/useAppContext'

export const useDesign = (scope: string) => {
  const { prefixCls } = useAppInject()

  const getPrefixCls = computed(() => {
    return `${unref(prefixCls)}-${scope}`
  })

  return {
    prefixVar: unref(prefixCls),
    getPrefixCls: unref(getPrefixCls),
  }
}
