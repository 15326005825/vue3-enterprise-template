# ECharts 图表组件使用文档

## 概述

本项目提供了基于 ECharts 的图表组件封装，包含折线图、柱状图、饼图、地图等常用图表类型，支持主题切换、自适应容器、数据自动刷新和图表联动等功能。

## 组件列表

| 组件 | 路径 | 说明 |
|------|------|------|
| EChart | `src/components/Chart/EChart.vue` | 图表基类组件 |
| LineChart | `src/components/Chart/LineChart.vue` | 折线图组件 |
| BarChart | `src/components/Chart/BarChart.vue` | 柱状图组件 |
| PieChart | `src/components/Chart/PieChart.vue` | 饼图组件 |
| MapChart | `src/components/Chart/MapChart.vue` | 地图组件 |
| ChartGroup | `src/components/Chart/ChartGroup.vue` | 图表组合组件（联动） |

## 基础组件（EChart）

### Props

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| width | String/Number | '100%' | 图表宽度 |
| height | String/Number | '400px' | 图表高度 |
| option | Object | {} | ECharts 配置项 |
| theme | String | 'light' | 主题（light/dark） |
| autoResize | Boolean | true | 自动响应容器大小变化 |
| refreshInterval | Number | 0 | 数据自动刷新间隔（秒，0为关闭） |
| loading | Boolean | false | 是否显示加载状态 |
| loadingText | String | '加载中...' | 加载提示文本 |
| groupName | String | '' | 图表分组名称（用于联动） |
| animation | Boolean | true | 是否启用动画 |
| animationDuration | Number | 1000 | 动画时长（毫秒） |

### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| ready | chartInstance | 图表初始化完成 |
| click | params | 点击事件 |
| dblclick | params | 双击事件 |
| mouseover | params | 鼠标悬停事件 |
| mouseout | params | 鼠标离开事件 |
| dataZoom | params | 数据缩放事件 |
| legendselectchanged | params | 图例选择变化事件 |
| refresh | - | 自动刷新触发事件 |

### Expose Methods

| 方法名 | 参数 | 说明 |
|--------|------|------|
| getChartInstance | - | 获取 ECharts 实例 |
| resize | - | 手动调整图表大小 |
| dispose | - | 销毁图表实例 |
| toggleLoading | loading | 切换加载状态 |
| updateOption | - | 更新图表配置 |
| getOption | - | 获取当前配置 |
| setOption | option, notMerge | 设置配置项 |

## 折线图（LineChart）

### Props

继承 EChart 的所有 props，额外支持：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| data | Array | [] | 数据系列 |
| xAxisData | Array | [] | X轴数据 |
| series | Array | [] | 自定义系列配置 |
| title | String | '' | 标题 |
| subtitle | String | '' | 副标题 |
| xAxisName | String | '' | X轴名称 |
| yAxisName | String | '' | Y轴名称 |
| smooth | Boolean | false | 是否平滑曲线 |
| showArea | Boolean | false | 是否显示面积 |
| showPoint | Boolean | true | 是否显示数据点 |
| showLine | Boolean | true | 是否显示线条 |
| stack | String | '' | 堆叠名称 |
| dataZoom | Boolean | false | 是否显示缩放组件 |
| legend | Boolean | true | 是否显示图例 |
| legendPosition | String | 'top' | 图例位置（top/bottom/left/right） |
| tooltip | Boolean | true | 是否显示提示框 |
| colors | Array | [默认色值] | 颜色数组 |
| markLine | Object | {} | 标线配置 |
| markPoint | Object | {} | 标记点配置 |

### 数据格式

```javascript
data: [
  { name: '系列1', data: [120, 132, 101, 134, 190] },
  { name: '系列2', data: [82, 93, 90, 94, 105] }
]
xAxisData: ['1月', '2月', '3月', '4月', '5月']
```

### 使用示例

```vue
<LineChart
  title="销售趋势"
  :xAxisData="['1月', '2月', '3月']"
  :data="[
    { name: '产品A', data: [120, 132, 101] },
    { name: '产品B', data: [82, 93, 90] }
  ]"
  :smooth="true"
  :showArea="true"
  height="400px"
/>
```

## 柱状图（BarChart）

### Props

继承 EChart 的所有 props，额外支持：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| data | Array | [] | 数据系列 |
| xAxisData | Array | [] | X轴数据 |
| series | Array | [] | 自定义系列配置 |
| title | String | '' | 标题 |
| subtitle | String | '' | 副标题 |
| xAxisName | String | '' | X轴名称 |
| yAxisName | String | '' | Y轴名称 |
| stack | String | '' | 堆叠名称 |
| barWidth | String/Number | 'auto' | 柱宽 |
| barGap | String | '10%' | 柱间距 |
| barCategoryGap | String | '20%' | 类别间距 |
| horizontal | Boolean | false | 是否横向 |
| dataZoom | Boolean | false | 是否显示缩放组件 |
| legend | Boolean | true | 是否显示图例 |
| legendPosition | String | 'top' | 图例位置 |
| tooltip | Boolean | true | 是否显示提示框 |
| colors | Array | [默认色值] | 颜色数组 |
| markLine | Object | {} | 标线配置 |
| markPoint | Object | {} | 标记点配置 |
| showLabel | Boolean | false | 是否显示标签 |
| labelPosition | String | 'top' | 标签位置 |

