<template>
  <div
    :class="[
      `${getPrefixCls}`,
      {
        'pl-[12px]': !state.scrollable,
      },
    ]"
  >
    <div
      class="relative"
      :class="[
        `${getPrefixCls}-tabs`,
        {
          'px-[32px]': state.scrollable,
        },
      ]"
      ref="tabsWrapRef"
    >
      <div
        class="left-0"
        :class="[`${getPrefixCls}-tabs-prev`, ...getScrollControllCommonCls]"
        @click="scrollPrev"
      >
        <n-icon size="16">
          <LeftOutlined />
        </n-icon>
      </div>
      <div
        class="right-0"
        :class="[`${getPrefixCls}-tabs-next`, ...getScrollControllCommonCls]"
        @click="scrollNext"
      >
        <n-icon size="16">
          <RightOutlined />
        </n-icon>
      </div>
      <div
        ref="tabsScrollRef"
        :class="`${getPrefixCls}-tabs-scroll`"
        class="flex-grow flex-shrink-0"
      >
        <vue-draggable-next
          v-model="getTabList"
          item-key="fullPath"
          :handle="`.${getPrefixCls}-tabs-item`"
          class="h-[32px] flex"
        >
          <div
            :id="getTabItemIdByPath(item.fullPath)"
            :class="[`${getPrefixCls}-tabs-item`]"
            v-for="item in getTabList"
            :key="item.fullPath"
            @click.stop="go(item.fullPath)"
            @contextmenu="handleContextMenu($event as PointerEvent, item)"
          >
            <div
              class="titl"
              :class="[
                `${getPrefixCls}-tabs-item-title`,
                {
                  active: item.fullPath === route.fullPath,
                },
              ]"
              >{{ item.meta.title }}</div
            >
            <div
              :class="`${getPrefixCls}-tabs-close`"
              @click.stop="close(item)"
              v-if="!item.meta.affix"
            >
              <n-icon size="12">
                <CloseOutlined />
              </n-icon>
            </div>
          </div>
        </vue-draggable-next>
      </div>
    </div>
    <div :class="`${getPrefixCls}-actions`">
      <!-- <div :class="`${getPrefixCls}-trigger`" @click.stop="reload()">
        <n-icon size="16">
          <ReloadOutlined />
        </n-icon>
      </div> -->
      <n-dropdown
        trigger="hover"
        @select="handleMultiTabAction"
        :options="multiTabActionOptions"
      >
        <div :class="`${getPrefixCls}-trigger`">
          <n-icon size="16">
            <DownOutlined />
          </n-icon>
        </div>
      </n-dropdown>
    </div>
    <n-dropdown
      :show="state.showContextMenuDropdown"
      :x="state.contextMenuDropdownX"
      :y="state.contextMenuDropdownY"
      @clickoutside="handleContextMenuOutside"
      @select="handleMultiTabAction"
      :options="multiTabActionOptions"
    />
  </div>
</template>

