import type { PluginOption } from 'vite'
import { viteMockServe } from 'vite-plugin-mock'

export const configMockPlugin = (
  isBuild: boolean,
): PluginOption | PluginOption[] => {
  return viteMockServe({
    ignore: /^\_/,
    mockPath: 'mock',
    localEnabled: !isBuild,
    prodEnabled: isBuild,
    injectCode: `
        import { setupProdMockServer } from '../mock/_createProductionServer';
  
        setupProdMockServer();
        `,
  })
}
