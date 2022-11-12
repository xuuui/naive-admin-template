import { defHttp } from '@/utils/http/axios'
import type { RoleModel } from '@/models/sys/role.model'
import { createQueryListParams } from '../helper'
import type { GetListParams, PaginationResult } from '@/models/base.model'
import { EAccountType } from '@/enums/sysEnum'

export type GetRoleListParams = GetListParams & {
  name?: string
  accountType?: EAccountType
  tenantId?: string
}

enum Api {
  QueryList = '/sys/role/queryList',
  CreateOne = '/sys/role/createOne',
  UpdateOne = '/sys/role/updateOne',
  Delete = '/sys/role/delete',
}

export const GET_ROLE_LIST = <T = PaginationResult<RoleModel> | RoleModel[]>({
  limit,
  page,
  sort = [],
  name,
  accountType,
  tenantId,
  dateRange,
}: GetRoleListParams) => {
  const params = createQueryListParams({
    limit,
    page,
    sort,
    dateRange,
    search: { name: { $cont: name }, accountType, tenantId },
  })
  return defHttp.get<T>({
    url: Api.QueryList,
    params: {
      ...params,
    },
  })
}

export const CREATE_ROLE = (params: Recordable) => {
  return defHttp.post<RoleModel>({ url: Api.CreateOne, params })
}

export const UPDATE_ROLE = (params: Recordable) => {
  return defHttp.put<boolean>({ url: Api.UpdateOne, params })
}

export const DELETE_ROLE = (params: Recordable) => {
  return defHttp.delete<boolean>({ url: Api.Delete, params })
}
