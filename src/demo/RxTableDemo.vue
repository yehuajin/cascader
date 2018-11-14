<template>
  <div class="rx-page">
    <rx-card title="简单表格" :collapsed="false">
      <template slot="operations">
        <el-button @click="changeData">changeData</el-button>
        <el-button @click="validate1">校验</el-button>
        <el-button @click="getValidates1">校验对象</el-button>
      </template>
      <rx-table :data="tableData" :columns="columns" :showIndex="true" ref="table1"></rx-table>
    </rx-card>
    <rx-card title="表头合并" :collapsed="true">
      <rx-table :data="tableData" :columns="columns2" :showIndex="true"></rx-table>
    </rx-card>
    <rx-card title="复杂表头" :collapsed="true">
      <template slot="operations">
        <el-button @click="validate">校验</el-button>
        <el-button @click="getValidates">校验对象</el-button>
      </template>
      <rx-table :data="tableData" :columns="columns3" v-bind="rxTableProps" @select="select" @cell-click="cellClick"
                :header-cell-class-name="headerRowClassName" @cell-change="change" ref="table"></rx-table>
    </rx-card>
    <rx-card title="集成分页" :collapsed="true">
      <template slot="operations">
        <el-button @click="getData">请求数据</el-button>
      </template>
      <rx-table ref="table3" :data="tableDataList" :columns="columns2" v-bind="rxTablePageProps" :showIndex="true"></rx-table>
    </rx-card>
    <rx-card title="表单合计" :collapsed="false">
      <rx-table ref="table4" :data="tableDataList1" :columns="columns4" v-bind="rxTablePageProps1" hideHeaderNumber="last"></rx-table>
    </rx-card>
  </div>
</template>

