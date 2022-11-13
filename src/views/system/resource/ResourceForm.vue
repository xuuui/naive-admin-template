<template>
  <div>
    <div class="text-lg font-bold pb-4">{{ getTitle }}</div>
    <n-form
      ref="formRef"
      :model="form"
      :rules="getRules"
      label-placement="left"
      label-align="right"
    >
      <n-grid :cols="24" :x-gap="24">
        <n-form-item-gi :span="24" label="资源类型" path="type">
          <n-radio-group v-model:value="form.type">
            <n-radio-button
              v-for="item in typeOptions"
              :key="item.value"
              :value="item.value"
              :label="item.label"
              :disabled="curResource?.id && item.value !== curResource.type"
            />
          </n-radio-group>
        </n-form-item-gi>
      </n-grid>
      <n-grid :cols="24" :x-gap="24">
        <n-form-item-gi :span="12" label="显示名称" path="title">
          <n-input v-model:value="form.title" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="名称" path="name">
          <n-input v-model:value="form.name" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="上级菜单" path="parentId">
          <n-tree-select
            :options="parentOptions"
            v-model:value="form.parentId"
            :loading="treeLoading"
            :default-expanded-keys="form.parentId ? [form.parentId] : []"
          >
            <template #empty>
              <Icon size="{120}" icon="empty-data|svg" class="text-primary" />
            </template>
          </n-tree-select>
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="排序" path="sort">
          <n-input-number v-model:value="form.sort" :min="0" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="图标" path="icon" v-if="!isButton">
          <icon-picker v-model:value="form.icon" :disabled="isButton" />
        </n-form-item-gi>
        <n-form-item-gi
          :span="12"
          label="路由地址"
          path="path"
          v-if="!isButton"
        >
          <n-input v-model:value="form.path" />
        </n-form-item-gi>
        <n-form-item-gi
          :span="12"
          label="组件路径"
          path="component"
          v-if="isMenu"
        >
          <n-input v-model:value="form.component" />
        </n-form-item-gi>
        <n-form-item-gi
          :span="12"
          label="权限标识"
          path="permission"
          v-if="!isRoute"
        >
          <n-input v-model:value="form.permission" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="状态" path="state">
          <n-switch
            v-model:value="form.state"
            :checked-value="1"
            :unchecked-value="0"
          >
            <template #checked> 启用 </template>
            <template #unchecked> 禁用 </template>
          </n-switch>
        </n-form-item-gi>
        <n-form-item-gi
          :span="12"
          label="是否缓存"
          path="isCache"
          v-if="isMenu"
        >
          <n-switch
            v-model:value="form.isCache"
            :checked-value="1"
            :unchecked-value="0"
          >
            <template #checked> 是 </template>
            <template #unchecked> 否 </template>
          </n-switch>
        </n-form-item-gi>
        <n-form-item-gi
          :span="12"
          label="是否显示"
          path="isVisible"
          v-if="!isButton"
        >
          <n-switch
            v-model:value="form.isVisible"
            :checked-value="1"
            :unchecked-value="0"
          >
            <template #checked> 是 </template>
            <template #unchecked> 否 </template>
          </n-switch>
        </n-form-item-gi>
      </n-grid>
    </n-form>
    <div
      class="w-full mr-10px"
      v-if="
        isUpdate
          ? hasActionPermission('EDIT', curResource?.isSys)
          : hasActionPermission('ADD', curResource?.isSys)
      "
    >
      <n-button
        :loading="submitLoading"
        class="float-right"
        type="primary"
        @click="handleSubmit"
        >保存
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {
    CREATE_RESOURCE,
    GET_RESOURCE_TREE,
    UPDATE_RESOURCE,
  } from '@/api/sys/resource'
  import { EResourceType } from '@/enums/sysEnum'
  import { type ResourceModel } from '@/models/sys/resource.model'
  import { mapTree } from '@/utils/helper/treeHelper'
  import { type FormInst, type TreeSelectOption } from 'naive-ui'
  import { IconPicker } from '@/components/Icon'
  import { computed, onMounted, ref, unref, watch } from 'vue'
  import { useCrudPermission } from '@/hooks/useCrudPermission'
  import { useWeb } from '@/hooks/web/useWeb'
  import { useRequest } from 'vue-request'
  import { useResourceInject } from './useResourceContext'
  import { omit, values } from 'lodash-es'

  defineOptions({ name: 'ResourceForm' })

  const {
    setIsChange,
    curResource,
    setCurResource,
    accountType,
    resourceTreeRef,
  } = useResourceInject()

  const isUpdate = computed(() => !!unref(curResource)?.id)
  const { message } = useWeb()
  const { hasActionPermission } = useCrudPermission('SystemResource')
  const submitLoading = ref(false)
  const formRef = ref<FormInst | null>(null)

  const {
    loading: treeLoading,
    runAsync: fetchTreeData,
    data,
  } = useRequest(
    async () => {
      return GET_RESOURCE_TREE({
        accountType: unref(accountType),
      })
    },
    { manual: true },
  )

  const parentOptions = computed(() =>
    transformResourcesToTreeOptions(unref(data) || []),
  )

  const defForm = {
    type: EResourceType.MENU,
    title: '',
    name: '',
    parentId: null,
    sort: 0,
    icon: '',
    path: '',
    component: 'LAYOUT',
    permission: '',
    state: 1,
    isCache: 1,
    isVisible: 1,
  }

  const form = ref<Partial<ResourceModel>>(defForm)

  watch(
    () => form.value.type,
    (val) => {
      form.value = {
        ...defForm,
        ...unref(curResource),
        type: val,
      }
    },
  )

  watch(
    curResource,
    async (val) => {
      form.value = defForm
      if (val?.parentId) {
        form.value.parentId = val.parentId
      }

      if (val?.id) {
        form.value = {
          ...defForm,
          ...val,
        }
      }
    },
    { immediate: true, deep: true },
  )

  const setChanged = () => {
    setIsChange(true)
  }
  const getTitle = computed(() =>
    !unref(isUpdate) ? '新增' : `编辑：${unref(curResource)?.title}`,
  )

  const typeOptions = [
    { label: '路由', value: EResourceType.ROUTE },
    { label: '菜单', value: EResourceType.MENU },
    { label: '按钮', value: EResourceType.BUTTON },
  ]

  const isRoute = computed(() => {
    return unref(form).type === EResourceType.ROUTE
  })
  const isMenu = computed(() => {
    return unref(form).type === EResourceType.MENU
  })
  const isButton = computed(() => {
    return unref(form).type === EResourceType.BUTTON
  })

  const createRule = (message: string) => {
    return {
      required: true,
      message,
      trigger: 'change',
    }
  }

  const transformResourcesToTreeOptions = (
    resources: Partial<ResourceModel>[],
  ): TreeSelectOption[] => {
    return mapTree(resources, (resource) => {
      return {
        resource: resource,
        label: resource.title,
        key: resource.id!,
        isSys: resource.isSys,
        value: resource.id,
      }
    })
  }

  const getRules = computed(() => {
    return {
      title: {
        ...createRule('请输入显示名称'),
      },
      name: {
        ...createRule('请输入名称'),
      },
      path: {
        ...(unref(isButton) ? {} : createRule('请输入路由地址')),
      },
    }
  })

  const handleSubmit = async () => {
    formRef.value
      ?.validate(async (errors) => {
        if (!errors) {
          try {
            submitLoading.value = true
            if (unref(isUpdate)) {
              await UPDATE_RESOURCE({
                ...unref(form),
                id: unref(curResource)!.id,
              })
            } else {
              await CREATE_RESOURCE({
                ...unref(form),
                accountType: unref(accountType),
              }).then((res) => {
                setCurResource(res)
              })
            }
            setChanged()
            message.success('保存成功')
            await fetchTreeData()
            unref(resourceTreeRef).fetchResourcesList()
          } finally {
            submitLoading.value = false
          }
        }
      })
      .catch(console.log)
  }

  onMounted(async () => {
    await fetchTreeData()
  })
</script>
