<template>
  <div>
    <h1 align="center">请使用微信扫码登录：{{ id }}</h1>
    <a-row type="flex" justify="center">
      <a-col :xs="12" :sm="24" :md="24" :lg="6" :xl="6">
        <a-spin :tip="tip" :spinning="spinning">
          <div class="spin-content">
            <img :src="img" width="100%"/>
          </div>
        </a-spin>
      </a-col>
      <br/>
      <a-col :xs="23" :sm="24" :md="24" :lg="17" :xl="17">
        <a-table :columns="columns"
                 :data-source="data"
                 :row-key="record => record.id"
                 bordered>
        </a-table>
        <br/>
        <a-alert v-for="(d,index) in data_err" :key="index" :message="d" banner/>
      </a-col>
    </a-row>
  </div>
</template>

<script>
const columns = [
  {title: '日期', dataIndex: 'date'},
  {title: 'name', dataIndex: 'name'},
  {title: 'app_name', dataIndex: 'app_name'},
  {title: 'code_id', dataIndex: 'code_id'},
  {title: '数据来源', dataIndex: 'code_name'},
  {title: '曝光量', dataIndex: 'impression'},
  {title: '点击量', dataIndex: 'click'},
  {title: '点击率', dataIndex: 'ctr'},
  {title: 'cpm', dataIndex: 'cpm'},
  {title: '收益', dataIndex: 'income'},
];


export default {
  name: "wechat",
  data() {
    return {
      columns,
      data: [],
      data_err: [],
      id: "",
      img: "",
      tip: "二维码获取中......",
      spinning: true,
      result: []
    }
  },
  mounted() {
    this.get_QrCode()
  },
  methods: {
    get_QrCode() {
      clearInterval(this.timer);
      this.tip = "二维码获取中......"
      this.$http.post('apis/tools/weixinxcx/QrCode/').then(res => res.data).then(res => {
        this.id = res.id
        this.img = res.img
        this.spinning = false
        this.timer = setInterval(() => {
          this.check_QrCode()
        }, 1000)
      })
    },
    check_QrCode() {
      this.$http.get(`apis/tools/weixinxcx/QrCode/${this.id}/`).then(res => res.data).then(res => {
        console.log(res)
        if (res.status == 4) {
          this.spinning = true
          this.tip = "扫码中......"
          this.data = []
          this.data_err = []
        } else if (res.status == 6) {
          this.spinning = true
          this.tip = "密码输入中......"
        } else if (res.status == 3) {
          this.spinning = true
          this.tip = "扫码失败"
          this.get_QrCode()
        } else if (res.status == 1) {
          this.tip = "扫码成功，数据收集中......"
          clearInterval(this.timer);
          this.task()
        }
      })
    },
    task() {
      this.$http.get(`apis/tools/weixinxcx/Task/${this.id}/`).then(res => res.data).then(res => {
        this.result = res
        res.forEach(item => {
          if (item.status == "收集成功") {
            this.data.unshift(item.data)
          } else {
            this.data_err.push(item.data)
          }
        })
        this.get_QrCode()
      })
    },
  }
}
</script>

<style scoped>

</style>