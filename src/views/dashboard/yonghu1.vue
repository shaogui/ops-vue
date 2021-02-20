<template>
  <div>
    <a-card title="昨日数据">
      <a-spin :spinning="spinning">
        <a-row :gutter="16">
          <a-col class="gutter-row" :span="8">
            <div class="gutter-box">
              <a-card title="每日赚点新增用户人数">
                {{ yonghu.newuser[0] }}
              </a-card>
            </div>
          </a-col>
          <a-col class="gutter-row" :span="8">
            <div class="gutter-box">
              <a-card title="当天新增用户完成马甲包人数">
                {{ yonghu.newuser_pkg[0] }}
              </a-card>
            </div>
          </a-col>
          <a-col class="gutter-row" :span="8">
            <div class="gutter-box">
              <a-card title="马甲包活跃人数">
                {{ yonghu.user_active[0] }}
              </a-card>
            </div>
          </a-col>
        </a-row>
        <br/>
        <a-row :gutter="16">
          <a-col class="gutter-row" :span="span" v-for="(line,index) in yonghu.success_rate" :key="index">
            <div class="gutter-box">
              <a-card :title="`${line[0]}：${line[1]}（提交数 / 成功率）`">{{ line[2] }} / {{ line[3] * 100 }} %</a-card>
            </div>
          </a-col>
        </a-row>
      </a-spin>
    </a-card>
  </div>
</template>

<script>
export default {
  props: ["data"],
  data() {
    return {
      span: 0,
      spinning: true,
      yonghu: {
        income: 0,
        impression: 0,
        click: 0,
        ctr: 0,
        cpm: 0,
        order: 0
      }
    }
  },
  watch: {
    data: {
      immediate: true,
      handler: function () {
        this.spinning = true
        this.$http.get('/apis/dashboard/yonghu/', {
          params: {
            task_id: this.data.task_id
          }
        }).then(res => res.data).then(data => {
          console.log(2222222222, data)
          this.yonghu = {...data}
          this.span = 24 / data.success_rate.length
          this.spinning = false
        })
      }
    },
  },
}
</script>

<style scoped>

</style>