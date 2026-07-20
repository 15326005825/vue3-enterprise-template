# 高级表格组件使用文档

## 概述

本组件是基于 Element Plus 的 `el-table` 封装的高级表格组件，提供了分页、排序、筛选、列配置、行内编辑、导出、多选、树形表格等企业级功能。

## 功能清单

| 功能 | 说明 |
|------|------|
| 分页 | 支持页码切换、每页条数选择 |
| 排序 | 支持单列排序（ascending/descending） |
| 筛选 | 支持输入框、下拉框、日期选择器筛选 |
| 列配置 | 支持列显示/隐藏、拖拽排序、固定列 |
| 行内编辑 | 支持输入框、下拉框行内编辑 |
| 导出Excel | 支持导出当前表格数据为Excel |
| 多选 | 支持全选、反选、批量操作 |
| 树形表格 | 支持树形数据展示、展开/收起 |

## 文件结构

```
src/components/Table/
├── index.vue          # 高级表格主组件
└── ColumnConfig.vue   # 列配置弹窗组件

src/composables/
└── useTable.js        # 表格状态管理composable

src/utils/
└── export.js          # 导出工具函数
```

## Props 说明

### 基础配置

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `tableData` | Array | `[]` | 表格数据 |
| `loading` | Boolean | `false` | 加载状态 |
| `columns` | Array | `[]` | 列配置 |
| `total` | Number | `0` | 总条数 |
| `currentPage` | Number | `1` | 当前页码 |
| `pageSize` | Number | `10` | 每页条数 |
| `pageSizes` | Array | `[10, 20, 50, 100]` | 每页条数选项 |
| `paginationLayout` | String | `'total, sizes, prev, pager, next, jumper'` | 分页布局 |

### 功能开关

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `showSelection` | Boolean | `false` | 是否显示多选列 |
| `selectionWidth` | Number | `55` | 多选列宽度 |
| `reserveSelection` | Boolean | `false` | 是否保留选中状态（分页） |
| `showIndex` | Boolean | `false` | 是否显示序号列 |
| `indexWidth` | Number | `60` | 序号列宽度 |
| `showActions` | Boolean | `false` | 是否显示操作列 |
| `actionsWidth` | Number | `150` | 操作列宽度 |
| `actionsFixed` | String | `'right'` | 操作列固定位置 |
| `showPagination` | Boolean | `true` | 是否显示分页 |
| `showToolbar` | Boolean | `true` | 是否显示工具栏 |
| `showAddBtn` | Boolean | `false` | 是否显示添加按钮 |
| `showBatchDeleteBtn` | Boolean | `false` | 是否显示批量删除按钮 |
| `showExportBtn` | Boolean | `false` | 是否显示导出按钮 |
| `showColumnConfigBtn` | Boolean | `false` | 是否显示列配置按钮 |

### 表格样式

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `border` | Boolean | `false` | 是否显示边框 |
| `stripe` | Boolean | `true` | 是否显示斑马纹 |
| `highlightCurrentRow` | Boolean | `false` | 是否高亮当前行 |
| `rowKey` | String | `'id'` | 行唯一标识字段 |

### 筛选配置

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `filterForm` | Object | `{}` | 筛选表单数据 |
| `filterType` | Object | `{}` | 筛选类型配置 |
| `filterOptions` | Object | `{}` | 下拉框选项配置 |
| `filterLabels` | Object | `{}` | 筛选标签配置 |

### 树形表格配置

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `treeProps` | Object | `{ children: 'children', hasChildren: 'hasChildren' }` | 树形数据配置 |
| `defaultExpandAll` | Boolean | `false` | 是否默认展开所有节点 |
| `defaultSort` | Object | `{}` | 默认排序配置 |

## 列配置说明

`columns` 参数是一个数组，每项包含以下属性：

| 属性 | 类型 | 说明 |
|------|------|------|
| `prop` | String | 字段名（必填） |
| `label` | String | 列标题 |
| `width` | String/Number | 列宽度 |
| `fixed` | String | 是否固定（`'left'`/`'right'`） |
| `align` | String | 对齐方式（`'left'`/`'center'`/`'right'`） |
| `sortable` | Boolean | 是否可排序 |
| `visible` | Boolean | 是否可见（默认`true`） |
| `editable` | Boolean | 是否可编辑 |
| `editType` | String | 编辑类型（`'input'`/`'select'`） |
| `editOptions` | Array | 下拉框编辑选项 |
| `formatter` | Function | 格式化函数 |
| `children` | Array | 子列配置（多级表头） |
| `filters` | Array | 筛选选项 |
| `filterMethod` | Function | 筛选方法 |

