import { useCompute } from '@fast-crud/fast-crud'
import { useUserStore } from '@/store/modules/user'
import { usePermission } from './web/usePermission'
import { merge } from 'lodash-es'
import { type BasicEntityModel } from '@/models/base.model'
import { PermissionAction } from '@/enums/sysEnum'

export function useCrudPermission(prefix: string, _extra?: any) {
  const userStore = useUserStore()

  const { compute } = useCompute()

  const { hasPermission } = usePermission()

  const getPermissionCode = (action: PermissionAction): string => {
    return `${prefix}:${action}`
  }

  const hasActionPermission = (
    action: PermissionAction,
    isSys = false,
  ): boolean => {
    return !!isSys
      ? !!userStore.getIsSuperAdmin
      : hasPermission([getPermissionCode(action)])
  }

  const buildCrudPermission = (options: any = {}) => {
    let per: Recordable = {}
    if (prefix) {
      per = {
        columns: {
          _select: {
            column: {
              disabled(row: BasicEntityModel & Recordable) {
                return !hasActionPermission('del', row.isSys)
              },
            },
          },
        },
        actionbar: {
          buttons: {
            add: { show: hasActionPermission('add') },
          },
        },
        rowHandle: {
          buttons: {
            edit: {
              show: compute(({ row }) => {
                return hasActionPermission('edit', row.isSys)
              }),
              disabled: compute(({ row }) => {
                return !hasActionPermission('edit', row.isSys)
              }),
            },
            remove: {
              show: compute(({ row }) => {
                return hasActionPermission('del', row.isSys)
              }),
              disabled: compute(({ row }) => {
                return !hasActionPermission('del', row.isSys)
              }),
            },
            view: {
              show: compute(({ row }) => {
                return hasActionPermission('view', row.isSys)
              }),
              disabled: compute(({ row }) => {
                return !hasActionPermission('view', row.isSys)
              }),
            },
          },
        },
      }
    }

    if (options?.columns?.isSys) {
      options.columns.isSys.form = merge({}, options.columns.isSys.form, {
        value: 0,
        show: options.columns.isSys.form?.show
          ? options.columns.isSys.form?.show
          : !!userStore.getIsSuperAdmin,
      })
    }

    let extra = {}
    if (_extra && _extra instanceof Function) {
      extra = _extra({ hasActionPermission })
    }

    return merge({}, per, extra, options)
  }

  return { buildCrudPermission, hasActionPermission }
}
