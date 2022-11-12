import { defHttp } from '@/utils/http/axios'
import { createQueryListParams } from '../helper'
import type { OperateLogModel } from '@/models/sys/operate-log.model'
import type { GetListParams, PaginationResult } from '@/models/base.model'
import { EAccountType, EOpertateType } from '@/enums/sysEnum'

export type GetOperateLogListParams = GetListParams & {
  operateUsername?: string
  operateType?: EOpertateType
  accountType?: EAccountType
}

enum Api {
  QueryList = '/sys/operate-log/queryList',
}

export const GET_OPERATE_LOG_LIST = <
  T = PaginationResult<OperateLogModel> | OperateLogModel[],
>({
  limit,
  page,
  sort = [],
  operateType,
  operateUsername,
  dateRange,
}: GetOperateLogListParams) => {
  const params = createQueryListParams({
    limit,
    page,
    sort,
    dateRange,
    search: { operateUsername: { $cont: operateUsername }, operateType },
  })
  return defHttp.get<T>({
    url: Api.QueryList,
    params: {
      ...params,
    },
  })
}
