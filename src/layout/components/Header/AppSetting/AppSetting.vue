<template>
  <div
    :class="`${getPrefixCls}-trigger`"
    @click="setShowSettingDrawer(!showSettingDrawer)"
  >
    <n-tooltip placement="bottom">
      <template #trigger>
        <n-icon size="18">
          <SettingOutlined />
        </n-icon>
      </template>
      <span>项目配置</span>
    </n-tooltip>
  </div>
</template>

<script setup lang="ts">
  import { SettingOutlined } from '@vicons/antd'
  import { useDesign } from '@/hooks/web/useDesign'
  import { useAppInject } from '@/hooks/core/useAppContext'

  defineOptions({ name: 'AppSetting' })

  const { getPrefixCls } = useDesign('layout-header')
  const { setShowSettingDrawer, showSettingDrawer } = useAppInject()
</script>

<style></style>
