import { defHttp } from '@/utils/http/axios'
import type { DictModel } from '@/models/sys/dict.model'
import { createQueryListParams } from '../helper'
import type { GetListParams, PaginationResult } from '@/models/base.model'
import { EDictType } from '@/enums/sysEnum'

export type GetDictListParams = GetListParams & {
  type: EDictType
  parentId?: string
  label?: string
}

enum Api {
  QueryList = '/sys/dict/queryList',
  GetItemsByCode = '/sys/dict/getItemsByCode',
  CreateOne = '/sys/dict/createOne',
  UpdateOne = '/sys/dict/updateOne',
  Delete = '/sys/dict/delete',
}

export const GET_DICT_LIST = ({
  limit,
  page,
  sort = [],
  type,
  parentId,
  label,
  dateRange,
}: GetDictListParams) => {
  const params = createQueryListParams({
    limit,
    page,
    sort,
    search: {
      type,
      parentId,
      label: { $cont: label },
    },
    dateRange,
  })
  return defHttp.get<PaginationResult<DictModel> | DictModel[]>({
    url: Api.QueryList,
    params: {
      ...params,
    },
  })
}

export const GET_ITEMS_BY_CODE = (params: Recordable) => {
  return defHttp.get<DictModel>({ url: Api.GetItemsByCode, params })
}

export const CREATE_DICT = (params: Recordable) => {
  return defHttp.post<DictModel>({ url: Api.CreateOne, params })
}

export const UPDATE_DICT = (params: Recordable) => {
  return defHttp.put<boolean>({ url: Api.UpdateOne, params })
}

export const DELETE_DICT = (params: Recordable) => {
  return defHttp.delete<boolean>({ url: Api.Delete, params })
}
