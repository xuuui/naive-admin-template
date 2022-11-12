<template>
  <div class="w-full space-y-4 lg:h-full lg:flex lg:space-x-4 lg:space-y-0">
    <ResourceTree ref="resourceTreeRef" />
    <div
      class="w-full relative space-y-4 lg:h-full lg:flex-1 xl:flex xl:space-x-4 xl:space-y-0"
    >
      <n-card class="w-full relative xl:flex-1">
        <ResourceForm v-if="curResource" />
        <n-result class="p-4" v-if="!curResource" title="请选择后操作" />
      </n-card>
      <n-card class="w-full xl:flex-1">
        <n-result
          class="p-4"
          status="404"
          title="404"
          sub-title="Sorry, the page you visited does not exist."
        />
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { usePermission } from '@/hooks/web/usePermission'
  import { useWeb } from '@/hooks/web/useWeb'
  import { unref } from 'vue'
  import { onBeforeRouteLeave } from 'vue-router'
  import ResourceTree from './ResourceTree.vue'
  import ResourceForm from './ResourceForm.vue'
  import { useResourceProvider } from './useResourceContext'
  defineOptions({ name: 'SystemResource' })

  const { refreshMenu } = usePermission()
  const { message } = useWeb()
  const { isChange, curResource, resourceTreeRef } = useResourceProvider()

  onBeforeRouteLeave(() => {
    if (unref(isChange)) {
      message.info('检测到菜单已修改，将重新加载菜单', {
        duration: 1500,
        onLeave: () => {
          refreshMenu()
        },
      })
    }
  })
</script>

<style scoped></style>
