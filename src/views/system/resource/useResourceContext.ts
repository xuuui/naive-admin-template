import { type InjectionKey, ref, type Ref } from 'vue'
import { createContext, useContext } from '@/hooks/core/useContext'
import { ResourceModel } from '@/models/sys/resource.model'
import ResourceTree from './ResourceTree.vue'
import { EAccountType } from '@/enums/sysEnum'

export interface ResourceProviderContextProps {
  resourceTreeRef: Ref<InstanceType<typeof ResourceTree>>
  isChange: Ref<boolean>
  accountType: Ref<EAccountType>
  setIsChange: (val: boolean) => void
  curResource: Ref<ResourceModel | Recordable | undefined>
  setAccountType: (val: EAccountType) => void
  setCurResource: (val: ResourceModel | Recordable | undefined) => void
}

const key: InjectionKey<ResourceProviderContextProps> = Symbol()

export function useResourceProvider() {
  const resourceTreeRef = ref()
  const isChange = ref(false)
  const accountType = ref(EAccountType.MANAGE)
  const curResource = ref<ResourceModel | Recordable | undefined>()

  const setIsChange = (val: boolean) => {
    isChange.value = val
  }
  const setCurResource = (val: ResourceModel | Recordable) => {
    curResource.value = val
  }
  const setAccountType = (val: EAccountType) => {
    accountType.value = val
  }

  const context = {
    isChange,
    setIsChange,
    curResource,
    setCurResource,
    resourceTreeRef,
    accountType,
    setAccountType,
  }

  return createContext<ResourceProviderContextProps>(context, key, {
    native: true,
  })
}

export function useResourceInject() {
  return useContext<ResourceProviderContextProps>(key)
}
