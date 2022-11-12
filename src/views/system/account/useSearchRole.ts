import { GET_ROLE_LIST } from '@/api/sys/role'
import { PaginationResult } from '@/models/base.model'
import { RoleModel } from '@/models/sys/role.model'
import { useUserStore } from '@/store/modules/user'
import { computed, unref } from 'vue'
import { usePagination } from 'vue-request'

export function useSearchRole() {
  const userStore = useUserStore()

  const {
    data,
    runAsync,
    current,
    totalPage,
    loading,
    pageSize,
    changeCurrent,
  } = usePagination(
    async (
      params: {
        page?: number
        limit?: number
      },
      name?: string,
    ): Promise<PaginationResult<RoleModel>> => {
      return await GET_ROLE_LIST({
        ...params,
        name,
        accountType: userStore.getAccountType,
        tenantId: userStore.getTenantId,
      })
    },
    {
      defaultParams: [
        {
          limit: 10,
        },
      ],
      pagination: {
        currentKey: 'page',
        pageSizeKey: 'limit',
        totalKey: 'total',
      },
      manual: true,
    },
  )

  const fetchRoleList = async (query?: string) => {
    await runAsync(
      {
        limit: pageSize.value,
        page: current.value,
      },
      query,
    )
  }

  const list = computed(
    () =>
      unref(data)?.result.map((item) => ({
        label: item.name,
        value: item.id,
      })) || [],
  )

  return {
    roleOptions: list,
    roleState: {
      current,
      totalPage,
      loading,
      pageSize,
    },
    changeCurrent,
    fetchRoleList,
  }
}
