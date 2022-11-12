<template>
  <LoginFormTitle v-if="getShow" class="enter-x" />
  <n-form
    v-if="getShow"
    class="enter-x"
    :show-label="false"
    :model="formData"
    :rules="getFormRules"
    ref="formRef"
  >
    <n-form-item path="account" class="enter-x">
      <n-input
        size="large"
        v-model:value="formData.account"
        placeholder="账号"
      />
    </n-form-item>

    <n-form-item path="mobile" class="enter-x">
      <n-input
        size="large"
        v-model:value="formData.mobile"
        placeholder="手机号码"
      />
    </n-form-item>
    <n-form-item path="sms" class="enter-x">
      <n-input-group>
        <n-input
          :class="`${getPrefixCls}-unset-input`"
          size="large"
          v-model:value="formData.sms"
          placeholder="验证码"
        />
        <n-button size="large" @click="start" :disabled="isStart">
          {{ getCountText }}
        </n-button>
      </n-input-group>
    </n-form-item>

    <n-form-item class="enter-x" :show-feedback="false">
      <n-button
        type="primary"
        size="large"
        block
        @click="handleReset"
        :loading="loading"
      >
        重置
      </n-button>
    </n-form-item>
    <n-form-item class="enter-x mt-4" :show-feedback="false">
      <n-button size="large" block @click="handleBackLogin"> 返回 </n-button>
    </n-form-item>
  </n-form>
</template>
<script lang="ts" setup>
  import type { FormInst } from 'naive-ui'

  import { reactive, ref, computed, unref, watch } from 'vue'
  import LoginFormTitle from './LoginFormTitle.vue'
  import {
    useLoginState,
    useFormRules,
    ELoginState,
    RESET_PASSWORD_COUNT_KEY,
  } from './useLogin'
  import { useDesign } from '@/hooks/web/useDesign'
  import { useCountdown } from '@/hooks/web/useCountdown'
  import { localStorage } from '@/utils/storage'
  import { dateUtil } from '@/utils/dateUtil'

  defineOptions({ name: 'ForgetPasswordForm' })

  const { getPrefixCls } = useDesign('login')
  const { handleBackLogin, getLoginState } = useLoginState()
  const { getFormRules } = useFormRules()
  const formRef = ref<FormInst | null>(null)
  const loading = ref(false)
  const count = ref(60)
  const { currentCount, isStart, start, reset, restart } = useCountdown(count)

  const formData = reactive({
    account: '',
    mobile: '',
    sms: '',
  })

  const getShow = computed(
    () => unref(getLoginState) === ELoginState.RESET_PASSWORD,
  )
  const getCountText = computed(() => {
    return !unref(isStart) ? '发送验证码' : `${unref(currentCount)}s后重新发送`
  })

  watch(getLoginState, () => {
    const curCountdown = unref(currentCount)

    if (curCountdown !== ELoginState.RESET_PASSWORD) {
      if (curCountdown > 0) {
        localStorage.set(
          RESET_PASSWORD_COUNT_KEY,
          dateUtil().add(curCountdown, 's').valueOf(),
          {
            expire: curCountdown,
          },
        )
      }
      reset()
      return
    }

    const cache = localStorage.get(RESET_PASSWORD_COUNT_KEY)
    if (cache && dateUtil().isBefore(dateUtil(cache))) {
      const left = (cache - dateUtil().valueOf()) / 1000
      count.value = parseInt(left)
      restart()
    }
  })

  const handleReset = async () => {}
</script>