### 使用示例

```vue
<BarChart
  title="部门业绩"
  :xAxisData="['技术部', '产品部', '运营部']"
  :data="[
    { name: 'Q1', data: [320, 280, 240] },
    { name: 'Q2', data: [340, 300, 280] }
  ]"
  :horizontal="false"
  :showLabel="true"
  height="400px"
/>
```

## 饼图（PieChart）

### Props

继承 EChart 的所有 props，额外支持：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| data | Array | [] | 数据 |
| series | Array | [] | 自定义系列配置 |
| title | String | '' | 标题 |
| subtitle | String | '' | 副标题 |
| radius | String/Array | '50%' | 半径 |
| center | Array | ['50%', '50%'] | 中心位置 |
| roseType | String | '' | 玫瑰图类型（area/radius） |
| doughnut | Boolean | false | 是否环形图 |
| showLabel | Boolean | true | 是否显示标签 |
| labelPosition | String | 'outside' | 标签位置 |
| labelLine | Boolean | true | 是否显示标签线 |
| legend | Boolean | true | 是否显示图例 |
| legendPosition | String | 'right' | 图例位置 |
| tooltip | Boolean | true | 是否显示提示框 |
| colors | Array | [默认色值] | 颜色数组 |
| selectedMode | String | '' | 选中模式（single/multiple） |

### 数据格式

```javascript
data: [
  { name: '华东', value: 3350 },
  { name: '华南', value: 2780 },
  { name: '华北', value: 1950 }
]
```

### 使用示例

```vue
<PieChart
  title="市场份额"
  :data="[
    { name: '华东', value: 3350 },
    { name: '华南', value: 2780 },
    { name: '华北', value: 1950 }
  ]"
  :doughnut="true"
  height="400px"
/>
```

## 地图（MapChart）

### Props

继承 EChart 的所有 props，额外支持：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| data | Array | [] | 地图数据 |
| mapName | String | 'china' | 地图名称 |
| mapUrl | String | [阿里云地图] | 地图数据URL |
| title | String | '' | 标题 |
| subtitle | String | '' | 副标题 |
| zoom | Number | 1 | 缩放级别 |
| center | Array | [104.11, 37.55] | 中心点坐标 |
| roam | Boolean | true | 是否允许拖拽缩放 |
| showLabel | Boolean | true | 是否显示标签 |
| labelPosition | String | 'bottom' | 标签位置 |
| legend | Boolean | true | 是否显示图例 |
| legendPosition | String | 'right' | 图例位置 |
| tooltip | Boolean | true | 是否显示提示框 |
| visualMap | Boolean | true | 是否显示视觉映射 |
| visualMapMin | Number | 0 | 视觉映射最小值 |
| visualMapMax | Number | 1000 | 视觉映射最大值 |
| visualMapColor | Array | [默认色值] | 视觉映射颜色 |
| selectedMode | String | '' | 选中模式 |
| drillDown | Boolean | false | 是否启用下钻 |
| drillDownUrl | String | [阿里云地图] | 下钻地图URL |

### 数据格式

```javascript
data: [
  { name: '北京', value: 1200 },
  { name: '上海', value: 1500 },
  { name: '广东', value: 2200 }
]
```

### 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| drilldown | { name, code } | 地图下钻事件 |

### 使用示例

```vue
<MapChart
  title="全国销售分布"
  :data="[
    { name: '北京', value: 1200 },
    { name: '上海', value: 1500 },
    { name: '广东', value: 2200 }
  ]"
  :drillDown="true"
  height="500px"
  @drilldown="handleDrillDown"
/>
```

## 图表组合（ChartGroup）

用于实现多图表联动，支持高亮联动、Tooltip联动、DataZoom联动。图表组件会自动注册到父级 ChartGroup，无需手动设置 groupName。

### Props

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| groupName | String | 'chartGroup' | 分组名称（内部使用） |
| syncTooltip | Boolean | false | 是否同步Tooltip |
| syncHighlight | Boolean | true | 是否同步高亮 |
| syncDataZoom | Boolean | false | 是否同步数据缩放 |
| theme | String | 'light' | 主题 |

### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| sync | { type, params } | 同步事件 |
| dataZoom | params | 数据缩放事件 |

### Expose Methods

| 方法名 | 参数 | 说明 |
|--------|------|------|
| registerChart | chartInstance | 注册图表实例 |
| unregisterChart | chartInstance | 注销图表实例 |
| highlightAll | dataIndex, seriesIndex | 高亮所有图表指定数据 |
| downplayAll | - | 取消所有图表高亮 |
| showTipAll | dataIndex, seriesIndex | 显示所有图表Tooltip |
| hideTipAll | - | 隐藏所有图表Tooltip |
| resizeAll | - | 调整所有图表大小 |
| disposeAll | - | 销毁所有图表实例 |

