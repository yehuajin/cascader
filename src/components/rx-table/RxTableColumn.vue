<template>
  <ele-table-column v-if="columns.type === 'selection'" v-bind="columns"></ele-table-column>
  <ele-table-column v-else v-bind="columns">
    <rx-table-column v-if="columns.children"
                     v-for="(child, index) in columns.children" ref="contentloop"
                     :key="'key' + child.levelNum + index" :columns="child"
                     @cell-change="cellChange">
    </rx-table-column>
    <template slot-scope="scope">
      <rx-table-content :children="columns" v-model="scope.row[scope.column.property]"
                        @cell-change="cellChange" :scope="scope" ref="content"
                        :key="'content' + columns.levelNum">
      </rx-table-content>
    </template>
    <template slot="header" slot-scope="slot">
      <rx-table-header-content v-if="columns.headerOption" :headerOption="columns.headerOption">
      </rx-table-header-content>
      <span v-else>{{columns.label}}</span>
    </template>
  </ele-table-column>
</template>
<script>
  import RxTableContent from './RxTableContent.vue'
  import EleTableColumn from './ele-table/EleTableColumn.js'
  import RxComponentMixin from '@/mixins/rx-component-mixin'
  import RxTableHeaderContent from './RxTableHeaderContent.vue'
  export default {
    name: 'RxTableColumn',
    mixins: [RxComponentMixin],
    components: {
      EleTableColumn,
      RxTableContent,
      RxTableHeaderContent
    },
    props: {
      columns: Object
    },
    data () {
      return {
      }
    },
    methods: {
      cellChange (row, column, obj, oldValue) {
        this.$emit('cell-change', row, column, obj, oldValue)
      }
    }
  }
</script>
<style scoped>
</style>