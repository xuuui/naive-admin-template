<template>
  <div :class="`${getPrefixCls}`">
    <LayoutLogo
      class="px-[12px] flex-shrink-0"
      :style="{
        width: getSiderWidth + 'px',
      }"
      v-if="getLayoutMode === ENavMode.HORIZONTAL"
      :collapsed="false"
    />
    <!-- 菜单收起 -->
    <sider-collapsed v-if="getLayoutMode === ENavMode.VERTICAL" />
    <!-- 面包屑 -->
    <breadcrumb v-if="getBreadcrumbShow && !getHeaderMenuShow" />
    <!--顶部菜单-->
    <div class="flex-1 overflow-hidden h-full">
      <n-scrollbar
        v-if="getHeaderMenuShow"
        class="h-full"
        content-class="h-full flex items-center"
        x-scrollable
      >
        <header-menu />
      </n-scrollbar>
    </div>
    <!-- 右侧 -->
    <full-screen />
    <user-dropdown />
    <app-setting />
  </div>
</template>

<script setup lang="ts">
  import { useDesign } from '@/hooks/web/useDesign'
  import { FullScreen } from './FullScreen'
  import { SiderCollapsed } from './SiderCollapsed'
  import { useHeaderSetting } from '@/hooks/setting/useHeaderSetting'
  import { Breadcrumb } from './Breadcrumb'
  import { UserDropdown } from './UserDropdown'
  import { AppSetting } from './AppSetting'
  import { HeaderMenu } from '../Menu'
  import { LayoutLogo } from '../Logo'
  import { ENavMode } from '@/enums/appEnum'
  import { useSiderSetting } from '@/hooks/setting/useSiderSetting'
  import { useAppSetting } from '@/hooks/setting/useAppSetting'

  defineOptions({ name: 'LayoutHeader' })

  const { getPrefixCls } = useDesign('layout-header')
  const { getHeaderMenuShow, getLayoutMode } = useAppSetting()
  const { getBreadcrumbShow } = useHeaderSetting()
  const { getSiderWidth } = useSiderSetting()
</script>

<style lang="scss">
  $prefix-cls: '#{$namespace}-layout-header';

  .#{$prefix-cls} {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: $header-height;
    box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
    transition: all 0.2s ease-in-out;
    width: 100%;

    .n-menu-item-content-header {
      overflow: inherit !important;
    }

    .avatar {
      display: flex;
      align-items: center;
      height: $header-height;
    }

    &-trigger {
      height: $header-height;
      padding: 0 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease-in-out;

      &:hover {
        background-color: var(--hover-color);
      }
    }

    &-breadcrumb {
      .n-breadcrumb {
        line-height: inherit;
      }

      .n-breadcrumb .n-breadcrumb-item {
        transition: none;
      }

      .n-breadcrumb .n-breadcrumb-item .n-breadcrumb-item__link {
        cursor: pointer;
        transition: none;

        &:hover {
          color: var(--primary-color);
        }
      }

      .n-breadcrumb .n-breadcrumb-item:last-child .n-breadcrumb-item__link {
        font-weight: var(--font-weight-active);
        cursor: unset;
        color: var(--item-text-color-active);
      }
    }
  }
</style>
