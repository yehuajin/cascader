<template>
  <div class="rx-header-table-editor">
    <div v-html="label" v-on="onProps" v-if="label" :style="style"></div>
    <pass-and-reject v-bind="bindProps" v-on="onProps" v-if="type === 'passAndReject'"></pass-and-reject>
  </div>
</template>

<script>
  import PassAndReject from './table-header/PassAndReject.vue'
  export default {
    name: 'RxTableHeaderContent',
    components: {PassAndReject},
    props: {
      headerOption: Object
    },
    computed: {
      type () {
        return this.headerOption.type
      },
      bindProps () {
        return this.headerOption.bind
      },
      onProps () {
        return this.headerOption.on
      },
      label () {
        return this.headerOption.label ? this.headerOption.label() : ''
      },
      style () {
        return this.headerOption.style
      }
    }
  }
</script>

<style scoped>
</style>