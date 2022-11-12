import { EAccountType } from '@/enums/sysEnum'
import { type BasicEntityModel } from '../base.model'
import { type ResourceModel } from './resource.model'

export interface RoleModel extends BasicEntityModel {
  tenantId: string
  name: string
  remarks: string
  accountType: EAccountType
  isSys: number

  resources: ResourceModel[]
}
