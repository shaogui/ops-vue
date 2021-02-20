<template>
  <div>
    <a-card title="昨日数据">
      <a-row :gutter="24">
        <a-spin :spinning="spinning">
          <a-col class="gutter-row" :span="span" v-for="(line,index) in renwu" :key="index">
            <div class="gutter-box">
              <a-card :title="`${line.action_id}（完成量 / 总量）`">{{ line.complete }} / {{ line.repeated }}</a-card>
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
      span: 0,
      spinning: true,
      renwu: []
    }
  },
  watch: {
    data: {
      immediate: true,
      handler: function () {
        this.spinning = true
        this.$http.get(`/apis/dashboard/LogTaskNewSystemRemain/${this.data.task_id}/`,).then(res => {
          this.renwu = res.data
          this.span = 24 / res.data.length
          this.spinning = false
        })
      }
    },
  },
}
</script>

<style scoped>

</style>