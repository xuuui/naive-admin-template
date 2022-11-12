<template>
  <div
    class="lg:flex lg:items-start lg:space-x-4 lg:space-y-0 w-full space-y-4"
  >
    <n-card
      content-style="padding: 0;"
      class="lg:w-3/7 lg:min-w-400px px-4 w-full relative"
    >
      <fs-crud
        table-layout="auto"
        ref="crudRef"
        class="h-full"
        v-bind="crudBinding"
      >
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
    </n-card>
    <n-card content-style="padding: 0;" class="lg:w-4/7 p-4 w-full relative">
      <dict-item
        v-if="currentRow?.id"
        :parentId="currentRow?.id"
        ref="dictItemRef"
      />
      <n-result v-if="!currentRow?.id" title="请选择后操作" />
    </n-card>
  </div>
</template>

<script lang="ts" setup>
  import { createCrudOptions } from './crud'
  import { useExpose } from '@fast-crud/fast-crud'
  import DictItem from './dict-item/index.vue'
  import { ref, unref } from 'vue'
  import { useCrud } from '@/hooks/useCrud'

  defineOptions({ name: 'SystemDict' })

  const dictItemRef = ref()
  const crudRef = ref()
  const crudBinding = ref()
  const { crudExpose } = useExpose({ crudRef, crudBinding })
  const { crudOptions } = createCrudOptions()
  const { handleBatchDelete, currentRow, hasActionPermission, isEmpty } =
    useCrud({
      permissionScope: 'SystemDict',
      crudExpose,
      crudOptions: crudOptions,
      currentRowChange() {
        unref(dictItemRef).doRefresh()
      },
    })
</script>
