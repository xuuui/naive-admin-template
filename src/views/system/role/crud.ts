import { type CrudOptions, dict } from '@fast-crud/fast-crud'
import { GET_RESOURCE_TREE } from '@/api/sys/resource'
import {
  CREATE_ROLE,
  DELETE_ROLE,
  GET_ROLE_LIST,
  UPDATE_ROLE,
} from '@/api/sys/role'
import { omit } from 'lodash-es'
import { mapTree } from '@/utils/helper/treeHelper'
import { createRule } from '@/utils/rule'
import { useUserStore } from '@/store/modules/user'

export function createCrudOptions() {
  const userStore = useUserStore()
  const pageRequest = async (query) => {
    return await GET_ROLE_LIST({
      ...query,
      accountType: userStore.getAccountType,
      tenantId: userStore.getTenantId,
    })
  }
  const editRequest = async ({ form, row }) => {
    form.id = row.id
    return await UPDATE_ROLE({ ...form })
  }
  const delRequest = async ({ row }) => {
    return await DELETE_ROLE({ id: row.id })
  }
  const addRequest = async ({ form }) => {
    return await CREATE_ROLE({
      ...omit(form, 'resources'),
      accountType: userStore.getAccountType,
      tenantId: userStore.getTenantId,
    })
  }

  return {
    crudOptions: {
      //请求配置
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
        name: {
          title: '名称',
          type: 'text',
          search: {
            show: true,
          },
          form: {
            rule: [createRule('请输入名称')],
          },
        },
        resources: {
          title: '资源权限',
          type: 'dict-tree',
          column: {
            show: true,
          },
          dict: dict({
            cloneable: false,
            isTree: true,
            label: 'title',
            value: 'id',
            getData: async () => {
              return await GET_RESOURCE_TREE({
                accountType: userStore.getAccountType,
              }).then((res) => {
                return mapTree(res, (item) => {
                  return {
                    title: item.title,
                    id: item.id,
                  }
                })
              })
            },
          }),
          form: {
            component: {
              labelField: 'title',
              keyField: 'id',
              childrenField: 'children',
              checkable: true,
              checkedStrategy: 'all',
              multiple: true,
              defaultExpandAll: true,
            },
          },
          valueBuilder: (context) => {
            context.row.resources = context.row.resources.map((item) => item.id)
          },
          valueResolve: (context) => {
            context.form.resourceIds = context.form.resources
          },
        },
        remarks: {
          title: '备注',
          type: 'text',
          form: {
            component: {
              type: 'textarea',
            },
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
    } as unknown as CrudOptions,
  }
}
