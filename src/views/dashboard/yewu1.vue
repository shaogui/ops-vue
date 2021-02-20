<template>
  <div>
    <a-card title="昨日数据">
      <a-row :gutter="24">
        <a-spin :spinning="spinning">
          <a-col class="gutter-row" :span="4">
            <div class="gutter-box">
              <a-card title="营收（元）">{{ yewu.income }}</a-card>
            </div>
          </a-col>
          <a-col class="gutter-row" :span="4">
            <div class="gutter-box">
              <a-spin :spinning="spinning2">
                <a-card title="预估支出（元）">{{ yewu.coins }}</a-card>
              </a-spin>
            </div>
          </a-col>
          <a-col class="gutter-row" :span="4">
            <div class="gutter-box">
              <a-card title="曝光（次）">{{ yewu.impression }}</a-card>
            </div>
          </a-col>
          <a-col class="gutter-row" :span="4">
            <div class="gutter-box">
              <a-card title="点击（次）">{{ yewu.click }}</a-card>
            </div>
          </a-col>
          <a-col class="gutter-row" :span="4">
            <div class="gutter-box">
              <a-card title="点击率（%）">{{ yewu.ctr }}</a-card>
            </div>
          </a-col>
          <a-col class="gutter-row" :span="4">
            <div class="gutter-box">
              <a-card title="cpm">{{ yewu.cpm }}</a-card>
            </div>
          </a-col>
        </a-spin>
      </a-row>
    </a-card>
  </div>
</template>

<script>
export default {
  props: ["data"],
  data() {
    return {
      spinning: true,
      spinning2: true,
      yewu: {
        income: 0,
        impression: 0,
        click: 0,
        ctr: 0,
        cpm: 0,
        coins: 0
      }
    }
  },
  watch: {
    data: {
      immediate: true,
      handler: function () {
        this.spinning = true
        this.spinning2 = true
        this.$http.get(`/apis/dashboard/Chuanshanjia/?today=true&app_name=${this.data.name}&code_id=${this.data.code_id}`,).then(res => {
          this.yewu = {...this.yewu, ...res.data[0]}
          this.spinning = false
        })
        this.$http.get(`/apis/dashboard/VideoAdConsume/${this.data.name}/`,).then(res => {
          this.yewu = {...this.yewu, ...res.data[0]}
          this.spinning2 = false
        })
        console.log(this.yewu)
      }
    },
  },
}
</script>

<style scoped>

</style>