<template>
  <div :class="getPrefixCls" :style="getStyle">
    <app-layout-header
      v-if="headerVisible"
      v-bind="commonProps"
      :fixed="fixedHeader"
      :z-index="headerZIndex"
      :min-width="minWidth"
      :height="headerHeight"
      :padding-left="headerPaddingLeft"
      :style="headerTransform"
    >
      <slot name="header"></slot>
    </app-layout-header>
    <app-layout-tab
      v-if="tabVisible"
      v-bind="commonProps"
      :fixed="fixedHeader"
      :z-index="tabZIndex"
      :min-width="minWidth"
      :top="headerHeight"
      :height="tabHeight"
      :padding-left="commonPaddingLeft"
      :style="headerTransform"
    >
      <slot name="tab"></slot>
    </app-layout-tab>
    <app-layout-sider
      v-if="siderVisible"
      v-bind="commonProps"
      :z-index="siderZIndex"
      :width="currentSiderWidth"
      :padding-top="siderPaddingTop"
    >
      <slot name="sider"></slot>
    </app-layout-sider>
    <div
      v-if="showMask"
      :class="`${getPrefixCls}-sider__mask`"
      :style="siderStyle"
      @click="handleClickMask"
    ></div>
    <app-layout-content
      v-bind="commonProps"
      :padding-top="contentPaddingTop"
      :padding-bottom="contentPaddingBottom"
      :padding-left="commonPaddingLeft"
      :overflow-hidden="addMainOverflowHidden"
    >
      <slot></slot>
    </app-layout-content>
  </div>
</template>

<script setup lang="ts">
  import { useDesign } from '@/hooks/web/useDesign'
  import { computed, unref } from 'vue'
  import {
    AppLayoutHeader,
    AppLayoutSider,
    AppLayoutContent,
    AppLayoutTab,
  } from './components'
  import { useFixedTransformStyle } from './useFixedTransformStyle'

  defineOptions({ name: 'AppLayout' })

  interface Props {
    /** 布局模式 */
    mode?: 'vertical' | 'horizontal'
    /** 是否是移动端 */
    isMobile?: boolean
    /** 移动端时遮罩背景颜色 */
    maskBg?: string
    /** 是否启用最小宽度的布局 */
    useMinWidthLayout?: boolean
    /** 最小宽度 */
    minWidth?: number
    /** 头部可见 */
    headerVisible?: boolean
    /** 头部高度 */
    headerHeight?: number
    /** 标签可见 */
    tabVisible?: boolean
    /** 标签页高度 */
    tabHeight?: number
    /** 固定头部和标签 */
    fixedHeader?: boolean
    /** 给主体内容添加禁止溢出 */
    addMainOverflowHidden?: boolean
    /** 侧边可见 */
    siderVisible?: boolean
    /** 侧边栏高度 */
    siderWidth?: number
    /** 侧边栏折叠状态的高度 */
    siderCollapsedWidth?: number
    /** 侧边栏折叠状态 */
    siderCollapse?: boolean
    /** 动画过渡时间 */
    transitionDuration?: number
    /** 动画过渡速度曲线 */
    transitionTimingFunction?: string
  }
  const props = withDefaults(defineProps<Props>(), {
    mode: 'vertical',
    isMobile: false,
    maskBg: 'rgba(0,0,0,0.05)',
    useMinWidthLayout: false,
    minWidth: 1200,
    headerVisible: true,
    headerHeight: 56,
    tabVisible: true,
    tabHeight: 44,
    fixedHeader: true,
    addMainOverflowHidden: false,
    footerVisible: true,
    footerHeight: 48,
    fixedFooter: true,
    siderVisible: true,
    siderWidth: 220,
    siderCollapsedWidth: 64,
    siderCollapse: false,
    transitionDuration: 200,
    transitionTimingFunction: 'ease-in-out',
  })
  interface Emits {
    (e: 'update:sider-collapse', collapse: boolean): void
  }
  const emit = defineEmits<Emits>()

  const { getPrefixCls } = useDesign('app-layout')

  const getStyle = computed(() => {
    const { useMinWidthLayout, minWidth } = props
    return {
      minWidth: useMinWidthLayout ? `${minWidth}px` : '',
    }
  })
  // fixed布局时，应用translateX样式(水平方向出现滚动条，拖动滚动条时，fixed元素跟着滚动)
  const hasFixedEl = computed(() => {
    const { useMinWidthLayout, fixedHeader, fixedFooter } = props
    return useMinWidthLayout && (fixedHeader || fixedFooter)
  })
  const transformStyle = useFixedTransformStyle(hasFixedEl)
  const headerTransform = computed(() => {
    const { fixedHeader } = props
    return fixedHeader ? unref(transformStyle) : ''
  })
  /** 各个子组件的公共属性 */
  const commonProps = computed(() => {
    const { transitionDuration, transitionTimingFunction } = props
    return {
      transitionDuration,
      transitionTimingFunction,
    }
  })
  /** 水平布局 */
  const isVertical = computed(() => props.mode === 'vertical')
  // fixed布局时的层级
  const headerZIndex = 1001
  const tabZIndex = 999
  const siderZIndex = computed(() => {
    const { isMobile } = props
    return isMobile || unref(isVertical) ? 1003 : 1000
  })

  const siderCollapseStatus = computed({
    get() {
      return props.siderCollapse
    },
    set(collapse) {
      emit('update:sider-collapse', collapse)
    },
  })

  function handleClickMask() {
    siderCollapseStatus.value = !unref(siderCollapseStatus)
  }

  const showMask = computed(() => props.isMobile && !unref(siderCollapseStatus))
  const siderStyle = computed(() => {
    const { transitionDuration, transitionTimingFunction, maskBg } = props
    return {
      backgroundColor: maskBg,
      transitionDuration: `${transitionDuration}ms`,
      transitionTimingFunction,
    }
  })
  /** 侧边宽度 */
  const currentSiderWidth = computed(() => {
    const { siderWidth, siderCollapsedWidth, isMobile, siderVisible } = props
    const collapseWidth = isMobile ? 0 : siderCollapsedWidth
    const width = unref(siderCollapseStatus) ? collapseWidth : siderWidth
    return siderVisible ? width : 0
  })
  const commonPaddingLeft = computed(() =>
    props.isMobile ? 0 : unref(currentSiderWidth),
  )

  // 各子组件的属性
  const headerPaddingLeft = computed(() =>
    unref(isVertical) ? unref(commonPaddingLeft) : 0,
  )
  const siderPaddingTop = computed(() => {
    const { isMobile, headerVisible, headerHeight } = props
    return !isMobile && !unref(isVertical) && headerVisible ? headerHeight : 0
  })
  const contentPaddingTop = computed(() => {
    const { fixedHeader, headerVisible, headerHeight, tabVisible, tabHeight } =
      props
    let height = 0
    if (fixedHeader) {
      if (headerVisible) {
        height += headerHeight
      }
      if (tabVisible) {
        height += tabHeight
      }
    }
    return height
  })
  const contentPaddingBottom = computed(() => {
    const { fixedFooter, footerVisible, footerHeight } = props
    return fixedFooter && footerVisible ? footerHeight : 0
  })
</script>
<style lang="scss">
  $prefix-cls: '#{$namespace}-app-layout';

  .#{$prefix-cls} {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;

    &-sider__mask {
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1002;
      width: 100%;
      height: 100%;
      transition-property: background-color;
    }
  }
</style>
