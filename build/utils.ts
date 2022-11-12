import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { GlobEnvConfig } from '#/env'

export function isReportMode(): boolean {
  return process.env.REPORT === 'true'
}

// 读取所有环境变量配置文件到process.env
export function wrapperEnv(env: Recordable): ViteEnv {
  let ret: Recordable = {}
  for (const envName of Object.keys(env)) {
    let realName = env[envName].replace(/\\n/g, '\n')
    realName =
      realName === 'true' ? true : realName === 'false' ? false : realName

    if (envName === 'VITE_PORT') {
      realName = Number(realName)
    }

    if (envName === 'VITE_PROXY' && realName) {
      try {
        realName = JSON.parse(realName.replace(/'/g, '"'))
      } catch (error) {
        realName = ''
      }
    }
    ret[envName] = realName
    if (typeof realName === 'string') {
      process.env[envName] = realName
    } else if (typeof realName === 'object') {
      process.env[envName] = JSON.stringify(realName)
    }
  }
  return ret as ViteEnv
}

/**
 * 获取当前环境下生效的配置文件名
 */
function getEnvFiles() {
  const script = process.env.npm_lifecycle_script
  const reg = new RegExp('--mode ([a-z_\\d]+)')
  const result = reg.exec(script as string) as any
  if (result) {
    const mode = result[1] as string
    return ['.env', `.env.${mode}`]
  }
  return ['.env', '.env.production']
}

export const getGlobEnvConfigKey = (shortName: string) => {
  return `__PRODUCTION__${shortName || 'APP'}__CONF__`
    .toUpperCase()
    .replace(/\s/g, '')
}

export function getGlobEnvConfig(
  match = 'VITE_GLOB_',
  confFiles = getEnvFiles(),
): GlobEnvConfig {
  let envConfig: Recordable = {}
  confFiles.forEach((item) => {
    try {
      const env = dotenv.parse(
        fs.readFileSync(path.resolve(process.cwd(), item)),
      )
      envConfig = { ...envConfig, ...env }
    } catch (e) {
      console.error(`Error in parsing ${item}`, e)
    }
  })
  const reg = new RegExp(`^(${match})`)
  Object.keys(envConfig).forEach((key) => {
    if (!reg.test(key)) {
      Reflect.deleteProperty(envConfig, key)
    }
  })
  return envConfig as GlobEnvConfig
}

export function getRootPath(...dir: string[]) {
  return path.resolve(process.cwd(), ...dir)
}
