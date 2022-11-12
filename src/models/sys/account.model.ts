import { EAccountType } from '@/enums/sysEnum'
import { type BasicEntityModel } from '../base.model'
import { type RoleModel } from './role.model'
import { type UserModel } from './user.model'

export interface AccountIdentityModel extends BasicEntityModel {
  accountId: string
  isSuperAdmin: number
}

export interface AccountModel extends BasicEntityModel {
  tenantId: string
  username: string
  mobile: string
  state: number
  remarks: string
  accountType: EAccountType
  isSys: number

  roles?: RoleModel
  identity?: AccountIdentityModel
  user?: UserModel
  isSubscribeGzh?: number
}
