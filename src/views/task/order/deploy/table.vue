<template>
  <div>
    <a-table :columns="columns" :data-source="data" :pagination="table.pagination" :loading="table.loading"
             :row-key="record => record.id" @change="table_change_v2" bordered>

      <template slot="title" slot-scope="">
        快速查询:
        <a-checkbox name="is_actived" v-model="radio.is_actived_value" @change="handlecheckboxChange">进行中</a-checkbox>
        <a-radio-group name="verify_status" :options="radio.verify_status" v-model="radio.verify_status_value"
                       @change="handleradioChange"/>
        <a-radio-group name="run_status" :options="radio.run_status" v-model="radio.run_status_value"
                       @change="handleradioChange"/>
        <a-tag @click="handleResetSearch">重置搜索条件</a-tag>
      </template>

      <template slot="filterDropdown" style="padding: 8px"
                slot-scope="{ column }">
        <a-input-search :placeholder="`Search ${column.title}`" style="width: 200px"
                        @search="table_search_v2($event,column.dataIndex)"/>
      </template>


      <template slot="app" slot-scope="app">
        <a-tag v-for="(v,index) in app" :key="index">{{ v.name }}</a-tag>
      </template>

      <template slot="label" slot-scope="app">
        <a-tag v-for="label in uniq_label(app)" :key="label">{{ label }}</a-tag>
      </template>

      <template slot="is_actived" slot-scope="status,text,index">
        <a-switch checked-children="开" un-checked-children="关"
                  :default-checked="status === 1"
                  :disabled="status === 2"
                  @change="table_close(text,$event,index)" :loading="switchloading"/>
      </template>

      <template slot="status" slot-scope="status">
        <a-tag :color="tag.color[status.code]">{{ status.display }}</a-tag>
      </template>

      <template slot="action" slot-scope="text">
        <div>
          <a-button type="primary" @click="open_detail(text)">详细</a-button>
        </div>
      </template>
    </a-table>

    <a-drawer placement="right" :closable="false" width="50%"
              :visible="drawer.visible" @close="drawer.visible = false">
      <Detail ref="Detail" :parent="children.detail" @submit="handlesubmit"/>
    </a-drawer>

  </div>
</template>
<script>
import {table_fetch_v2, table_change_v2, table_search_v2} from '@/utils/table'
import Detail from './detail'

const verify_status = [
  {label: '待审批', value: 0},
  {label: '审批通过', value: 1},
  {label: '审批拒绝', value: 2},
];

const run_status = [
  {label: '待部署', value: 0},
  {label: '部署完成', value: 1},
  {label: '部署失败/拒绝', value: 2},
];

const columns = [
  {title: 'id', dataIndex: 'id'},
  {
    title: '应用', dataIndex: 'app', key: "app", scopedSlots: {
      customRender: 'app',
      filterDropdown: 'filterDropdown',
    },
  },
  {
    title: '标签', dataIndex: 'app', key: "label", scopedSlots: {
      customRender: 'label',
      filterDropdown: 'filterDropdown',
    },
  },
  {title: '创建人', dataIndex: 'creater'},
  {title: '开关', dataIndex: 'is_actived', width: 80, scopedSlots: {customRender: 'is_actived'}, align: "center"},
  {title: '审批', dataIndex: 'verify', width: 80, scopedSlots: {customRender: 'status'}, align: "center"},
  {title: '部署', dataIndex: 'run', width: 80, scopedSlots: {customRender: 'status'}, align: "center"},
  {title: '创建时间', dataIndex: 'create_time', width: 180,},
  {title: 'Action', key: 'operation', scopedSlots: {customRender: 'action'}, width: 80,},
];

export default {
  data() {
    return {
      timer: "",
      data: [],
      children: {
        detail: {},
      },
      radio: {
        run_status,
        run_status_value: "",
        verify_status,
        verify_status_value: "",
        is_actived_value: true
      },
      drawer: {
        visible: false,
      },
      tag: {
        color: {
          1: "#87d068",
          2: "#f50",
        }
      },
      columns,
      table: {
        loading: false,
        pagination: {},
      },
      switchloading: false,
    };
  },
  components: {Detail},
  mounted() {
    this.table_fetch_v2({url: "/apis/tasks/order/deploy/", params: {is_actived: 1}})
    this.timer = setInterval(() => {
      this.table_fetch_v2()
    }, 10000)
    this.open_detail_http()
  },
  methods: {
    table_fetch_v2,
    table_change_v2,
    table_search_v2,
    table_close(text, checked, index) {
      this.switchloading = true
      if (checked === false) {
        this.$http.delete(`/apis/tasks/order/deploy/${text.id}/`).then(() => {
          this.data[index].is_actived = 2
        }).catch(() => {
          this.data[index].is_actived = 1
        }).finally(() => {
          this.switchloading = false
        })
      }
    },
    open_detail_http() {
      let id = this.$route.query.id
      if (id) {
        this.$http.get(`/apis/tasks/order/deploy/${id}/`).then(res => {
          this.drawer.visible = true
          this.children.detail = res.data
        })
      }
    },
    open_detail(data) {
      this.drawer.visible = true
      this.children.detail = data
    },
    handlesubmit() {
      this.handleResetSearch()
    },
    handleradioChange(e) {
      console.log(e.target.name, e.target.value)
      this.table_search_v2(e.target.value, e.target.name)
    },
    handlecheckboxChange(e) {
      console.log(e.target.name, e.target.checked)
      if (e.target.checked) {
        this.table_search_v2(1, e.target.name)
      } else {
        this.table_search_v2("", e.target.name)
      }
    },
    handleResetSearch() {
      this.radio.is_actived_value = true
      this.radio.verify_status_value = ""
      this.radio.run_status_value = ""
      this.table.params = {}
      this.table_fetch_v2({params: {is_actived: 1}, current: 1})
    },
    uniq_label(value) {
      let labels = Array()
      value.forEach(item => {
        item.label.forEach(label => {
          labels.push(label)
        })
      })
      return [...new Set(labels)]
    }
  }
}
</script>

<style scoped>

</style>