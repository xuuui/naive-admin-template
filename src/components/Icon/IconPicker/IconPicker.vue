<template>
  <n-input-group>
    <n-input
      disabled
      :style="{ width }"
      placeholder="点击选择图标"
      v-model:value="currentSelect"
    />
    <n-popover
      placement="bottom"
      trigger="click"
      scrollable
      v-model:show="visible"
      :to="false"
      :width="300"
      content-style="padding: 0;"
    >
      <template #header>
        <div class="flex justify-between">
          <n-input placeholder="搜索图标" v-model:value="search" clearable />
        </div>
      </template>

      <div v-if="getPaginationList.length">
        <n-scrollbar style="max-height: 240px">
          <ul class="flex flex-wrap px-4">
            <li
              v-for="icon in getPaginationList"
              :key="icon"
              :class="[
                `hover:border-primary`,
                'hover:text-primary',
                currentSelect === icon ? 'border-primary text-primary' : '',
              ]"
              class="p-2 w-1/8 cursor-pointer mr-1 mt-1 flex justify-center items-center border border-solid"
              @click="handleClick(icon)"
              :title="icon"
            >
              <SvgIcon v-if="isSvgMode" :name="icon" />
              <Icon :icon="icon" v-else />
            </li>
          </ul>
        </n-scrollbar>
        <div
          class="flex py-2 items-center justify-center"
          v-if="getTotal >= pageSize"
        >
          <n-pagination
            :page-slot="6"
            size="small"
            :page-size="pageSize"
            :item-count="getTotal"
            @update:page="handlePageChange"
          />
        </div>
      </div>
      <template v-else>
        <div class="p-5"><n-empty /></div>
      </template>
      <template #trigger>
        <n-button :disabled="props.disabled">
          <n-icon>
            <SvgIcon :name="currentSelect" v-if="isSvgMode && currentSelect" />
            <Icon :icon="currentSelect || 'ion:apps-outline'" v-else />
          </n-icon>
        </n-button>
      </template>
    </n-popover>
  </n-input-group>
</template>
<script lang="ts" setup>
  import type { PropType } from 'vue'
  import { ref, watchEffect, watch, unref } from 'vue'
  import Icon from '../Icon.vue'
  import { SvgIcon } from '../SvgIcon'
  import iconsData from '../data/icons.data'
  import { usePagination } from '@/hooks/web/usePagination'
  import { useDebounceFn, useClipboard } from '@vueuse/core'
  import svgIcons from 'virtual:svg-icons-names'
  import { useWeb } from '@/hooks/web/useWeb'

  defineOptions({ name: 'IconPicker' })

  function getIcons() {
    const data = iconsData
    const prefix: string = data?.prefix ?? ''
    let result: string[] = []
    if (prefix) {
      result = (data?.icons ?? []).map((item) => `${prefix}:${item}`)
    } else if (Array.isArray(iconsData)) {
      result = iconsData as string[]
    }
    return result
  }

  function getSvgIcons() {
    return svgIcons.map((icon: string) => icon.replace('icon-', ''))
  }

  const props = defineProps({
    value: String,
    width: {
      type: String,
      default: '100%',
    },
    pageSize: {
      type: Number,
      default: 140,
    },
    copy: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String as PropType<'svg' | 'iconify'>,
      default: 'iconify',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits(['change', 'update:value'])
  const { message } = useWeb()
  const isSvgMode = props.mode === 'svg'
  const icons = isSvgMode ? getSvgIcons() : getIcons()

  const currentSelect = ref()
  const visible = ref(false)
  const currentList = ref(icons)
  const search = ref('')

  const debounceHandleSearchChange = useDebounceFn(handleSearchChange, 100)
  const { copy, copied } = useClipboard({
    source: currentSelect,
  })

  const { getPaginationList, getTotal, setCurrentPage } = usePagination(
    currentList,
    props.pageSize,
  )

  watchEffect(() => {
    currentSelect.value = props.value
  })

  watch(search, debounceHandleSearchChange)

  watch(currentSelect, (v) => {
    emit('update:value', v)
    return emit('change', v)
  })

  function handlePageChange(page: number) {
    setCurrentPage(page)
  }

  async function handleClick(icon: string) {
    currentSelect.value = icon
    if (props.copy) {
      await copy()
      if (unref(copied)) {
        message.success('复制图标成功!')
      }
    }
  }

  function handleSearchChange(value: string) {
    if (!value) {
      setCurrentPage(1)
      currentList.value = icons
      return
    }
    currentList.value = icons.filter((item: string) => item.includes(value))
  }
</script>
