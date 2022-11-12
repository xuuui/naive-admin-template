<template>
  <!--切换全屏-->
  <div
    :class="`${getPrefixCls}-trigger`"
    @click="setSiderCollapsed(!getSiderCollapsed)"
  >
    <n-tooltip placement="bottom">
      <template #trigger>
        <n-icon size="18">
          <MenuUnfoldOutlined v-if="getSiderCollapsed" />
          <MenuFoldOutlined v-else />
        </n-icon>
      </template>
      <span>{{ getSiderCollapsed ? '收起菜单' : '展开菜单' }}</span>
    </n-tooltip>
  </div>
</template>

<script setup lang="ts">
  import { MenuUnfoldOutlined, MenuFoldOutlined } from '@vicons/antd'
  import { useDesign } from '@/hooks/web/useDesign'
  import { useSiderSetting } from '@/hooks/setting/useSiderSetting'
  defineOptions({ name: 'SiderCollapsed' })
  const { getPrefixCls } = useDesign('layout-header')
  const { getSiderCollapsed, setSiderCollapsed } = useSiderSetting()
</script>
