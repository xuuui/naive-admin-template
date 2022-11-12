<template>
  <div :class="getPrefixCls">
    <img :src="logoImg" :class="{ 'mr-2': !collapsed }" />
    <div v-show="!collapsed" class="m-0 text-[16px] font-bold">{{
      VITE_GLOB_APP_TITLE
    }}</div>
  </div>
</template>

<script lang="ts" setup>
  import { getGlobEnvConfig } from '@/utils/env'
  import logoImg from '@/assets/images/logo.png'
  import { useDesign } from '@/hooks/web/useDesign'
  defineOptions({ name: 'LayoutLogo' })

  defineProps({
    collapsed: {
      type: Boolean,
    },
  })

  const { getPrefixCls } = useDesign('logo')
  const { VITE_GLOB_APP_TITLE } = getGlobEnvConfig()
</script>

<style lang="scss">
  $prefix-cls: '#{$namespace}-logo';

  .#{ $prefix-cls } {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 64px;
    line-height: 64px;
    overflow: hidden;
    white-space: nowrap;

    img {
      width: auto;
      height: 32px;
    }
  }
</style>
