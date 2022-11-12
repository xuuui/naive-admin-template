import { EStorageNamespace } from '@/enums/cacheEnum'
import { type SyncAdapter } from 'lowdb'
import { isNullOrUnDef } from '../is'

export interface StorageOptions {
  namspace: EStorageNamespace
  page: boolean
  user: boolean
  encrypt: boolean
  expire: Nullable<number>
}

export interface StorageItem {
  value: any
  encrypt: boolean
  time: number
  expire: Nullable<number>
}

export class SessionStorage<T> implements SyncAdapter<T> {
  #key: string

  constructor(key: string) {
    this.#key = key
  }

  read(): T | null {
    const value = sessionStorage.getItem(this.#key)

    if (isNullOrUnDef(value)) {
      return value
    }

    return JSON.parse(value) as T
  }

  write(obj: T): void {
    sessionStorage.setItem(this.#key, JSON.stringify(obj))
  }
}

export class LocalStorage<T> implements SyncAdapter<T> {
  #key: string

  constructor(key: string) {
    this.#key = key
  }

  read(): T | null {
    const value = localStorage.getItem(this.#key)

    if (isNullOrUnDef(value)) {
      return value
    }

    return JSON.parse(value) as T
  }

  write(obj: T): void {
    localStorage.setItem(this.#key, JSON.stringify(obj))
  }
}
