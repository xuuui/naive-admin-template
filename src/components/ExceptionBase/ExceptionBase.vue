<template>
  <div class="flex flex-col items-center justify-center w-full h-full">
    <div class="text-primary">
      <Icon
        size="400"
        icon="no-permission|svg"
        v-if="type === EException.PAGE_NOT_ACCESS"
      />
      <Icon
        size="400"
        icon="not-found|svg"
        v-if="type === EException.PAGE_NOT_FOUND"
      />
      <Icon
        size="400"
        icon="service-error|svg"
        v-if="type === EException.SERVICE_ERROR"
      />
    </div>
    <n-button type="primary" @click="go()">回到首页</n-button>
  </div>
</template>

<script lang="ts" setup>
  import { EException } from '@/enums/exceptionEnum'
  import { useGo } from '@/hooks/web/usePage'

  defineOptions({ name: 'ExceptionBase' })

  interface Props {
    type: EException
  }

  defineProps<Props>()
  const go = useGo()
</script>
