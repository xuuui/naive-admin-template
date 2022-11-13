<template>
  <main :class="getPrefixCls" :style="getStyle">
    <slot></slot>
  </main>
</template>

<script setup lang="ts">
  import { useDesign } from '@/hooks/web/useDesign'
  import { computed, type CSSProperties } from 'vue'

  defineOptions({ name: 'AppLayoutContent' })

  interface Props {
    /** 顶部内边距 */
    paddingTop?: number
    /** 底部内边距 */
    paddingBottom?: number
    /** 左侧内边距 */
    paddingLeft?: number
    /** 是否禁止溢出 */
    overflowHidden?: boolean
    /** 动画过渡时间 */
    transitionDuration?: number
    /** 动画过渡时间 */
    transitionTimingFunction?: string
  }
  const props = withDefaults(defineProps<Props>(), {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    transitionDuration: 300,
    transitionTimingFunction: 'ease-in-out',
  })

  const { getPrefixCls } = useDesign('app-layout-content')

  const getStyle = computed((): CSSProperties => {
    const {
      paddingTop,
      paddingBottom,
      overflowHidden,
      paddingLeft,
      transitionDuration,
      transitionTimingFunction,
    } = props
    return {
      paddingTop: `${paddingTop}px`,
      paddingBottom: `${paddingBottom}px`,
      paddingLeft: `${paddingLeft}px`,
      overflow: overflowHidden ? 'hidden' : 'visible',
      transitionDuration: `${transitionDuration}ms`,
      transitionTimingFunction,
    }
  })
</script>

<style lang="scss">
  $prefix-cls: '#{$namespace}-app-layout-content';

  .#{$prefix-cls} {
    flex-grow: 1;
    box-sizing: border-box;
    width: 100%;
    min-height: 0;
    transition-property: padding-left;
  }
</style>
