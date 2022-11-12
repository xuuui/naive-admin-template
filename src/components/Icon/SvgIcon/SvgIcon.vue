<template>
  <svg
    :class="[$attrs.class, getPrefixCls, spin && `${getPrefixCls}-spin`]"
    :style="getStyle"
    aria-hidden="true"
  >
    <use :xlink:href="symbolId" />
  </svg>
</template>
<script lang="ts" setup>
  import type { CSSProperties } from 'vue'

  import { computed } from 'vue'
  import { useDesign } from '@/hooks/web/useDesign'

  defineOptions({ name: 'SvgIcon' })

  const props = defineProps({
    prefix: {
      type: String,
      default: 'icon',
    },
    name: {
      type: String,
      required: true,
    },
    size: {
      type: [Number, String],
      default: 16,
    },
    spin: {
      type: Boolean,
      default: false,
    },
  })

  const { getPrefixCls } = useDesign('svg-icon')

  const symbolId = computed(() => `#${props.prefix}-${props.name}`)

  const getStyle = computed((): CSSProperties => {
    const { size } = props
    let s = `${size}`
    s = `${s.replace('px', '')}px`
    return {
      width: s,
      height: s,
    }
  })
</script>
<style lang="scss">
  $prefix-cls: '#{namespace}-svg-icon';

  .#{prefix-cls} {
    display: inline-block;
    overflow: hidden;
    vertical-align: -0.15em;
    fill: currentColor;
    color: var(--primary-color);

    &-spin {
      animation: loadingCircle 1s infinite linear;
    }
  }
</style>