<script setup lang="ts">
  import { useRoute } from 'vue-router'
  import { EPageRoute } from '@/enums/pageEnum'
  import { useGo, useRedo } from '@/hooks/web/usePage'
  import { useWeb } from '@/hooks/web/useWeb'
  import { VueDraggableNext } from 'vue-draggable-next'
  import {
    CloseOutlined,
    ColumnWidthOutlined,
    MinusOutlined,
    ReloadOutlined,
    DownOutlined,
    RightOutlined,
    LeftOutlined,
    ArrowLeftOutlined,
    ArrowRightOutlined,
  } from '@vicons/antd'
  import { NIcon } from 'naive-ui'
  import { computed, unref, watch, h, reactive, nextTick, ref } from 'vue'
  import { useDesign } from '@/hooks/web/useDesign'
  import { useResizeObserver } from '@vueuse/core'
  import { useMultiTabStore } from '@/store/modules/multiTab'
  import { transformRouteToMultiTab } from '@/utils/helper/routeHelper'
  import { MultiTab } from '@/store/types'
  import { EMultiTabAction } from '@/enums/appEnum'

  defineOptions({ name: 'LayoutMultiTab' })

  const { getPrefixCls } = useDesign('layout-multiTab')
  const multiTabStore = useMultiTabStore()
  const route = useRoute()
  const { message } = useWeb()
  const tabsScrollRef = ref<Nullable<HTMLElement>>(null)
  const tabsWrapRef = ref<HTMLElement>()
  const go = useGo()
  const reDo = useRedo()
  const state = reactive({
    scrollable: false,
    showContextMenuDropdown: false,
    contextMenuDropdownX: 0,
    contextMenuDropdownY: 0,
  })
  const contextTab = ref<MultiTab>(transformRouteToMultiTab(route))

  multiTabStore.initTabs()

  const getTabList = computed({
    get() {
      return multiTabStore.getTabList
    },
    set(val) {
      multiTabStore.setTabList(val || [])
    },
  })

  watch(
    () => route.fullPath,
    () => {
      const tab = transformRouteToMultiTab(route)
      contextTab.value = tab
      multiTabStore.addTab(tab)
      updateMultiTabScroll(true)
    },
    {
      immediate: true,
    },
  )

  const getScrollControllCommonCls = computed(() => {
    return [
      `${getPrefixCls}-trigger`,
      'hover:!bg-transparent',
      { '!hidden': !state.scrollable },
    ]
  })

  async function handleContextMenu(e: PointerEvent, routeItem: MultiTab) {
    e.preventDefault()
    contextTab.value = routeItem

    state.showContextMenuDropdown = false
    await nextTick()
    state.showContextMenuDropdown = true
    state.contextMenuDropdownX = e.clientX
    state.contextMenuDropdownY = e.clientY
  }

  const handleContextMenuOutside = () => {
    state.showContextMenuDropdown = false
    contextTab.value = transformRouteToMultiTab(route)
  }

  const reload = (tab: MultiTab = unref(contextTab)) => {
    reDo({ fullPath: tab.fullPath })
  }

  const closeOther = (tab: MultiTab = unref(contextTab)) => {
    multiTabStore.closeOtherTabs(tab)
    go(tab.fullPath, true)
    updateMultiTabScroll()
  }

  const closeRight = (tab: MultiTab = unref(contextTab)) => {
    multiTabStore.closeRightTabs(tab)
    go(tab.fullPath, true)
    updateMultiTabScroll()
  }

  const closeLeft = (tab: MultiTab = unref(contextTab)) => {
    multiTabStore.closeLeftTabs(tab)
    go(tab.fullPath, true)
    updateMultiTabScroll()
  }

  const closeAll = () => {
    multiTabStore.closeAllTabs()
    go(EPageRoute.BASE_HOME, true)
    updateMultiTabScroll()
  }

  const close = (tab: MultiTab = unref(contextTab)) => {
    if (unref(getTabList).length === 1) {
      return message.warning('这已经是最后一页，不能再关闭了！')
    }
    multiTabStore.closeCurrentTab(tab)

    if (route.fullPath === tab.fullPath) {
      const tabList = unref(getTabList)
      const next = tabList[Math.max(0, tabList.length - 1)]
      go(next.fullPath)
    }
    updateMultiTabScroll()
  }

  const renderIcon = (icon: any) => {
    return () => h(NIcon, null, { default: () => h(icon) })
  }

  const multiTabActionOptions = computed(() => {
    const isDisabled = unref(getTabList).length <= 1
    const isCurrent = route.fullPath === unref(contextTab).fullPath
    return [
      {
        label: '重新加载',
        key: EMultiTabAction.RELOAD,
        icon: renderIcon(ReloadOutlined),
      },
      {
        label: isCurrent ? '关闭当前' : `关闭标签页`,
        key: EMultiTabAction.CLOSE,
        disabled:
          unref(contextTab).fullPath === EPageRoute.BASE_HOME || isDisabled,
        icon: renderIcon(CloseOutlined),
      },
      {
        label: '关闭左侧',
        key: EMultiTabAction.CLOSE_LEFT,
        disabled: isDisabled,
        icon: renderIcon(ArrowLeftOutlined),
      },
      {
        label: '关闭右侧',
        key: EMultiTabAction.CLOSE_RIGHT,
        disabled: isDisabled,
        icon: renderIcon(ArrowRightOutlined),
      },
      {
        label: '关闭其他',
        key: EMultiTabAction.CLOSE_OTHER,
        disabled: isDisabled,
        icon: renderIcon(ColumnWidthOutlined),
      },
      {
        label: '关闭全部',
        key: EMultiTabAction.CLOSE_ALL,
        disabled: isDisabled,
        icon: renderIcon(MinusOutlined),
      },
    ]
  })

  const handleMultiTabAction = (key: EMultiTabAction) => {
    const actions = {
      [EMultiTabAction.RELOAD]: reload,
      [EMultiTabAction.CLOSE_ALL]: closeAll,
      [EMultiTabAction.CLOSE_OTHER]: closeOther,
      [EMultiTabAction.CLOSE]: close,
      [EMultiTabAction.CLOSE_LEFT]: closeLeft,
      [EMultiTabAction.CLOSE_RIGHT]: closeRight,
    }
    actions[key]()
    state.showContextMenuDropdown = false
    contextTab.value = transformRouteToMultiTab(route)
  }

  function scrollTo(value: number, amplitude: number) {
    const tabsScroll = unref(tabsScrollRef)!
    const currentScroll = tabsScroll.scrollLeft
    const scrollWidth =
      (amplitude > 0 && currentScroll + amplitude >= value) ||
      (amplitude < 0 && currentScroll + amplitude <= value)
        ? value
        : currentScroll + amplitude
    tabsScroll && tabsScroll.scrollTo(scrollWidth, 0)
    if (scrollWidth === value) return
    return window.requestAnimationFrame(() => scrollTo(value, amplitude))
  }

  function scrollPrev() {
    const tabsScroll = unref(tabsScrollRef)!
    const containerWidth = tabsScroll.offsetWidth
    const currentScroll = tabsScroll.scrollLeft

    if (!currentScroll) return
    const scrollLeft =
      currentScroll > containerWidth ? currentScroll - containerWidth : 0
    scrollTo(scrollLeft, (scrollLeft - currentScroll) / 20)
  }

  function scrollNext() {
    const tabsScroll = unref(tabsScrollRef)!

    const containerWidth = tabsScroll.offsetWidth
    const navWidth = tabsScroll.scrollWidth
    const currentScroll = tabsScroll.scrollLeft

    if (navWidth - currentScroll <= containerWidth) return
    const scrollLeft =
      navWidth - currentScroll > containerWidth * 2
        ? currentScroll + containerWidth
        : navWidth - containerWidth
    scrollTo(scrollLeft, (scrollLeft - currentScroll) / 20)
  }

  const getTabItemIdByPath = (path: string) => {
    return `tab${path.split('/').join('\/')}`
  }

  async function updateMultiTabScroll(autoScroll?: boolean) {
    await nextTick()
    const tabsScroll = unref(tabsScrollRef)!
    if (!tabsScroll) return

    const containerWidth = tabsScroll.offsetWidth
    const navWidth = tabsScroll.scrollWidth
    if (containerWidth < navWidth) {
      state.scrollable = true
      if (autoScroll) {
        let tabList =
          tabsScroll.querySelectorAll(`.${unref(getPrefixCls)}-tabs-item`) || []
        Array.from(tabList).forEach((tab: HTMLElement) => {
          if (tab.id === getTabItemIdByPath(route.fullPath)) {
            tab.scrollIntoView && tab.scrollIntoView()
          }
        })
      }
    } else {
      state.scrollable = false
    }
  }

  useResizeObserver(tabsWrapRef, () => {
    updateMultiTabScroll(true)
  })
