# hello

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm start
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```
## 基本属性介绍
```
options:Array 级联选项数组
```
```
placeholder: String 提示语
```
```
disabled: Boolean 是否可用
```
```
separator: { type: String, default: ' / ' } 显示值每一级之间的分隔符
```
```
filterable: Boolean 是否支持搜索功能
```
```
props: { type: Object, default () { return { label: 'label',value: 'value', children: 'children' } } }
```
```
label:显示字段名，value:绑定值字段，children:子级数组字段
```
```
onlyLastNodeCheck: Boolean 是否只能选择最后一个节点，当多选的时候只能选择最后一个节点
```
```
showAllLevels: { type: Boolean, default: true } 是否显示全路径，false时只显示最后一级的label值
```
```
multiple: Boolean 是否多选
```
