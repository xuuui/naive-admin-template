import type { AppRouteRecordRaw } from '#/router'
import {
  REDIRECT_NAME,
  LAYOUT,
  EXCEPTION_COMPONENT,
  EXPECTION_NAME,
  ROOT_NAME,
  LOGIN_NAME,
} from '@/router/constant'
import { EPageRoute } from '@/enums/pageEnum'

export const ROOT_ROUTE: AppRouteRecordRaw = {
  path: '/',
  name: ROOT_NAME,
  redirect: EPageRoute.BASE_HOME,
  meta: {
    title: 'Root',
  },
}

export const LOGIN_ROUTE: AppRouteRecordRaw = {
  path: '/login',
  name: LOGIN_NAME,
  component: () => import('@/views/sys/login/index.vue'),
  meta: {
    title: '登录',
  },
}

export const EXPECTION_ROUTE: AppRouteRecordRaw = {
  path: '/:path(.*)*',
  name: `${EXPECTION_NAME}Parent`,
  component: LAYOUT,
  meta: {
    title: '错误页面',
    hideBreadcrumb: true,
    hideMenu: true,
  },
  children: [
    {
      path: '/:path(.*)*',
      name: EXPECTION_NAME,
      component: EXCEPTION_COMPONENT,
      meta: {
        title: '错误页面',
        hideBreadcrumb: true,
        hideMenu: true,
      },
    },
  ],
}

export const REDIRECT_ROUTE: AppRouteRecordRaw = {
  path: '/redirect',
  component: LAYOUT,
  name: `${REDIRECT_NAME}Parent`,
  meta: {
    title: `${REDIRECT_NAME}Parent`,
    hideBreadcrumb: true,
    hideMenu: true,
  },
  children: [
    {
      path: '/redirect/:path(.*)',
      name: REDIRECT_NAME,
      component: () => import('@/views/sys/redirect/index.vue'),
      meta: {
        title: REDIRECT_NAME,
        hideBreadcrumb: true,
        hideMenu: true,
      },
    },
  ],
}
