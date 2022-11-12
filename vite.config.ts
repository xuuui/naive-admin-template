import type { ConfigEnv, UserConfig } from 'vite'

import { loadEnv } from 'vite'
import dayjs from 'dayjs'
import { resolve } from 'path'
import { createProxy } from './build/vite/proxy'
import { OUTPUT_DIR } from './build/constant'
import { createVitePlugins } from './build/vite/plugin'
import { wrapperEnv } from './build/utils'
import pkg from './package.json'

const pathResolve = (dir: string) => {
  return resolve(process.cwd(), '.', dir)
}

const { dependencies, devDependencies, name, version } = pkg
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
}

export default ({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd()
  const viteEnv = wrapperEnv(loadEnv(mode, root))

  const { VITE_PORT, VITE_PUBLIC_PATH, VITE_PROXY, VITE_DROP_CONSOLE } = viteEnv

  const isBuild = command === 'build'
  return {
    base: VITE_PUBLIC_PATH,
    root,
    resolve: {
      alias: [
        {
          find: '#',
          replacement: pathResolve('types') + '/',
        },
        {
          find: '@',
          replacement: pathResolve('src') + '/',
        },
      ],
    },
    server: {
      host: true,
      port: VITE_PORT,
      proxy: createProxy(VITE_PROXY),
    },
    esbuild: {
      pure: VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : [],
    },
    build: {
      target: 'es2015',
      cssTarget: 'chrome80',
      outDir: OUTPUT_DIR,
      // terserOptions: {
      //   compress: {
      //     keep_infinity: true,
      //     drop_console: VITE_DROP_CONSOLE,
      //   },
      // },
      chunkSizeWarningLimit: 2000,
    },
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
    css: {
      preprocessorOptions: {
        scss: {
          modifyVars: {},
          javascriptEnabled: true,
          additionalData: `@import "src/styles/var.scss";`,
        },
      },
    },
    plugins: createVitePlugins(viteEnv, isBuild),
    optimizeDeps: {
      include: ['lodash-es'],
      exclude: ['vue-demi'],
    },
  }
}
