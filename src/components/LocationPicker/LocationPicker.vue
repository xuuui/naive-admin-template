<template>
  <div>
    <div class="flex items-center space-x-[10px]">
      <n-form-item label="经度">
        <n-input-number
          :disabled="props.disabled"
          class="w-[150px]"
          v-model:value="state.longitude"
          placeholder="经度"
        />
      </n-form-item>
      <n-form-item label="纬度">
        <n-input-number
          :disabled="props.disabled"
          class="w-[150px]"
          v-model:value="state.latitude"
          placeholder="纬度"
        />
      </n-form-item>
      <n-button type="primary" @click="handleMap" :disabled="props.disabled"
        >打开地图</n-button
      >
    </div>

    <n-modal
      ref="modalRef"
      v-model:show="mapVisible"
      preset="dialog"
      title="坐标选取"
      positive-text="确认"
      negative-text="取消"
      @positive-click="handleOk"
      style="width: 1000px"
      :showIcon="false"
    >
      <n-form-item label="搜索" class="w-[400px]">
        <n-input-group>
          <n-input
            v-model:value="state.keyword"
            type="text"
            placeholder="请输入关键词"
            @keydown.enter="handleSearch"
          />
          <n-button @click="handleSearch">
            <n-icon>
              <SearchOutlined />
            </n-icon>
          </n-button>
        </n-input-group>
      </n-form-item>

      <div class="flex space-x-4 w-full">
        <n-form-item label="地址" class="w-[400px]">
          <n-input v-model:value="state.address" />
        </n-form-item>
        <n-form-item label="经纬度" class="w-[250px]">
          <n-input
            type="text"
            :value="`${state.longitude || 116.397128},${
              state.latitude || 39.916527
            }`"
            disabled
          />
        </n-form-item>
      </div>
      <n-spin :show="state.loading">
        <div id="map" style="width: 100%; height: 480px"></div>
      </n-spin>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
  import { getGlobEnvConfig } from '@/utils/env'
  import { nextTick, ref, watch, reactive, computed, unref } from 'vue'
  import { jsonp } from 'vue-jsonp'
  import { SearchOutlined } from '@vicons/antd'
  import { isNaN } from 'lodash-es'
  import { isNullOrUnDef } from '@/utils/is'
  import { log } from 'console'

  defineOptions({ name: 'LocationPicker' })

  const TMap = (window as any).TMap
  let map: any

  const props = defineProps({
    modelValue: {
      type: Object,
    },
    disabled: {
      type: Boolean,
    },
  })

  const emit = defineEmits(['update:modelValue', 'blur', 'input'])
  const { VITE_GLOB_MAP_KEY } = getGlobEnvConfig()

  const state = reactive<{
    longitude: number | null
    latitude: number | null
    keyword: string
    address: string
    loading: boolean
  }>({
    keyword: '',
    address: '',
    longitude: null,
    latitude: null,
    loading: false,
  })
  const mapVisible = ref(false)

  watch(
    () => props.modelValue,
    (value) => {
      state.longitude = value?.longitude
      state.latitude = value?.latitude
    },
    { immediate: true },
  )

  watch(mapVisible, (value) => {
    if (value) {
      nextTick(() => {
        !map && initMap()
      })
    } else {
      map = null
    }
  })

  const handleMap = () => {
    mapVisible.value = true
  }

  const handleOk = () => {
    const data = {
      longitude: Number(state.longitude || 116.397128),
      latitude: Number(state.latitude || 39.916527),
    }
    emit('update:modelValue', data)
    emit('input', data)
    mapVisible.value = false
  }

  const center = computed(() => {
    return new TMap.LatLng(
      state?.latitude || 39.916527,
      state?.longitude || 116.397128,
    )
  })

  const initMap = () => {
    //定义map变量，调用 TMap.Map() 构造函数创建地图
    map = new TMap.Map(document.getElementById('map'), {
      center: unref(center), //设置地图中心点坐标
      zoom: 17.2, //设置地图缩放级别
      pitch: 43.5, //设置俯仰角
      rotation: 45, //设置地图旋转角度
    })
    map.on('click', handleMapClick)
    markerLayer()
  }
  const handleMapClick = (evt: any) => {
    state.latitude = Number(evt.latLng.getLat().toFixed(6))
    state.longitude = Number(evt.latLng.getLng().toFixed(6))
    markerLayer()
    getAddress()
  }
  //标记地图
  const markerLayer = () => {
    if (map.markerLayer) {
      map.markerLayer.updateGeometries({
        id: 1, //点标记唯一标识，后续如果有删除、修改位置等操作，都需要此id
        styleId: 'myStyle', //指定样式id
        position: unref(center), //点标记坐标位置
      })
      return
    }
    map.markerLayer = new TMap.MultiMarker({
      map: map, //指定地图容器
      //样式定义
      styles: {
        myStyle: new TMap.MarkerStyle({
          width: 20, // 点标记样式宽度（像素）
          height: 28, // 点标记样式高度（像素）
          // "src": '../../assets/logo.png',  //图片路径
          background: 'pink',
          anchor: { x: 16, y: 32 },
        }),
      },
      //点标记数据数组
      geometries: [
        {
          id: 1, //点标记唯一标识，后续如果有删除、修改位置等操作，都需要此id
          styleId: 'myStyle', //指定样式id
          position: unref(center), //点标记坐标位置
        },
      ],
    })
  }

  const getAddress = () => {
    jsonp('https://apis.map.qq.com/ws/geocoder/v1/', {
      location: `${state.latitude},${state.longitude}`,
      key: VITE_GLOB_MAP_KEY,
      output: 'jsonp',
    }).then((res) => {
      state.address = res.result.address
    })
  }

  const getLocation = () => {
    return jsonp('https://apis.map.qq.com/ws/location/v1/ip', {
      key: VITE_GLOB_MAP_KEY,
      output: 'jsonp',
    })
  }

  const setCenter = (lat: number, lng: number) => {
    map.setCenter(new TMap.LatLng(lat, lng))
  }

  const handleSearch = async () => {
    const {
      result: { location },
    } = await getLocation()
    state.loading = true
    await jsonp('https://apis.map.qq.com/ws/place/v1/search', {
      keyword: state.keyword,
      key: VITE_GLOB_MAP_KEY,
      boundary: `nearby(${location.lat},${location.lng},1000,1)`,
      output: 'jsonp',
    }).then((res) => {
      const item = res.data?.[0]
      if (!item) return
      state.address = item.address
      state.latitude = Number(item.location.lat)
      state.longitude = Number(item.location.lng)
      markerLayer()
      setCenter(state.latitude, state.longitude)
    })
    state.loading = false
  }
</script>
