<template>
  <aside :class="getPrefixCls" :style="getStyle">
    <slot></slot>
  </aside>
</template>

<script setup lang="ts">
  import { useDesign } from '@/hooks/web/useDesign'
  import { computed, type CSSProperties } from 'vue'

  defineOptions({ name: 'AppLayoutSider' })

  interface Props {
    /** fixed布局的层级 */
    zIndex?: number
    /** 宽度 */
    width?: number
    /** 顶部内边距 */
    paddingTop?: number
    /** 动画过渡时间 */
    transitionDuration?: number
    /** 动画过渡时间 */
    transitionTimingFunction?: string
  }
  const props = withDefaults(defineProps<Props>(), {
    zIndex: 1002,
    collapse: false,
    width: 200,
    paddingTop: 0,
    transitionDuration: 300,
    transitionTimingFunction: 'ease-in-out',
  })

  const { getPrefixCls } = useDesign('app-layout-sider')

  const getStyle = computed((): CSSProperties => {
    const {
      zIndex,
      width,
      paddingTop,
      transitionDuration,
      transitionTimingFunction,
    } = props
    return {
      zIndex,
      width: `${width}px`,
      paddingTop: `${paddingTop}px`,
      transitionDuration: `${transitionDuration}ms`,
      transitionTimingFunction,
    }
  })
</script>
<style lang="scss">
  $prefix-cls: '#{$namespace}-app-layout-sider';

  .#{$prefix-cls} {
    position: fixed;
    left: 0;
    top: 0;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    transition-property: 'all';
  }
</style>
