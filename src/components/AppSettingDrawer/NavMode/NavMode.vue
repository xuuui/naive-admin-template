<template>
  <n-space justify="space-between">
    <nav-mode-check-box
      v-for="item in navModeList"
      :key="item.value"
      :mode="item.value"
      :label="item.label"
      :checked="item.value === getNavMode"
      @click="setNavMode(item.value)"
    />
  </n-space>
</template>

<script setup lang="ts">
  import { ENavMode } from '@/enums/appEnum'
  import { useAppSetting } from '@/hooks/setting/useAppSetting'
  import { NavModeCheckBox } from '../NavModeCheckBox'

  defineOptions({ name: 'NavMode' })

  const { getNavMode, setNavMode } = useAppSetting()
  const navModeList = {
    [ENavMode.VERTICAL]: {
      value: ENavMode.VERTICAL,
      label: '左侧菜单模式',
    },
    [ENavMode.HORIZONTAL]: {
      value: ENavMode.HORIZONTAL,
      label: '顶部菜单模式',
    },
    [ENavMode.HORIZONTAL_MIX]: {
      value: ENavMode.HORIZONTAL_MIX,
      label: '顶部菜单混合模式',
    },
  }
</script>

<style scoped></style>
