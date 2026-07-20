import { ref, computed } from 'vue'

export const useTable = (fetchDataFn) => {
  const tableData = ref([])
  const loading = ref(false)
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(10)
  const searchParams = ref({})
  const sortParams = ref({})
  const filterParams = ref({})
  const selectedRows = ref([])
  const editableRows = ref([])
  const editBackup = ref({})

  const fetchData = async () => {
    loading.value = true
    try {
      const params = {
        page: page.value,
        pageSize: pageSize.value,
        ...searchParams.value,
        ...sortParams.value,
        ...filterParams.value
      }
      const result = await fetchDataFn(params)
      tableData.value = result.data || result.list || []
      total.value = result.total || 0
    } catch (error) {
      console.error('获取数据失败:', error)
    } finally {
      loading.value = false
    }
  }

  const handleSizeChange = (val) => {
    pageSize.value = val
    page.value = 1
    fetchData()
  }

  const handleCurrentChange = (val) => {
    page.value = val
    fetchData()
  }

  const handleSearch = (params = {}) => {
    searchParams.value = params
    page.value = 1
    fetchData()
  }

  const handleSort = ({ prop, order }) => {
    if (order) {
      sortParams.value = {
        sortField: prop,
        sortOrder: order === 'ascending' ? 'asc' : 'desc'
      }
    } else {
      sortParams.value = {}
    }
    page.value = 1
    fetchData()
  }

  const handleFilter = (filters) => {
    filterParams.value = filters
    page.value = 1
    fetchData()
  }

  const handleReset = () => {
    searchParams.value = {}
    sortParams.value = {}
    filterParams.value = {}
    page.value = 1
    fetchData()
  }

  const refresh = () => {
    fetchData()
  }

  const handleSelectionChange = (val) => {
    selectedRows.value = val
  }

  const handleEdit = (row, rowKey = 'id') => {
    editableRows.value.push(row[rowKey])
    editBackup.value[row[rowKey]] = { ...row }
  }

  const handleSaveEdit = (row, rowKey = 'id') => {
    const index = editableRows.value.indexOf(row[rowKey])
    if (index > -1) {
      editableRows.value.splice(index, 1)
    }
    delete editBackup.value[row[rowKey]]
  }

  const handleCancelEdit = (row, rowKey = 'id') => {
    const backup = editBackup.value[row[rowKey]]
    if (backup) {
      Object.keys(backup).forEach(key => {
        row[key] = backup[key]
      })
      delete editBackup.value[row[rowKey]]
    }
    const index = editableRows.value.indexOf(row[rowKey])
    if (index > -1) {
      editableRows.value.splice(index, 1)
    }
  }

  const toggleSelection = (row, rowKey = 'id') => {
    const index = selectedRows.value.findIndex(item => item[rowKey] === row[rowKey])
    if (index > -1) {
      selectedRows.value.splice(index, 1)
    } else {
      selectedRows.value.push(row)
    }
  }

  const toggleAllSelection = (rows, rowKey = 'id') => {
    if (selectedRows.value.length === rows.length) {
      selectedRows.value = []
    } else {
      selectedRows.value = [...rows]
    }
  }

  return {
    tableData,
    loading,
    total,
    page,
    pageSize,
    searchParams,
    sortParams,
    filterParams,
    selectedRows,
    editableRows,
    fetchData,
    handleSizeChange,
    handleCurrentChange,
    handleSearch,
    handleSort,
    handleFilter,
    handleReset,
    refresh,
    handleSelectionChange,
    handleEdit,
    handleSaveEdit,
    handleCancelEdit,
    toggleSelection,
    toggleAllSelection
  }
}
