<template>
  <div :id="id"></div>
</template>

<script setup lang="ts">
  import { buildUUID } from '@/utils/uuid'
  import { createApp, h, nextTick, onMounted, ref, watch } from 'vue'
  import { Icon } from '../Icon'

  defineOptions({ name: 'CrudEmpty' })

  interface Props {
    /** 是否为空 */
    empty?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    empty: true,
  })

  const id = ref(buildUUID())

  watch(
    () => props.empty,
    (val) => {
      mountImg(val)
    },
  )

  const img = createApp(
    h(Icon, {
      size: 200,
      icon: 'empty-data|svg',
      class: 'text-primary',
    }),
  )

  async function mountImg(isEmpty: boolean) {
    await nextTick()
    const self = document.getElementById(id.value)!
    const parentNode = self.parentNode!
    const emptyNode = parentNode.querySelector('.n-data-table-empty')!
    if (isEmpty) {
      if (img._container) {
        img.unmount()
      }
      img.mount(emptyNode)
    }
  }

  onMounted(() => {
    mountImg(props.empty)
  })
</script>

<style scoped></style>
