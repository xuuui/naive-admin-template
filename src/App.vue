<template>
  <app-provider>
    <router-view />
  </app-provider>
</template>

<script setup lang="ts">
  import { AppProvider } from '@/components/App'
  import { RouterView } from 'vue-router'
  import { loadMapScript } from './logics/app'
  import { getGlobEnvConfig } from './utils/env'

  const { VITE_GLOB_MAP_KEY } = getGlobEnvConfig()

  loadMapScript(VITE_GLOB_MAP_KEY)
</script>

<style lang="scss">
  @import 'styles/index.scss';
</style>
