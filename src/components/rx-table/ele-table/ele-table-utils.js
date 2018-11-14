export const  handleColumns = (val, hideHeaderNumber) => {
  val = _.cloneDeep(val)
  // val = JSON.parse(JSON.stringify(val))  // 方法不行
  if (val.length === 1) {
    addDefault(val[0])
    return val[0]
  }
  let num = ''
  if (hideHeaderNumber === 'last') {
    num = val.length - 1
  } else if (Object.prototype.toString.call(hideHeaderNumber) === '[object Number]') {
    num = hideHeaderNumber - 1
  }
  let tableColumnLevelArr = []
  let tableColumnLevelLast = []
  let tableColumnOptions = []
  // 处理默认值
  val.map((column, columnIndex) => {
    column.map((item) => {
      if (columnIndex === num) {
        item.hidden = true
      }
      item.headerAlign = item.headerAlign || 'center'
      item.align = item.align || 'center'
      item.showOverflowTooltip = item.showOverflowTooltip === false ? false : true
      item.levelNum = columnIndex + 1
      item.rowSpan = item.rowSpan || 1
      item.colSpan = item.colSpan || 1
      for (let i = columnIndex; i < columnIndex + Number(item.rowSpan); i++) {
        tableColumnLevelArr[i] = tableColumnLevelArr[i] ? tableColumnLevelArr[i] : []
        tableColumnLevelArr[i].push(item)
      }
    })
  })
  // 位置
  tableColumnLevelArr.map((column, columnIndex) => {
    column.map((item, index) => {
      if (index === 0) {
        item.colPostion = 0
      } else {
        item.colPostion = column[index - 1].colSpan + column[index - 1].colPostion
      }
    })
  })
  tableColumnOptions = val[0]
  tableColumnLevelLast = [...tableColumnOptions]
  tableColumnLevelArr = val.slice(1, val.length - 1)
  // 转换成列嵌套
  tableColumnLevelArr.map((item, index) => {
    tableColumnLevelLast.map((column, columnIndex) => {
      for (let i = 0; i < item.length; i++) {
        if (!item[i]) {
          continue
        } else if (column.colSpan + column.colPostion > item[i].colPostion) {
          column.children = column.children ? [...column.children, item[i]] : [item[i]]
          item.splice(i, 1, undefined)
        } else {
          break
        }
      }
    })
    tableColumnLevelLast = getLevelLast(tableColumnLevelLast)
  })
  // 处理最后一行
  handLastLine(tableColumnLevelLast, val[val.length - 1])
  return tableColumnOptions
}
const getLevelLast = (val) => {
  let tableColumnLevelLast = []
  const loopLevelLast = function (arr) {
    arr.map((item) => {
      if (item.children) {
        loopLevelLast(item.children)
      } else {
        tableColumnLevelLast.push(item)
      }
    })
  }
  loopLevelLast(val)
  return tableColumnLevelLast
}
const handLastLine =  (levelLast, lastArr) => {
  levelLast = levelLast.reverse()
  lastArr = lastArr.reverse()
  levelLast.map((item) => {
    for (let i = 0; i < lastArr.length; i++) {
      if (!lastArr[i]) {
        continue
      }
      if ((item.colPostion + item.colSpan) >= (lastArr[i].colPostion + lastArr[i].colSpan) &&
        item.colPostion <= lastArr[i].colPostion) {
        item.children = item.children ? [lastArr[i], ...item.children] : [lastArr[i]]
        lastArr.splice(i, 1, undefined)
      } else {
        break
      }
    }
  })
}
const addDefault = (arr) => {
  let recursion = (list) => {
    list.map((item) => {
      item.headerAlign = item.headerAlign || 'center'
      item.align = item.align || 'center'
      item.showOverflowTooltip = item.showOverflowTooltip === false ? false : true
      if (item.children) {
        recursion(item.children)
      }
    })
  }
  recursion(arr)
}