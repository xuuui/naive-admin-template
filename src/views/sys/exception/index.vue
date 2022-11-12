<template>
  <ExceptionBase :type="status" />
</template>

<script lang="ts" setup>
  import { type PropType } from 'vue'
  import { EException } from '@/enums/exceptionEnum'
  import { ExceptionBase } from '@/components/ExceptionBase'

  defineOptions({ name: 'ErrorPage' })

  defineProps({
    status: {
      type: Number as PropType<EException>,
      default: EException.PAGE_NOT_FOUND,
    },
  })
</script>
