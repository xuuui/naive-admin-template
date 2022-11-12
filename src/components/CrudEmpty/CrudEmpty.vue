<template> </template>

<script setup lang="ts">
  import { createApp, h, onMounted } from 'vue'
  import { Icon } from '../Icon'

  defineOptions({ name: 'CrudEmpty' })

  function mountImg() {
    const emptys = document.getElementsByClassName('n-data-table-empty')
    const img = createApp(
      h(Icon, {
        size: 200,
        icon: 'empty-data|svg',
        class: 'text-primary',
      }),
    )
    if (emptys.length > 0) {
      if (!img._container) {
        img.mount(emptys[0])
      } else {
        img.unmount()
      }
    }
  }

  onMounted(() => {
    mountImg()
  })
</script>

<style scoped></style>
