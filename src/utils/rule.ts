import { type FormItemRule } from 'naive-ui'
import { isNullOrUnDef, isPhoneNumber } from './is'

export function createMobileRule(options?: Recordable) {
  return createRule(null, {
    validator: (rule: FormItemRule, value: string) => {
      console.log(value)
      if (rule.required && !value) {
        return new Error('请输入手机号')
      }

      if (value && !isPhoneNumber(value)) {
        return new Error('手机号格式不正确')
      }
      return true
    },
    ...options,
  })
}

export const createRule = (message: string | null, options?: Recordable) => {
  const rule: Recordable = {
    required: true,
    trigger: ['change', 'blur'],
  }
  if (!isNullOrUnDef(message)) {
    rule.message = message
  }
  return {
    ...rule,
    ...options,
  }
}
