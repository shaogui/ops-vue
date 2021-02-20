<template>
  <div>
    <a-button type="primary" icon="edit" @click="drawer.visible = true;drawer.render+=1">添加指令</a-button>
    <br/><br/>
    <Table ref="Table"/>

    <a-drawer title="创建" placement="right" :closable="false" width="50%"
              :visible="drawer.visible" @close="drawer.visible = false">
      <Add_or_update @close="handlecolse" :render="drawer.render"/>
    </a-drawer>

  </div>
</template>

<script>
import Table from './template/table'
import Add_or_update from './template/add_or_update'


export default {
  data: () => ({
    drawer: {
      visible: false,
      title: "",
      display: "",
      render: 0
    }
  }),
  components: {
    Table, Add_or_update
  },
  methods: {
    handlecolse() {
      this.drawer.visible = false
      this.$refs.Table.table_fetch_v2()
    }

  },
}
</script>

<style scoped>

</style>