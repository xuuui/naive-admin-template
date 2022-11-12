import { EStorageNamespace, EStorageType, UUID_KEY } from '@/enums/cacheEnum'
import { router } from '@/router'
import { defaultCacheTime } from '@/settings'
import {
  cacheCipher,
  enableStorageEncryption,
} from '@/settings/encryptionSetting'
import { get, merge, omit, set } from 'lodash-es'
import { LowSync } from 'lowdb'
import { unref } from 'vue'
import { getUuid } from '../auth'
import { AesEncryption, type EncryptionParams } from '../cipher'
import { getStorageShortName } from '../env'
import { isNullOrUnDef } from '../is'
import {
  LocalStorage,
  SessionStorage,
  type StorageItem,
  type StorageOptions,
} from './types'

export interface CreateStorageOptions extends EncryptionParams {
  options?: Partial<StorageOptions>
  prefixKey: string
  storageType: EStorageType
}

export class Storage {
  private options: StorageOptions = {
    namspace: EStorageNamespace.BASE,
    user: false,
    page: false,
    expire: null,
    encrypt: false,
  }
  private db!: LowSync<Object>
  private encryption: AesEncryption

  constructor({
    options,
    prefixKey = '',
    storageType = EStorageType.LOCAL,
    key = cacheCipher.key,
    iv = cacheCipher.iv,
  }: Partial<CreateStorageOptions> = {}) {
    if (options) {
      this.options = merge({}, this.options, options)
    }
    if (
      this.options.encrypt &&
      [key.length, iv.length].some((item) => item !== 16)
    ) {
      throw new Error('When isEncrypt is true, the key or iv must be 16 bits!')
    }
    this.encryption = new AesEncryption({ key, iv })
    this.init(storageType, prefixKey)
  }

  getAdapter(storageType: EStorageType, prefixKey = '') {
    switch (storageType) {
      case EStorageType.LOCAL:
        return new LocalStorage<Object>(prefixKey)
      case EStorageType.SESSION:
        return new SessionStorage<Object>(prefixKey)
      default:
        return new LocalStorage<Object>(prefixKey)
    }
  }

  init(storageType: EStorageType, prefixKey = '') {
    this.db = new LowSync(this.getAdapter(storageType, prefixKey))
    this.db.read()
    if (!this.db.data) {
      this.db.data = {}
      this.db.write()
    }
  }

  getCurrentOptions(options: Partial<StorageOptions> = {}) {
    return merge({}, this.options, options)
  }

  getUserId() {
    // return cookies.get('uuid') || 'ghost-uuid'
    return getUuid()
  }

  getPath(path: string, options: Partial<StorageOptions> = {}) {
    options = this.getCurrentOptions(options)
    const { namspace, user, page } = options

    const userId = this.getUserId()
    const { fullPath } = unref(router.currentRoute)
    const currentPath =
      `${namspace}.${user ? `user.${userId}` : 'public'}` +
      (page && fullPath ? `.$page.${fullPath}` : '') +
      (path ? `.${path}` : '')

    return currentPath
  }

  encrypt(value: any): string {
    return this.encryption.encryptByAES(
      JSON.stringify({
        encryptValue: value,
      }),
    )
  }

  decrypt(str: string): any {
    return JSON.parse(this.encryption.decryptByAES(str)).encryptValue
  }

  set(path: string, value: any, options: Partial<StorageOptions> = {}) {
    this.db.read()
    options = this.getCurrentOptions(options)

    if (!value) {
      this.remove(path, options)
      return
    }
    const { encrypt, expire } = options
    const storageItem: StorageItem = {
      value,
      encrypt: encrypt!,
      time: Date.now(),
      expire: !isNullOrUnDef(expire)
        ? new Date().getTime() + expire * 1000
        : null,
    }

    if (storageItem.encrypt) {
      storageItem.value = this.encrypt(storageItem.value)
    }
    set(this.db.data!, this.getPath(path, options), storageItem)
    this.db.write()
  }

  get(path: string, options: Partial<StorageOptions> = {}, defaultValue?: any) {
    this.db.read()
    options = this.getCurrentOptions(options)

    const storageItem: StorageItem =
      get(this.db.data!, this.getPath(path, options)) || {}

    if (!storageItem.value) return defaultValue || storageItem.value

    if (storageItem.encrypt) {
      storageItem.value = this.decrypt(storageItem.value)
    }

    const { value, expire } = storageItem
    if (isNullOrUnDef(expire) || expire >= new Date().getTime()) {
      return value
    } else {
      this.remove(path, options)
      return null
    }
  }

  remove(path: string, options: Partial<StorageOptions> = {}) {
    this.db.read()
    options = this.getCurrentOptions(options)

    const pathArr = this.getPath(path, options).split('.')
    const attr = pathArr.pop()!
    const parentPath = pathArr.join('.')
    const obj = get(this.db.data!, parentPath)
    set(this.db.data!, parentPath, omit(obj, attr))
    this.db.write()
  }

  clear(namespace: EStorageNamespace = this.options.namspace) {
    this.db.read()
    this.db.data![namespace] = {}
    this.db.write()
  }
}

const createDefaultOptions = (
  options: Partial<CreateStorageOptions> = {},
): Partial<CreateStorageOptions> => {
  return {
    options: {
      encrypt: enableStorageEncryption,
      expire: defaultCacheTime,
    },
    prefixKey: getStorageShortName(),
    ...options,
  }
}

export function createStorage(options: Partial<CreateStorageOptions> = {}) {
  return new Storage(createDefaultOptions(options))
}
