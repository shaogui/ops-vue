<template>
  <div>
    <Add_Folder @submit="table_fetch_v2()"/>
    <p></p>

    <a-table :columns="columns" :data-source="data" :row-key="record => record.id"
             :pagination="table.pagination" :loading="table.loading" @change="table_change_v2">
      <template slot="action" slot-scope="text">
        <a-button type="primary" @click="uploadfile(text)">
          <div v-if="text.category === 'file'">添加</div>
          <div v-else-if="text.category === 'folder'">覆盖</div>
        </a-button>
        |
        <a-button @click="filelist(text)">记录</a-button>
      </template>
    </a-table>

    <a-drawer :title="drawer.title" :visible="drawer.visible2" @close="drawer.visible2 = false"
              placement="bottom" height="80%">
      <File_Table :parent="drawer.children2" :render="drawer.render"/>
    </a-drawer>

    <a-drawer :title="drawer.title" :visible="drawer.visible" @close="drawer.visible = false"
              placement="right" width="30%">
      <File_Upload :parent="drawer.children"/>
    </a-drawer>
  </div>

</template>

<script>
import {table_fetch_v2, table_change_v2} from "@/utils/table";
import File_Upload from "./file/upload"
import File_Table from "./file/table"
import Add_Folder from "./file/add_folder"


const columns = [
  {title: 'Id', dataIndex: 'id'},
  {title: '名称', dataIndex: 'name'},
  {title: '存储路径', dataIndex: 'path'},
  {title: '访问地址模板', dataIndex: 'url'},
  {title: '创建时间', dataIndex: 'create_time', width: 180},
  {title: 'Action', key: 'operation', scopedSlots: {customRender: 'action'}, width: 200, align: "center"}
];


export default {
  data() {
    return {
      columns,
      data: [],
      table: {
        loading: false,
        pagination: {},
      },
      drawer: {
        title: "",
        visible: false,
        children: {},
        visible2: false,
        children2: {},
        render: 0
      },
    }
  },
  components: {File_Upload, File_Table, Add_Folder},
  mounted() {
    this.table_fetch_v2({url: "/apis/tools/files/directory/"})
  },
  methods: {
    table_fetch_v2,
    table_change_v2,
    uploadfile(text) {
      console.log("uploadfile", text)
      this.drawer.children = text
      this.drawer.title = text.name
      this.drawer.visible = true
    },
    filelist(text) {
      this.drawer.render = new Date().getTime();
      this.drawer.children2 = text
      this.drawer.title = text.name
      this.drawer.visible2 = true
      console.log("filelist", text)
    },
  }
}
</script>
