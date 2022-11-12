import { EAccountType, EResourceType } from '@/enums/sysEnum'
import { type BasicEntityModel } from '../base.model'

export interface ResourceModel extends BasicEntityModel {
  parentId: string | null
  name: string
  title: string
  type: EResourceType
  icon: string
  sort: number
  permission: string
  path: string
  component: string
  isCache: number
  isVisible: number
  state: number
  accountType: EAccountType
  isSys: number
  children: ResourceModel[]
}
