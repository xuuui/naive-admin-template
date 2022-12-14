import {
  CREATE_ADMIN_ACCOUNT,
  DELETE_ACCOUNT,
  GET_ACCOUNT_LIST,
  UPDATE_ADMIN_ACCOUNT,
} from '@/api/sys/account'
import { isArray, merge } from 'lodash-es'
import { useCompute, dict, type CrudOptions } from '@fast-crud/fast-crud'
import { NPagination, NSpin } from 'naive-ui'
import { Icon } from '@/components/Icon'
import { useCrudPermission } from '@/hooks/useCrudPermission'
import type { AccountModel } from '@/models/sys/account.model'
import { createMobileRule, createRule } from '@/utils/rule'
import { useUserStore } from '@/store/modules/user'
import { useSearchRole } from './useSearchRole'

export function createCrudOptions(): CrudOptions {
  const userStore = useUserStore()
  const { hasActionPermission } = useCrudPermission('SystemAccount')
  const { roleOptions, roleState, fetchRoleList } = useSearchRole()
  const { compute } = useCompute()

  const pageRequest = async (query: any) => {
    return await GET_ACCOUNT_LIST({
      ...query,
      accountType: userStore.getAccountType,
      tenantId: userStore.getTenantId,
    })
  }
  const editRequest = async ({ form, row }) => {
    return await UPDATE_ADMIN_ACCOUNT({
      ...form,
      id: row.id,
    })
  }
  const delRequest = async ({ row }) => {
    return await DELETE_ACCOUNT({ id: row.id })
  }
  const addRequest = async ({ form }) => {
    return await CREATE_ADMIN_ACCOUNT({
      ...form,
      accountType: userStore.getAccountType,
      tenantId: userStore.getTenantId,
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
      rowHandle: {
        buttons: {
          remove: {
            show: compute(({ row }: { row: AccountModel }) => {
              return row?.identity?.isSuperAdmin
                ? false
                : hasActionPermission('DEL', !!row.isSys)
            }),
            disabled: compute(({ row }: { row: AccountModel }) => {
              return row?.identity?.isSuperAdmin
                ? true
                : !hasActionPermission('DEL', !!row.isSys)
            }),
          },
        },
      },
      toolbar: {
        buttons: {
          export: {
            show: false,
          },
        },
      },
      columns: {
        _select: {
          column: {
            disabled(row: AccountModel) {
              return row?.identity?.isSuperAdmin
                ? true
                : !hasActionPermission('DEL', !!row.isSys)
            },
          },
        },
        avatar: {
          title: '??????',
          type: 'image-uploader',
          form: {
            component: {
              limit: 1,
              uploader: {
                type: 'form',
              },
            },
          },
          valueBuilder: (context: any) => {
            context.row.avatar = context.row.user?.avatar
          },
          valueResolve: (context: any) => {
            const avatar = context.form.avatar
            context.form.user = merge(context.form?.user ?? {}, {
              avatar: isArray(avatar) ? avatar?.[0] ?? '' : avatar,
            })
          },
        },
        username: {
          title: '?????????',
          type: 'text',
          search: {
            show: true,
          },
          form: {
            show: compute((context) => {
              return !context.row.identity?.isSuperAdmin
            }),
            rule: [createRule('??????????????????')],
          },
        },
        password: {
          title: '??????',
          type: 'password',
          column: {
            show: false,
          },
          viewForm: {
            show: false,
          },
          addForm: {
            rule: [
              createRule('???????????????'),
              createRule('????????? 6 - 24 ?????????', { min: 6, max: 24 }),
            ],
          },
          editForm: {
            rule: [
              createRule('????????? 6 - 24 ?????????', {
                required: false,
                min: 6,
                max: 24,
              }),
            ],
            component: {
              placeholder: '?????????????????????',
            },
          },
        },
        mobile: {
          title: '?????????',
          type: 'text',
          form: {
            rule: [createMobileRule({ required: false })],
          },
        },
        roles: {
          title: '??????',
          type: 'dict-select',
          form: {
            show: compute((context) => {
              return !context.row.identity?.isSuperAdmin
            }),
            component: {
              name: 'n-select',
              vModel: 'value',
              filterable: true,
              multiple: true,
              remote: true,
              clearable: true,
              loading: roleState.loading,
              options: roleOptions,
              onSearch(query: string) {
                fetchRoleList(query)
              },
              onFocus() {
                fetchRoleList()
              },
              fallbackOption: compute((context) => {
                return (value: string) => {
                  const item = context.row.roles?.find(
                    (item) => item.value == value,
                  )
                  return item
                }
              }),
              children: {
                action: () => (
                  <NPagination
                    page-slot={6}
                    size="small"
                    page-count={roleState.totalPage.value}
                    v-models={[
                      [roleState.current.value, 'page'],
                      [roleState.pageSize.value, 'page-size'],
                    ]}
                  />
                ),
                empty: () =>
                  roleState.loading.value ? (
                    <NSpin show={true} />
                  ) : (
                    <Icon
                      size={120}
                      icon="empty-data|svg"
                      class="text-primary"
                    />
                  ),
              },
            },
            valueBuilder: (context: any) => {
              context.form.roles = context.row.roles?.map(
                (item: any) => item.value,
              )
            },
            valueResolve: (context: any) => {
              context.form.roleIds = context.form?.roles
            },
          },
          valueBuilder: (context: any) => {
            context.row.roles = context.row.roles.map((item: any) => ({
              label: item.name,
              value: item.id,
            }))
          },
        },
        remarks: {
          title: '??????',
          type: 'text',
          form: {
            component: {
              type: 'textarea',
            },
          },
        },
        isSys: {
          title: '????????????',
          type: 'dict-radio',
          dict: dict({ url: 'sys_yes_no' }),
          form: {
            show: compute((context) => {
              return !context.row.identity?.isSuperAdmin
            }),
          },
        },
      },
    } as unknown as CrudOptions,
  }
}
