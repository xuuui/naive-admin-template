import type { PluginOption } from 'vite'

import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

export function configSvgIconsPlugin(
  isBuild: boolean,
): PluginOption | PluginOption[] {
  const svgIconsPlugin = createSvgIconsPlugin({
    iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
    svgoOptions: isBuild,
    // default
    symbolId: 'icon-[dir]-[name]',
  })
  return svgIconsPlugin
}
