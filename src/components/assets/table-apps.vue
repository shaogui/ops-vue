<template>
  <a-table
      :columns="columns"
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

    <template slot="label" slot-scope="label_list">
      <a-tag v-for="label in label_list" :key="label.id">{{ label }}</a-tag>
    </template>
    <template slot="path" slot-scope="installpath">
      <a-tag v-for="p in installpath" :key="p.id" color="blue">{{ p.ipaddress }}:{{ p.path }}</a-tag>
    </template>

    <template slot="code" slot-scope="code">
      <a> {{ code }} </a>
    </template>

    <template slot="action" slot-scope="">
      <div>
        <a-button type="primary">版本</a-button>
      </div>
    </template>
  </a-table>
</template>
<script>
import {table_fetch, table_change, table_search} from '@/utils/table'

const columns = [
  {
    title: 'name', dataIndex: 'name', scopedSlots: {
      filterDropdown: 'filterDropdown',
    }
  },
  {
    title: '应用属性', dataIndex: 'label_list', scopedSlots: {
      filterDropdown: 'filterDropdown',
      customRender: 'label'
    },
  },
  {title: '安装路径', dataIndex: 'installpath', scopedSlots: {customRender: 'path'},},
  {title: 'code', dataIndex: 'code'},
  {title: 'desc', dataIndex: 'desc'},
  {title: 'create_time', dataIndex: 'create_time', width: 180,},
  // {title: 'Action', key: 'operation', scopedSlots: {customRender: 'action'}, width: 80,},
];


export default {
  data() {
    return {
      data: [],
      pagination: {},
      loading: false,
      columns,
      url: "/apis/assets/app/list/",
      params: {}
    };
  },
  props: {
    server_id: Number
  },
  mounted() {
  },
  methods: {
    table_fetch,
    table_change,
    table_search,
    table_render() {
      console.log(this.server_id)
      this.params.server_id = this.server_id
      this.table_fetch()
    }
  }
}
</script>
