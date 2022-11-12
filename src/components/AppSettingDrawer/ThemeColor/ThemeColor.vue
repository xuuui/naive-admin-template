<template>
  <n-grid :cols="8" :x-gap="8" :y-gap="12">
    <n-grid-item
      v-for="color in getThemeColorList"
      :key="color"
      class="flex items-center justify-center"
    >
      <theme-color-check-box
        :color="color"
        :checked="color === getThemeColor"
        @click="setThemeColor(color)"
      />
    </n-grid-item>
  </n-grid>
</template>

<script setup lang="ts">
  import { useDesignSetting } from '@/hooks/setting/useDesignSetting'
  import { ThemeColorCheckBox } from '../ThemeColorCheckBox'

  defineOptions({ name: 'ThemeColor' })
  const { getThemeColorList, getThemeColor, setThemeColor } = useDesignSetting()
</script>

<style scoped></style>
