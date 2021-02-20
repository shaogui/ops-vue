<template>
  <div>
    <a-button type="primary" icon="edit" @click="create">创建部署任务</a-button>
    <p></p>
    <order_deploy_table ref="order_deploy_table"/>

    <a-drawer placement="right" :closable="false" width="50%"
              :visible="drawer.visible" @close="close">
      <order_deploy_create @submit="submit"/>
    </a-drawer>

  </div>
</template>
<script>
import order_deploy_table from './order/deploy/table'
import order_deploy_create from './order/deploy/create'

export default {
  data() {
    return {
      data: {
        detail: {}
      },
      drawer: {
        visible: false,
        title: "抽屉",
        display: "",
      }
    };
  },
  components: {
    order_deploy_create,
    order_deploy_table
  },
  mounted() {
  },
  methods: {
    close() {
      this.drawer.visible = false
    },
    create() {
      this.drawer.visible = true
    },
    submit() {
      this.close()
      this.$refs.order_deploy_table.table_fetch_v2()
    }
  }
}
</script>
