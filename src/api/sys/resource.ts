import { EAccountType } from '@/enums/sysEnum'
import type { ResourceModel } from '@/models/sys/resource.model'
import { defHttp } from '@/utils/http/axios'

enum Api {
  GetMenuTree = '/sys/resource/getMenuTree',
  GetResourceTree = '/sys/resource/getResourceTree',
  CreateOne = '/sys/resource/createOne',
  UpdateOne = '/sys/resource/updateOne',
  Delete = '/sys/resource/delete',
}

export const GET_MENU_TREE = () => {
  return defHttp.get<ResourceModel[]>({ url: Api.GetMenuTree })
}

export const GET_RESOURCE_TREE = (params: { accountType: EAccountType }) => {
  return defHttp.get<ResourceModel[]>({
    url: Api.GetResourceTree,
    params,
  })
}

export const CREATE_RESOURCE = (params: Recordable) => {
  return defHttp.post<ResourceModel>({ url: Api.CreateOne, params })
}

export const UPDATE_RESOURCE = (params: Recordable) => {
  return defHttp.put<boolean>({ url: Api.UpdateOne, params })
}

export const DELETE_RESOURCE = (params: Recordable) => {
  return defHttp.delete<boolean>({ url: Api.Delete, params })
}
