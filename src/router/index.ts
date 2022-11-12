import type { App } from 'vue'
import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from 'vue-router'
import { basicRouteNames, basicRoutes } from './routes'
import { setupRouterGuard } from './guard'

// 白名单应该包含基本静态路由

export const router = createRouter({
  // 创建一个 hash 历史记录。
  history: createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH),
  // 应该添加到路由的初始路由列表。
  routes: [...basicRoutes] as unknown as RouteRecordRaw[],
  // 是否应该禁止尾部斜杠。默认为假
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

export function resetRouter() {
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !basicRouteNames.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export const setupRouter = async (app: App<Element>) => {
  app.use(router)
  setupRouterGuard(router)
  await router.isReady()
}
