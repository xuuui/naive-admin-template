import { EAccountType } from '@/enums/sysEnum'
import type { GetListParams, PaginationResult } from '@/models/base.model'
import type { AccountModel } from '@/models/sys/account.model'
import { defHttp } from '@/utils/http/axios'
import { createQueryListParams } from '../helper'

export type GetAccountListParams = GetListParams & {
  username?: string
  state?: number
  mobile?: string
  accountType?: EAccountType
  user?: {
    nickname?: string
    sex?: string
    realname?: string
  }
  tenantId?: string
}

enum Api {
  QueryList = '/sys/account/queryList',
  CreateAdmin = '/sys/account/createAdmin',
  UpdateAdmin = '/sys/account/updateAdmin',
  CreateClient = '/sys/account/createClient',
  UpdateClient = '/sys/account/updateClient',
  Delete = '/sys/account/delete',
}

export const GET_ACCOUNT_LIST = ({
  limit,
  page,
  sort = [],
  username,
  user,
  mobile,
  state,
  tenantId,
  accountType,
  dateRange,
}: GetAccountListParams) => {
  const search: Recordable = {
    username: { $cont: username },
    mobile: { $cont: mobile },
    accountType,
    state,
    tenantId,
  }

  const params = createQueryListParams({
    limit,
    page,
    sort,
    search,
    dateRange,
  })
  return defHttp.get<PaginationResult<AccountModel> | AccountModel[]>({
    url: Api.QueryList,
    params: {
      ...params,
      user,
    },
  })
}

export const CREATE_ADMIN_ACCOUNT = (params: Recordable) => {
  return defHttp.post<AccountModel>({ url: Api.CreateAdmin, params })
}

export const UPDATE_ADMIN_ACCOUNT = (params: Recordable) => {
  return defHttp.put<boolean>({ url: Api.UpdateAdmin, params })
}

export const CREATE_CLIENT_ACCOUNT = (params: Recordable) => {
  return defHttp.post<AccountModel>({ url: Api.CreateClient, params })
}

export const UPDATE_CLIENT_ACCOUNT = (params: Recordable) => {
  return defHttp.put<boolean>({ url: Api.UpdateClient, params })
}

export const DELETE_ACCOUNT = (params: Recordable) => {
  return defHttp.delete<boolean>({ url: Api.Delete, params })
}
