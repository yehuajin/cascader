<script type="text/babel">
  import Table from 'babel-loader!element-ui/packages/table/src/table'
  import TableHeader from './EleTableHeader.js'
  export default {
    name: 'EleTable',
    extends: Table,
    components: {
      TableHeader
    }
  }
</script>