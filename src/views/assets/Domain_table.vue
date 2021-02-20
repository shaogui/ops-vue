<template>
  <div>
    <a-table :columns="columns"
             :data-source="data"
             :pagination="table.pagination"
             :loading="table.loading"
             :row-key="(record) => record.id"
             @change="table_change_v2"
             bordered>
      <template slot="filterDropdown"
                style="padding: 8px"
                slot-scope="{ column }">
        <a-input-search :placeholder="`Search ${column.title}`"
                        style="width: 200px"
                        @search="table_search($event, column.dataIndex)" />
      </template>
      <template slot="action"
                slot-scope="text">
        <div>
          <a-button type="primary"
                    @click="ClickEdit(text)">编辑</a-button>
        </div>
      </template>
    </a-table>
    <a-drawer title="域名信息编辑"
              placement="right"
              :closable="false"
              width="30%"
              :visible="drawer.visible"
              @close="drawer.visible = false">
      <Domain_add @submit="HandleSubmit"
                  :todata="todata" />
    </a-drawer>
  </div>
</template>
<script>
import {
  table_fetch_v2,
  table_change_v2,
  table_search_v2,
} from "@/utils/table";
import Domain_add from "./Domain_add.vue"

const columns = [
  {
    title: "域名ID",
    dataIndex: "DomainId",
    scopedSlots: {
      filterDropdown: "filterDropdown",
    },
  },
  {
    title: "域名",
    dataIndex: "DomainName",
    scopedSlots: {
      filterDropdown: "filterDropdown",
    },
  },
  {
    title: "ICP号",
    dataIndex: "icp",
    scopedSlots: {
      filterDropdown: "filterDropdown",
    },
  },

  {
    title: "所有者",
    dataIndex: "owner",
    scopedSlots: {
      filterDropdown: "filterDropdown",
    },
  },
  {
    title: "创建时间",
    dataIndex: "CreationDate",
  },
  {
    title: "到期时间",
    dataIndex: "ExpirationDate",
    scopedSlots: {
      filterDropdown: "filterDropdown",
    },
  },
  {
    title: "Action",
    key: "operation",
    scopedSlots: {
      customRender: "action",
    },
    width: 80,
  },
];

export default {
  data () {
    return {
      columns,
      data: [],
      todata: {},
      table: {
        pagination: {},
        loading: false,
      },
      drawer: {
        visible: false
      }
    };
  },
  components: {
    Domain_add
  },
  mounted () {
    this.table_fetch_v2({
      url: "/apis/assets/domain/list/",
    });
  },
  methods: {
    table_fetch_v2,
    table_change_v2,
    table_search_v2,
    ClickEdit (text) {
      console.log(text)
      this.todata = text
      this.drawer.visible = true
    },
    HandleSubmit () {
      this.drawer.visible = false
      this.table_fetch_v2()
    }
  },
};
</script>
