<template>
  <div>
    <a-form-model layout="inline" :model="form" :label-col="{span: 5}" :wrapper-col="{span: 18}">
      <a-form-model-item label="时间范围">
        <a-range-picker v-model="form.date" @change="HandleChange"/>
      </a-form-model-item>
      <a-form-model-item label="类型">
        <a-select v-model="form.select" style="width: 120px">
          <a-select-option value="income">营收</a-select-option>
          <a-select-option value="order">预估支出</a-select-option>
          <a-select-option value="impression">曝光</a-select-option>
          <a-select-option value="click">点击</a-select-option>
          <a-select-option value="ctr">点击率</a-select-option>
          <a-select-option value="cpm">cpm</a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>
    <br/>
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
        select: "income",
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
          text: "时间段统计图",
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
      let data = []
      this.form.data.forEach(item => {
        data.push({x: item.date, y: item[this.form.select]})
      })
      this.series = [{name: this.form.select, data: data}]
      this.spinning = false
    },
    HandleChange() {
      this.spinning = true
      this.$http({
        url: '/apis/dashboard/Chuanshanjia/',
        method: 'get',
        type: 'json',
        params: {
          app_name: this.data.name,
          code_id: this.data.code_id,
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
        console.log('yewu2 data', newV, this.form.date)
        this.HandleChange()
      }
    },
    'form.select': {
      deep: true,
      handler: function (newV) {
        console.log('yewu2 form.select ', newV)
        this.spinning = true
        this.update_line()
      }
    },
  },
}
</script>

<style scoped>

</style>