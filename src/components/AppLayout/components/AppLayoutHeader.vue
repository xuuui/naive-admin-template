<template>
  <header :class="getPrefixCls" :style="getStyle">
    <slot></slot>
  </header>
</template>

<script setup lang="ts">
  import { useDesign } from '@/hooks/web/useDesign'
  import { computed, type CSSProperties } from 'vue'

  defineOptions({ name: 'AppLayoutHeader' })
  interface Props {
    /** 开启fixed布局 */
    fixed?: boolean
    /** fixed布局的层级 */
    zIndex?: number
    /** 是否启用最小宽度的布局 */
    useMinWidthLayout?: boolean
    /** 最小宽度 */
    minWidth?: number
    /** 高度 */
    height?: number
    /** 左侧内边距 */
    paddingLeft?: number
    /** 动画过渡时间 */
    transitionDuration?: number
    /** 动画过渡时间 */
    transitionTimingFunction?: string
  }
  const props = withDefaults(defineProps<Props>(), {
    fixed: true,
    zIndex: 1001,
    minWidth: 1200,
    height: 56,
    paddingLeft: 0,
    transitionDuration: 300,
    transitionTimingFunction: 'ease-in-out',
  })

  const { getPrefixCls } = useDesign('app-layout-header')

  const getStyle = computed((): CSSProperties => {
    const {
      fixed,
      zIndex,
      minWidth,
      height,
      useMinWidthLayout,
      paddingLeft,
      transitionDuration,
      transitionTimingFunction,
    } = props
    return {
      position: fixed ? 'fixed' : 'static',
      zIndex,
      minWidth: useMinWidthLayout ? minWidth : '',
      height: `${height}px`,
      paddingLeft: `${paddingLeft}px`,
      transitionDuration: `${transitionDuration}ms`,
      transitionTimingFunction,
    }
  })
</script>
<style lang="scss">
  $prefix-cls: '#{$namespace}-app-layout-header';

  .#{$prefix-cls} {
    left: 0;
    top: 0;
    flex-shrink: 0;
    box-sizing: border-box;
    width: 100%;
    transition-property: 'padding-left';
  }
</style>
