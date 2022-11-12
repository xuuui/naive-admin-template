<template>
  <div
    v-if="getShowThemeModeToggle"
    :class="[
      getPrefixCls,
      {
        dark: getThemeMode === EThemeMode.DARK,
      },
    ]"
    @click="toggleThemeMode"
  >
    <div :class="`${getPrefixCls}-inner`"></div>
    <Icon size="14" icon="sun|svg" />
    <Icon size="14" icon="moon|svg" />
  </div>
</template>

<script lang="ts" setup>
  import { unref } from 'vue'
  import { useDesign } from '@/hooks/web/useDesign'
  import { EThemeMode } from '@/enums/appEnum'
  import { useDesignSetting } from '@/hooks/setting/useDesignSetting'
  import { Icon } from '../Icon'
  import { useAppSetting } from '@/hooks/setting/useAppSetting'

  defineOptions({ name: 'AppThemeModeToggle' })

  const { getPrefixCls } = useDesign('app-theme-mode-toggle')
  const { getThemeMode, setThemeMode } = useDesignSetting()
  const { getShowThemeModeToggle } = useAppSetting()

  const toggleThemeMode = () => {
    const darkMode =
      unref(getThemeMode) === EThemeMode.DARK
        ? EThemeMode.LIGHT
        : EThemeMode.DARK
    setThemeMode(darkMode)
  }
</script>
<style lang="scss">
  $prefix-cls: '#{$namespace}-app-theme-mode-toggle';

  .#{$prefix-cls} {
    position: relative;
    display: flex;
    width: 50px;
    height: 26px;
    padding: 0 6px;
    cursor: pointer;
    background-color: var(--card-color);
    border: 1px solid var(--border-color);
    border-radius: 30px;
    justify-content: space-between;
    align-items: center;

    &-inner {
      position: absolute;
      z-index: 1;
      width: 18px;
      height: 18px;
      background-color: var(--text-color-base);
      border-radius: 50%;
      transition: transform 0.5s, background-color 0.5s;
      will-change: transform;
    }

    &.dark {
      .#{$prefix-cls}-inner {
        transform: translateX(calc(100% + 2px));
      }
    }
  }
</style>
