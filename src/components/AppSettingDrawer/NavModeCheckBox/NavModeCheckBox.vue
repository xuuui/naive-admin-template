<template>
  <div
    class="border-[2px] border-solid rounded-[6px] cursor-pointer hover:border-primary"
    :class="[checked ? 'border-primary' : 'border-transparent']"
  >
    <n-tooltip trigger="hover">
      <template #trigger>
        <div
          class="relative w-[56px] h-[48px] bg-white rounded-[4px] overflow-hidden"
        >
          <div
            class="absolute left-0 top-0 bg-[#273352]"
            :class="activeConfig.menuClass"
          ></div>
          <div
            class="absolute right-0 bottom-0 bg-[#f0f2f5]"
            :class="activeConfig.mainClass"
          ></div>
        </div>
      </template>
      <span>{{ label }}</span>
    </n-tooltip>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { ENavMode } from '@/enums/appEnum'

  defineOptions({ name: 'NavModeCheckBox' })

  interface Props {
    mode: ENavMode
    label: string
    checked: boolean
  }

  type NavModeConfig = Record<
    ENavMode,
    {
      menuClass: string
      mainClass: string
    }
  >

  const props = defineProps<Props>()

  const navModeConfig: NavModeConfig = {
    [ENavMode.VERTICAL]: {
      menuClass: 'w-1/3 h-full',
      mainClass: 'w-2/3 h-3/4',
    },
    [ENavMode.HORIZONTAL]: {
      menuClass: 'w-full h-1/4',
      mainClass: 'w-full h-3/4',
    },
    [ENavMode.HORIZONTAL_MIX]: {
      menuClass: 'w-full h-1/4',
      mainClass: 'w-2/3 h-3/4',
    },
  }

  const activeConfig = computed(() => navModeConfig[props.mode])
</script>
