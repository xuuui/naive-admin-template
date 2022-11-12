import { isFunction, isNull, isObject, isUndefined } from 'lodash-es'

const toString = Object.prototype.toString

export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`
}

export function isNullAndUnDef(val: unknown): val is null | undefined {
  return isUndefined(val) && isNull(val)
}

export function isNullOrUnDef(val: unknown): val is null | undefined {
  return isUndefined(val) || isNull(val)
}

export function isPromise<T = any>(val: unknown): val is Promise<T> {
  return (
    is(val, 'Promise') &&
    isObject(val) &&
    isFunction((val as Recordable).then) &&
    isFunction((val as Recordable).catch)
  )
}

export function isWindow(val: any): val is Window {
  return typeof window !== 'undefined' && is(val, 'Window')
}

export const isServer = typeof window === 'undefined'

export const isClient = !isServer

export function isUrl(path: string): boolean {
  const reg =
    /^(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?(\/#\/)?(?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/
  return reg.test(path)
}

export const isPhoneNumber = (value: string) => {
  return /^1[3456789]\d{9}$/.test(value)
}

export function isFullArray(val: unknown): val is any[] {
  return Array.isArray(val) && val.length > 0
}
