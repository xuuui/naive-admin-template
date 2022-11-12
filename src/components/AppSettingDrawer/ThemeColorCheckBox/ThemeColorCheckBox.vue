<template>
  <div
    class="flex items-center justify-center w-[20px] h-[20px] rounded-[2px] shadow cursor-pointer"
    :style="{ backgroundColor: color }"
  >
    <n-icon>
      <CheckOutlined
        v-if="checked"
        :class="[isWhite ? 'text-gray-700' : 'text-white']"
      />
    </n-icon>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { CheckOutlined } from '@vicons/antd'
  defineOptions({ name: 'ThemeColorCheckBox' })

  interface Props {
    color: string
    checked: boolean
  }

  const props = defineProps<Props>()

  const whiteColors = ['#ffffff', '#fff', 'rgb(255,255,255)']
  const isWhite = computed(() => whiteColors.includes(props.color))
</script>
