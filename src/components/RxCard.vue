<template>
  <el-card class="rx-card" :shadow="shadow" :class="computedClass">
    <!-- @dblclick="toggleContent" -->
    <div v-if="title" slot="header" class="el-card__header_wrapper clearfix" >
      <el-button type="text" size="large" @click="toggleContent" :icon="cardCollapseIcon">{{title}}</el-button>
      <span v-if="$slots['operations']" class="header__operations" @dbclick.stop>
        <slot name="operations">
        </slot>
      </span>
    </div>
    <div v-show="showContent" class="rx-card-content">
      <slot></slot>
    </div>
  </el-card>
</template>

<script>
import RxComponentMixin from '@/mixins/rx-component-mixin'
export default {
  name: 'RxCard',
  mixins: [RxComponentMixin],
  props: {
    border: {
      type: Boolean,
      default: false
    },
    collapsed: {
      type: Boolean,
      default: false
    },
    shadow: {
      type: String,
      default: 'never' // 'always', always / hover / never
    },
    title: String
  },
  data () {
    return {
      showContent: !this.collapsed

    }
  },
  methods: {
    toggleContent () {
      this.showContent = !this.showContent
      this.$emit('toggle-content', this.showContent)
    }
  },
  computed: {
    cardCollapseIcon () {
      if (this.showContent) return 'el-icon-caret-bottom'
      return 'el-icon-caret-right'
    },
    computedClass () {
      const clss = {}
      if (!this.showContent) {
        clss.collapsed = true
      }
      if (!this.border) {
        clss['no-border'] = true
      }
      return clss
    }
  },
  watch: {}
}
</script>

<style lang="scss" scoped>
.rx-card {
  /deep/ {
    .el-card__header {
      padding: 0;
      .header__operations {
        float: right;
        margin-top: 2px;
        margin-right: 10px;
        .el-button {
          padding: 5px 8px;
        }
      }
    }
    &.no-border {
      border: 0;
      /deep/ {
        .el-card__header {
          padding: 0;
        }
      }
    }
    &.collapsed /deep/ {
      .el-card__body {
        padding: 0;
      }
    }
  }
}
</style>