import type { PluginOption } from 'vite'

import { createHtmlPlugin } from 'vite-plugin-html'
import pkg from '../../../package.json'
import { GLOB_ENV_CONFIG_FILE_NAME } from '../../constant'

export const configHtmlPlugin = (
  env: ViteEnv,
  isBuild: boolean,
): PluginOption | PluginOption[] => {
  const { VITE_GLOB_APP_TITLE, VITE_PUBLIC_PATH } = env

  const path = VITE_PUBLIC_PATH.endsWith('/')
    ? VITE_PUBLIC_PATH
    : `${VITE_PUBLIC_PATH}/`

  const getAppConfigSrc = () => {
    return `${path || '/'}${GLOB_ENV_CONFIG_FILE_NAME}?v=${
      pkg.version
    }-${new Date().getTime()}`
  }

  const htmlPlugin: PluginOption[] = createHtmlPlugin({
    minify: isBuild,
    inject: {
      data: {
        title: VITE_GLOB_APP_TITLE,
      },
      tags: isBuild
        ? [
            {
              tag: 'script',
              attrs: {
                src: getAppConfigSrc(),
              },
            },
          ]
        : [],
    },
  })
  return htmlPlugin
}
