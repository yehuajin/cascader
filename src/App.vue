<template>
  <div class="rx-page">
    <el-button @click="component = 'RxTableDemo'">table组件demo</el-button>
    <el-button @click="component = 'CascaderDemo'">级联组件demo</el-button>
    <components :is="component"></components>
  </div>
</template>

<script>
  export default {
    name: 'app',
    components: {
      CascaderDemo: () => import('@/demo/CascaderDemo.vue'),
      RxTableDemo: () => import('@/demo/RxTableDemo.vue')
    },
    data () {
      return {
        component: 'RxTableDemo'
      }
    }
  }
</script>

<style lang="scss" scoped>
  .width-170 {
    width: 170px;
  }
</style>