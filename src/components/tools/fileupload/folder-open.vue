<template>
  <a-table :columns="columns" :data-source="data" :pagination="pagination" :loading="loading"
           :scroll="{ x: '100%', y: 450 }"
           :row-key="record => record.id" @change="table_change" bordered>
    <template slot="url" slot-scope="url">
      <a> {{ url }} </a>
    </template>
    <template slot="action" slot-scope="">
      <div>
        <a-button type="primary">暂无</a-button>
      </div>
    </template>
  </a-table>
</template>
<script>
import {table_fetch, table_change} from '@/utils/table'

const columns = [
  {
    title: '文件名',
    dataIndex: 'file_name',
    ellipsis: true,
  },
  {
    title: '访问地址',
    dataIndex: 'url',
    ellipsis: true,
    scopedSlots: {
      customRender: 'url'
    },
  },
  {
    title: '上传用户',
    dataIndex: 'user',
    width: 150,
    align: 'center',
  },
  {
    title: '上传时间',
    dataIndex: 'create_time',
    width: 180,
    align: 'center',
  },
  {
    title: 'Action',
    key: 'operation',
    width: 100,
    align: 'center',
    scopedSlots: {
      customRender: 'action'
    },
  },
];


export default {
  data() {
    return {
      data: [],
      loading: false,
      pagination: {},
      columns,
      url: '/apis/tools/files/upload/',
    };
  },
  props: {
    params: Object
  },
  methods: {
    table_fetch,
    table_change
  }
};
</script>
