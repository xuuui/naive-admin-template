import type { AppSetting, DesignSetting } from '#/config'

import { createLocalStorage, createSessionStorage } from '@/utils/storage'
import {
  TOKEN_KEY,
  USER_INFO_KEY,
  APP_SET_KEY,
  MULTI_TAB_KEY,
  ROLES_KEY,
  DESIGN_SET_KEY,
  EStorageNamespace,
} from '@/enums/cacheEnum'
import { ERole } from '@/enums/sysEnum'
import { toRaw } from 'vue'
import type { MultiTab } from '@/store/types'
import { type UserInfo } from '@/models/sys/user.model'

export interface BasicStore {
  [TOKEN_KEY]: string | null | undefined
  [USER_INFO_KEY]: Nullable<UserInfo>
  [ROLES_KEY]: ERole[]
  [APP_SET_KEY]: AppSetting
  [DESIGN_SET_KEY]: DesignSetting
  [MULTI_TAB_KEY]: MultiTab[]
}

export type BasicKeys = keyof BasicStore

const ls = createLocalStorage({
  options: {
    namspace: EStorageNamespace.SYS,
  },
})
const ss = createSessionStorage({
  options: {
    namspace: EStorageNamespace.SYS,
  },
})

export class Persistent {
  static getLocal<K extends BasicKeys>(key: K) {
    return ls.get(key) as BasicStore[K]
  }

  static setLocal<K extends BasicKeys>(key: K, value: BasicStore[K]): void {
    ls.set(key, toRaw(value))
  }

  static removeLocal(key: BasicKeys): void {
    ls.remove(key)
  }

  static clearLocal(): void {
    ls.clear()
  }

  static getSession<K extends BasicKeys>(key: K) {
    return ss.get(key) as BasicStore[K]
  }

  static setSession<K extends BasicKeys>(key: K, value: BasicStore[K]): void {
    ss.set(key, toRaw(value))
  }

  static removeSession(key: BasicKeys): void {
    ss.remove(key)
  }
  static clearSession(): void {
    ss.clear()
  }

  static clearAll() {
    ls.clear()
    ss.clear()
  }
}
