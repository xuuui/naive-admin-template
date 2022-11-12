import { ref, unref, type Ref } from 'vue'
import { tryOnUnmounted } from '@vueuse/core'

export function useCountdown(count: Ref<number>) {
  const currentCount = ref(unref(count))
  const isStart = ref(false)

  let timerId: ReturnType<typeof setInterval> | null

  function clear() {
    timerId && window.clearInterval(timerId)
  }

  function stop() {
    isStart.value = false
    clear()
    timerId = null
  }

  function start() {
    if (unref(isStart) || !!timerId) {
      return
    }
    isStart.value = true
    timerId = setInterval(() => {
      if (unref(currentCount) === 1) {
        stop()
        currentCount.value = unref(count)
      } else {
        currentCount.value -= 1
      }
    }, 1000)
  }

  function reset() {
    currentCount.value = unref(count)
    stop()
  }

  function restart() {
    reset()
    start()
  }

  tryOnUnmounted(() => {
    reset()
  })

  return { start, reset, restart, clear, stop, currentCount, isStart }
}
