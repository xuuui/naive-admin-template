import type { AppRouteRecordRaw } from '#/router'

const routeName = 'Home'

const routes: Array<AppRouteRecordRaw> = [
  {
    path: '/home',
    name: `${routeName}`,
    component: '/sys/home/index',
    meta: {
      title: '工作台',
      icon: 'ion:grid-outline',
      ignoreKeepAlive: true,
    },
  },
]

export default routes
