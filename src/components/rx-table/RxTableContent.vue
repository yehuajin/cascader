<template>
  <div>
    <el-collapse-transition>
      <div class="error-message" v-if="validateState === 'error'">{{errorMessage}}</div>
    </el-collapse-transition>
    <div class="ellipsis" v-if="children.type === 'index'">
      {{((scope.row.$currentPage || 1) - 1) * (scope.row.$pageSize || 0) + scope.$index + 1 }}
    </div>
    <div v-else-if="!editable" class="ellipsis">
      {{contentData}}
    </div>
    <div v-else>
      <el-input ref="input"
                v-bind="bindPorps"
                v-model="currentValue"
                v-on="onProps"
                @change="handleChange"
                v-if="contentType === 'input'"
                type="text" class="edit-input"></el-input>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'RxTableContent',
    props: {
      scope: Object,
      children: Object,
      value: null
    },
    created () {
      this.promiseList.push(this)
    },
    beforeDestroy () {
      this.promiseList.splice(this.promiseList.indexOf(this), 1)
    },
    inject: ['promiseList'],
    data () {
      return {
        currentValue: this.value,
        errorMessage: '',
        validateState: ''
      }
    },
    computed: {
      editable () {
        if (typeof this.children.editable === 'boolean') {
          return this.children.editable
        } else if (typeof this.children.editable === 'function') {
          return this.children.editable(this.scope.row)
        } else {
          return false
        }
      },
      contentData () {
        if (this.children.formatter && typeof this.children.formatter === 'function') {
          return this.children.formatter(this.value, this.scope.row)
        } else {
          return this.value
        }
      },
      contentType () {
        if (typeof this.children.editOptions.contentType === 'function') {
          return this.children.editOptions.contentType(this.scope.row)
        } else {
          return this.children.editOptions.contentType
        }
      },
      bindPorps () {
        if (typeof this.children.editOptions.bind === 'function') {
          return this.children.editOptions.bind(this.scope.row)
        } else {
          return this.children.editOptions.bind
        }
      },
      onProps () {
        if (typeof this.children.editOptions.on === 'function') {
          return this.children.editOptions.on(this.scope.row)
        } else {
          return this.children.editOptions.on
        }
      }
    },
    watch: {
      value (val) {
        this.currentValue = val
        this.$nextTick(() => {
          if (this.validateState === 'error') {
            this.validate().then(() => {
              this.resetValidateState()
            }).catch(() => {
            })
          }
        })
      }
    },
    methods: {
      changeValue (val, oldValue, obj) {
        // 验证数据的正确性
        let options = this.children.editOptions
        if (options && options.rules && options.rules.length) {
          this.validate().catch(() => {})
        }
        this.$emit('input', val)
        this.$emit('cell-change', this.scope.row, this.scope.column, obj, oldValue)
      },
      handleChange (val) {
        this.changeValue(val)
      },
      validate () {
        this.resetValidateState()
        return new Promise((resolve, reject) => {
          if (this.editable) {
            const promiseList = []
            let options = this.children.editOptions
            if (options && options.rules && options.rules.length && this.contentType !== 'button') {
              options.rules.forEach(rule => {
                promiseList.push(new Promise((resolve, reject) => {
                  // 是否是非空验证，先验证非空验证
                  if (rule.required && !this.currentValue) {
                    reject(rule.message)
                  } else if (rule.validator && typeof rule.validator === 'function') {
                    // 调用自定义验证方法验证
                    rule.validator(this.currentValue, this.scope.row, (errMessage) => {
                      if (errMessage) {
                        reject(errMessage)
                      } else {
                        resolve()
                      }
                    })
                  } else {
                    resolve()
                  }
                }))
              })
            }
            Promise.all(promiseList).then(() => {
              resolve()
            }).catch(err => {
              if (this.$refs.input && this.$refs.input.$el.querySelector('input')) {
                this.$refs.input.$el.querySelector('input').style.borderColor = 'red'
              }
              this.validateState = 'error'
              this.errorMessage = err
              reject(err)
            })
          } else {
            resolve()
          }
        })
      },
      resetValidateState () {
        this.validateState = null
        if (this.$refs.input && this.$refs.input.$el.querySelector('input')) {
          this.$refs.input.$el.querySelector('input').style.borderColor = ''
        }
      }
    }
  }
</script>

<style scoped>
  .edit-input{
    width: 98%;
  }
  .error-message{
    position: absolute;
    height: 14px;
    line-height: 14px;
    margin-left: 5px;
    font-size: 12px;
    color: red;
    top: 34px;
    background-color: #fff;
    z-index: 111111000;
  }
  .ellipsis {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>