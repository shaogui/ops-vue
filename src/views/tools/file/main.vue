<template>
  <div>
    <a-table
        :columns="columns"
        :data-source="data"
        :pagination="false"
        :row-key="record => record.id"
        @change="table_change"
        bordered>

      <template slot="action" slot-scope="text">
        <a-button @click="open(text)">列表</a-button>
        |
        <a-button type="primary" @click="open(text)">添加</a-button>
      </template>
    </a-table>

    <a-drawer :title="drawer.title" placement="bottom" :closable="false" height="80%"
              :visible="visible.open" @close="Drawer('open',false)">
      <folderopen ref="child" :root_path="data.root_path" :params="{root_path:data.root_path}"/>
    </a-drawer>

    <a-drawer :title="drawer.title" placement="right" :closable="false" :width="500"
              :visible="visible.add" @close="Drawer('add',false)">
      <folderadd :data="data.data" :accept="data.accept"/>
    </a-drawer>

  </div>

</template>

<script>
import {table_change_v2, table_fetch_v2, table_search_v2} from "@/utils/table";


const columns = [
  {title: 'id', dataIndex: 'id'},
  {title: '名称', dataIndex: 'name'},
  {title: '存储路径', dataIndex: 'path'},
  {title: '访问地址模板', dataIndex: 'url'},
  {title: '创建时间', dataIndex: 'create_time', width: 180,},
  {title: 'Action', key: 'operation', scopedSlots: {customRender: 'action'}, width: 200, align: "center"},
];

export default {
  name: "table",
  data() {
    return {
      columns,
      data: {},
      table: {
        loading: false,
        pagination: {},
      }
    }
  },
  mounted() {
    this.table_fetch_v2({url: "/apis/tools/files/directory/"})
  },
  methods: {
    table_fetch_v2,
    table_change_v2,
    table_search_v2,
  }
}
</script>
