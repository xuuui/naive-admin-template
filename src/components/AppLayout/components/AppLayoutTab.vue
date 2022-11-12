<template>
  <div :class="getPrefixCls" :style="getStyle">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
  import { useDesign } from '@/hooks/web/useDesign'
  import { computed, type CSSProperties } from 'vue'

  defineOptions({ name: 'AppLayoutTab' })

  interface Props {
    /** 开启fixed布局 */
    fixed?: boolean
    /** fixed布局的top距离 */
    top?: number
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
    top: 56,
    zIndex: 999,
    minWidth: 1200,
    height: 56,
    paddingLeft: 0,
    transitionDuration: 300,
    transitionTimingFunction: 'ease-in-out',
  })

  const { getPrefixCls } = useDesign('app-layout-tab')

  const getStyle = computed((): CSSProperties => {
    const {
      fixed,
      top,
      zIndex,
      minWidth,
      height,
      paddingLeft,
      transitionDuration,
      transitionTimingFunction,
      useMinWidthLayout,
    } = props

    return {
      position: fixed ? 'fixed' : 'static',
      top: `${top}px`,
      zIndex: zIndex,
      height: `${height}px`,
      minWidth: useMinWidthLayout ? `${minWidth}px` : '',
      paddingLeft: `${paddingLeft}px`,
      transitionDuration: `${transitionDuration}ms`,
      transitionTimingFunction,
    }
  })
</script>
<style lang="scss">
  $prefix-cls: '#{$namespace}-app-layout-tab';

  .#{$prefix-cls} {
    left: 0;
    flex-shrink: 0;
    box-sizing: border-box;
    width: 100%;
    transition-property: 'padding-left';
  }
</style>
