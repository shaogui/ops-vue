<template>
  <div>
    <a-form-model :model="form" :label-col="{span: 1}" :wrapper-col="{span: 18}">
      <a-form-model-item label="时间范围">
        <a-date-picker v-model="form.date" @change="HandleChange"/>
      </a-form-model-item>
    </a-form-model>
    <a-spin :spinning="spinning">
      <apexchart type="area" height="350" :options="chartOptions" :series="series"></apexchart>
    </a-spin>
  </div>
</template>

<script>
export default {
  props: ["data"],
  data() {
    return {
      spinning: true,
      form: {
        date: "",
        data: [],
        x: [],
        y: [],
      },
      series: [
        {
          name: "",
          data: []
        }
      ],
      chartOptions: {
        title: {
          text: "点广告回调累积图",
          align: 'left',
          style: {
            fontSize: "16px",
            color: '#666'
          }
        },
        chart: {
          height: 350,
          type: 'line',
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight'
        },
        xaxis: {
          tickAmount: 20,
        },
        legend: {
          show: false
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            gradientToColors: ['#FDD835'],
            shadeIntensity: 1,
            type: 'horizontal',
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100, 100, 100]
          },
        },
      },
    }
  },
  methods: {
    update_line() {
      let data = this.form.data
      this.series = []
      this.series.push({name: this.chartOptions.title.text, data: data})
      this.spinning = false
    },
    HandleChange() {
      this.spinning = true
      this.$http({
        url: '/apis/dashboard/dianji/',
        method: 'get',
        type: 'json',
        params: {
          app_id: this.data.app_id,
          log_date: this.form.date ? this.form.date.format('yyyy-MM-DD') : "",
        },
      }).then(res => {
        this.form.data = res.data
        this.update_line()
      })
    },
  },
  watch: {
    'data': {
      deep: true,
      handler: function (newV) {
        console.log('renwu3 data', newV, this.form.date)
        this.HandleChange()
      }
    },
  },
}
</script>

<style scoped>

</style>