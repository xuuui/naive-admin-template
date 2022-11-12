<template>
  <div :class="getPrefixCls" class="relative wh-full px-5">
    <div class="absolute right-4 top-4">
      <app-theme-mode-toggle class="enter-x" v-if="!sessionTimeout" />
    </div>

    <div class="container relative h-full py-2 mx-auto sm:px-10">
      <div class="flex h-full">
        <div class="hidden min-h-full pl-4 mr-4 xl:flex xl:flex-col xl:w-6/12">
          <div class="my-auto">
            <img
              :alt="getTitle"
              src="../../../assets/icons/login-bg.svg"
              class="w-4/5 -enter-x"
            />
            <div class="mt-5 w-4/5 text-center font-medium text-white -enter-x">
              <!-- <span class="inline-block text-3xl"> {{ getTitle }}</span> -->
            </div>
          </div>
        </div>
        <div class="flex wh-full py-5 xl:h-auto xl:py-0 xl:my-0 xl:w-6/12">
          <div
            :class="`${getPrefixCls}-form`"
            class="relative w-full px-5 mx-auto py-8 my-auto rounded-md shadow-md xl:ml-16 xl:bg-transparent sm:px-8 xl:p-4 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto enter-x"
          >
            <LoginForm />
            <ForgetPasswordForm />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { AppThemeModeToggle } from '@/components/AppThemeModeToggle'
  import { useDesign } from '@/hooks/web/useDesign'
  import { computed } from 'vue'
  import LoginForm from './LoginForm.vue'
  import ForgetPasswordForm from './ForgetPasswordForm.vue'
  import { getGlobEnvConfig } from '@/utils/env'
  defineOptions({ name: 'Login' })
  defineProps({
    sessionTimeout: {
      type: Boolean,
    },
  })

  const { getPrefixCls } = useDesign('login')
  const { VITE_GLOB_APP_TITLE } = getGlobEnvConfig()

  const getTitle = computed(() => VITE_GLOB_APP_TITLE ?? '')
</script>
<style lang="scss">
  $prefix-cls: '#{$namespace}-login';

  html[data-theme='dark'] {
    .#{$prefix-cls} {
      background-color: var(--body-color);

      @media (max-width: $screen-xl) {
        &-form {
          background: transparent !important;
          border: 1px solid var(--border-color);
        }
      }
    }
  }

  .#{$prefix-cls} {
    min-height: 100%;
    overflow: hidden;
    background-color: #fff;

    @media (max-width: $screen-xl) {
      background-color: var(--primary-color);

      &-form {
        background-color: #fff;
      }
    }

    &::before {
      content: ' ';
      position: absolute;
      top: 0;
      left: 0;
      width: 50%;
      height: 100%;
      background-color: var(--primary-color);

      @media (max-width: $screen-xl) {
        display: none;
      }
    }

    n-input:not(.account) input:not([type='checkbox']) {
      min-width: 360px;

      @media (max-width: $screen-xl) {
        min-width: 320px;
      }

      @media (max-width: $screen-lg) {
        min-width: 260px;
      }

      @media (max-width: $screen-md) {
        min-width: 240px;
      }

      @media (max-width: $screen-sm) {
        min-width: 160px;
      }
    }

    &-unset-input input {
      min-width: unset !important;
    }
  }
</style>
