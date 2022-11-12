<template>
  <n-card
    class="relative h-full py-4 xl:w-250px w-auto"
    content-style="padding:0;display:flex;flex-direction: column;height:0;"
  >
    <n-radio-group
      v-if="isTenantMode"
      size="small"
      :value="accountType"
      @update:value="setAccountType"
      class="px-4 mb-4"
    >
      <n-radio-button
        v-for="item in accountTypeOptions"
        :key="item.value"
        :value="item.value"
        :label="item.label"
      />
    </n-radio-group>
    <div class="px-4 mb-4">
      <n-input-group>
        <n-button
          @click="handleCreate(null)"
          type="primary"
          size="small"
          v-if="hasActionPermission('add')"
        >
          添加
        </n-button>
        <n-input
          v-model:value="searchValue"
          type="text"
          size="small"
          placeholder="请输入关键词"
        />
        <n-button size="small">
          <n-icon>
            <SearchOutlined />
          </n-icon>
        </n-button>
      </n-input-group>
    </div>
    <n-scrollbar class="flex-1 px-4">
      <n-spin :show="loading">
        <n-tree
          blockNode
          block-line
          :show-irrelevant-nodes="true"
          :pattern="searchValue"
          :filter="treeFilter"
          :data="treeData"
          :render-suffix="renderSuffix"
          :render-label="renderLabel"
          :node-props="nodeProps"
          @update:selected-keys="handleSelect"
        >
          <template #empty>
            <Icon
              :size="150"
              icon="empty-data|svg"
              class="text-primary block mx-auto"
            /> </template
        ></n-tree>
      </n-spin>
    </n-scrollbar>
  </n-card>
</template>

<script lang="tsx" setup>
  import {
    nextTick,
    onMounted,
    ref,
    unref,
    withModifiers,
    computed,
    watch,
  } from 'vue'
  import {
    SearchOutlined,
    PlusSquareTwotone,
    DeleteTwotone,
  } from '@vicons/antd'
  import { useWeb } from '@/hooks/web/useWeb'
  import { type ResourceModel } from '@/models/sys/resource.model'
  import { NIcon, type TreeOption } from 'naive-ui'
  import { useCrudPermission } from '@/hooks/useCrudPermission'
  import { DELETE_RESOURCE, GET_RESOURCE_TREE } from '@/api/sys/resource'
  import { mapTree } from '@/utils/helper/treeHelper'
  import { EAccountType, PermissionAction } from '@/enums/sysEnum'
  import { useRequest } from 'vue-request'
  import { useResourceInject } from './useResourceContext'
  import { getGlobEnvConfig } from '@/utils/env'

  defineOptions({ name: 'ResourceTree' })

  const { setIsChange, setCurResource, accountType, setAccountType } =
    useResourceInject()
  const { VITE_GLOB_TENANT_MODE: isTenantMode } = getGlobEnvConfig()

  const { hasActionPermission } = useCrudPermission('SystemResource')
  const { message, createConfirm } = useWeb()
  const searchValue = ref('')
  const accountTypeOptions = [
    {
      label: '平台',
      value: EAccountType.MANAGE,
    },
    {
      label: '商户',
      value: EAccountType.TENANT,
    },
  ]
  const hoverId = ref('')
  const {
    data,
    runAsync: fetchResourcesList,
    loading,
  } = useRequest(
    async () => {
      return GET_RESOURCE_TREE({
        accountType: unref(accountType),
      })
    },
    {
      manual: true,
    },
  )

  watch(accountType, () => {
    fetchResourcesList()
  })

  const treeData = computed((): TreeOption[] => {
    return transformResourcesToTreeOptions(unref(data) || [])
  })

  const treeFilter = (search: string, node: TreeOption) => {
    return !!(node.label && node.label.includes(search))
  }

  const transformResourcesToTreeOptions = (
    resources: Partial<ResourceModel>[],
  ): TreeOption[] => {
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

  const nodeProps = ({ option }: { option: TreeOption }) => {
    return {
      onMouseover: withModifiers(() => {
        hoverId.value = option.key! as string
      }, ['stop']),
      onMouseleave: withModifiers(() => {
        hoverId.value = ''
      }, ['stop']),
    }
  }

  async function handleSelect(
    keys: Array<string | number>,
    option: Array<TreeOption | null>,
  ) {
    setCurResource(undefined)
    await nextTick()
    const resource =
      option.length > 0 ? (option[0]?.resource as ResourceModel) : undefined
    setCurResource(resource)
  }

  function renderLabel({ option }: { option: TreeOption }) {
    const active = option.label!.indexOf(unref(searchValue)) > -1
    return (
      <div>
        {active ? (
          <span>
            {option.label?.substr(0, option.label.indexOf(searchValue.value))}
            <span style="color: var(--primary-color)">{searchValue.value}</span>
            {option.label?.substr(
              option.label?.indexOf(searchValue.value) +
                searchValue.value.length,
            )}
          </span>
        ) : (
          <span>{option.label}</span>
        )}
      </div>
    )
  }

  function renderSuffix({ option }: { option: TreeOption }) {
    const hasPerm = (action: PermissionAction) => {
      return (
        hasActionPermission(action, !!option.isSys) &&
        hoverId.value === option.key
      )
    }
    const delProps = {
      class: 'flex items-center',
      onClick: withModifiers(() => handleDel([option.key as string]), ['stop']),
    }
    const addProps = {
      class: 'mr-[4px] flex items-center',
      onClick: withModifiers(
        () => handleCreate(option.key as string),
        ['stop'],
      ),
    }
    return (
      <>
        {hasPerm('add') && (
          <div {...addProps}>
            <NIcon size={16} color="var(--primary-color)">
              <PlusSquareTwotone />
            </NIcon>
          </div>
        )}
        {hasPerm('del') && (
          <div {...delProps}>
            <NIcon size={16} color="var(--error-color)">
              <DeleteTwotone />
            </NIcon>
          </div>
        )}
      </>
    )
  }

  const setChanged = () => {
    setIsChange(true)
  }

  const handleCreate = (parentId?: string | null) => {
    setCurResource(undefined)
    setCurResource({ parentId })
  }

  const handleDel = async (ids: string[]) => {
    if (!ids.length) {
      message.warning('请先选择删除记录')
      return
    }
    const confirm = createConfirm({
      type: 'warning',
      title: () => '确认',
      content: '您确定要删除该记录吗?',
      onPositiveClick: async () => {
        confirm.loading = true
        await DELETE_RESOURCE({ id: ids })
        message.success('删除成功')
        fetchResourcesList()
        setCurResource(undefined)
        setChanged()
      },
    })
  }

  onMounted(() => {
    fetchResourcesList()
  })

  defineExpose({ fetchResourcesList })
</script>

<style lang="scss">
  .n-tree-node-content__text {
    border-bottom: none !important;
  }
</style>
