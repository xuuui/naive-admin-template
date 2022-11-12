import { type BasicEntityModel } from '../base.model'

export interface UserModel extends BasicEntityModel {
  accountId: string
  nickname: string
  avatar: string
  sex: number
  realname: string
  birthDate: string
  age: number
  remarks: string
}
