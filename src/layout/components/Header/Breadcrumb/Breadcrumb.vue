<template>
  <div :class="`${getPrefixCls}-breadcrumb`">
    <n-breadcrumb>
      <template v-for="item in breadcrumbList" :key="item.key">
        <n-breadcrumb-item
          :clickable="false"
          :separator="item.children?.length == 0 ? '' : '/'"
        >
          <n-dropdown
            v-if="item.children?.length"
            :options="item.children"
            :render-icon="renderDropdownIcon"
            @select="dropdownSelect"
          >
            <div class="flex items-center">
              <Icon
                class="mr-1"
                v-if="getBreadcrumbIconShow && item.meta.icon"
                :icon="item.meta?.icon!"
              />
              <span style="transition: none">{{ item.label }}</span>
            </div>
          </n-dropdown>
          <div class="flex items-center" v-else>
            <Icon
              v-if="getBreadcrumbIconShow && item.meta.icon"
              :icon="item.meta?.icon!"
              class="mr-1"
            />
            <span style="transition: none">{{ item.label }}</span>
          </div>
        </n-breadcrumb-item>
      </template>
    </n-breadcrumb>
  </div>
</template>

<script setup lang="ts">
  import type { DropdownOption } from 'naive-ui'

  import { computed } from 'vue'
  import { type RouteMeta, useRoute, useRouter } from 'vue-router'
  import { useDesign } from '@/hooks/web/useDesign'
  import { useHeaderSetting } from '@/hooks/setting/useHeaderSetting'
  import type { AppRouteRecordRaw } from '#/router'
  import { Icon, renderIcon } from '@/components/Icon'

  defineOptions({ name: 'Breadcrumb' })

  const { getPrefixCls } = useDesign('layout-header')
  const route = useRoute()
  const router = useRouter()
  const { getBreadcrumbIconShow } = useHeaderSetting()

  const generator = (routes: AppRouteRecordRaw[]) => {
    return routes.map((item) => {
      const current: DropdownOption & { meta: RouteMeta } = {
        label: item.meta?.title,
        key: item.name,
        disabled: item.path === '/',
        meta: item.meta || {},
      }
      if (item.children && item.children.length > 0) {
        current.children = generator(item.children)
      }
      return current
    })
  }

  function renderDropdownIcon(option: DropdownOption) {
    return renderIcon(
      (option as DropdownOption & { meta: RouteMeta }).meta?.icon || '',
    )
  }

  const breadcrumbList = computed(() => {
    return generator(route.matched as unknown as AppRouteRecordRaw[])
  })

  const dropdownSelect = (key: string) => {
    router.push({ name: key })
  }
</script>
