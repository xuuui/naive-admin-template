<template>
  <n-drawer
    :show="showSettingDrawer"
    display-directive="show"
    :width="330"
    @mask-click="setShowSettingDrawer(false)"
  >
    <n-drawer-content title="设置" :native-scrollbar="false">
      <div class="flex items-center flex-col">
        <n-divider title-placement="center">主题</n-divider>
        <AppThemeModeToggle />
        <n-divider title-placement="center">主题颜色</n-divider>
        <theme-color />
        <n-divider title-placement="center">导航模式</n-divider>
        <nav-mode />
        <n-divider title-placement="center">界面设置</n-divider>
        <n-space vertical size="large" class="w-full">
          <div class="flex items-center">
            <div class="flex-1"> 固定顶栏 </div>
            <n-switch :value="getHeaderFixed" @update:value="setHeaderFixed" />
          </div>
          <div class="flex items-center">
            <div class="flex-1"> 顶栏反转色 </div>
            <n-switch
              :value="getHeaderInverted"
              @update:value="setHeaderInverted"
            />
          </div>
          <div class="flex items-center">
            <div class="flex-1"> 边栏反转色 </div>
            <n-switch
              :value="getSiderInverted"
              @update:value="setSiderInverted"
            />
          </div>
          <div class="flex items-center">
            <div class="flex-1"> 边栏手风琴模式 </div>
            <n-switch
              :value="getSiderAccordion"
              @update:value="setSiderAccordion"
            />
          </div>
          <div class="flex items-center">
            <div class="flex-1"> 侧边栏展开宽度 </div>
            <n-input-number
              class="w-[120px]"
              size="small"
              :step="1"
              :value="getSiderWidth"
              @update:value="setSiderWidth"
            />
          </div>
          <div class="flex items-center">
            <div class="flex-1"> 侧边栏折叠宽度 </div>
            <n-input-number
              class="w-[120px]"
              size="small"
              :step="1"
              :value="getSiderMinWidth"
              @update:value="setSiderMinWidth"
            />
          </div>
        </n-space>

        <n-divider title-placement="center">界面显示</n-divider>
        <n-space vertical size="large" class="w-full">
          <div class="flex items-center">
            <div class="flex-1"> 面包屑 </div>
            <n-switch
              :value="getBreadcrumbShow"
              @update:value="setBreadcrumbShow"
            />
          </div>
          <div class="flex items-center">
            <div class="flex-1"> 面包屑图标 </div>
            <n-switch
              :value="getBreadcrumbIconShow"
              @update:value="setBreadcrumbIconShow"
            />
          </div>
          <div class="flex items-center">
            <div class="flex-1"> 过渡动画 </div>
            <n-switch
              :value="getTranstionEnable"
              @update:value="setTransitionEnable"
            />
          </div>
          <div class="flex items-center">
            <div class="flex-1"> 过渡动画类型 </div>
            <n-select
              class="w-[120px]"
              size="small"
              :value="getTranstionName"
              @update:value="setTransitionName"
              :options="TRANSITION_NAME_OPTIONS"
            />
          </div>
        </n-space>
      </div>
    </n-drawer-content>
  </n-drawer>
  <div
    v-if="getShowSetting && isLogin"
    :class="`${getPrefixCls}-btn`"
    @click="setShowSettingDrawer(!showSettingDrawer)"
  >
    <n-icon size="18">
      <SettingOutlined />
    </n-icon>
  </div>
</template>

<script setup lang="ts">
  import { SettingOutlined } from '@vicons/antd'
  import { AppThemeModeToggle } from '@/components/AppThemeModeToggle'
  import { useDesign } from '@/hooks/web/useDesign'
  import { ThemeColor } from './ThemeColor'
  import { NavMode } from './NavMode'
  import { useHeaderSetting } from '@/hooks/setting/useHeaderSetting'
  import { useSiderSetting } from '@/hooks/setting/useSiderSetting'
  import { storeToRefs } from 'pinia'
  import { useUserStore } from '@/store/modules/user'
  import { useAppInject } from '@/hooks/core/useAppContext'
  import { useAppSetting } from '@/hooks/setting/useAppSetting'
  import { useTranstionSetting } from '@/hooks/setting/useTransitionSetting'
  import { TRANSITION_NAME_OPTIONS } from '@/enums/appEnum'

  defineOptions({ name: 'AppSettingDrawer' })

  const { getPrefixCls } = useDesign('app-setting-drawer')
  const userStore = useUserStore()
  const { isLogin } = storeToRefs(userStore)
  const { getShowSetting } = useAppSetting()
  const {
    getHeaderFixed,
    setHeaderFixed,
    getHeaderInverted,
    setHeaderInverted,
    getBreadcrumbIconShow,
    getBreadcrumbShow,
    setBreadcrumbIconShow,
    setBreadcrumbShow,
  } = useHeaderSetting()
  const {
    getSiderWidth,
    setSiderWidth,
    getSiderMinWidth,
    setSiderMinWidth,
    getSiderAccordion,
    setSiderAccordion,
    getSiderInverted,
    setSiderInverted,
  } = useSiderSetting()
  const {
    getTranstionEnable,
    setTransitionEnable,
    getTranstionName,
    setTransitionName,
  } = useTranstionSetting()
  const { showSettingDrawer, setShowSettingDrawer } = useAppInject()
</script>

<style lang="scss">
  $prefix-cls: '#{$namespace}-app-setting-drawer';

  .#{$prefix-cls} {
    &-btn {
      position: fixed;
      top: 50%;
      right: 0;
      width: 42px;
      height: 42px;
      background-color: var(--primary-color);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--base-color);
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
      cursor: pointer;
      z-index: 1000;
    }
  }
</style>
