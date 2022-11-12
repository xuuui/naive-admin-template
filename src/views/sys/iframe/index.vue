<template>
  <n-spin :show="loading">
    <div :class="getPrefixCls" :style="getSty">
      <iframe
        :src="frameSrc"
        :class="`${getPrefixCls}-iframe`"
        ref="frameRef"
      ></iframe>
    </div>
  </n-spin>
</template>
<script lang="ts" setup>
  import { useAppInject } from '@/hooks/core/useAppContext'
  import { useDesign } from '@/hooks/web/useDesign'
  import { ref, unref, onMounted, nextTick, computed } from 'vue'
  import { useRoute } from 'vue-router'

  defineOptions({ name: 'Frame' })

  const { getPrefixCls } = useDesign('frame')
  const route = useRoute()
  const loading = ref(false)
  const frameRef = ref<HTMLFrameElement | null>(null)
  const { layoutContentHeight } = useAppInject()

  const getSty = computed(() => {
    return {
      height: `${unref(layoutContentHeight)}px`,
    }
  })

  const frameSrc = computed(() => {
    return route.meta?.frameSrc
  })

  function hideLoading() {
    loading.value = false
  }

  function init() {
    nextTick(() => {
      const iframe = unref(frameRef)
      if (!iframe) return
      const _frame = iframe as any
      if (_frame.attachEvent) {
        _frame.attachEvent('onload', () => {
          hideLoading()
        })
      } else {
        iframe.onload = () => {
          hideLoading()
        }
      }
    })
  }

  onMounted(() => {
    loading.value = true
    init()
  })
</script>

<style lang="scss">
  $prefix-cls: '#{$namespace}-frame';

  .#{$prefix-cls} {
    width: 100%;
    height: 100%;

    &-iframe {
      width: 100%;
      height: 100%;
      overflow: hidden;
      border: 0;
      box-sizing: border-box;
    }
  }
</style>