**列配置示例：**

```javascript
const columns = [
  { prop: 'id', label: 'ID', width: '80', fixed: 'left' },
  { prop: 'name', label: '用户名', width: '120', sortable: true, editable: true, editType: 'input' },
  { prop: 'status', label: '状态', width: '100', editable: true, editType: 'select', editOptions: [
    { label: '正常', value: 'active' },
    { label: '禁用', value: 'disabled' }
  ]}
]
```

## Events 说明

| 事件 | 参数 | 说明 |
|------|------|------|
| `size-change` | `(pageSize)` | 每页条数改变 |
| `current-change` | `(page)` | 当前页改变 |
| `selection-change` | `(selectedRows)` | 选中项改变 |
| `sort-change` | `({ prop, order })` | 排序改变 |
| `filter-change` | `(filters)` | 筛选条件改变 |
| `add` | - | 点击添加按钮 |
| `edit` | `(row)` | 点击编辑按钮 |
| `delete` | `(row)` | 点击删除按钮 |
| `batch-delete` | `(rows)` | 点击批量删除 |
| `edit-save` | `(row)` | 保存行内编辑 |
| `edit-cancel` | `(row)` | 取消行内编辑 |
| `column-update` | `(columns)` | 列配置更新 |

## Slots 说明

| 插槽名 | 参数 | 说明 |
|--------|------|------|
| `custom-${prop}` | `{ row }` | 自定义列内容，`${prop}`为列字段名 |
| `actions` | `{ row }` | 自定义操作列内容 |

## useTable Composable

### 说明

`useTable` 是一个状态管理函数，用于处理表格的分页、排序、筛选、编辑等状态。

### 返回值

| 属性/方法 | 类型 | 说明 |
|-----------|------|------|
| `tableData` | Ref | 表格数据 |
| `loading` | Ref | 加载状态 |
| `total` | Ref | 总条数 |
| `page` | Ref | 当前页码 |
| `pageSize` | Ref | 每页条数 |
| `searchParams` | Ref | 搜索参数 |
| `sortParams` | Ref | 排序参数 |
| `filterParams` | Ref | 筛选参数 |
| `selectedRows` | Ref | 选中行 |
| `editableRows` | Ref | 可编辑行 |
| `fetchData` | Function | 获取数据 |
| `handleSizeChange` | Function | 每页条数改变处理 |
| `handleCurrentChange` | Function | 当前页改变处理 |
| `handleSearch` | Function | 搜索处理 |
| `handleSort` | Function | 排序处理 |
| `handleFilter` | Function | 筛选处理 |
| `handleReset` | Function | 重置处理 |
| `refresh` | Function | 刷新数据 |
| `handleSelectionChange` | Function | 选中改变处理 |
| `handleEdit` | Function | 编辑处理 |
| `handleSaveEdit` | Function | 保存编辑 |
| `handleCancelEdit` | Function | 取消编辑 |
| `toggleSelection` | Function | 切换选中 |
| `toggleAllSelection` | Function | 全选/反选 |

## 使用示例

### 基础用法

```vue
<template>
  <AdvancedTable
    :table-data="tableData"
    :columns="columns"
    :total="total"
    :current-page="page"
    :page-size="pageSize"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script setup>
import AdvancedTable from '@components/Table/index.vue'

const tableData = [/* 数据 */]
const columns = [
  { prop: 'id', label: 'ID' },
  { prop: 'name', label: '名称' }
]
const total = 100
const page = 1
const pageSize = 10

const handleSizeChange = (val) => { /* ... */ }
const handleCurrentChange = (val) => { /* ... */ }
</script>
```

### 完整示例

