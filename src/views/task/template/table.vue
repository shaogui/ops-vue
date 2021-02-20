<template>
  <div>
    <a-table :columns="columns" :data-source="data" :pagination="table.pagination" :loading="table.loading"
             :row-key="record => record.id" @change="table_change_v2" bordered>

      <template slot="app" slot-scope="app">
        <a-badge :count="app.length" :number-style="{ backgroundColor: '#52c41a' }"/>
      </template>

      <template slot="action" slot-scope="line">
        <div>
          <a-button type="primary" @click="edit(line)">编辑</a-button>
          |
          <a-popconfirm title="确认执行？" ok-text="Yes" cancel-text="No"
                        @confirm="del(line)">
            <a-button>删除</a-button>
          </a-popconfirm>

        </div>
      </template>

    </a-table>

    <a-drawer title="编辑" placement="right" :closable="false" width="50%"
              :visible="drawer.visible" @close="drawer.visible = false">
      <Add_or_update ref="Add_or_update" status="update" :parent="children.Add_or_update" @close="handlecolse"/>
    </a-drawer>

  </div>
</template>

<script>
import {table_fetch_v2, table_change_v2, table_search_v2} from '@/utils/table'
import Add_or_update from "@/views/task/template/add_or_update";

const columns = [
  {title: 'id', dataIndex: 'id', width: 120, align: "center"},
  {title: '指令名', dataIndex: 'name'},
  {title: '指令类型', dataIndex: 'type', width: 150, align: "center"},
  {title: '关联应用数', dataIndex: 'app', scopedSlots: {customRender: 'app'}, width: 120, align: "center"},
  {title: '创建时间', dataIndex: 'create_time', width: 180, align: "center"},
  {title: 'Action', key: 'operation', scopedSlots: {customRender: 'action'}, width: 180, align: "center"},
];

export default {
  data: () => ({
    columns,
    table: {
      loading: false,
      pagination: {},
    },
    data: [],
    children: {
      Add_or_update: {}
    },
    drawer: {
      visible: false,
    },
  }),
  components: {Add_or_update},
  mounted() {
    this.table_fetch_v2({
      url: "/apis/tasks/command/template/"
    })
  },
  methods: {
    table_fetch_v2,
    table_change_v2,
    table_search_v2,
    edit(data) {
      this.children.Add_or_update = data
      this.drawer.visible = true
    },
    del(data) {
      this.$http.delete(`/apis/tasks/command/template/${data.id}`).then(() => {
        this.$message.success('已删除')
        this.table_fetch_v2()
      })
    },
    handlecolse() {
      this.drawer.visible = false
      this.table_fetch_v2()
    }
  }
}
</script>
