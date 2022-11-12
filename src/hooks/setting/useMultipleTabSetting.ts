import { computed, unref } from 'vue'
import { useAppSetting } from './useAppSetting'

export const useMultipleTabSetting = () => {
  const { getMultiTabSetting } = useAppSetting()

  const getMultiTabShow = computed(() => unref(getMultiTabSetting).show)
  const getMultiTabFixed = computed(() => unref(getMultiTabSetting).fixed)

  return {
    getMultiTabShow,
    getMultiTabFixed,
  }
}
