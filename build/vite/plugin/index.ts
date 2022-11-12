import { PluginOption } from 'vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import DefineOptions from 'unplugin-vue-define-options/vite'
import purgeIcons from 'vite-plugin-purge-icons'
import { configHtmlPlugin } from './html'
import { configMockPlugin } from './mock'
import { configCompressPlugin } from './compress'
import { configSvgIconsPlugin } from './svgSprite'
import { isReportMode } from '../../utils'
import { configVisualizerConfig } from './visualizer'

export const createVitePlugins = (
  viteEnv: ViteEnv,
  isBuild: boolean,
): PluginOption[] => {
  const {
    VITE_USE_MOCK,
    VITE_BUILD_COMPRESS,
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE,
  } = viteEnv

  const vitePlugins: (PluginOption | PluginOption[])[] = [
    vue(),
    vueJsx(),
    DefineOptions(),
    // 按需引入NaiveUi且自动创建组件声明
    Components({
      dts: './src/components.d.ts',
      resolvers: [NaiveUiResolver()],
    }),
  ]

  // vite-plugin-html
  vitePlugins.push(configHtmlPlugin(viteEnv, isBuild))

  // vite-plugin-svg-icons
  vitePlugins.push(configSvgIconsPlugin(isBuild))

  // vite-plugin-mock
  VITE_USE_MOCK && vitePlugins.push(configMockPlugin(isBuild))

  vitePlugins.push(purgeIcons())

  if (isReportMode()) {
    vitePlugins.push(configVisualizerConfig())
  }

  if (isBuild) {
    // rollup-plugin-gzip
    vitePlugins.push(
      configCompressPlugin(
        VITE_BUILD_COMPRESS,
        VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE,
      ),
    )
  }

  return vitePlugins
}
