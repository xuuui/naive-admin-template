<template>
  <div :class="getPrefixCls">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
  import { useDesign } from '@/hooks/web/useDesign'

  defineOptions({ name: 'AppPage' })

  const { getPrefixCls } = useDesign('app-page')
</script>

<style lang="scss">
  $prefix-cls: '#{$namespace}-app-page';

  .#{$prefix-cls} {
    background-color: var(--body-color);
    color: var(--text-color-1);
  }
</style>
