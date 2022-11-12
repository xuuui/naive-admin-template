import type { Router } from 'vue-router'
import { usePermissionStore } from '@/store/modules/permission'
import { EPageRoute } from '@/enums/pageEnum'
import { useUserStore } from '@/store/modules/user'
import { EXPECTION_ROUTE } from '@/router/routes/basic'
import { basicRouteNames } from '../routes'

const LOGIN_PATH = EPageRoute.BASE_LOGIN

export function createPermissionGuard(router: Router) {
  router.beforeEach(async (to, from) => {
    const userStore = useUserStore()
    const permissionStore = usePermissionStore()

    if (basicRouteNames.includes(to.name as string)) {
      if (to.path === LOGIN_PATH && userStore.isLogin) {
        const isSessionTimeout = userStore.getSessionTimeout
        try {
          await userStore.afterLoginAction()
          if (!isSessionTimeout) {
            return (to.query?.redirect as string) || EPageRoute.BASE_HOME
          }
        } catch {}
      }
      return
    }

    if (!userStore.isLogin) {
      if (to.meta?.ignoreAuth) {
        return
      }

      const redirectInfo: Recordable = {
        path: LOGIN_PATH,
        replace: true,
      }
      if (to.path) {
        redirectInfo.query = {
          redirect: to.path,
        }
      }
      return redirectInfo
    }

    if (
      from.path === LOGIN_PATH &&
      to.name === EXPECTION_ROUTE.name &&
      to.fullPath !== EPageRoute.BASE_HOME
    ) {
      return EPageRoute.BASE_HOME
    }

    if (userStore.getLastUpdateTime === 0) {
      try {
        await userStore.getUserInfoAction()
      } catch (err) {
        return
      }
    }

    if (permissionStore.getIsDynamicAddedRoute) {
      return
    }

    await permissionStore.buildRoutesAction()

    if (to.name === EXPECTION_ROUTE.name) {
      // 动态添加路由后，此处应当重定向到fullPath，否则会加载404页面内容
      return { path: to.fullPath, replace: true, query: to.query }
    } else {
      const redirectPath = (from.query.redirect || to.path) as string
      const redirect = decodeURIComponent(redirectPath)
      const nextInfo =
        to.path === redirect ? { ...to, replace: true } : { path: redirect }
      return nextInfo
    }
  })
}
