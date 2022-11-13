<template>
  <n-card content-style="padding: 0;" class="px-4">
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #pagination-left v-if="hasActionPermission('DEL')">
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
      <crud-empty :empty="isEmpty" />
    </fs-crud>
  </n-card>
</template>

<script lang="ts" setup>
  import { useExpose } from '@fast-crud/fast-crud'
  import { ref } from 'vue'
  import { createCrudOptions } from './crud'
  import { useCrud } from '@/hooks/useCrud'

  defineOptions({ name: 'SystemAccount' })

  const crudRef = ref()
  const crudBinding = ref()
  const { crudExpose } = useExpose({ crudRef, crudBinding })
  const { crudOptions } = createCrudOptions()
  const { handleBatchDelete, hasActionPermission, isEmpty } = useCrud({
    permissionScope: 'SystemAccount',
    crudExpose,
    crudOptions,
  })
</script>
