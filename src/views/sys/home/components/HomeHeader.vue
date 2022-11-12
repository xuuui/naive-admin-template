<template>
  <n-card content-style="display:flex;">
    <n-avatar
      :src="userInfo?.user?.avatar || headerImg"
      :size="72"
      round
      class="!mx-auto !block"
      object-fit="cover"
    />
    <div class="md:ml-6 flex flex-col justify-center md:mt-0 mt-2">
      <span class="md:text-lg text-md">
        <span class="font-bold"> Hello {{ userInfo?.user?.nickname }} </span>
        开始您一天的工作吧！</span
      >
    </div>
    <div class="flex flex-1 justify-end md:mt-0 mt-4"> </div>
  </n-card>
</template>
<script lang="ts" setup>
  import { useUserStore } from '@/store/modules/user'
  import headerImg from '@/assets/images/header.jpg'
  import { storeToRefs } from 'pinia'

  defineOptions({ name: 'HomeHeader' })

  const userStore = useUserStore()
  const { userInfo } = storeToRefs(userStore)
</script>
