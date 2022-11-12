<template> <div></div></template>
<script lang="ts" setup>
  import { unref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  defineOptions({ name: 'Redirect' })

  const router = useRouter()
  const route = useRoute()

  const doRedirect = () => {
    const { params, query } = unref(route)
    const { path, _redirect_type = 'path' } = params

    const _path = Array.isArray(path) ? path.join('/') : path
    if (_redirect_type === 'name') {
      router.replace({
        name: _path,
        query,
        params,
      })
    } else {
      router.replace({
        path: _path?.startsWith('/') ? _path : '/' + _path,
        query,
      })
    }
  }
  doRedirect()
</script>
