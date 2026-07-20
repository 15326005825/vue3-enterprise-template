<template>
  <EChart
    :width="width"
    :height="height"
    :option="chartOption"
    :theme="theme"
    :autoResize="autoResize"
    :refreshInterval="refreshInterval"
    :loading="loading"
    :loadingText="loadingText"
    :groupName="groupName"
    :animation="animation"
    :animationDuration="animationDuration"
    @ready="handleReady"
    @click="handleClick"
    @dblclick="handleDblclick"
    @contextmenu="handleContextmenu"
    @mouseover="handleMouseover"
    @mouseout="handleMouseout"
    @legendselectchanged="handleLegendSelectChanged"
    @refresh="handleRefresh"
    ref="chartRef"
  />
</template>

<script setup>
import { computed, ref, onMounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import EChart from './EChart.vue'

const props = defineProps({
  width: {
    type: [String, Number],
    default: '100%'
  },
  height: {
    type: [String, Number],
    default: '500px'
  },
  data: {
    type: Array,
    default: () => []
  },
  mapName: {
    type: String,
    default: 'china'
  },
  mapUrl: {
    type: String,
    default: 'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json'
  },
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  zoom: {
    type: Number,
    default: 1
  },
  center: {
    type: Array,
    default: () => [104.114129, 37.550339]
  },
  roam: {
    type: Boolean,
    default: true
  },
  showLabel: {
    type: Boolean,
    default: true
  },
  labelPosition: {
    type: String,
    default: 'bottom'
  },
  legend: {
    type: Boolean,
    default: true
  },
  legendPosition: {
    type: String,
    default: 'right'
  },
  tooltip: {
    type: Boolean,
    default: true
  },
  visualMap: {
    type: Boolean,
    default: true
  },
  visualMapMin: {
    type: Number,
    default: 0
  },
  visualMapMax: {
    type: Number,
    default: 3000
  },
  visualMapColor: {
    type: Array,
    default: () => ['#5470c6', '#91cc75', '#fac858', '#ee6666']
  },
  theme: {
    type: String,
    default: 'light'
  },
  autoResize: {
    type: Boolean,
    default: true
  },
  refreshInterval: {
    type: Number,
    default: 0
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingText: {
    type: String,
    default: '加载中...'
  },
  groupName: {
    type: String,
    default: ''
  },
  animation: {
    type: Boolean,
    default: true
  },
  animationDuration: {
    type: Number,
    default: 1000
  },
  selectedMode: {
    type: String,
    default: ''
  },
  drillDown: {
    type: Boolean,
    default: false
  },
  drillDownUrl: {
    type: String,
    default: 'https://geo.datav.aliyun.com/areas_v3/bound/{code}_full.json'
  },
  showScale: {
    type: Boolean,
    default: false
  },
  scalePosition: {
    type: String,
    default: 'bottomleft'
  }
})

const emit = defineEmits(['ready', 'click', 'dblclick', 'contextmenu', 'mouseover', 'mouseout', 'legendselectchanged', 'refresh', 'drilldown', 'drillup'])

const chartRef = ref(null)
const mapLoaded = ref(false)
const currentMapName = ref(props.mapName)
const currentMapCode = ref('100000')

const chinaProvinces = [
  { name: '北京', value: '110000' },
  { name: '天津', value: '120000' },
  { name: '河北', value: '130000' },
  { name: '山西', value: '140000' },
  { name: '内蒙古', value: '150000' },
  { name: '辽宁', value: '210000' },
  { name: '吉林', value: '220000' },
  { name: '黑龙江', value: '230000' },
  { name: '上海', value: '310000' },
  { name: '江苏', value: '320000' },
  { name: '浙江', value: '330000' },
  { name: '安徽', value: '340000' },
  { name: '福建', value: '350000' },
  { name: '江西', value: '360000' },
  { name: '山东', value: '370000' },
  { name: '河南', value: '410000' },
  { name: '湖北', value: '420000' },
  { name: '湖南', value: '430000' },
  { name: '广东', value: '440000' },
  { name: '广西', value: '450000' },
  { name: '海南', value: '460000' },
  { name: '重庆', value: '500000' },
  { name: '四川', value: '510000' },
  { name: '贵州', value: '520000' },
  { name: '云南', value: '530000' },
  { name: '西藏', value: '540000' },
  { name: '陕西', value: '610000' },
  { name: '甘肃', value: '620000' },
  { name: '青海', value: '630000' },
  { name: '宁夏', value: '640000' },
  { name: '新疆', value: '650000' },
  { name: '香港', value: '810000' },
  { name: '澳门', value: '820000' },
  { name: '台湾', value: '710000' }
]

const provinceCenters = {
  '北京': [116.4074, 39.9042],
  '天津': [117.2008, 39.0842],
  '河北': [114.5025, 38.0458],
  '山西': [112.5489, 37.8570],
  '内蒙古': [111.6708, 40.8178],
  '辽宁': [123.4328, 41.8046],
  '吉林': [125.3245, 43.8171],
  '黑龙江': [126.6424, 45.8038],
  '上海': [121.4737, 31.2304],
  '江苏': [118.7969, 32.0603],
  '浙江': [120.1551, 30.2741],
  '安徽': [117.2272, 31.8206],
  '福建': [119.2965, 26.0746],
  '江西': [115.8921, 28.6765],
  '山东': [117.0009, 36.6512],
  '河南': [113.6253, 34.7466],
  '湖北': [114.2879, 30.5843],
  '湖南': [112.9388, 28.2280],
  '广东': [113.2644, 23.1291],
  '广西': [108.3168, 22.8170],
  '海南': [110.3312, 19.8045],
  '重庆': [106.5516, 29.5630],
  '四川': [104.0668, 30.5728],
  '贵州': [106.6468, 26.6588],
  '云南': [102.8329, 24.8820],
  '西藏': [91.1322, 29.6540],
  '陕西': [108.9480, 34.2631],
  '甘肃': [103.8235, 36.0571],
  '青海': [101.7778, 36.6171],
  '宁夏': [106.2324, 38.4863],
  '新疆': [87.6168, 43.8256],
  '香港': [114.1654, 22.3193],
  '澳门': [113.5491, 22.1987],
  '台湾': [121.5090, 25.0330]
}

const loadMapData = async (url, mapName = props.mapName) => {
  try {
    const response = await fetch(url)
    const geoJson = await response.json()
    echarts.registerMap(mapName, geoJson)
    mapLoaded.value = true
    currentMapName.value = mapName
    console.log('Map data loaded:', mapName, 'geoJson features:', geoJson.features?.length)
    await nextTick()
    chartRef.value?.updateOption()
    return true
  } catch (error) {
    console.error('Failed to load map data:', error)
    return false
  }
}

const loadProvinceMap = async (provinceName) => {
  const province = chinaProvinces.find(p => p.name === provinceName)
  if (!province) return false

  const url = props.drillDownUrl.replace('{code}', province.value)
  return loadMapData(url, provinceName)
}

const chartOption = computed(() => {
  if (!mapLoaded.value) {
    return {
      title: {
        text: '地图加载中...',
        left: 'center',
        top: 'center'
      }
    }
  }

  return {
    title: props.title ? {
      text: props.title,
      subtext: props.subtitle,
      left: 'center'
    } : undefined,
    tooltip: props.tooltip ? {
      trigger: 'item',
      backgroundColor: props.theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.95)',
      borderColor: props.theme === 'dark' ? '#555' : '#ebeef5',
      borderWidth: 1,
      textStyle: {
        color: props.theme === 'dark' ? '#e0e0e0' : '#303133'
      },
      formatter: (params) => {
        if (params.seriesType === 'map') {
          let value = params.data?.value ?? params.value ?? 0
          const name = params.name
          if (isNaN(value)) {
            const matchedData = props.data.find(item => {
              const itemName = item.name.replace(/市|省|自治区|特别行政区/g, '')
              const paramName = name.replace(/市|省|自治区|特别行政区/g, '')
              return itemName === paramName
            })
            value = matchedData?.value ?? 0
          }
          return `<div>${name}</div><div>数值: ${value}</div>`
        }
        return ''
      }
    } : undefined,
    legend: props.legend ? {
      orient: props.legendPosition === 'right' || props.legendPosition === 'left' ? 'vertical' : 'horizontal',
      top: props.legendPosition === 'top' ? 10 : undefined,
      bottom: props.legendPosition === 'bottom' ? 10 : undefined,
      left: props.legendPosition === 'left' ? 10 : undefined,
      right: props.legendPosition === 'right' ? 10 : undefined
    } : undefined,
    visualMap: props.visualMap ? {
      min: props.visualMapMin,
      max: props.visualMapMax,
      left: props.legendPosition === 'left' ? '20%' : '5%',
      top: 'center',
      text: ['高', '低'],
      textStyle: {
        color: props.theme === 'dark' ? '#e0e0e0' : '#606266'
      },
      inRange: {
        color: props.visualMapColor
      }
    } : undefined,
    geo: {
      map: currentMapName.value,
      zoom: currentMapCode.value === '100000' ? props.zoom : 8,
      center: currentMapCode.value === '100000' ? props.center : (provinceCenters[currentMapName.value] || props.center),
      roam: props.roam,
      scale: props.showScale ? {
        show: true,
        position: props.scalePosition,
        align: 'left',
        width: 100,
        height: 60,
        borderColor: props.theme === 'dark' ? '#555' : '#dcdfe6',
        borderWidth: 1,
        textStyle: {
          color: props.theme === 'dark' ? '#e0e0e0' : '#606266',
          fontSize: 10
        }
      } : undefined,
      label: props.showLabel ? {
        show: true,
        position: props.labelPosition,
        color: props.theme === 'dark' ? '#e0e0e0' : '#333',
        fontSize: 12
      } : {
        show: false
      },
      itemStyle: {
        borderColor: props.theme === 'dark' ? '#555' : '#dcdfe6',
        borderWidth: 1
      },
      emphasis: {
        itemStyle: {
          areaColor: '#409eff',
          borderColor: '#409eff',
          borderWidth: 2
        },
        label: {
          show: true,
          fontSize: 14,
          fontWeight: 'bold',
          color: '#fff'
        }
      },
      data: props.data.map(item => {
        let mapName = item.name
        const province = chinaProvinces.find(p => {
          const shortName = p.name
          const fullNamePatterns = [shortName, shortName + '省', shortName + '市', shortName + '自治区', shortName + '特别行政区']
          return fullNamePatterns.includes(item.name)
        })
        if (province) {
          mapName = province.name
        }
        return {
          ...item,
          name: mapName
        }
      })
    },
    series: [{
      name: props.title || '地图数据',
      type: 'effectScatter',
      coordinateSystem: 'geo',
      data: props.data.map(item => {
        let mapName = item.name
        const province = chinaProvinces.find(p => {
          const shortName = p.name
          const fullNamePatterns = [shortName, shortName + '省', shortName + '市', shortName + '自治区', shortName + '特别行政区']
          return fullNamePatterns.includes(item.name)
        })
        if (province) {
          mapName = province.name
        }
        return {
          ...item,
          name: mapName
        }
      }),
      symbolSize: (value) => Math.max(5, Math.min(20, value / 100)),
      showEffectOn: 'render',
      rippleEffect: {
        brushType: 'stroke'
      },
      label: {
        show: false
      },
      itemStyle: {
        color: '#409eff',
        shadowBlur: 10,
        shadowColor: 'rgba(64, 158, 255, 0.5)'
      },
      emphasis: {
        focus: 'series'
      }
    }]
  }
})

const handleReady = (instance) => {
  emit('ready', instance)
}

const handleClick = (params) => {
  emit('click', params)
  
  if (props.drillDown && params.name && currentMapCode.value === '100000') {
    console.log('MapChart click:', params.name, 'drillDown:', props.drillDown, 'currentMapCode:', currentMapCode.value)
    
    let provinceName = params.name
    const matchedProvince = chinaProvinces.find(p => {
      const shortName = p.name
      const patterns = [shortName, shortName + '省', shortName + '市', shortName + '自治区', shortName + '特别行政区']
      return patterns.includes(params.name)
    })
    
    if (matchedProvince) {
      provinceName = matchedProvince.name
      console.log('Matched province:', provinceName, 'code:', matchedProvince.value)
      
      loadProvinceMap(provinceName).then((success) => {
        if (success) {
          currentMapCode.value = matchedProvince.value
          console.log('Map drilldown successful:', provinceName, currentMapCode.value)
          emit('drilldown', { name: provinceName, code: currentMapCode.value })
        } else {
          console.log('Failed to load province map:', provinceName)
        }
      })
    } else {
      console.log('Province not found:', params.name)
    }
  }
}

const handleDblclick = (params) => {
  emit('dblclick', params)
}

const handleContextmenu = (params) => {
  emit('contextmenu', params)
  
  if (props.drillDown && currentMapCode.value !== '100000') {
    console.log('MapChart contextmenu: returning to national map')
    resetMap()
    emit('drillup', { code: currentMapCode.value })
  }
}

const handleMouseover = (params) => {
  emit('mouseover', params)
}

const handleMouseout = (params) => {
  emit('mouseout', params)
}

const handleLegendSelectChanged = (params) => {
  emit('legendselectchanged', params)
}

const handleRefresh = () => {
  emit('refresh')
}

const resetMap = () => {
  currentMapCode.value = '100000'
  loadMapData(props.mapUrl)
}

onMounted(async () => {
  await loadMapData(props.mapUrl)
  await nextTick()
  if (chartRef.value) {
    chartRef.value.updateOption()
  }
})

watch(() => props.data, () => {
  if (mapLoaded.value) {
    chartRef.value?.updateOption()
  }
}, { deep: true })

watch(currentMapName, () => {
  if (mapLoaded.value) {
    chartRef.value?.updateOption()
  }
})

watch(() => props.theme, () => {
  if (mapLoaded.value) {
    chartRef.value?.updateOption()
  }
})

defineExpose({
  resize: () => chartRef.value?.resize(),
  dispose: () => chartRef.value?.dispose(),
  toggleLoading: (loading) => chartRef.value?.toggleLoading(loading),
  updateOption: () => chartRef.value?.updateOption(),
  getOption: () => chartRef.value?.getOption(),
  setOption: (option, notMerge) => chartRef.value?.setOption(option, notMerge),
  resetMap,
  getChartInstance: () => chartRef.value?.getChartInstance?.()
})
</script>