</script>

<style lang="scss">
  $prefix-cls: '#{$namespace}-layout-multiTab';

  .#{$prefix-cls} {
    display: flex;
    align-items: center;
    max-width: 100%;

    &-tabs {
      height: 32px;
      flex-grow: 1;
      display: flex;
      overflow: hidden;

      &-prev,
      &-next {
        width: 32px;
        text-align: center;
        position: absolute;
        line-height: 32px;
        cursor: pointer;
      }

      &-scroll {
        white-space: nowrap;
        overflow: hidden;
      }

      &-item {
        background: var(--card-color);
        color: var(--text-color-1);
        height: 32px;
        padding: 0 16px;
        border-radius: 3px;
        margin-right: 6px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        position: relative;
        flex: 0 0 auto;
        line-height: 1;

        &-title {
          &.active {
            color: var(--primary-color);
          }
        }

        &:hover {
          &-title {
            color: var(--primary-color);
          }
        }
      }

      &-close {
        margin-left: 6px;
        width: 18px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        color: var(--close-icon-color);

        &:hover {
          background-color: var(--close-color-hover);
          color: var(--close-icon-color);
        }
      }
    }

    &-actions {
      height: 32px;
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }

    &-trigger {
      height: 100%;
      display: flex;
      cursor: pointer;
      align-items: center;
      justify-content: center;
      padding: 0 10px;
      transition: all 0.2s ease-in-out;
      color: var(--text-color-3);

      &:hover {
        background-color: var(--button-color-2-hover);
        color: var(--text-color-2);
      }
    }
  }
</style>
