import type {
  LoadingBarProviderInst,
  DialogProviderInst,
  MessageProviderInst,
  NotificationProviderInst,
} from 'naive-ui'
import type {
  ComponentRenderProxy,
  VNode,
  VNodeChild,
  ComponentPublicInstance,
  FunctionalComponent,
  PropType as VuePropType,
} from 'vue'

declare global {
  declare interface Window {
    $NDialog: DialogProviderInst
    $NMessage: MessageProviderInst
    $NNotification: NotificationProviderInst
    $NLoadingBar: LoadingBarProviderInst
  }
  const __APP_INFO__: {
    pkg: {
      name: string
      version: string
      dependencies: Recordable<string>
      devDependencies: Recordable<string>
    }
    lastBuildTime: string
  }
  declare type PropType<T> = VuePropType<T>
  declare type VueNode = VNodeChild | JSX.Element
  export type Writable<T> = {
    -readonly [P in keyof T]: T[P]
  }
  declare type Nullable<T> = T | null
  declare type NonNullable<T> = T extends null | undefined ? never : T
  declare type Recordable<T = any> = Record<string, T>
  declare type ReadonlyRecordable<T = any> = {
    readonly [key: string]: T
  }
  declare type Indexable<T = any> = {
    [key: string]: T
  }
  declare type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>
  }
  declare type TimeoutHandle = ReturnType<typeof setTimeout>
  declare type IntervalHandle = ReturnType<typeof setInterval>
  declare interface ChangeEvent extends Event {
    target: HTMLInputElement
  }
  declare interface WheelEvent {
    path?: EventTarget[]
  }
  interface ImportMetaEnv extends ViteEnv {
    __: unknown
  }
  declare interface Fn<T = any, R = T> {
    (...arg: T[]): R
  }
  declare interface PromiseFn<T = any, R = T> {
    (...arg: T[]): Promise<R>
  }
  declare type RefType<T> = T | null
  declare type LabelValueOptions = {
    label: string
    value: any
    [key: string]: string | number | boolean
  }[]
  declare type EmitType = (event: string, ...args: any[]) => void
  declare type TargetContext = '_self' | '_blank'
  declare interface ComponentElRef<T extends HTMLElement = HTMLDivElement> {
    $el: T
  }
  declare type ComponentRef<T extends HTMLElement = HTMLDivElement> =
    ComponentElRef<T> | null
  declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>
  declare function parseInt(s: string | number, radix?: number): number
  declare function parseFloat(string: string | number): number
  namespace JSX {
    type Element = VNode
    type ElementClass = ComponentRenderProxy
    interface ElementAttributesProperty {
      $props: any
    }
    interface IntrinsicElements {
      [elem: string]: any
    }
    interface IntrinsicAttributes {
      [elem: string]: any
    }
  }
}
declare module 'vue' {
  export type JSXComponent<Props = any> =
    | { new (): ComponentPublicInstance<Props> }
    | FunctionalComponent<Props>
}
