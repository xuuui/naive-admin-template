<template>
  <n-config-provider
    :locale="zhCN"
    :theme="getDarkTheme"
    :theme-overrides="getThemeOverrides"
    :date-locale="dateZhCN"
    abstract
  >
    <n-el id="app-el" ref="appElRef" class="h-full w-full">
      <naive-provider>
        <slot></slot>
      </naive-provider>
    </n-el>
  </n-config-provider>
</template>

<script lang="ts" setup>
  import { zhCN, dateZhCN, NEl } from 'naive-ui'
  import { useTheme } from '@/hooks/web/useTheme'
  import { useAppProvider } from '@/hooks/core/useAppContext'
  import {
    useEventListener,
    useMutationObserver,
    useWindowSize,
  } from '@vueuse/core'
  import { nextTick, onMounted, ref, unref } from 'vue'
  import { NaiveProvider } from './NaiveProvider'
  import { syncNaiveElToHtml } from '@/logics/theme'
  import { useAppSetting } from '@/hooks/setting/useAppSetting'

  defineOptions({ name: 'AppProvider' })

  const { getDarkTheme, getThemeOverrides } = useTheme()

  useAppProvider()

  let oldCssText = ''

  const appElRef = ref<InstanceType<typeof NEl>>()
  const { getMobileWidth, setIsMobile } = useAppSetting()
  const { width: windowWidth } = useWindowSize()

  //判断是否触发移动端模式
  const checkIsMobile = () => {
    const isMobile = unref(windowWidth) <= unref(getMobileWidth)
    setIsMobile(isMobile)
  }

  useEventListener(window, 'resize', checkIsMobile)

  useMutationObserver(
    appElRef,
    (mutations) => {
      const attributeNames = mutations.map((item) => item.attributeName)
      if (attributeNames.includes('style')) {
        const el = unref(appElRef)?.$el
        const cssText = el?.style?.cssText || ''
        if (oldCssText !== cssText) {
          oldCssText = cssText
          syncNaiveElToHtml(cssText)
        }
      }
    },
    {
      attributes: true,
    },
  )

  onMounted(async () => {
    await nextTick()
    syncNaiveElToHtml()
  })
</script>