### 使用示例

```vue
<ChartGroup :syncHighlight="true" :syncTooltip="true">
  <BarChart
    title="销售额"
    :xAxisData="['周一', '周二', '周三']"
    :data="barData"
    height="300px"
  />
  <LineChart
    title="订单量"
    :xAxisData="['周一', '周二', '周三']"
    :data="lineData"
    height="300px"
  />
  <PieChart
    title="销售占比"
    :data="pieData"
    height="300px"
  />
</ChartGroup>
```

## 主题切换

所有图表组件均支持 `theme` 属性，可在亮色和暗色主题之间切换。

```vue
<LineChart
  title="收入趋势"
  :data="data"
  :theme="currentTheme"
  height="400px"
/>
```

## 数据刷新

通过 `refreshInterval` 属性设置自动刷新间隔（秒），触发 `refresh` 事件时更新数据。

```vue
<LineChart
  title="实时数据"
  :data="realtimeData"
  :refreshInterval="5"
  @refresh="fetchData"
  height="400px"
/>
```

## 配置工具函数

### createLineOption

创建折线图配置项。

```javascript
import { createLineOption } from '@utils/chart/chartConfig'

const option = createLineOption({
  title: '销售趋势',
  xAxisData: ['1月', '2月', '3月'],
  series: [
    { name: '产品A', data: [120, 132, 101] }
  ],
  smooth: true
})
```

### createBarOption

创建柱状图配置项。

```javascript
import { createBarOption } from '@utils/chart/chartConfig'

const option = createBarOption({
  title: '业绩对比',
  xAxisData: ['技术部', '产品部'],
  series: [
    { name: 'Q1', data: [320, 280] }
  ],
  horizontal: true
})
```

### createPieOption

创建饼图配置项。

```javascript
import { createPieOption } from '@utils/chart/chartConfig'

const option = createPieOption({
  title: '市场份额',
  data: [
    { name: '华东', value: 3350 },
    { name: '华南', value: 2780 }
  ],
  doughnut: true
})
```

### createMapOption

创建地图配置项。

```javascript
import { createMapOption } from '@utils/chart/chartConfig'

const option = createMapOption({
  title: '全国分布',
  data: [
    { name: '北京', value: 1200 },
    { name: '上海', value: 1500 }
  ]
})
```

### generateMockData

生成模拟数据。

```javascript
import { generateMockData } from '@utils/chart/chartConfig'

// 生成折线图/柱状图数据
const lineData = generateMockData('line', { count: 7, min: 0, max: 100 })

// 生成饼图数据
const pieData = generateMockData('pie', { count: 6 })

// 生成地图数据
const mapData = generateMockData('map')
```

## 企业场景示例

### 数据大屏

```vue
<template>
  <div class="dashboard">
    <LineChart title="实时趋势" :data="trendData" height="400px" />
    <BarChart title="区域排名" :data="rankData" :horizontal="true" height="400px" />
    <PieChart title="占比分析" :data="pieData" height="400px" />
    <MapChart title="全国分布" :data="mapData" height="500px" />
  </div>
</template>
```

### 实时数据看板

```vue
<template>
  <ChartGroup groupName="realtime">
    <LineChart
      title="实时流量"
      :data="flowData"
      :refreshInterval="3"
      @refresh="updateFlowData"
      height="300px"
    />
    <BarChart
      title="实时订单"
      :data="orderData"
      :refreshInterval="3"
      @refresh="updateOrderData"
      height="300px"
    />
  </ChartGroup>
</template>
```

### 地图下钻

```vue
<template>
  <div>
    <MapChart
      ref="mapRef"
      title="销售分布"
      :data="mapData"
      :drillDown="true"
      @drilldown="handleDrillDown"
    />
    <el-button @click="resetMap">返回全国</el-button>
  </div>
</template>

<script setup>
const mapRef = ref(null)

const handleDrillDown = (params) => {
  console.log('下钻到:', params.name, params.code)
}

const resetMap = () => {
  mapRef.value.resetMap()
}
</script>
```

## 注意事项

1. **容器尺寸**：确保图表容器有明确的高度，建议使用固定高度或通过 CSS 设置容器高度。

2. **地图数据**：地图组件默认使用阿里云地图服务，需要网络访问权限。如需离线使用，可下载地图 GeoJSON 文件并配置 `mapUrl`。

3. **图表联动**：图表组件会自动注册到父级 ChartGroup，无需手动设置 `groupName`。

4. **性能优化**：对于大数据量图表，建议关闭动画或调整 `animationDuration`。

5. **主题切换**：所有图表组件均支持亮色/暗色主题，切换主题时会自动更新图表样式（标题、坐标轴、图例、Tooltip等）。

6. **Tooltip取值**：地图组件的Tooltip取值使用空值合并运算符（??），确保数值为0时能正确显示。

7. **内存管理**：在组件卸载时会自动调用 `dispose` 方法销毁图表实例，无需手动处理。