export enum ERole {}

export enum EAccountType {
  MANAGE = 'manage',
  CLIENT = 'client',
  TENANT = 'tenant',
}

export enum EResourceType {
  ROUTE = 'route',
  MENU = 'menu',
  BUTTON = 'button',
}

export enum EDictType {
  DICT = 'dict',
  DICT_ITEM = 'dict_item',
}

export const HTTP_HEADER_TOKEN = 'HTTP-ACCESS-TOKEN'

export type PermissionAction = 'add' | 'view' | 'edit' | 'del'

export enum EOpertateType {
  LOGIN = 'login',
  EXIT = 'exit',
  VIEW = 'view',
  ADD = 'add',
  EDIT = 'edit',
  DEL = 'del',
  OTHER = 'other',
}

export enum EBalanceChangeType {
  INCOME = 1,
  EXPEND = 2,
}
