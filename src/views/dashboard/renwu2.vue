<template>
  <div>
    <a-form-model :model="form" :label-col="{span: 1}" :wrapper-col="{span: 18}">
      <a-form-model-item label="时间范围">
        <a-range-picker v-model="form.date" @change="HandleChange"/>
      </a-form-model-item>
    </a-form-model>
    <a-spin :spinning="spinning">
      <apexchart type="line" height="350" :options="chartOptions" :series="series"></apexchart>
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
        date: [],
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
          text: "任务跑量统计图",
          align: 'left',
          style: {
            fontSize: "16px",
            color: '#666'
          }
        },
        chart: {
          height: 350,
          type: 'line',
          zoom: {
            enabled: false
          },

        },
        stroke: {
          width: 7,
          curve: 'smooth'
        },
        xaxis: {
          type: 'datetime',
        },
        tooltip: {
          x: {
            format: 'dd/MM/yyyy'
          },
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
        markers: {
          size: 4,
          colors: ["#FFA41B"],
          strokeColors: "#fff",
          strokeWidth: 2,
          hover: {
            size: 7,
          }
        },
      },
    }
  },
  methods: {
    update_line() {
      let data = {}
      this.form.data.forEach(item => {
        if (!data[item.action_id]) {
          data[item.action_id] = []
        }
        data[item.action_id].push({x: item.date, y: item.complete})
      })
      this.series = []
      for (let key in data) {
        console.log(key, data[key])
        this.series.push({name: key, data: data[key]})
      }
      this.spinning = false
    },
    HandleChange() {
      this.spinning = true
      this.$http({
        url: '/apis/dashboard/LogTaskNewSystemRemain/',
        method: 'get',
        type: 'json',
        params: {
          task_id: this.data.task_id,
          stdate: this.form.date[0] ? this.form.date[0].format('yyyy-MM-DD') : "",
          until: this.form.date[1] ? this.form.date[1].format('yyyy-MM-DD') : "",
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
        console.log('renwu2 data', newV, this.form.date)
        this.HandleChange()
      }
    },
  },
}
</script>

<style scoped>

</style>