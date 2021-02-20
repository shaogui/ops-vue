<template>
  <div>
    <a-table :columns="columns"
             :data-source="data"
             :pagination="pagination"
             :loading="loading"
             :row-key="record => record.id"
             @change="table_change"
             bordered>

      <template slot="filterDropdown" style="padding: 8px"
                slot-scope="{ column }">
        <a-input-search :placeholder="`Search ${column.title}`" style="width: 200px"
                        @search="table_search($event,column.dataIndex)"/>
      </template>

      <template slot="Ipaddress" slot-scope="data">
      <span>
        私网:
        <a-tag color="blue"> {{ data.ipaddress }}</a-tag>
      </span>
        <span v-show="data.eipaddress">
        公网:
        <a-tag color="red"> {{ data.eipaddress }}</a-tag>
      </span>
      </template>

      <template slot="Memory" slot-scope="Memory"> {{ Memory }} GB</template>

      <template slot="action" slot-scope="text">
        <a-button type="primary" @click="open(text)">应用列表</a-button>
      </template>

    </a-table>

    <a-drawer :title="drawertitle" placement="bottom" :closable="false" height="80%"
              :visible="visible" @close="close()">
      <tableapps ref="tableapps" :server_id="server_id"/>
    </a-drawer>
  </div>


</template>
<script>
import tableapps from '@/components/assets/table-apps'
import {table_fetch, table_change, table_search} from '@/utils/table'

const columns = [
  {title: '实列名', dataIndex: 'instance_id'},
  {
    title: '主机名', dataIndex: 'instance_name', scopedSlots: {
      filterDropdown: 'filterDropdown',
    }
  },
  {title: 'Ipaddress', scopedSlots: {customRender: 'Ipaddress'},},
  {title: 'Port', dataIndex: 'remote_port', width: 60,},
  {title: 'Cpus', dataIndex: 'cpus', width: 70,},
  {title: 'Memory', dataIndex: 'memory', scopedSlots: {customRender: 'Memory'}, width: 90,},
  {title: 'Create_time', dataIndex: 'create_time', width: 180,},
  {title: 'Action', key: 'operation', scopedSlots: {customRender: 'action'}, width: 80,},
];


export default {
  data() {
    return {
      data: [],
      server_id: false,
      visible: false,
      drawertitle: "",
      pagination: {},
      loading: false,
      columns,
      url: '/apis/assets/server/list/',
      params: {}
    };
  },
  components: {tableapps},
  mounted() {
    this.table_fetch()
  },
  methods: {
    table_fetch,
    table_change,
    table_search,
    open(value) {
      this.server_id = value.id
      this.drawertitle = value.ipaddress
      this.visible = true
      setTimeout(() => {
        this.$refs.tableapps.table_render()
      }, 0)

    },
    close() {
      this.visible = false
    }
  }
};
</script>
