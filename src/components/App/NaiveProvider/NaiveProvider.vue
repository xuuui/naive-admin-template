<template>
  <n-config-provider
    :locale="zhCN"
    :theme="getDarkTheme"
    :theme-overrides="getThemeOverrides"
    :date-locale="dateZhCN"
    abstract
  >
    <n-loading-bar-provider>
      <n-dialog-provider>
        <n-message-provider>
          <n-notification-provider>
            <naive-mount>
              <slot></slot>
            </naive-mount>
          </n-notification-provider>
        </n-message-provider>
      </n-dialog-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script lang="ts" setup>
  import { useTheme } from '@/hooks/web/useTheme'
  import { syncNaiveElToHtml } from '@/logics/theme'
  import { zhCN, dateZhCN } from 'naive-ui'
  import { unref } from 'vue'
  import { NaiveMount } from '../NaiveMount'

  defineOptions({ name: 'NaiveProvider' })

  const { getDarkTheme, getThemeOverrides } = useTheme()

  syncNaiveElToHtml(
    `--primary-color: ${unref(getThemeOverrides).common?.primaryColor};`,
  )
</script>
