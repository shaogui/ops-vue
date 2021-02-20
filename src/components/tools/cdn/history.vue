<template>
  <a-table
      :columns="columns"
      :data-source="data"
      :pagination="pagination"
      :loading="loading"
      :row-key="record => record.id"
      @change="table_change"
      bordered>
    <template slot="title" slot-scope="">
      Header
    </template>
    <template slot="footer" slot-scope="">
      Footer
    </template>
    <template slot="url" slot-scope="url">
      <a> {{ url }} </a>
    </template>
    <template slot="action" slot-scope="text">
      <div>
        <a-button type="primary" :loading="$store.getters.iconLoading('cdn')" @click="() => submit(text)">
          提交刷新
        </a-button>
      </div>
    </template>
  </a-table>
</template>
<script>
import eventBus from "@/utils/eventBus";
import {table_fetch, table_change} from '@/utils/table'


const columns = [
  {title: 'id', dataIndex: 'id', width: 100,},
  {title: 'type', dataIndex: 'type', width: 100,},
  {title: 'url', dataIndex: 'url', scopedSlots: {customRender: 'url'}},
  {title: 'user', dataIndex: 'user', width: 150, align: 'center',},
  {title: 'create_time', dataIndex: 'create_time', width: 180, align: 'center',},
  {
    title: 'Action', key: 'operation', width: 80,
    align: 'center',
    scopedSlots: {customRender: 'action'}
  },
];


export default {
  data() {
    return {
      data: [],
      pagination: {},
      loading: false,
      columns,
      url: '/apis/tools/cdn/',
    };
  },
  mounted() {
    this.table_fetch()
    eventBus.$on("cdn-reload", () => {
      this.table_fetch()
    })

  },
  methods: {
    table_fetch,
    table_change,
    submit(text) {
      eventBus.$emit("cdn-Refresh", text)
    }
  }
};
</script>
