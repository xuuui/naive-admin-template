<template>
  <n-scrollbar class="flex-1 overflow-hidden">
    <n-menu
      :options="(menus as MenuOption[])"
      :accordion="getSiderAccordion"
      mode="vertical"
      :collapsed="getSiderCollapsed"
      :collapsed-width="getSiderMinWidth"
      :indent="24"
      :expanded-keys="getOpenKeys"
      :inverted="getSiderInverted"
      :value="getSelectedKey"
      key-field="path"
      label-field="title"
      @update:expanded-keys="handleOpenChange"
      @update:value="handleKeyChange"
    />
  </n-scrollbar>
</template>

<script lang="ts" setup>
  import type { MenuOption } from 'naive-ui'

  import { computed, watch } from 'vue'
  import { useSiderSetting } from '@/hooks/setting/useSiderSetting'
  import { ref, unref } from 'vue'
  import { useMenu } from '../useMenu'
  import { ENavMode } from '@/enums/appEnum'
  import { useLayoutInject } from '@/hooks/core/useLayoutContext'
  import { useAppSetting } from '@/hooks/setting/useAppSetting'
  import type { Menu } from '#/router'
  import { useRoute } from 'vue-router'
  import { isUrl } from '@/utils/is'
  import { openWindow } from '@/utils'

  defineOptions({ name: 'SiderMenu' })

  const route = useRoute()
  const { getMenus, getParentPaths, handleMenuGo } = useMenu()
  const { getNavMode } = useAppSetting()
  const {
    getSiderCollapsed,
    getSiderAccordion,
    getSiderMinWidth,
    getSiderInverted,
  } = useSiderSetting()

  const {
    siderSelectedKey,
    headerSelectedKey,
    setHeaderSelectedKey,
    setSiderSelectedKey,
  } = useLayoutInject()
  const menus = ref<Menu[]>([])
  const openKeys = ref<string[]>()

  const getSelectedKey = computed(() => {
    return unref(siderSelectedKey)
  })

  const getOpenKeys = computed(() => {
    return unref(openKeys) || []
  })

  const handleOpenChange = (keys: string[]) => {
    openKeys.value = keys
  }

  const setMenus = async () => {
    const navMode = unref(getNavMode)
    const menuList = unref(getMenus)

    if (navMode === ENavMode.VERTICAL) {
      menus.value = menuList
    } else if (navMode === ENavMode.HORIZONTAL_MIX) {
      const currentTop = menuList.find(
        (item) => item.path === unref(headerSelectedKey),
      )
      menus.value = currentTop?.children ?? []
    } else {
      menus.value = []
    }
  }

  watch(
    [getMenus, headerSelectedKey, getNavMode],
    async () => {
      setMenus()
    },
    { immediate: true },
  )

  const handleFullPathChange = () => {
    const parentPaths = getParentPaths(route.fullPath)
    const pre = !unref(getSiderAccordion) ? unref(openKeys) || [] : []
    const list = [...pre, ...parentPaths]
    openKeys.value = [...new Set(list)]
    setSiderSelectedKey(route.fullPath)
  }

  watch(
    () => route.fullPath,
    () => {
      handleFullPathChange()
    },
  )

  watch(
    getNavMode,
    async (nVal) => {
      if (nVal === ENavMode.HORIZONTAL) return

      // 重新设置菜单选择
      const siderKey = unref(siderSelectedKey)
      const headerKey = unref(headerSelectedKey)
      if (nVal === ENavMode.HORIZONTAL_MIX) {
        const rootPath = getParentPaths(siderKey)?.[0]
        setHeaderSelectedKey(rootPath || siderKey)
      }
      if (nVal === ENavMode.VERTICAL) {
        if (!siderKey && headerKey) {
          setSiderSelectedKey(headerKey)
        }
      }

      // 重新设置展开
      if (!siderKey) return
      const parentPaths = getParentPaths(siderKey)
      if (nVal === ENavMode.HORIZONTAL_MIX) {
        const keys = unref(getOpenKeys)!.filter((item) => {
          return parentPaths.includes(item) && item !== parentPaths?.[0]
        })
        openKeys.value = keys
      }
      if (nVal === ENavMode.VERTICAL) {
        const keys = [...new Set([...unref(getOpenKeys)!, ...parentPaths])]
        openKeys.value = keys
      }
    },
    { immediate: true },
  )

  const handleKeyChange = (key: string) => {
    if (isUrl(key)) {
      openWindow(key)
      return
    }
    setSiderSelectedKey(key)
    handleMenuGo(key)
  }
</script>
