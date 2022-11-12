<template>
  <svg-icon
    v-if="isSvgIcon"
    :size="size"
    :name="getSvgIcon"
    :class="[$attrs.class]"
    :spin="spin"
  />
  <span
    v-else
    ref="elRef"
    :class="[$attrs.class, getPrefixCls, { [`${getPrefixCls}-spin`]: spin }]"
    :style="getWrapStyle"
  ></span>
</template>
<script lang="ts" setup>
  import type { CSSProperties } from 'vue'

  import { ref, watch, onMounted, nextTick, unref, computed } from 'vue'
  import { SvgIcon } from './SvgIcon'
  import Iconify from '@purge-icons/generated'
  import { isString } from 'lodash-es'
  import { useDesign } from '@/hooks/web/useDesign'

  defineOptions({ name: 'Icon' })

  const SVG_END_WITH_FLAG = '|svg'

  interface Props {
    icon: string
    color?: string
    size?: string | number
    spin?: boolean
    prefix?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    size: 16,
    spin: false,
    prefix: '',
  })

  const { getPrefixCls } = useDesign('icon')

  const elRef = ref<ElRef>(null)
  const isSvgIcon = computed(
    () => props.icon?.endsWith(SVG_END_WITH_FLAG) ?? '',
  )
  const getSvgIcon = computed(
    () => props.icon?.replace(SVG_END_WITH_FLAG, '') ?? '',
  )
  const getIconRef = computed(
    () => `${props.prefix ? props.prefix + ':' : ''}${props.icon}`,
  )

  const update = async () => {
    if (unref(isSvgIcon)) return

    const el = unref(elRef)
    if (!el) return

    await nextTick()
    const icon = unref(getIconRef)
    if (!icon) return

    const svg = Iconify.renderSVG(icon, {})
    if (svg) {
      el.textContent = ''
      el.appendChild(svg)
    } else {
      const span = document.createElement('span')
      span.className = 'iconify'
      span.dataset.icon = icon
      el.textContent = ''
      el.appendChild(span)
    }
  }

  const getWrapStyle = computed((): CSSProperties => {
    const { size, color } = props
    let fs = size
    if (isString(size)) {
      fs = parseInt(size, 10)
    }
    return {
      fontSize: `${fs}px`,
      color: color,
      display: 'inline-flex',
    }
  })

  watch(() => props.icon, update, { flush: 'post' })
  onMounted(update)
</script>
<style lang="scss">
  $prefix-cls: '#{$namespace}-icon';

  .#{$prefix-cls} {
    display: inline-block;

    &-spin {
      svg {
        animation: loadingCircle 1s infinite linear;
      }
    }

    &.iconify {
      display: block;
      min-width: 1em;
      min-height: 1em;
      background-color: var(--icon-color);
      border-radius: 100%;
    }
  }
</style>
