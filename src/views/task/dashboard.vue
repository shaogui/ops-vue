<template>
  <div>
    <a-row :gutter="[16,16]">
      <a-col :span="24">
        <AppDeployTable ref="AppDeployTable" @detail="AppDeployDetail"/>
      </a-col>
    </a-row>

    <a-drawer :title="drawer.title" placement="right" :closable="false" width="50%"
              :visible="drawer.visible" @close="close">
      <AppDeployDetail v-if="drawer.display === 'AppDeployDetail'" ref="AppDeployDetail"
                       :form="data.detail"></AppDeployDetail>
    </a-drawer>

  </div>
</template>

<script>
import AppDeployTable from './app_deploy/table2'
import AppDeployDetail from './app_deploy/detail'

export default {
  data: () => ({
    data: {},
    drawer: {
      visible: false,
      title: "抽屉",
      display: ""
    }
  }),
  components: {
    AppDeployTable,
    AppDeployDetail
  },
  methods: {
    close() {
      this.drawer.visible = false
    },
    AppDeployDetail(text) {
      this.data.detail = text
      this.drawer.title = "任务详情"
      this.drawer.display = "AppDeployDetail"
      this.drawer.visible = true
    }
  }
}
</script>