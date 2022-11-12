<template>
  <slot></slot>
</template>

<script setup lang="ts">
  import {
    useDialog,
    useLoadingBar,
    useMessage,
    useNotification,
  } from 'naive-ui'
  import UiNaive from '@fast-crud/ui-naive'

  defineOptions({ name: 'NaiveMount' })

  window.$NLoadingBar = useLoadingBar()
  window.$NDialog = useDialog()
  window.$NMessage = useMessage()
  window.$NNotification = useNotification()
  UiNaive.init()
</script>
