import type { FormRules } from 'naive-ui'

import { LOGIN_FORM_KEY } from '@/enums/cacheEnum'
import { ref, computed, unref } from 'vue'

export enum ELoginState {
  LOGIN,
  RESET_PASSWORD,
}

const createLsKey = (val: string) => LOGIN_FORM_KEY + val
export const ACCOUNT_KEY = createLsKey('ACCOUNT')
export const REMEMBERME_KEY = createLsKey('REMEMBERME')
export const RESET_PASSWORD_COUNT_KEY = createLsKey('RESET_PASSWORD_COUNT')

const currentState = ref(ELoginState.LOGIN)

export const useLoginState = () => {
  const setLoginState = (state: ELoginState) => {
    currentState.value = state
  }

  const getLoginState = computed(() => currentState.value)

  const handleBackLogin = () => {
    setLoginState(ELoginState.LOGIN)
  }
  return { setLoginState, getLoginState, handleBackLogin }
}

export const useFormRules = () => {
  const getAccountFormRule = computed(() => createRule('请输入账号'))
  const getPasswordFormRule = computed(() => createRule('请输入密码'))
  const getCaptchaFormRule = computed(() => createRule('请输入图形验证码'))
  const getSmsFormRule = computed(() => createRule('请输入短信验证码'))
  const getMobileFormRule = computed(() => createRule('请输入手机号码'))

  const getFormRules = computed((): FormRules => {
    const accountFormRule = unref(getAccountFormRule)
    const passwordFormRule = unref(getPasswordFormRule)
    const captchaFormRule = unref(getCaptchaFormRule)
    const smsFormRule = unref(getSmsFormRule)
    const mobileFormRule = unref(getMobileFormRule)

    const mobileRule = {
      sms: smsFormRule,
      mobile: mobileFormRule,
    }

    switch (unref(currentState)) {
      case ELoginState.RESET_PASSWORD:
        return {
          account: accountFormRule,
          ...mobileRule,
        }
      default:
        return {
          account: accountFormRule,
          password: passwordFormRule,
          captcha: captchaFormRule,
        }
    }
  })
  return { getFormRules }
}

const createRule = (message: string) => {
  return [
    {
      required: true,
      message,
      trigger: ['change', 'blur'],
    },
  ]
}
