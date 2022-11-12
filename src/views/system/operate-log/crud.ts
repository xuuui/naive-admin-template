import { dict, type CrudOptions } from '@fast-crud/fast-crud'
import { EAccountType } from '@/enums/sysEnum'
import { GET_OPERATE_LOG_LIST } from '@/api/sys/operate-log'

export function createCrudOptions() {
  const pageRequest = async (query) => {
    return await GET_OPERATE_LOG_LIST({
      ...query,
      accountType: EAccountType.MANAGE,
    })
  }

  return {
    crudOptions: {
      request: {
        pageRequest,
      },
      actionbar: {
        buttons: {
          add: { show: false },
        },
      },
      rowHandle: {
        show: false,
      },
      columns: {
        operateUsername: {
          title: '用户',
          type: 'text',
          search: {
            show: true,
          },
        },
        operateType: {
          title: '操作类型',
          type: 'dict-radio',
          dict: dict({
            url: 'sys_operate_type',
          }),
          search: {
            show: true,
          },
        },
        operateDesc: {
          title: '操作描述',
          type: 'text',
        },
        operateIp: {
          title: 'IP',
          type: 'text',
        },
        operateIpAddress: {
          title: 'IP地址',
          type: 'text',
        },
        apiPath: {
          title: '接口路径',
          type: 'text',
        },
      },
    } as unknown as CrudOptions,
  }
}
