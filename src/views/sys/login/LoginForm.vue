<template>
  <LoginFormTitle v-if="getShow" class="enter-x" />
  <n-form
    class="enter-x"
    ref="formRef"
    v-if="getShow"
    :model="formData"
    :rules="getFormRules"
    :show-label="false"
    size="large"
  >
    <n-form-item path="account" class="enter-x">
      <n-input-group>
        <n-input
          class="account"
          v-model:value="formData.account"
          placeholder="请输入账号"
        />
        <n-select
          v-if="isTenantMode"
          class="w-[30%]"
          v-model:value="formData.accountType"
          :options="accountTypeOptions"
        />
      </n-input-group>
    </n-form-item>
    <n-form-item path="password" class="enter-x">
      <n-input
        type="password"
        show-password-on="click"
        v-model:value="formData.password"
        placeholder="请输入密码"
      />
    </n-form-item>
    <n-form-item path="captcha" class="enter-x">
      <n-input-group>
        <n-input
          :class="`${getPrefixCls}-unset-input`"
          size="large"
          v-model:value="formData.captcha"
          placeholder="请输入验证码"
        />
        <n-button class="p-0">
          <img
            class="block w-[100px] h-[40px]"
            @click="refreshCaptcha"
            :src="captchaImgSrc"
          />
        </n-button>
      </n-input-group>
    </n-form-item>

    <n-grid class="enter-x">
      <n-gi :span="12">
        <n-form-item :show-feedback="false">
          <n-checkbox v-model:checked="rememberMe" size="small">
            记住我
          </n-checkbox>
        </n-form-item>
      </n-gi>
      <n-gi :span="12">
        <n-form-item :show-feedback="false" style="place-items: center end">
          <n-button
            text
            type="primary"
            size="small"
            @click="setLoginState(ELoginState.RESET_PASSWORD)"
            >忘记密码?</n-button
          >
        </n-form-item>
      </n-gi>
    </n-grid>

    <n-form-item :show-feedback="false" class="enter-x mt-4">
      <n-button
        block
        type="primary"
        size="large"
        @click="handleLogin"
        @keyup.enter="handleLogin"
        :loading="loginLoading"
        >登录</n-button
      >
    </n-form-item>
  </n-form>
</template>

<script setup lang="ts">
  import type { FormInst } from 'naive-ui'

  import { EAccountType } from '@/enums/sysEnum'
  import { useDesign } from '@/hooks/web/useDesign'
  import { useWeb } from '@/hooks/web/useWeb'
  import { useUserStore } from '@/store/modules/user'
  import { localStorage } from '@/utils/storage'
  import { buildUUID } from '@/utils/uuid'
  import { computed, reactive, ref, unref } from 'vue'
  import LoginFormTitle from './LoginFormTitle.vue'
  import {
    ACCOUNT_KEY,
    ELoginState,
    REMEMBERME_KEY,
    useFormRules,
    useLoginState,
  } from './useLogin'
  import { getGlobEnvConfig } from '@/utils/env'

  defineOptions({ name: 'LoginForm' })

  const { VITE_GLOB_API_URL: apiUrl, VITE_GLOB_TENANT_MODE: isTenantMode } =
    getGlobEnvConfig()
  const { getPrefixCls } = useDesign('login')
  const { notification, createErrorDialog } = useWeb()
  const { getLoginState, setLoginState } = useLoginState()
  const userStore = useUserStore()
  const { getFormRules } = useFormRules()
  const accountTypeOptions = [
    {
      label: '平台',
      value: EAccountType.MANAGE,
    },
    {
      label: '商户',
      value: EAccountType.TENANT,
    },
  ]
  const formRef = ref<FormInst | null>(null)
  const loginLoading = ref(false)
  const rememberMe = ref(localStorage.get(REMEMBERME_KEY))
  const formData = reactive({
    account: localStorage.get(ACCOUNT_KEY),
    password: '',
    captcha: '',
    random: buildUUID(),
    accountType: accountTypeOptions[0].value,
  })

  const getShow = computed(() => unref(getLoginState) === ELoginState.LOGIN)
  const captchaImgSrc = computed(
    () => `${apiUrl}/api/sys/captcha?random=${formData.random}`,
  )

  const refreshCaptcha = () => {
    formData.random = buildUUID()
    formData.captcha = ''
  }

  const handleLogin = () => {
    formRef.value
      ?.validate(async (errors) => {
        if (!errors) {
          try {
            loginLoading.value = true
            const userInfo = await userStore.login({
              password: formData.password,
              username: formData.account,
              captcha: formData.captcha,
              random: formData.random,
              accountType: formData.accountType,
              mode: 'none', //不要默认的错误提示
            })

            if (userInfo) {
              if (unref(rememberMe)) {
                localStorage.set(ACCOUNT_KEY, formData.account)
                localStorage.set(REMEMBERME_KEY, unref(rememberMe))
              } else {
                localStorage.remove(ACCOUNT_KEY)
                localStorage.remove(REMEMBERME_KEY)
              }
              notification.success({
                title: '登录成功',
                description: `欢迎回来: ${userInfo?.user?.nickname}`,
                duration: 3000,
              })
            }
          } catch (error) {
            createErrorDialog({
              content:
                (error as unknown as Error).message ||
                '网络异常，请检查您的网络连接是否正常!',
            })
          } finally {
            loginLoading.value = false
          }
        }
      })
      .catch(console.log)
  }
</script>
