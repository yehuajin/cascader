<template>
  <div class="pass-reject-content">
    <p class="pass cursor-pointer" @click="handleClick('check')">
      <span class="el-icon-check"></span>
      <span class="word-color">通过</span>
    </p>
    <p class="reject cursor-pointer" @click="handleClick('cancel')">
      <span class="el-icon-close"></span>
      <span class="word-color">拒绝</span>
    </p>
  </div>
</template>

<script>
  export default {
    name: 'PassAndReject',
    props: {
      toggleCheck: Function
    },
    methods: {
      handleClick (type) {
        if (this.toggleCheck) {
          this.toggleCheck(type)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .pass-reject-content{
    margin: 0;
    padding: 0;
    .reject,
    .pass{
      margin: 0;
      padding: 0;
      line-height: unset;
      display: block;
      .el-icon-close{
        color: red !important;
        font-size: 14px;
        font-weight: bolder;
      }
      .el-icon-check {
        color: green !important;
        font-size: 14px;
        font-weight: bolder;
      }
      .word-color{
        color: #5487DC;
      }
    }
  }
</style>