import { PaginationResult } from '@/api/base.model'
import { GET_SHOP_LIST } from '@/api/common/shop'
import { ShopModel } from '@/models/common/shop.model'
import { useUserStore } from '@/store/modules/user'
import { computed, onMounted, ref, unref, watch } from 'vue'
import { usePagination } from 'vue-request'

export function useShopSelect() {
  const userStore = useUserStore()
  const currentShopId = ref()
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
      query?: string,
    ): Promise<PaginationResult<ShopModel>> => {
      return await GET_SHOP_LIST({
        ...params,
        name: query,
      })
    },
    {
      defaultParams: [
        {
          limit: 8,
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

  const fetchShopList = async (query?: string) => {
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

  watch(list, (val) => {
    if (val?.length) {
      currentShopId.value = userStore.getShopId
    }
  })

  onMounted(() => {
    fetchShopList()
  })

  return {
    shopOptions: list,
    shopState: {
      current,
      totalPage,
      loading,
      pageSize,
    },
    currentShopId,
    changeShopCurrent: changeCurrent,
    fetchShopList,
  }
}
