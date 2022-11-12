import { EStorageType } from '@/enums/cacheEnum'
import { createStorage, CreateStorageOptions } from './storage'

export const createSessionStorage = (
  options: Partial<CreateStorageOptions> = {},
) => {
  return createStorage({
    ...options,
    storageType: EStorageType.SESSION,
  })
}

export const createLocalStorage = (
  options: Partial<CreateStorageOptions> = {},
) => {
  return createStorage({
    ...options,
    storageType: EStorageType.LOCAL,
  })
}

export const sessionStorage = createSessionStorage()
export const localStorage = createLocalStorage()
