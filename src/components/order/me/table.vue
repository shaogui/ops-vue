<template>
  <a-table :columns="columns" :data-source="data" :pagination="pagination" :loading="loading"
           :row-key="record => record.id" @change="table_change" bordered>
    <template slot="is_active" slot-scope="is_active,text">
      <a-switch :default-checked="is_active === 'true'" @change="onChange(text,$event)" :loading="switchloading"/>
    </template>
    <template slot="status" slot-scope="status">
      <img :src="require('@/assets/icon/正确.svg')" v-show="status === 'allow'" width="60%"/>
      <img :src="require('@/assets/icon/错误.svg')" v-show="status === 'deny'" width="60%"/>
      <img :src="require('@/assets/icon/等待 缓冲 快速 延迟.svg')" v-show="status === 'null'" width="60%"/>
    </template>
    <template slot="action" slot-scope="text">
      <div>
        <a-button type="primary" @click="detail(text)">详细</a-button>
      </div>
    </template>
  </a-table>
</template>
<script>
import {table_fetch, table_change} from '@/utils/table'

const columns = [
  {title: 'id', dataIndex: 'id'},
  {title: 'title', dataIndex: 'title'},
  {title: '创建人', dataIndex: 'creater'},
  {title: '开关', dataIndex: 'is_active', width: 80, scopedSlots: {customRender: 'is_active'}, align: "center"},
  {title: '审批', dataIndex: 'status', width: 80, scopedSlots: {customRender: 'status'}, align: "center"},
  {title: '部署', dataIndex: 'status2', width: 80, scopedSlots: {customRender: 'status'}, align: "center"},
  {title: '创建时间', dataIndex: 'create_time', width: 180,},
  {title: '审批时间', dataIndex: 'verify_time', width: 180,},
  {title: 'Action', key: 'operation', scopedSlots: {customRender: 'action'}, width: 100,},
];


export default {
  data() {
    return {
      data: [],
      columns,
      pagination: {},
      loading: false,
      switchloading: false,
      url: "/apis/order/deploy/"
    };
  },
  components: {},
  mounted() {
    this.table_fetch()
  },
  methods: {
    table_fetch,
    table_change,
    onChange(text, checked) {
      this.switchloading = true
      console.log(`a-switch to ${checked}`);
      console.log(text)
      this.$http({
        url: `/apis/order/deploy/${text.id}/`,
        method: 'put',
        data: {is_active: checked},
        type: 'text',
      }).then(res => {
        console.log(res)
        this.switchloading = false
      })
    },
    detail(text) {
      this.$emit("detail", 'visible2', text);
    }
  }
}
</script>
