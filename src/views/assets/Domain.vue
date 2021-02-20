<template>
  <div>
    <a-button type="primary" icon="edit" @click="ClickAdd">添加域名
    </a-button>
    |
    <a-button type="primary" icon="sync" @click="ClickSync" :loading="loading">自动更新域名
    </a-button>
    <p></p>
    <Domain_table ref="Domain_table"/>

    <a-drawer title="域名信息编辑" placement="right" :closable="false" width="30%" :visible="drawer.visible"
              @close="drawer.visible = false">
      <Domain_add @submit="HandleSubmit"/>
    </a-drawer>
  </div>
</template>
<script>
import Domain_table from "./Domain_table.vue"
import Domain_add from "./Domain_add.vue"

export default {
  data() {
    return {
      data: [],
      drawer: {
        visible: false
      },
      loading: false
    };
  },
  components: {
    Domain_table,
    Domain_add
  },
  methods: {
    ClickAdd() {
      this.drawer.visible = true
    },
    ClickSync() {
      this.loading = true
      this.$http.post('/apis/assets/domain/sync/', {}).then(() => {
        this.$message.success("同步完成")
        this.loading = false
      }).finally(() => {
        this.loading = false
      })
    },
    HandleSubmit() {
      this.drawer.visible = false
      this.$refs.Domain_table.table_fetch_v2()
    }
  }
}
</script>