<script>
  import RxComponentMixin from '@/mixins/rx-component-mixin'
  import RxTable from '@/components/rx-table/RxTable'
  import RxCard from '@/components/RxCard.vue'
  import _ from 'lodash'
  export default {
    name: 'RxTableDemo',
    mixins: [RxComponentMixin],
    components: {
      RxTable,
      RxCard
    },
    watch: {
      tableDataList1 (val) {
        let all = 0
        val.map((item) => {
          all += item.zip
        })
        this.columns4[1][1].label = all + ''
      }
    },
    mounted () {
      this.$refs.table4.initData()
    },
    data () {
      return {
        isWindowMaximizedDefault: true,
        tableDataList: [],
        tableDataList1: [],
        tableData: [
          {
            date: '2016-05-03',
            name: '',
            province: '',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333
          }, {
            date: '2016-05-02',
            name: '王小虎2',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200332
          }, {
            date: '2016-05-04',
            name: '王小虎3',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200331
          }, {
            date: '2016-05-01',
            name: '王小虎4',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200330
          }, {
            date: '2016-05-08',
            name: '王小虎5',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200329
          }, {
            date: '2016-05-06',
            name: '王小虎6',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200328
          }, {
            date: '2016-05-07',
            name: '',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200327
          }
        ],
        columns: [
          {prop: 'date', label: '日期', type: 'selection'},
          {prop: 'name',
            label: '姓名',
            editable: true,
            editOptions: {
              contentType: 'input',
              rules: [
                {validator: (val, row, back) => { back('必须的字段') }}
              ]
            }
          },
          {prop: 'address',
            label: '地址',
            editable: true,
            editOptions: {
              contentType: 'input',
              rules: [
                {validator: (val, row, back) => { back('必须的字段') }}
              ]
            }},
          {prop: 'province',
            label: '省',
            editable: true,
            editOptions: {
              contentType: 'input',
              rules: [
                {validator: (val, row, back) => { back('必须的字段') }}
              ]
            }},
          {prop: 'city',
            label: '市',
            editable: true,
            editOptions: {
              contentType: 'input',
              rules: [
                {validator: (val, row, back) => { back('必须的字段') }}
              ]
            }},
          {prop: 'zip',
            label: '邮编',
            editable: true,
            editOptions: {
              contentType: 'input',
              rules: [
                {validator: (val, row, back) => { back('必须的字段') }}
              ]
            }}
        ],
        columns2: [
          {prop: 'date', label: '日期'},
          {prop: 'name', label: '姓名'},
          {
            label: '地址',
            children: [
              {
                label: '详细地址',
                children: [
                  {prop: 'province', label: '省'},
                  {prop: 'city', label: '市'},
                  {prop: 'address', label: '地址'}
                ]
              },
              {prop: 'zip', label: '邮编'}
            ]
          }
        ],
        columns3: [
          [
            {label: '序号', rowSpan: 3},
            {label: '产品类型', rowSpan: 3, colSpan: 2},
            {label: '安全库存', rowSpan: 3},
            {label: '计划合计', colSpan: 2},
            {label: '实际合计', colSpan: 5}
          ],
          [
            {label: '12周', rowSpan: 2},
            {label: '5周', rowSpan: 2},
            {label: '第36周', colSpan: 3},
            {label: '第37周', colSpan: 2}
          ],
          [
            {label: '逾期1'},
            {label: '通知1'},
            {label: '剩余1'},
            {label: '逾期11'},
            {label: '通知11'}
          ],
          [
            {label: '需求生产量', colSpan: 3},
            {label: ''},
            {label: '14周'},
            {label: '14周'},
            {label: '逾期3'},
            {label: '通知3'},
            {label: '剩余3'},
            {label: '逾期13'},
            {label: '通知13'}
          ],
          [
            {label: '计划/标工差量', colSpan: 3},
            {label: '20142'},
            {label: '16周'},
            {label: '16周'},
            {label: '3合一1', colSpan: 3},
            {label: '3合一', colSpan: 2}
          ],
          [
            {label: 'label1', prop: 'date', hidden: false, type: 'selection', fixed: true},
            {label: 'label2', prop: 'name', hidden: false, type: 'index', width: 70, fixed: true},
            {label: 'label3',
              prop: 'province',
              hidden: false,
              editable: true,
              editOptions: {
                contentType: 'input',
                rules: [
                  {required: true, message: '必须的字段'}
                ],
                bind: () => {
                  return {placeholder: '请输入'}
                },
                on: (row) => {
                  return {
                    focus: () => {
                      console.log('focus:', row)
                    },
                    change: () => {
                      console.log('change:', row)
                    },
                    blur: () => {
                      console.log('blur:', row)
                    }
                  }
                }
              },
              headerOption: {
                type: 'passAndReject',
                bind: {toggleCheck: this.toggleCheck}
              }
            },
            {label: 'label4', prop: 'city', hidden: false},
            {label: 'label5',
              prop: 'address',
              hidden: false,
              headerOption: {
                type: 'html',
                label: () => {
                  let html = `<div>自定义头部</div>`
                  return html
                }
              }
            },
            {label: 'label6', prop: 'zip', hidden: false},
            {label: 'label7', prop: 'date', hidden: false},
            {label: 'label8', prop: 'name', hidden: false, width: 80},
            {label: 'label9', prop: 'province', hidden: false, width: 90},
            {label: 'label10', prop: 'city', hidden: false, width: 120},
            {label: 'label11', prop: 'address', hidden: false, width: 150}
          ]
        ],
        columns4: [
          [{prop: '', label: '序号'},
            {prop: 'date', label: '日期', type: 'selection'},
            {prop: 'name', label: '姓名'},
            {prop: 'zip', label: '邮编'},
            {prop: 'province', label: '省'},
            {prop: 'city', label: '市'},
            {prop: 'address', label: '地址'}],
          [{prop: 'date1', label: '合计:', colSpan: 3, headerAlign: 'right'},
            {prop: 'date2', label: ''},
            {prop: 'date3', label: ''},
            {prop: 'date4', label: ''},
            {prop: 'date5', label: ''}],
          [{label: '', type: 'index'},
            {prop: 'date', label: '1', type: 'selection'},
            {prop: 'name', label: '1'},
            {prop: 'zip', label: '1'},
            {prop: 'province', label: '1'},
            {prop: 'city', label: '1'},
            {prop: 'address', label: '1'}]
        ],
        rxTableProps: {
          height: '350',
          showIndex: true,
          hideHeaderNumber: '1'
        },
        rxTablePageProps: {
          isShowPager: true,
          pagProps: {
            loadMethod: this.loadMethod,
            total: 0
          }
        },
        rxTablePageProps1: {
          isShowPager: true,
          pagProps: {
            loadMethod: this.loadMethod1,
            total: 7
          }
        }
      }
    },
    methods: {
      changeData () {
        this.tableData.splice(0, 2)
      },
      getData () {
        this.$refs.table3.initData()
      },
      loadMethod (pageSize, currentPage) {
        this.rxTablePageProps.pagProps.total = this.tableData.length
        return new Promise((resolve, reject) => {
          this.tableDataList = _.cloneDeep(this.tableData.slice((currentPage - 1) * pageSize, (currentPage - 1) * pageSize + pageSize))
          resolve(this.tableDataList)
        })
      },
      loadMethod1 (pageSize, currentPage) {
        return new Promise((resolve, reject) => {
          this.tableDataList1 = _.cloneDeep(this.tableData.slice((currentPage - 1) * pageSize, (currentPage - 1) * pageSize + pageSize))
          resolve(this.tableDataList1)
        })
      },
      cellClick (row, column, cell, event) {
        console.log(11111, row, column, cell, event)
      },
      select (selection, row) {
        console.log(11111, selection, row)
      },
      change (row, column, obj, oldValue) {
        console.log(row, column, obj, oldValue)
      },
      validate () {
        console.log(this.tableData)
        this.$refs.table.validate((valid) => {
          console.log(111, valid)
        }).then(() => {
          console.log(222)
        }).catch((err) => {
          console.log(333, err)
        })
      },
      getValidates () {
        console.log(this.$refs.table.getValidates())
      },
      validate1 () {
        this.$refs.table1.validate((valid) => {
          console.log(111, valid)
        }).then(() => {
          console.log(222)
        }).catch((err) => {
          console.log(333, err)
        })
      },
      getValidates1 () {
        console.log(this.$refs.table1.getValidates())
      },
      headerRowClassName (data) {
        return 'abcd'
      },
      toggleCheck (type) {
        if (type === 'check') { // 点击通过
          console.log('点击通过')
        } else if (type === 'cancel') { // 点击拒绝
          console.log('点击拒绝')
        }
      }
    }
  }
</script>

<style scoped>
</style>