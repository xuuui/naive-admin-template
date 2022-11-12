import { isDevMode } from '@/utils/env'

export const cacheCipher = {
  key: '_11111000001111@',
  iv: '@11111000001111_',
}

// 是否加密缓存
export const enableStorageEncryption = !isDevMode()
