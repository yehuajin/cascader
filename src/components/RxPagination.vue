<template>
  <el-pagination ref="el-pagination"
                 prev-text="上一页"
                 next-text="下一页"
                 layout="total, sizes, prev, pager, next, jumper"
                 @size-change="handleSizeChange"
                 @current-change="handleCurrentChange"
                 :current-page="rxCurrentPage"
                 :page-sizes="rxPageSizes"
                 :page-size="rxPageSize"
                 :total="total"
                 v-bind="computedElProps"
                 v-on="computedElListeners">
    <slot></slot>
  </el-pagination>
</template>

<script>
  import RxComponentMixin from '@/mixins/rx-component-mixin'
  import _ from 'lodash'
  export default {
    name: 'RxPagination',
    mixins: [RxComponentMixin],
    props: {
      loadMethod: {
        required: true,
        type: Function
      },
      total: {
        type: Number,
        default: 0
      },
      sizeChange: Function,
      // pageSize: Number, // 后期可能会用到
      // currentPage: Number, // 后期可能会用到
      currentChange: Function
    },
    data () {
      return {
        rxPageSizes: JSON.parse(this.UTILS.getConfig('VUE_APP_DEFAULT_PAGE_SIZE_LIST')),
        rxPageSize: Number(this.UTILS.getConfig('VUE_APP_DEFAULT_PAGE_SIZE')),
        rxCurrentPage: 1
        // rxPageSize: this.pageSize || Number(this.UTILS.getConfig('VUE_APP_DEFAULT_PAGE_SIZE')),
        // rxCurrentPage: this.currentPage || 1
      }
    },
    computed: {
      computedElProps () {
        let elProps = _.cloneDeep(this.$attrs)
        // let parentProps = _.pick(_.cloneDeep(this.$props), ['layout'])
        return elProps // Object.assign({}, elProps, parentProps)
      },
      computedElListeners () {
        let elListeners = _.cloneDeep(this.$listeners)
        delete elListeners['size-change']
        delete elListeners['current-change']
        delete elListeners['prev-click']
        delete elListeners['next-click']
        return elListeners
      }
    },
    methods: {
      handleSizeChange (val) {
        this.rxPageSize = val
        this.initData()
        if (this.sizeChange && (typeof this.sizeChange === 'function')) {
          this.sizeChange()
        }
      },
      handleCurrentChange (val) {
        this.rxCurrentPage = val
        this.getData()
        if (this.currentChange && (typeof this.currentChange === 'function')) {
          this.currentChange()
        }
      },
      initData (flag) {
        this.rxCurrentPage = 1
        if (flag) { // 初始化时使用
          return new Promise((resolve, reject) => {
            this.getData()
            resolve()
          })
        } else {
          this.getData()
        }
      },
      getData () {
        this.loadMethod(this.rxPageSize, this.rxCurrentPage).then((data) => {
          data.map((item) => {
            item.$pageSize = this.rxPageSize
            item.$currentPage = this.rxCurrentPage
          })
          data.splice(0, 0)
        })
      }
    }
  }
</script>

<style scoped>

</style>