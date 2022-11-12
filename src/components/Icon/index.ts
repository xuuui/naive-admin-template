import { SvgIcon } from './SvgIcon'
import Icon from './Icon.vue'
import { IconPicker } from './IconPicker'
import { createVNode } from 'vue'

function renderIcon(name?: string | undefined) {
  return createVNode(Icon, { icon: name })
}

export { SvgIcon, Icon, IconPicker, renderIcon }
