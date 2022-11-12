<template>
  <!--切换全屏-->
  <div :class="`${getPrefixCls}-trigger`" @click="reloadPage">
    <n-tooltip placement="bottom">
      <template #trigger>
        <n-icon size="18">
          <ReloadOutlined />
        </n-icon>
      </template>
      <span>重新加载页面</span>
    </n-tooltip>
  </div>
</template>

<script setup lang="ts">
  import { ReloadOutlined } from '@vicons/antd'
  import { useDesign } from '@/hooks/web/useDesign'
  import { useRedo } from '@/hooks/web/usePage'

  defineOptions({ name: 'PageReload' })

  const { getPrefixCls } = useDesign('layout-header')
  const reDo = useRedo()

  const reloadPage = () => {
    reDo()
  }
</script>
