<template>
  <h2
    class="mb-3 text-2xl font-bold text-center xl:text-3xl enter-x xl:text-left"
  >
    {{ getFormTitle }}
  </h2>
</template>
<script lang="ts" setup>
  import { computed, unref } from 'vue'
  import { ELoginState, useLoginState } from './useLogin'
  defineOptions({ name: 'LoginFormTitle' })
  const { getLoginState } = useLoginState()

  const getFormTitle = computed(() => {
    const titleMap = {
      [ELoginState.RESET_PASSWORD]: '重置密码',
      [ELoginState.LOGIN]: '登录',
    }
    return titleMap[unref(getLoginState)]
  })
</script>
