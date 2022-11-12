import { dateUtil } from '@/utils/dateUtil'
import { isFullArray } from '@/utils/is'
import type { CreateQueryParams } from '@nestjsx/crud-request'
import { RequestQueryBuilder } from '@nestjsx/crud-request'
import { merge } from 'lodash-es'

export const createQueryListParams = (
  params: CreateQueryParams & Recordable,
) => {
  const query: CreateQueryParams & Recordable = {
    ...params,
    sort: isFullArray(params.sort) ? params.sort : [],
  }
  if (query?.dateRange?.[0]) {
    merge(query, {
      search: {
        createdAt: {
          $gte: dateUtil(query.dateRange[0])
            .startOf('day')
            .format('YYYY-MM-DD HH:mm:ss'),
        },
      },
    })
  }
  if (query?.dateRange?.[1]) {
    merge(query, {
      search: {
        createdAt: {
          $lte: dateUtil(query.dateRange[1])
            .endOf('day')
            .format('YYYY-MM-DD HH:mm:ss'),
        },
      },
    })
  }
  const qb = RequestQueryBuilder.create(query)
  qb.query()
  return qb.queryObject
}
