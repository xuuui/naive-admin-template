export const REDIRECT_NAME = 'Redirect'
export const ROOT_NAME = 'Root'
export const LOGIN_NAME = 'Login'
export const PARENT_LAYOUT_NAME = 'ParentLayout'
export const EXPECTION_NAME = 'Expection'

export const LAYOUT = () => import('@/layout/index.vue')
export const EXCEPTION_COMPONENT = () =>
  import('@/views/sys/exception/index.vue')
export const IFRAME = () => import('@/views/sys/iframe/index.vue')

export const getParentLayout = () => {
  return () =>
    new Promise((resolve) => {
      resolve({
        name: PARENT_LAYOUT_NAME,
      })
    })
}
