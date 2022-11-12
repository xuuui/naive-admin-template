import { EDictType } from '@/enums/sysEnum'
import { type BasicEntityModel } from '../base.model'

export interface DictModel extends BasicEntityModel {
  parentId: number
  code: string
  label: string
  value: string | number
  type: EDictType
  remarks: string
  isSys: number
  items: DictModel[]
}
