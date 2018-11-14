<template>
  <div class="rx-table">
    <ele-table v-bind="computedElProps" v-on="computedElListeners">
      <rx-table-column ref="contentloop"
                       v-for="(column, index) in tableColumns"
                       :columns="column"
                       :key="'key' + column.levelNum + index"
                       @cell-change="cellChange">
      </rx-table-column>
    </ele-table>
    <div class="text-right">
      <rx-pagination ref="rx-pagination" v-if="isShowPager" v-bind="pagProps"></rx-pagination>
    </div>
  </div>
</template>
<script>
  import _ from 'lodash'
  import EleTableColumn from './ele-table/EleTableColumn.js'
  import RxTableContent from './RxTableContent.vue'
  import EleTable from './ele-table/EleTable.vue'
  import RxTableColumn from './RxTableColumn.vue'
  import RxPagination from '../RxPagination'
  import {handleColumns} from './ele-table/ele-table-utils.js'
  import RxComponentMixin from '@/mixins/rx-component-mixin'
  export default {
    name: 'RxTable',
    mixins: [RxComponentMixin],
    components: {RxTableColumn, RxPagination, EleTable, EleTableColumn, RxTableContent},
    props: {
      data: Array,
      columns: Array,
      headerRowClassName: Function,
      spanMethod: Function,
      showIndex: Boolean,
      showSelection: Boolean,
      stripe: {
        type: Boolean,
        default: true
      },
      rowKey: {
        type: String | Number,
        default: 'id'
      },
      border: {
        type: Boolean,
        default: true
      },
      hideHeaderNumber: String | Number,
      isShowPager: Boolean,
      pagProps: {
        type: Object,
        default () {
          return {loadMethod: () => {}}
        }
      }
    },
    data () {
      return {
        promiseList: [],
        hiddeNumber: '',
        ifMultiseriate: true // columns是否是数组套数组的格式
      }
    },
    provide () {
      return {
        promiseList: this.promiseList
      }
    },
    computed: {
      tableColumns () {
        if (!this.columns.length) {
          return []
        }
        let columnsData
        this.ifMultiseriate = true
        if (Object.prototype.toString.call(this.columns[0]) === '[object Object]') {
          this.ifMultiseriate = false
          columnsData = handleColumns([this.columns])
          if (this.showIndex) {
            columnsData.unshift({type: 'index', label: '序号', align: 'center'})
          }
          return columnsData
        }
        let maxLength = this.columns.length
        if (this.hideHeaderNumber === 'last') {
          maxLength = maxLength - 1
          this.hiddeNumber = maxLength
        } else if (Object.prototype.toString.call(this.hideHeaderNumber) === '[object Number]' &&
          this.hideHeaderNumber > 0 && this.hideHeaderNumber <= this.columns.length &&
          _.isInteger(this.hideHeaderNumber)) {
          maxLength = maxLength - 1
          this.hiddeNumber = this.hideHeaderNumber - 1
        }
        columnsData = handleColumns(this.columns, this.hideHeaderNumber)
        if (this.showIndex) {
          columnsData.unshift({type: 'index', rowSpan: maxLength, colSpan: 1, label: '序号', align: 'center'})
        }
        return columnsData
      },
      computedElProps () {
        let option = _.pick(this.$props, ['stripe', 'rowKey', 'data', 'border'])
        option = _.merge(this.$attrs, option)
        option.headerRowClassName = this.rxHeaderRowClassName
        option.spanMethod = this.rxSpanMethod
        return option
      },
      computedElListeners () {
        return this.$listeners
      }
    },
    methods: {
      initData (flag) {
        if (flag) {
          return this.$refs['rx-pagination'].initData(flag)
        } else {
          this.$refs['rx-pagination'].initData()
        }
      },
      cellChange (row, column, obj, oldValue) {
        this.$emit('cell-change', row, column, obj, oldValue)
      },
      rxHeaderRowClassName ({row, rowIndex}) {
        let className = ''
        if (rowIndex === this.hiddeNumber) {
          className = ' table-class-hidden'
        }
        if (this.headerRowClassName) {
          className = this.headerRowClassName({row, rowIndex}) + className
        }
        return className
      },
      rxSpanMethod ({ row, column, rowIndex, columnIndex }) {
        if (this.spanMethod) {
          return this.spanMethod({ row, column, rowIndex, columnIndex })
        }
        if (this.ifMultiseriate && this.columns[this.columns.length - 1][columnIndex] &&
          this.columns[this.columns.length - 1][columnIndex].merge) {
          if (this.columns[this.columns.length - 1][columnIndex].mergeObj) {
            return this.columns[this.columns.length - 1][columnIndex].mergeObj
          }
          return {rowspan: 2, colspan: 1}
        }
        if (!this.ifMultiseriate && this.columns[columnIndex] && this.columns[columnIndex].merge) {
          if (this.columns[columnIndex].mergeObj) {
            return this.columns[columnIndex].mergeObj
          }
          return {rowspan: 2, colspan: 1}
        }
        return {rowspan: 1, colspan: 1}
      },
      validate () {
        return new Promise((resolve, reject) => {
          const promiseList = []
          this.promiseList.forEach(item => {
            promiseList.push(item.validate())
          })
          Promise.all(promiseList).then(() => {
            resolve()
          }).catch(err => {
            reject(err)
          })
        })
      },
      getValidates () {
        return this.promiseList
      }
    }
  }
</script>

<style lang="scss" scoped>
/deep/ {
  .el-table {
    th, td {
      padding: 0;
      height: 36px;
    }
    th div div{
      padding: 0;
      line-height: unset;
      display: block;
    }
  }
}
.text-right{
  text-align: right;
}
</style>