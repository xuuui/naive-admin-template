<template>
  <n-menu
    :options="(menus as MenuOption[])"
    mode="horizontal"
    :inverted="getHeaderInverted"
    :value="getSelectedKey"
    key-field="path"
    label-field="title"
    @update:value="handleKeyChange"
  />
</template>

<script lang="ts" setup>
  import type { MenuOption } from 'naive-ui'
  import type { Menu } from '#/router'

  import { computed, watch } from 'vue'
  import { ref, unref } from 'vue'
  import { useMenu } from '../useMenu'
  import { ENavMode } from '@/enums/appEnum'
  import { omit } from 'lodash-es'
  import { useHeaderSetting } from '@/hooks/setting/useHeaderSetting'
  import { useLayoutInject } from '@/hooks/core/useLayoutContext'
  import { useAppSetting } from '@/hooks/setting/useAppSetting'
  import { useRoute } from 'vue-router'
  import { openWindow } from '@/utils'
  import { isUrl } from '@/utils/is'

  defineOptions({ name: 'HeaderMenu' })

  const route = useRoute()
  const { getMenus, getParentPaths, handleMenuGo } = useMenu()
  const { getHeaderInverted } = useHeaderSetting()
  const { getNavMode } = useAppSetting()

  const {
    siderSelectedKey,
    headerSelectedKey,
    setHeaderSelectedKey,
    setSiderSelectedKey,
  } = useLayoutInject()

  const menus = ref<Menu[]>([])

  const getSelectedKey = computed(() => {
    const navMode = unref(getNavMode)
    if (navMode === ENavMode.HORIZONTAL_MIX) {
      return unref(headerSelectedKey)
    } else {
      return unref(siderSelectedKey)
    }
  })

  const setMenus = async () => {
    const navMode = unref(getNavMode)
    const list = unref(getMenus)

    if (navMode === ENavMode.HORIZONTAL) {
      menus.value = list
    } else if (navMode === ENavMode.HORIZONTAL_MIX) {
      const topMenus: Menu[] = list.map((item) => {
        return {
          ...omit(item, 'children'),
        }
      })
      menus.value = topMenus
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
    const navMode = unref(getNavMode)
    const parentPaths = getParentPaths(route.fullPath)
    if (navMode === ENavMode.HORIZONTAL_MIX) {
      setHeaderSelectedKey(parentPaths?.[0] || route.fullPath || '')
    } else {
      setSiderSelectedKey(route.fullPath)
    }
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
      if (nVal === ENavMode.VERTICAL) return

      // 重新设置菜单选择
      const siderKey = unref(siderSelectedKey)
      const headerKey = unref(headerSelectedKey)

      if (nVal === ENavMode.HORIZONTAL_MIX) {
        const rootPath = getParentPaths(siderKey)?.[0]
        setHeaderSelectedKey(rootPath || siderKey)
      }

      if (nVal === ENavMode.HORIZONTAL) {
        if (!siderKey && headerKey) {
          setSiderSelectedKey(headerKey)
        }
      }
    },
    { immediate: true },
  )

  const handleKeyChange = (key: string) => {
    if (isUrl(key)) {
      openWindow(key)
      return
    }

    const navMode = unref(getNavMode)
    if (navMode === ENavMode.HORIZONTAL_MIX) {
      setSiderSelectedKey('')
      setHeaderSelectedKey(key || '')
      const hasChildren = !!unref(getMenus).find((item) => item.path === key)
        ?.children
      if (!hasChildren) {
        handleMenuGo(key)
      }
    } else {
      setSiderSelectedKey(key)
      handleMenuGo(key)
    }
  }
</script>
