<template>
  <n-card content-style="padding: 0;" class="px-4">
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <crud-empty :empty="isEmpty" />
    </fs-crud>
  </n-card>
</template>

<script lang="ts" setup>
  import { useExpose } from '@fast-crud/fast-crud'
  import { ref } from 'vue'
  import { createCrudOptions } from './crud'
  import { useCrud } from '@/hooks/useCrud'

  defineOptions({ name: 'OperateLog' })

  const crudRef = ref()
  const crudBinding = ref()
  const { crudExpose } = useExpose({ crudRef, crudBinding })
  const { crudOptions } = createCrudOptions()
  const { isEmpty } = useCrud({
    permissionScope: 'OperateLog',
    crudExpose,
    crudOptions,
  })
</script>
