import type { ErrorMessageMode } from '@/utils/http/axios/types'
import { defHttp } from '@/utils/http/axios'
import type { AccountModel } from '@/models/sys/account.model'
import { EAccountType } from '@/enums/sysEnum'

export interface LoginParams {
  username: string
  password: string
  accountType: EAccountType
  captcha: string
  random: string
}

export interface LoginResult {
  token: string
  account: AccountModel
}

enum Api {
  Login = '/sys/auth/adminLogin',
  GetLoginAccount = '/sys/auth/getLoginAccount',
  GetPermCode = '/sys/resource/getPermCodeList',
}

export function LOGIN(params: LoginParams, mode: ErrorMessageMode = 'dialog') {
  return defHttp.post<LoginResult>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    },
  )
}

export function GET_LOGIN_ACCOUNT() {
  return defHttp.get<AccountModel>(
    { url: Api.GetLoginAccount },
    { errorMessageMode: 'none' },
  )
}

export function GET_PERM_CODE() {
  return defHttp.get<string[]>({ url: Api.GetPermCode })
}
