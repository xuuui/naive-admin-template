<template>
  <NLayout
    :class="getPrefixCls"
    :content-style="getLayoutsContentSty"
    position="absolute"
    :native-scrollbar="false"
    has-sider
    :scrollbar-props="{
      trigger: 'none',
    }"
  >
    <AppLayout
      :mode="getLayoutMode"
      :is-mobile="getIsMobile"
      :fixed-header="getHeaderFixed"
      :min-width="getMobileWidth"
      :header-height="64"
      :sider-visible="getSiderMenuShow"
      :sider-width="getSiderWidth"
      :sider-collapsed-width="getSiderMinWidth"
      :sider-collapse="getSiderCollapsed"
      :transition-duration="200"
      :tab-visible="getMultiTabShow"
      :add-main-overflow-hidden="getHeaderFixed"
      @update:sider-collapse="setSiderCollapsed"
    >
      <template #header>
        <NLayoutHeader
          :inverted="getHeaderInverted"
          :style="getInvertedHoverSty(getHeaderInverted)"
          position="static"
        >
          <LayoutHeader />
        </NLayoutHeader>
      </template>
      <template #tab>
        <div class="h-full w-full flex items-center">
          <LayoutMultiTab class="flex-1" :collapsed="getSiderCollapsed" />
        </div>
      </template>
      <template #sider>
        <NLayoutSider
          :class="`${getPrefixCls}-sider`"
          show-trigger="bar"
          :style="getInvertedHoverSty(getSiderInverted)"
          position="static"
          :collapsed="getSiderCollapsed"
          collapse-mode="width"
          :collapsed-width="getSiderMinWidth"
          :width="getSiderWidth"
          :inverted="getSiderInverted"
          @collapse="setSiderCollapsed(true)"
          @expand="setSiderCollapsed(false)"
        >
          <LayoutLogo
            :collapsed="getSiderCollapsed"
            v-if="getLayoutMode === ENavMode.VERTICAL"
          />
          <sider-menu />
        </NLayoutSider>
      </template>
      <div ref="layoutContentRef" :class="`${getPrefixCls}-content`">
        <NScrollbar trigger="none" :class="`${getPrefixCls}-content-scroll`">
          <LayoutMain class="flex-grow w-full h-0" />
        </NScrollbar>
      </div>
      <template #footer> </template>
    </AppLayout>
  </NLayout>
  <AppSettingDrawer />
</template>

<script lang="ts" setup>
  import { AppSettingDrawer } from '@/components/AppSettingDrawer'
  import { LayoutMain } from './components/Main'
  import { LayoutHeader } from './components/Header'
  import { LayoutLogo } from './components/Logo'
  import { LayoutMultiTab } from './components/MultiTab'
  import { useDesign } from '@/hooks/web/useDesign'
  import { useSiderSetting } from '@/hooks/setting/useSiderSetting'
  import { useHeaderSetting } from '@/hooks/setting/useHeaderSetting'
  import { SiderMenu } from './components/Menu'
  import { useLayoutProvider } from '@/hooks/core/useLayoutContext'
  import { useTheme } from '@/hooks/web/useTheme'
  import { ENavMode } from '@/enums/appEnum'
  import { computed, ref, unref, watch } from 'vue'
  import { useMultipleTabSetting } from '@/hooks/setting/useMultipleTabSetting'
  import { useAppSetting } from '@/hooks/setting/useAppSetting'
  import { useElementSize } from '@vueuse/core'
  import { useAppInject } from '@/hooks/core/useAppContext'

  defineOptions({ name: 'layout' })

  const { getPrefixCls } = useDesign('layout')
  const { getInvertedHoverSty } = useTheme()
  const {
    getSiderCollapsed,
    getSiderWidth,
    getSiderMinWidth,
    setSiderCollapsed,
    getSiderInverted,
  } = useSiderSetting()
  const { getSiderMenuShow, getIsMobile, getLayoutMode, getMobileWidth } =
    useAppSetting()
  const { getHeaderFixed, getHeaderInverted } = useHeaderSetting()
  const { getMultiTabShow } = useMultipleTabSetting()
  const { setLayoutContentHeight } = useAppInject()
  const layoutContentRef = ref(null)
  const { height } = useElementSize(layoutContentRef)

  useLayoutProvider()

  const getLayoutsContentSty = computed(() => {
    return !unref(getHeaderFixed)
      ? ''
      : {
          height: '100%',
        }
  })

  watch(
    height,
    (val) => {
      setLayoutContentHeight(val)
    },
    {
      immediate: true,
    },
  )
</script>

<style lang="scss">
  $prefix-cls: '#{$namespace}-layout';

  .#{$prefix-cls} {
    &-sider {
      min-height: 100%;
      box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
      position: relative;
      transition: all 0.2s ease-in-out;
    }

    .n-scrollbar-rail {
      z-index: 1001;
    }

    &-content {
      height: 100%;

      &-scroll > .n-scrollbar-container > .n-scrollbar-content {
        min-height: 100%;
        position: relative;
        padding: 0 12px 12px 12px;
        display: flex;
        flex-direction: column;
      }
    }
  }
</style>
