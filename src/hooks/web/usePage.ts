import { EPageRoute } from '@/enums/pageEnum'
import { REDIRECT_NAME } from '@/router/constant'
import {
  useRoute,
  useRouter,
  type RouteLocationRaw,
  type Router,
} from 'vue-router'
import { isString } from 'lodash-es'

export type PathAsPageEnum<T> = T extends { path: string }
  ? T & { path: EPageRoute }
  : T
export type RouteLocationRawEx = PathAsPageEnum<RouteLocationRaw>

const handleError = (e: Error) => {
  console.error(e)
}

// 页面切换
export const useGo = (_router?: Router) => {
  const router = _router ? _router : useRouter()
  const { push, replace } = router
  function go(
    opt: RouteLocationRawEx = EPageRoute.BASE_HOME,
    isReplace = false,
  ) {
    if (!opt) {
      return
    }
    if (isString(opt)) {
      isReplace ? replace(opt).catch(handleError) : push(opt).catch(handleError)
    } else {
      const o = opt as RouteLocationRaw
      isReplace ? replace(o).catch(handleError) : push(o).catch(handleError)
    }
  }
  return go
}

// 重做当前页面
export const useRedo = (_router?: Router) => {
  const router = _router ? _router : useRouter()
  const { push } = router
  const route = useRoute()

  function redo(
    options: { name?: string; fullPath?: string } = {},
  ): Promise<boolean> {
    const { query, params = {} } = route
    const name = options.name
    const fullPath = options.fullPath || route.fullPath
    return new Promise((resolve) => {
      if (name === REDIRECT_NAME) {
        resolve(false)
        return
      }
      if (name) {
        params['_redirect_type'] = 'name'
        params['path'] = String(name)
      } else {
        params['_redirect_type'] = 'path'
        params['path'] = fullPath!
      }
      push({ name: REDIRECT_NAME, params, query }).then(() => resolve(true))
    })
  }
  return redo
}
