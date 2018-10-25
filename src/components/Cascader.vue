<template>
  <div class="rx-cascader-content" @click.stop="handleClick" @mouseenter="isHover=true" @mouseleave="isHover=false">
    <el-popover
      v-model="menuVisible"
      popper-class="el-cascader-menus rx-cascader"
      placement="bottom-start">
      <ul class="el-cascader-menu" :class="{'el-cascader-menu--flexible': filterStr}"
          v-for="(item, index) in (filterStr ? [0] : hoverActionIndexList)" v-if="ifShow (index)"
          :key="generateKey(index)" :style="hoverActionIndexList.length - 1 === index ? {borderRight: 0} : ''">
        <li v-for="(itemLi, indexLi) in getItemList(index)"
            class="el-cascader-menu__item"
            :key="filterStr ? itemLi[props.label].join(separator) : itemLi[props.label]"
            :class="getClass(index, itemLi, indexLi)"
            @click="itemClick(index, itemLi, indexLi)"
            @mouseenter="itemHover(index, itemLi, indexLi)">
          {{filterStr ? itemLi[props.label].join(separator) : itemLi[props.label]}}
        </li>
        <li v-if="getItemList(index).length === 0" class="el-cascader-menu__item is-disabled">无匹配数据</li>
      </ul>
      <el-input
        :readonly = 'filterable ? false : true'
        slot="reference"
        ref="input"
        :class="{'is-disabled': disabled}"
        v-model="filterStr"
        :placeholder="placeholder">
        <template slot="suffix">
          <li v-if="this.value && this.value.length"
              class="el-input__icon el-icon-circle-close" @click.stop="removeAll">
          </li>
          <i class="el-input__icon el-icon-arrow-down" :class="{'is-reverse': menuVisible }" v-else></i>
        </template>
      </el-input>
    </el-popover>
    <span class="el-cascader__label" :title="getHoverLabel()"
          v-show="filterStr === '' && !multiple">
     {{showLabelValue[0] ? (showAllLevels ? showLabelValue[0].join(separator) : showLabelValue[0][showLabelValue[0].length - 1]) : ''}}
    </span>
    <span class="el-cascader__label rx-multiple-cascader__label" v-show="filterStr === '' && multiple">
      <el-tag
        :closable="!disabled" size="small" type="info"
        v-if="showLabelValue.length"
        :title="getHoverLabel()"
        @close="deleteValue"
        class="label-tags-list el-select__tags-text"
        disable-transitions>
          {{ showLabelValue.length ? (showAllLevels ? showLabelValue[showLabelValue.length - 1].join(separator) :
          showLabelValue[showLabelValue.length - 1][showLabelValue[showLabelValue.length - 1].length - 1]) : '' }}
      </el-tag>
      <el-tag
        v-if="showLabelValue.length > 1"
        :closable="false"
        size="small"
        type="info"
        disable-transitions>
        <span class="el-select__tags-text">+ {{ showLabelValue.length - 1 }}</span>
      </el-tag>
    </span>
  </div>
</template>

