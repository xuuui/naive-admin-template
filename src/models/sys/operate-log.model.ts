import { EAccountType, EOpertateType } from '@/enums/sysEnum'
import { type BasicEntityModel } from '../base.model'

export interface OperateLogModel extends BasicEntityModel {
  operateType: EOpertateType
  operateId: string
  operateUsername: string
  operateIp: string
  operateIpAddress: string
  apiPath: string
  operateTime: string
  operateDesc: string
  state: number
  errMsg: string
  accountType: EAccountType
}
