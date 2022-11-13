<template>
  <div>
    <RouterView>
      <template #default="{ Component, route: r }">
        <transition
          :name="getTranstionEnable && !pageLoaded ? getTranstionName : ''"
          mode="out-in"
          appear
        >
          <keep-alive v-if="keepAliveRoutes" :include="keepAliveRoutes">
            <component :is="Component" :key="r.name" />
          </keep-alive>
          <component v-else :is="Component" :key="r.name" />
        </transition>
      </template>
    </RouterView>
  </div>
</template>

<script setup lang="ts">
  import { useTranstionSetting } from '@/hooks/setting/useTransitionSetting'
  import { useMultiTabStore } from '@/store/modules/multiTab'
  import { computed } from 'vue'
  import { RouterView, useRoute } from 'vue-router'
  defineOptions({ name: 'LayoutMain' })

  const route = useRoute()
  const multiTabStore = useMultiTabStore()
  const { getTranstionName, getTranstionEnable } = useTranstionSetting()

  const pageLoaded = computed(() => {
    return route.meta?.loaded
  })

  const keepAliveRoutes = computed(() => {
    return multiTabStore.getCachedTabList
  })
</script>