<script>
  import _ from 'lodash'
  const escapeRegexpString = (value = '') => String(value).replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
  export default {
    name: 'cascader',
    props: {
      options: Array,
      placeholder: String,
      disabled: Boolean,
      separator: {
        type: String,
        default: ' / '
      },
      filterable: Boolean, // 是否可搜索
      props: {
        type: Object,
        default () {
          return {
            label: 'label',
            value: 'value',
            children: 'children'
          }
        }
      },
      value: {
        type: Array,
        default () {
          return []
        }
      },
      onlyLastNodeCheck: Boolean, // 是否只能选择最后一个节点，当多选的时候失效只能选择最后一个节点
      showAllLevels: { // 是否显示全路径
        type: Boolean,
        default: true
      },
      multiple: Boolean
    },
    data () {
      return {
        filterStr: '', // 搜=搜索字符串
        currentValue: [],
        showLabelValue: [], // 显示选中的值
        valueIndexList: [], // 控制实际选中的值options对象索引
        hoverActionIndexList: [0], // hover是控制高亮显示
        menuVisible: false,
        showOptions: {},
        filterOption: [], // 搜索的option
        isHover: false
      }
    },
    created () {
      this.initHoverActionIndexList(this.options)
      this.initValue() // 去掉true试试
      this.changeFilterOption()
    },
    watch: {
      value: function (val) {
        // this.currentValue = val
        this.initValue()
      },
      options: {
        deep: true,
        handler (val) {
          this.initHoverActionIndexList(val)
          this.initValue()
          this.changeFilterOption()
        }
      },
      menuVisible: function (val) { // popover显示时同步高亮显示的值为选中的值
        if (val) {
          this.hoverActionIndexList = this.valueIndexList.length ? _.cloneDeep(this.valueIndexList[this.valueIndexList.length - 1]) : [0]
        } else {
          this.filterStr = ''
        }
      },
      filterStr: function (val) {
        if (val) {
          this.setFilterOption(val)
        } else {
          this.initHoverActionIndexList(this.options)
        }
      },
      onlyLastNodeCheck: function () {
        this.changeFilterOption()
      },
      multiple: function (val) {
        this.changeFilterOption()
      }
    },
    methods: {
      removeAll () {
        this.valueIndexList = []
        this.showLabelValue = []
        this.currentValue = []
        this.menuVisible = false
        this.$emit('input', [])
        this.$emit('change', [])
      },
      deleteValue () {
        this.currentValue.splice(this.valueIndexList.length - 1, 1)
        this.valueIndexList.splice(this.valueIndexList.length - 1, 1)
        this.showLabelValue.splice(this.showLabelValue.length - 1, 1)
        this.menuVisible = false
        this.$emit('input', _.cloneDeep(this.currentValue))
        this.$emit('change', _.cloneDeep(this.currentValue))
      },
      initValue () {
        if (!this.value || !this.value.length) {
          this.valueIndexList = []
          this.showLabelValue = []
          this.currentValue = []
          return
        }
        if (_.isEqual(this.value, this.currentValue)) {
          return
        }
        this.currentValue = _.cloneDeep(this.value)
        if (!this.multiple) {
          this.singleCheck(this.value, this.options)
        } else {
          this.multipleCheck(this.value, this.options)
        }
      },
      changeFilterOption () {
        if (this.filterable) {
          this.setFilterOptionObj()
        }
      },
      getHoverLabel () {
        let labelList = this.showLabelValue.map((item) => {
          return item.join(this.separator)
        })
        return (labelList || []).join(';')
      },
      // 初始化showOptions属性
      initHoverActionIndexList (options) {
        this.handleRxCascaderIndexList(options)
        this.showOptions[this.props.value] = new Date().getTime()
        this.showOptions[this.props.children] = options
      },
      handleRxCascaderIndexList (options) {
        options.map((item, index) => {
          item.rxCascaderIndexList = [0, index]
          this.setRxCascaderIndexList(item, item.rxCascaderIndexList)
        })
      },
      setRxCascaderIndexList (item, rxCascaderIndexList) {
        if (item[this.props.children] && item[this.props.children].length > 0) {
          item[this.props.children].map((child, index) => {
            child.rxCascaderIndexList = _.cloneDeep(rxCascaderIndexList)
            child.rxCascaderIndexList.push(index)
            this.setRxCascaderIndexList(child, child.rxCascaderIndexList)
          })
        }
      },
      // 控制ul是否显示
      ifShow (index) {
        let show = index === 0 ? index === 0 : false
        let children = this.showOptions[this.props.children]
        for (let i = 1; i <= index; i++) {
          children = children[this.hoverActionIndexList[i]][this.props.children]
          if (i === index && children && children.length > 0) {
            show = true
          }
        }
        return show
      },
      // 给ul生成key值
      generateKey (index) {
        let key = this.showOptions[this.props.value]
        let children = this.showOptions[this.props.children]
        for (let i = 1; i <= index; i++) {
          key += children[this.hoverActionIndexList[i]][this.props.value]
          if (i < index) {
            children = children[this.hoverActionIndexList[i]][this.props.children]
          }
        }
        return key
      },
      // 返回每一级选项显示的选项list
      getItemList (index) {
        let item = this.showOptions[this.props.children]
        for (let i = 1; i <= index; i++) {
          item = item[this.hoverActionIndexList[i]][this.props.children]
        }
        return item
      },
      // 控制li显示样式
      getClass (index, itemLi, indexLi) {
        let classStr = ''
        // 搜索时的样式
        if (itemLi.disabled) {
          classStr += ' is-disabled'
        }
        if (this.filterStr) {
          if (this.fiterCheckItem().includes(itemLi.rxCascaderIndexList.join(''))) {
            classStr += ' item-check'
          }
          return classStr
        }
        // 非搜索时的样式
        if (itemLi[this.props.children] && itemLi[this.props.children].length > 0) {
          classStr += ' el-cascader-menu__item--extensible'
        }
        if (this.hoverActionIndexList[index + 1] === indexLi || this.fiterCheckItem().includes(itemLi.rxCascaderIndexList.join(''))) {
          if (itemLi[this.props.children] && itemLi[this.props.children].length > 0) {
            classStr += ' is-active'
          } else {
            classStr += ' item-check'
          }
        }
        return classStr
      },
      // 搜索时是否选中显示
      fiterCheckItem () {
        let list = this.valueIndexList.map((item) => {
          return item.join('')
        })
        return list
      },
      // hover时间控制下一级显示
      itemHover (index, itemLi, indexLi) {
        if (itemLi[this.props.children] && itemLi[this.props.children].length > 0) {
          this.hoverActionIndexList.splice(index + 1, this.hoverActionIndexList.length, indexLi)
        }
      },
      // 单选点击选中
      itemClick (index, itemLi, indexLi) {
        if (itemLi.disabled) {
          return
        }
        let hasIndex = this.fiterCheckItem().indexOf(itemLi.rxCascaderIndexList.join(''))
        if (hasIndex !== -1 && this.multiple) {
          this.valueIndexList.splice(hasIndex, 1)
          this.currentValue.splice(hasIndex, 1)
          this.showLabelValue.splice(hasIndex, 1)
          if (!(itemLi[this.props.children] && itemLi[this.props.children].length > 0)) {
            this.hoverActionIndexList.splice(index + 1, this.hoverActionIndexList.length)
          }
          this.$emit('input', _.cloneDeep(this.currentValue))
          this.$emit('change', _.cloneDeep(this.currentValue))
          return
        }
        if (this.filterStr && hasIndex === -1) {
          if (!this.multiple) {
            this.currentValue = _.cloneDeep(itemLi[this.props.value])
            this.showLabelValue = [_.cloneDeep(itemLi[this.props.label])]
            this.valueIndexList = [_.cloneDeep(itemLi.rxCascaderIndexList)]
            this.$emit('input', _.cloneDeep(this.currentValue))
            this.$emit('change', _.cloneDeep(this.currentValue))
          } else {
            this.currentValue.splice(this.currentValue.length, 0, _.cloneDeep(itemLi[this.props.value]))
            this.showLabelValue.splice(this.showLabelValue.length, 0, _.cloneDeep(itemLi[this.props.label]))
            this.valueIndexList.splice(this.valueIndexList.length, 0, _.cloneDeep(itemLi.rxCascaderIndexList))
            this.$emit('input', _.cloneDeep(this.currentValue))
            this.$emit('change', _.cloneDeep(this.currentValue))
          }
        }
        if (!this.filterStr && hasIndex === -1) {
          // 非末尾节点不给选中
          if ((this.onlyLastNodeCheck || this.multiple) && itemLi[this.props.children] && itemLi[this.props.children].length > 0) {
            return
          }
          this.hoverActionIndexList.splice(index + 1, this.hoverActionIndexList.length, indexLi)
          let handleList = this.changeToValue(this.hoverActionIndexList)
          if (!this.multiple) {
            this.currentValue = handleList[0]
            this.showLabelValue = [handleList[1]]
            this.valueIndexList = [handleList[2]]
            this.$emit('input', _.cloneDeep(this.currentValue))
            this.$emit('change', _.cloneDeep(this.currentValue))
          } else {
            this.currentValue.splice(this.currentValue.length, 0, handleList[0])
            this.showLabelValue.splice(this.showLabelValue.length, 0, handleList[1])
            this.valueIndexList.splice(this.valueIndexList.length, 0, handleList[2])
            this.$emit('input', _.cloneDeep(this.currentValue))
            this.$emit('change', _.cloneDeep(this.currentValue))
          }
        }
        if (!this.multiple) {
          this.menuVisible = false
        }
      },
      // 将选中的选项转换成value值数组和显示的label值，同步valueIndexList
      changeToValue (val) {
        let value = []
        let activeItem = ''
        let showLabelValue = []
        val.map((item, index) => {
          if (index !== 0) {
            activeItem = activeItem[this.props.children][item]
            value.push(_.cloneDeep(activeItem[this.props.value]))
            showLabelValue.push(_.cloneDeep(activeItem[this.props.label]))
          } else if (index === 0) {
            activeItem = this.showOptions
          }
        })
        return [value, showLabelValue, _.cloneDeep(val)]
      },
      // 将父组件传过来的value值转成数组索引值，拼接显示的label值
      valueToNum (val, options) {
        let valueIndexList = [0]
        let showLabelValue = []
        if (val && val.length && options && options.length) {
          let optionList = options
          for (let i = 0; i < val.length; i++) {
            let obj = this.findValueIndex(val[i], optionList)
            if (obj.index !== -1) {
              valueIndexList.push(obj.index)
              showLabelValue.push(obj.label)
              optionList = optionList[obj.index][this.props.children]
            } else {
              return []
            }
          }
        }
        return [valueIndexList, showLabelValue]
      },
      // 单选初始化valueIndexList、showLabelValue
      singleCheck (val, options) {
        let valueAndLabel = this.valueToNum(val, options)
        this.valueIndexList = valueAndLabel[0] ? [valueAndLabel[0]] : []
        this.showLabelValue = valueAndLabel[1] ? [valueAndLabel[1]] : []
      },
      multipleCheck (val, options) {
        this.valueIndexList = []
        this.showLabelValue = []
        for (let i = 0; i < val.length; i++) {
          let valueAndLabel = this.valueToNum(val[i], options)
          if (!valueAndLabel[1] || val[i].length !== valueAndLabel[1].length) {
            this.valueIndexList = []
            this.showLabelValue = []
            this.currentValue = []
            this.$emit('input', _.cloneDeep(this.currentValue))
            this.$emit('change', _.cloneDeep(this.currentValue))
            return
          } else {
            this.valueIndexList.splice(this.valueIndexList.length, 0, valueAndLabel[0])
            this.showLabelValue.splice(this.showLabelValue.length, 0, valueAndLabel[1])
          }
        }
      },
      // 查询value值在数组中的位置
      findValueIndex (val, options) {
        let obj = {index: -1, label: ''}
        let index = options.findIndex(item => {
          return item[this.props.value] === val
        })
        if (index === -1) {
          this.$message.warning('数据错误')
        } else {
          obj.index = index
          obj.label = options[index][this.props.label]
        }
        return obj
      },
      // 点击获取焦点
      handleClick () {
        if (this.disabled) return
        this.$refs.input.focus()
        if (this.filterable) {
          this.menuVisible = true
          return
        }
        this.menuVisible = !this.menuVisible
      },
      // 组装搜索查询时使用的options值
      setFilterOption (filterStr) {
        this.showOptions[this.props.children] = _.cloneDeep(this.filterOption).filter(optionsStack => {
          return optionsStack[this.props.label].some(option => new RegExp(escapeRegexpString(filterStr), 'i').test(option))
        })
      },
      // 将父组件传过来的options属性组装成一个数组
      setFilterOptionObj () {
        let options = _.cloneDeep(this.options)
        let handOption = []
        options.map((item) => {
          this.handFilterOption(item, [], [], handOption)
        })
        this.filterOption = handOption
      },
      // 组装数组
      handFilterOption (item, value, label, option) {
        item[this.props.value] = [...value, item[this.props.value]]
        item[this.props.label] = [...label, item[this.props.label]]
        if (!((this.onlyLastNodeCheck || this.multiple) && item[this.props.children] && item[this.props.children].length > 0)) {
          option.push(item)
        }
        if (item[this.props.children] && item[this.props.children].length > 0) {
          item[this.props.children].map((childrenItem) => {
            this.handFilterOption(childrenItem, item[this.props.value], item[this.props.label], option)
          })
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .el-icon-arrow-down.is-reverse {
    -webkit-transform: rotateZ(180deg);
    transform: rotateZ(180deg);
  }
  .rx-cascader-content{
    position: relative;
    display: inline-block;
    cursor: pointer;
  }
  /deep/ {
    .el-cascader__label,
    .el-input__icon{
      line-height: 32px;
    }
    .el-input__inner {
      height: 32px;
    }
    .el-tag--small{
      padding: 0 2px;
      line-height: 21px;
    }
    .rx-multiple-cascader__label{
      line-height: 28px;
      text-overflow: unset;
      .label-tags-list{
        max-width: calc(100% - 24px);
        display: inline-block;
        padding-right: 18px;
        position: relative;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        vertical-align: middle;
        .el-icon-close{
          position: absolute;
          top: 18%;
          right: 0px;
        }
      }
    }
  }
  .item-check{
    color: #5487DC;
    &:after{
      position: absolute;
      right: 5px;
      font-family: 'element-icons';
      content: "\E611";
      font-size: 12px;
      font-weight: bold;
      -webkit-font-smoothing: antialiased;
    }
  }
  .rx-cascader-content{
    .el-input{
      .el-input__suffix{
        height: 100%;
        .el-input__suffix-inner{
          height: 100%;
          .el-icon-circle-close {
            z-index: 1;
            position: absolute;
            line-height: 32px;
            width: 25px;
            height: 13px;
            right: 0;
            &:hover{
              &:before{
                background-color: #878d99;
                border-radius: 50%;
              }
            }
          }
        }
      }
    }
  }

</style>