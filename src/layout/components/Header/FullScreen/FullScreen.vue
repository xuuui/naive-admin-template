<template>
  <!--切换全屏-->
  <div :class="`${getPrefixCls}-trigger`" @click="toggle">
    <n-tooltip placement="bottom">
      <template #trigger>
        <n-icon size="18">
          <FullscreenExitOutlined v-if="isFullscreen" />
          <FullscreenOutlined v-else />
        </n-icon>
      </template>
      <span>全屏</span>
    </n-tooltip>
  </div>
</template>

<script setup lang="ts">
  import { FullscreenOutlined, FullscreenExitOutlined } from '@vicons/antd'
  import { useDesign } from '@/hooks/web/useDesign'
  import { useFullscreen } from '@vueuse/core'

  defineOptions({ name: 'FullScreen' })

  const { getPrefixCls } = useDesign('layout-header')

  const { toggle, isFullscreen } = useFullscreen()
</script>
