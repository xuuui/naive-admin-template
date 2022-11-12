import { ref, unref, computed, type Ref } from 'vue'

const pagination = <T = any>(
  list: T[],
  pageNo: number,
  pageSize: number,
): T[] => {
  const offset = (pageNo - 1) * Number(pageSize)
  const ret =
    offset + Number(pageSize) >= list.length
      ? list.slice(offset, list.length)
      : list.slice(offset, offset + Number(pageSize))
  return ret
}

export const usePagination = <T = any>(list: Ref<T[]>, pageSize: number) => {
  const currentPage = ref(1)
  const pageSizeRef = ref(pageSize)

  const getPaginationList = computed(() => {
    return pagination(unref(list), unref(currentPage), unref(pageSizeRef))
  })

  const getTotal = computed(() => {
    return unref(list).length
  })

  const setCurrentPage = (page: number) => {
    currentPage.value = page
  }

  const setPageSize = (pageSize: number) => {
    pageSizeRef.value = pageSize
  }

  return {
    setCurrentPage,
    getTotal,
    setPageSize,
    getPaginationList,
  }
}
