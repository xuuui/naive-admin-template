export interface BasicEntityModel {
  id: string
  createdAt?: string
  updatedAt?: string
  deletedAt?: string
}

export type PaginationResult<T> = {
  result: T[]
  count: number
  total: number
  limit: number
  page: number
  pageCount: number
}

export interface PaginationParams {
  limit?: number
  page?: number
  sort?: any[]
}

export type GetListParams = PaginationParams & {
  dateRange?: string[]
}
