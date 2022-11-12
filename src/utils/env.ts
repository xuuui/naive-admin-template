import { GlobEnvConfig } from '#/env'
import { warn } from '@/utils/log'
import { getGlobEnvConfigKey } from '../../build/utils'
import pkg from '../../package.json'

export const devMode = 'development'

export const prodMode = 'production'

export function getEnv(): string {
  return import.meta.env.MODE
}

export function isDevMode(): boolean {
  return import.meta.env.DEV
}

export function isProdMode(): boolean {
  return import.meta.env.PROD
}

export function getCommonStoragePrefix() {
  const { VITE_GLOB_APP_SHORT_NAME } = getGlobEnvConfig()
  return `${VITE_GLOB_APP_SHORT_NAME}__${getEnv()}`.toUpperCase()
}

export function getStorageShortName() {
  return `${getCommonStoragePrefix()}${`__${pkg.version}`}__`.toUpperCase()
}

export function getGlobEnvConfig(): GlobEnvConfig {
  const key = getGlobEnvConfigKey(import.meta.env.VITE_GLOB_APP_SHORT_NAME)
  const env = (isDevMode()
    ? import.meta.env
    : window[key]) as unknown as GlobEnvConfig

  const {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_APP_SHORT_NAME,
    VITE_GLOB_API_URL,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_UPLOAD_URL,
    VITE_GLOB_IMG_URL,
    VITE_GLOB_MAP_KEY,
    VITE_GLOB_TENANT_MODE,
  } = env

  if (!/^[a-zA-Z\_]*$/.test(VITE_GLOB_APP_SHORT_NAME)) {
    warn(
      `VITE_GLOB_APP_SHORT_NAME Variables can only be characters/underscores, please modify in the environment variables and re-running.`,
    )
  }

  return {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_GLOB_APP_SHORT_NAME,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_UPLOAD_URL,
    VITE_GLOB_IMG_URL,
    VITE_GLOB_MAP_KEY,
    VITE_GLOB_TENANT_MODE:
      (VITE_GLOB_TENANT_MODE as unknown) === 'true' ? true : false,
  }
}
