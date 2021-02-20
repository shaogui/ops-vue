<template>
  <tableapps ref="tableapps"/>
</template>
<script>
import tableapps from '@/components/assets/table-apps'

export default {
  data() {
    return {
      data: [],
    };
  },
  components: {tableapps},
  mounted() {
    this.$refs.tableapps.table_fetch()
  },
  methods: {}
}
</script>
