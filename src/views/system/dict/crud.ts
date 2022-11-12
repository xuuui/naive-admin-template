import { type CrudOptions, dict } from '@fast-crud/fast-crud'
import {
  CREATE_DICT,
  DELETE_DICT,
  GET_DICT_LIST,
  UPDATE_DICT,
} from '@/api/sys/dict'
import { EDictType } from '@/enums/sysEnum'
import { createRule } from '@/utils/rule'

export function createCrudOptions() {
  const pageRequest = async (query) => {
    return await GET_DICT_LIST({ ...query, type: EDictType.DICT })
  }
  const editRequest = async ({ form, row }) => {
    form.id = row.id
    return await UPDATE_DICT(form)
  }
  const delRequest = async ({ row }) => {
    return await DELETE_DICT({ id: row.id })
  }
  const addRequest = async ({ form }) => {
    return await CREATE_DICT({ ...form, type: EDictType.DICT })
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
        code: {
          title: '编码',
          type: 'text',
          form: {
            rule: [createRule('请输入编码')],
          },
        },
        label: {
          title: '字典名称',
          type: 'text',
          search: {
            show: true,
          },
          form: {
            rule: [createRule('请输入名称')],
          },
        },
        value: {
          title: '字典值',
          type: 'text',
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
    } as unknown as CrudOptions,
  }
}
