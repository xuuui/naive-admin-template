<template>
  <fs-crud ref="crudRef" v-bind="crudBinding">
    <template #pagination-left v-if="hasActionPermission('del')">
      <n-tooltip>
        <template #trigger>
          <n-button
            secondary
            size="small"
            type="error"
            @click="handleBatchDelete"
            :disabled="isEmpty"
          >
            <template #icon>
              <Icon icon="ant-design:delete-outlined" />
            </template>
          </n-button>
        </template>
        批量删除
      </n-tooltip>
    </template>
    <crud-empty />
  </fs-crud>
</template>

<script lang="tsx" setup>
  import { createCrudOptions } from './crud'
  import { useExpose } from '@fast-crud/fast-crud'
  import { ref, toRefs } from 'vue'
  import { useCrud } from '@/hooks/useCrud'

  defineOptions({ name: 'DictItem' })

  interface Props {
    parentId: string
  }

  const props = defineProps<Props>()
  const { parentId } = toRefs(props)

  const crudRef = ref()
  const crudBinding = ref()
  const { crudExpose } = useExpose({ crudRef, crudBinding })
  const { crudOptions } = createCrudOptions({ parentId })

  const { handleBatchDelete, hasActionPermission, isEmpty } = useCrud({
    permissionScope: 'SystemDict',
    crudExpose,
    crudOptions,
  })

  defineExpose({
    setSearchFormData: crudExpose.setSearchFormData,
    doRefresh: crudExpose.doRefresh,
  })
</script>
