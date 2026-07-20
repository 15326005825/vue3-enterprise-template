import * as XLSX from 'xlsx'

export const exportToExcel = (data, filename = 'export', sheetName = 'Sheet1') => {
  if (!data || data.length === 0) {
    console.warn('导出数据为空')
    return
  }

  const headers = Object.keys(data[0])
  const rows = data.map(item => headers.map(header => item[header] || ''))
  const worksheetData = [headers, ...rows]

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)

  const columnWidths = headers.map(header => ({
    wch: Math.max(header.length * 1.2, 10)
  }))
  worksheet['!cols'] = columnWidths

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

  XLSX.writeFile(workbook, `${filename}.xlsx`)
}

export const exportToCSV = (data, filename = 'export') => {
  if (!data || data.length === 0) {
    console.warn('导出数据为空')
    return
  }

  const headers = Object.keys(data[0])
  const rows = data.map(item => headers.map(header => {
    const value = item[header] || ''
    return typeof value === 'string' && value.includes(',') ? `"${value}"` : value
  }))

  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
  const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}