import {
  Persistent,
  type BasicKeys,
  type BasicStore,
} from '@/utils/storage/persistent'
import { EStorageType, UUID_KEY } from '@/enums/cacheEnum'
import { appSetting } from '@/settings/appSetting'
import { TOKEN_KEY } from '@/enums/cacheEnum'

const { permissionCacheType } = appSetting
const isLocal = permissionCacheType === EStorageType.LOCAL

export function setUuid(uuid: string) {
  sessionStorage.setItem(UUID_KEY, uuid)
}

export function getUuid() {
  return sessionStorage.getItem(UUID_KEY)
}

export function getToken() {
  return getAuthCache(TOKEN_KEY)
}

export function getAuthCache<K extends BasicKeys>(key: K) {
  if (isLocal) return Persistent.getLocal(key)
  else return Persistent.getSession(key)
}

export function setAuthCache<K extends BasicKeys>(
  key: K,
  value: BasicStore[K],
) {
  if (isLocal) Persistent.setLocal(key, value)
  else Persistent.setSession(key, value)
}

export function clearAuthCache() {
  const fn = isLocal ? Persistent.clearLocal : Persistent.clearSession
  return fn()
}
