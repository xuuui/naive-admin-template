import { JsonToSheet, jsonToSheetXlsx } from '@/components/Excel'
import type { BasicEntityModel } from '@/models/base.model'
import {
  useCrud as useFastCrud,
  type CrudOptions,
  type CrudExpose,
} from '@fast-crud/fast-crud'
import { isFunction, merge } from 'lodash-es'
import { computed, nextTick, onMounted, ref, unref, watch } from 'vue'
import useBoolean from './core/useBoolean'
import { useCrudPermission } from './useCrudPermission'
import { useWeb } from './web/useWeb'

export interface UseCrudOptions {
  permissionScope: string
  crudOptions: CrudOptions
  crudExpose: CrudExpose
  crudBinding?: any
  currentRowChange?: (row: BasicEntityModel & Recordable) => void
  columns?: {
    selection?: boolean
    createdAt?: boolean
  }
  exportOptions?: Omit<JsonToSheet, 'data'> & {
    transformFn?: (val: any) => any
  }
}

const DEF_SORT = 'DESC'

export function useCrud<T extends BasicEntityModel & Recordable>({
  permissionScope,
  crudOptions,
  crudExpose,
  crudBinding,
  currentRowChange,
  columns,
  exportOptions,
}: UseCrudOptions) {
  columns = merge({ selection: true, createdAt: true }, columns)
  const { buildCrudPermission, hasActionPermission } =
    useCrudPermission(permissionScope)
  const { message, createConfirm } = useWeb()
  const currentRow = ref<T>()
  const selectedRowKeys = ref<Array<number | string>>([])
  const { bool: isEmpty, setBool: setIsEmpty } = useBoolean()
  const tableData = ref([])
  const sort = ref<{ field: string; order: string }[]>([])

  const onSelectedRowKeysChange = (changed: Array<number | string>) => {
    selectedRowKeys.value = changed
  }

  const getCrudOptions = computed(() => {
    const base: Recordable = {
      columns: {},
    }
    if (columns?.selection) {
      base.columns._select = {
        title: '选择',
        form: { show: false },
        column: {
          type: 'selection',
          width: '50px',
          columnSetDisabled: true,
        },
      }
      base.table = {
        'onUpdate:checkedRowKeys': onSelectedRowKeysChange,
        'onUpdate:sorter': (opt) => {
          const idx = unref(sort).findIndex(
            (item) => item.field === opt.columnKey,
          )
          function getSort(key, order) {
            if (order === 'ascend') {
              return 'ASC'
            } else if (order === 'descend') {
              return 'DESC'
            }
            return (
              unref(getCrudOptions).columns?.[key]?.column?.defaultSort ??
              DEF_SORT
            )
          }
          if (idx >= 0) {
            sort.value[idx].order = getSort(opt.columnKey, opt.order)
          }
          const item = sort.value[idx]
          sort.value.splice(idx, 1)
          sort.value.unshift(item)
          crudExpose.doRefresh()
        },
        rowProps: (row: T) => {
          return {
            class: [
              'cursor-pointer',
              {
                'naive-data-table-row--hover': row.id === unref(currentRow)?.id,
              },
            ],
            onClick: () => {
              onCurrentRowChange(row)
            },
          }
        },
      }
    }
    if (columns?.createdAt) {
      base.columns.createdAt = {
        title: '创建时间',
        editForm: { show: false },
        addForm: { show: false },
        type: 'text',
        column: {
          order: 999,
          sorter: true,
        },
      }
      base.columns.dateRange = {
        title: '创建时间',
        form: { show: false },
        type: 'daterange',
        search: {
          show: true,
          order: 999,
          component: {
            style: { width: '240px' },
            props: {
              clearable: true,
            },
          },
        },
        column: {
          show: false,
        },
      }
    }
    const opts = merge(
      base,
      {
        form: {
          wrapper: {
            style: { width: '600px' },
          },
          col: { span: 24 },
        },
        toolbar: {
          buttons: {
            refresh: {
              click: () => {
                if (columns?.selection) {
                  currentRow.value = undefined
                }
                crudExpose.doRefresh()
              },
            },
            export: {
              show: true,
              click: async () => {
                exportOptions &&
                  jsonToSheetXlsx({
                    data: isFunction(exportOptions?.transformFn)
                      ? unref(tableData).map((s) => {
                          return exportOptions!.transformFn!(s)
                        })
                      : unref(tableData),
                    ...exportOptions,
                  })
              },
            },
          },
        },
        table: {
          onDataChange({ data }) {
            tableData.value = unref(data)
            setIsEmpty(data.length === 0)
          },
        },
        pagination: {
          showSizeChanger: false,
        },
        search: {
          show: true,
        },
      },
      crudOptions,
      {
        request: {
          pageRequest: (args) => {
            return crudOptions.request?.pageRequest!({
              ...args,
              sort: unref(sort),
            })
          },
        },
      },
    )
    for (const key in opts.columns) {
      const item = opts.columns[key]
      item.column = merge(
        {
          align: 'center',
        },
        item.column,
      )
      if (item?.search?.show) {
        item.search = merge(
          {
            component: {
              size: 'small',
              autocomplete: 'off',
              style: { width: '140px' },
            },
          },
          item.search,
        )
      }
    }
    return buildCrudPermission(opts)
  })

  watch(
    () => getCrudOptions.value.columns,
    (val) => {
      const keys = Object.keys(val).filter((key) => val[key]?.column?.sorter)
      keys.map((key) => {
        const idx = sort.value.findIndex((item) => item.field === key)
        if (idx === -1) {
          sort.value.unshift({
            field: key,
            order: val[key]?.column?.defaultSort ?? DEF_SORT,
          })
        }
      })
    },
    { immediate: true },
  )

  const onCurrentRowChange = async (row: T) => {
    if (currentRow.value === row) {
      currentRow.value = undefined
      return
    }
    currentRow.value = undefined
    await nextTick()
    currentRow.value = row
    currentRowChange && currentRowChange(row)
  }

  onMounted(() => {
    crudExpose.doRefresh()
  })

  const handleBatchDelete = () => {
    const keys = unref(selectedRowKeys)
    if (keys?.length > 0) {
      const confirm = createConfirm({
        content: `确定要批量删除这${keys.length}条记录吗？`,
        async onPositiveClick() {
          confirm.loading = true
          await unref(getCrudOptions).request?.delRequest!({
            row: { id: keys },
          })
          confirm.loading = false
          message.success('删除成功')
          currentRow.value = undefined
          selectedRowKeys.value = []
          crudExpose.doRefresh()
        },
      })
    } else {
      message.warning('请先勾选记录')
    }
  }

  const { resetCrudOptions } = useFastCrud({
    crudExpose,
    crudOptions: getCrudOptions.value,
  })

  return {
    currentRow,
    selectedRowKeys,
    getCrudOptions: getCrudOptions,
    handleBatchDelete,
    resetCrudOptions,
    hasActionPermission,
    isEmpty,
  }
}
