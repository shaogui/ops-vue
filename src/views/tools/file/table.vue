<template>
  <div>
    <a-table :columns="columns" :data-source="data" :pagination="table.pagination" :loading="table.loading"
             :scroll="{ x: '100%', y: 450 }"
             :row-key="record => record.id" @change="table_change_v2" bordered>
      <template slot="url" slot-scope="url,text">
        <a-popover>
          <template slot="content">
            <a class="copydata" @click="ClickCopy"
               data-clipboard-action="copy"
               :data-clipboard-text="url">
              <vue-qr :bgSrc="require('@/assets/logo.png')" :logoSrc="require('@/assets/logo.png')"
                      :text="url"
                      :colorDark="green"
                      :size="256"/>
            </a>
          </template>
          <a v-if="text.directory.category === 'file'">{{ url }}</a>
          <a v-else-if="text.directory.category === 'folder'">{{ url }}{{ text.file_name }}</a>
        </a-popover>
      </template>
      <template slot="action" slot-scope="text">
        <a-button type="primary" @click="cover(text)">覆盖</a-button>
      </template>
    </a-table>
    <File_Cover :parent="children" :visible="visible" @close="visible = false;table_fetch_v2()"/>
  </div>
</template>
<script>
import File_Cover from "./cover"
import {table_fetch_v2, table_change_v2} from '@/utils/table'
import VueQr from 'vue-qr'

const columns = [
  {title: '文件名', dataIndex: 'file_name', ellipsis: true,},
  {title: '访问地址', dataIndex: 'url', ellipsis: true, scopedSlots: {customRender: 'url'},},
  {title: '存储路径', dataIndex: 'to_path', ellipsis: true, align: 'center',},
  {title: '上传用户', dataIndex: 'creater', width: 150, align: 'center',},
  {title: '上传时间', dataIndex: 'create_time', width: 180, align: 'center',},
  {title: '最后更新时间', dataIndex: 'update_time', width: 180, align: 'center',},
  {title: 'Action', key: 'operation', width: 100, align: 'center', scopedSlots: {customRender: 'action'},},
];

export default {
  props: {
    parent: Object,
    render: Number
  },
  data() {
    return {
      data: [],
      loading: false,
      columns,
      table: {
        pagination: {},
        loading: false
      },
      visible: false,
      children: {},
    };
  },
  components: {File_Cover, VueQr},
  watch: {
    render: {
      immediate: true,
      handler: function (val) {
        console.log("watch parent", val)
        this.table_fetch_v2({url: "/apis/tools/files/upload/file/", params: {directory: this.parent.id}})
      }
    },
  },
  methods: {
    table_fetch_v2,
    table_change_v2,
    cover(val) {
      console.log("cover", val)
      this.children = val
      this.visible = true
    },
    ClickCopy() {
      let clipboard = new this.$clipboard(".copydata");
      clipboard.on('success', () => {
        this.$message.success("复制成功")
        clipboard.destroy()
      });
      clipboard.on('error', () => {
        this.$message.warning("复制失败")
        clipboard.destroy()
      });
    }
  }
};
</script>