```vue
<template>
  <AdvancedTable
    :table-data="tableData"
    :loading="loading"
    :columns="columns"
    :total="total"
    :current-page="page"
    :page-size="pageSize"
    :show-selection="true"
    :show-actions="true"
    :show-toolbar="true"
    :show-add-btn="true"
    :show-batch-delete-btn="true"
    :show-export-btn="true"
    :show-column-config-btn="true"
    :filter-form="filterForm"
    :filter-type="filterType"
    :filter-options="filterOptions"
    :filter-labels="filterLabels"
    border
    @add="handleAdd"
    @delete="handleDelete"
    @batch-delete="handleBatchDelete"
    @edit-save="handleEditSave"
  >
    <template #custom-status="{ row }">
      <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
        {{ row.status === 'active' ? '正常' : '禁用' }}
      </el-tag>
    </template>
  </AdvancedTable>
</template>

<script setup>
import { ref } from 'vue'
import AdvancedTable from '@components/Table/index.vue'

const tableData = ref([/* 数据 */])
const loading = ref(false)
const total = ref(100)
const page = ref(1)
const pageSize = ref(10)

const filterForm = ref({
  name: '',
  status: ''
})

const filterType = {
  name: 'input',
  status: 'select'
}

const filterOptions = {
  status: [
    { label: '正常', value: 'active' },
    { label: '禁用', value: 'disabled' }
  ]
}

const filterLabels = {
  name: '名称',
  status: '状态'
}

const columns = ref([
  { prop: 'id', label: 'ID', width: '80', fixed: 'left' },
  { prop: 'name', label: '名称', width: '150', sortable: true, editable: true, editType: 'input' },
  { prop: 'status', label: '状态', width: '100' }
])

const handleAdd = () => { /* ... */ }
const handleDelete = (row) => { /* ... */ }
const handleBatchDelete = (rows) => { /* ... */ }
const handleEditSave = (row) => { /* ... */ }
</script>
```

### 树形表格示例

```vue
<template>
  <AdvancedTable
    :table-data="treeData"
    :columns="columns"
    :row-key="rowKey"
    :tree-props="treeProps"
    :default-expand-all="true"
    border
  />
</template>

<script setup>
import AdvancedTable from '@components/Table/index.vue'

const treeData = [
  {
    id: 1,
    name: '一级菜单',
    children: [
      { id: 11, name: '二级菜单1' },
      { id: 12, name: '二级菜单2' }
    ]
  }
]

const columns = [
  { prop: 'name', label: '菜单名称' }
]

const rowKey = 'id'
const treeProps = {
  children: 'children',
  hasChildren: 'hasChildren'
}
</script>
```

### 使用 useTable Composable

```vue
<template>
  <AdvancedTable
    :table-data="tableData"
    :loading="loading"
    :columns="columns"
    :total="total"
    :current-page="page"
    :page-size="pageSize"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    @sort-change="handleSort"
    @filter-change="handleFilter"
  />
</template>

<script setup>
import { useTable } from '@composables/useTable'

const fetchDataFn = async (params) => {
  const result = await api.get('/list', params)
  return result
}

const {
  tableData,
  loading,
  total,
  page,
  pageSize,
  handleSizeChange,
  handleCurrentChange,
  handleSort,
  handleFilter,
  fetchData
} = useTable(fetchDataFn)

fetchData()
</script>
```

## 导出功能

### 导出Excel

```javascript
import { exportToExcel } from '@utils/export'

const data = [
  { name: '张三', age: 25, department: '技术部' },
  { name: '李四', age: 30, department: '产品部' }
]

exportToExcel(data, '用户数据', '用户列表')
```

### 导出CSV

```javascript
import { exportToCSV } from '@utils/export'

exportToCSV(data, '用户数据')
```

## 企业场景说明

### 大数据量

- 支持虚拟滚动：可配合 `el-table` 的 `height` 属性实现固定高度滚动
- 服务端分页：通过 `total` 和分页参数实现大数据量分页加载

### 复杂表头

- 多级表头：通过 `columns` 的 `children` 属性配置
- 合并单元格：可通过自定义插槽实现

### 行内编辑

- 批量修改：支持多列同时编辑
- 数据校验：编辑时可配合 Element Plus 表单校验

### 导出功能

- Excel导出：支持自定义文件名、Sheet名称
- CSV导出：支持中文编码，兼容各类表格软件

## 注意事项

1. **rowKey 必填**：使用多选、树形表格、行内编辑功能时，必须设置 `rowKey` 属性
2. **编辑列配置**：可编辑列需要设置 `editable: true` 和 `editType` 属性
3. **筛选配置**：筛选功能需要同时配置 `filterForm`、`filterType`、`filterLabels`
4. **固定列**：固定列需要设置 `width` 属性，否则可能导致布局异常
5. **树形表格**：树形表格需要设置 `rowKey` 和 `treeProps` 属性

## 扩展建议

1. **自定义筛选组件**：可扩展支持更多筛选类型（日期范围、多选等）
2. **虚拟滚动**：集成 `vue-virtual-scroller` 实现大数据量虚拟滚动
3. **单元格合并**：支持跨行列合并单元格
4. **条件格式化**：支持根据条件动态设置单元格样式
5. **数据导入**：添加Excel导入功能