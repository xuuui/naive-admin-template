import { type CrudOptions, dict } from '@fast-crud/fast-crud'
import {
  CREATE_DICT,
  DELETE_DICT,
  GET_DICT_LIST,
  UPDATE_DICT,
} from '@/api/sys/dict'
import { EDictType } from '@/enums/sysEnum'
import { unref, type Ref } from 'vue'
import { createRule } from '@/utils/rule'

export interface CreateCrudOptions {
  parentId: Ref<string | undefined>
}

export function createCrudOptions({ parentId }: CreateCrudOptions) {
  const pageRequest = async (query) => {
    return await GET_DICT_LIST({
      ...query,
      parentId: unref(parentId),
      type: EDictType.DICT_ITEM,
    })
  }
  const editRequest = async ({ form, row }) => {
    form.id = row.id
    return await UPDATE_DICT(form)
  }
  const delRequest = async ({ row }) => {
    return await DELETE_DICT({ id: row.id })
  }
  const addRequest = async ({ form }) => {
    return await CREATE_DICT({
      ...form,
      parentId: unref(parentId),
      type: EDictType.DICT_ITEM,
    })
  }

  return {
    crudOptions: {
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest,
      },
      toolbar: {
        buttons: {
          export: {
            show: false,
          },
        },
      },
      columns: {
        label: {
          title: '项名称',
          type: 'text',
          search: {
            show: true,
          },
          form: {
            rule: [createRule('请输入名称')],
          },
        },
        value: {
          title: '键值',
          type: 'text',
          form: {
            rule: [createRule('请输入键值')],
          },
          valueResolve: (ctx) => {
            ctx.form.value = ctx.form.value?.toString()
          },
          valueBuilder: (ctx) => {
            ctx.row.value = ctx.row.value?.toString()
          },
        },
        isSys: {
          title: '系统内置',
          type: 'dict-radio',
          viewForm: {
            show: true,
          },
          dict: dict({ url: 'sys_yes_no' }),
        },
      },
    },
  } as unknown as CrudOptions
}
