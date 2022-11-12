import type { GlobEnvConfig } from '#/env'

import { GLOB_ENV_CONFIG_FILE_NAME, OUTPUT_DIR } from '../constant'
import fs, { writeFileSync } from 'fs-extra'
import colors from 'picocolors'
import { getGlobEnvConfig, getRootPath, getGlobEnvConfigKey } from '../utils'
import pkg from '../../package.json'

interface CreateGlobEnvConfigParams {
  key: string
  config: Partial<GlobEnvConfig>
  configFileName?: string
}

const createGlobEnvConfig = (params: CreateGlobEnvConfigParams) => {
  const { key, config, configFileName } = params
  try {
    const windowConf = `window.${key}`
    // Ensure that the variable will not be modified
    let configStr = `${windowConf}=${JSON.stringify(config)};`
    configStr += `
       Object.freeze(${windowConf});
       Object.defineProperty(window, "${key}", {
         configurable: false,
         writable: false,
       });
     `.replace(/\s/g, '')

    fs.mkdirp(getRootPath(OUTPUT_DIR))
    writeFileSync(getRootPath(`${OUTPUT_DIR}/${configFileName}`), configStr)

    console.log(
      colors.cyan(`✨ [${pkg.name}]`) +
        ` - configuration file is build successfully:`,
    )
    console.log(
      colors.gray(OUTPUT_DIR + '/' + colors.green(configFileName)) + '\n',
    )
  } catch (error) {
    console.log(
      colors.red(
        'configuration file configuration file failed to package:\n' + error,
      ),
    )
  }
}

export const runBuildGlobEnvConfig = () => {
  const config = getGlobEnvConfig()
  const key = getGlobEnvConfigKey(config.VITE_GLOB_APP_SHORT_NAME)
  createGlobEnvConfig({
    key,
    config,
    configFileName: GLOB_ENV_CONFIG_FILE_NAME,
  })
}
