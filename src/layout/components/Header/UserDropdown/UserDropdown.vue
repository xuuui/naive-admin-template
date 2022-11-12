<template>
  <n-dropdown trigger="hover" @select="select" :options="options">
    <div :class="`${getPrefixCls}-trigger`">
      <div class="avatar">
        <n-avatar round :src="userInfo?.user?.avatar">
          {{ userInfo?.user?.nickname }}
        </n-avatar>
      </div>
    </div>
  </n-dropdown>
</template>

<script setup lang="ts">
  import { useDesign } from '@/hooks/web/useDesign'
  import { useUserStore } from '@/store/modules/user'
  import { storeToRefs } from 'pinia'
  defineOptions({ name: 'UserDropdown' })

  enum ESelectOptions {
    set,
    logout,
  }

  const { getPrefixCls } = useDesign('layout-header')
  const userStore = useUserStore()
  const { userInfo } = storeToRefs(userStore)

  const options = [
    // {
    //   label: '个人设置',
    //   key: ESelectOptions.set,
    // },
    {
      label: '退出登录',
      key: ESelectOptions.logout,
    },
  ]

  const select = (key: ESelectOptions) => {
    switch (key) {
      case ESelectOptions.set:
        break
      case ESelectOptions.logout:
        userStore.confirmLoginOut()
        break
    }
  }
</script>
