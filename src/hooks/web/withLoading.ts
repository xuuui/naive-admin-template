import { MessageOptions, MessageReactive } from 'naive-ui'
import { ref } from 'vue'
import { useWeb } from './useWeb'

export type Fnc<R, P extends unknown[]> = (...args: P) => Promise<R>

export const withLoading = <R, P extends unknown[] = any>(
  fnc: Fnc<R, P>,
  options?: MessageOptions,
) => {
  const { message } = useWeb()

  const loading = ref(false)
  const loadingRef = ref<MessageReactive>()

  const startLoading = () => {
    loadingRef.value = message.loading('加载中...', options)
    loading.value = true
  }

  const endLoading = () => {
    loadingRef.value?.destroy()
    loading.value = false
  }

  const fn = async (...args: P): Promise<R> => {
    try {
      startLoading()
      const result = await fnc(...args)
      return result
    } catch (err) {
      throw err
    } finally {
      endLoading()
    }
  }
  return {
    loading,
    fn,
  }
}
