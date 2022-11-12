import { type InjectionKey, toRefs, type UnwrapRef } from 'vue'
import { provide, inject, reactive, readonly as defineReadonly } from 'vue'

export interface CreateContextOptions {
  readonly?: boolean
  createProvider?: boolean
  native?: boolean
}

type ShallowUnwrap<T> = {
  [P in keyof T]: UnwrapRef<T[P]>
}

export function createContext<T extends Object>(
  context: T,
  key: InjectionKey<T> = Symbol(),
  options: CreateContextOptions = {},
) {
  const { readonly = true, createProvider = false, native = false } = options

  const state = reactive(context)
  const provideData = readonly ? defineReadonly(state) : state
  !createProvider && provide(key, native ? context : provideData)

  return {
    ...toRefs(state),
  }
}

export function useContext<T>(
  key: InjectionKey<T> = Symbol(),
  defaultValue?: any,
): T {
  return inject(key, defaultValue || {})
}
