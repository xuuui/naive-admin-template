import { ETransitionName } from '@/enums/appEnum'
import { computed, unref } from 'vue'
import { useAppSetting } from './useAppSetting'

export const useTranstionSetting = () => {
  const { getTransitionSetting, setTransitionSetting } = useAppSetting()

  const getTranstionEnable = computed(() => unref(getTransitionSetting).enable)
  const getTranstionName = computed(
    () => unref(getTransitionSetting).transitionName,
  )

  const setTransitionEnable = (enable: boolean) => {
    setTransitionSetting({ enable })
  }

  const setTransitionName = (transitionName: ETransitionName) => {
    setTransitionSetting({ transitionName })
  }

  return {
    getTranstionEnable,
    getTranstionName,
    setTransitionEnable,
    setTransitionName,
  }
}
