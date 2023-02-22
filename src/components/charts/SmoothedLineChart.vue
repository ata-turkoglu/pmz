<template>
  <div id="echart" ref="echart" class="echarts"></div>
</template>

<script>
import * as echarts from "echarts";
import moment from "moment";

export default {
  data: () => ({
    smoothChart: null,
    option: {
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross" },
      },
      legend: {
        data: [{ name: "Reducer" }, { name: "Dryer" }],
      },
      /* emphasis: {
        focus: "series",
      }, */
      xAxis: {
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        type: "category",
        name: "Weekdays",
      },
      yAxis: {
        type: "value",
        name: "CNG",
        axisLabel: {
          formatter: "{value} sm3",
        },
      },
      series: [
        {
          name: "Reducer",
          data: [384, 300, 220, 250, 280, 400, 350],
          type: "line",
          smooth: true,
        },
        {
          name: "Dryer",
          data: [880, 1, 950, 700, 1, 1550, 1150],
          type: "line",
          smooth: true,
        },
      ],
    },
  }),
  mounted() {
    let chartDiv = this.$refs.echart;
    this.smoothChart = echarts.init(chartDiv);
    this.smoothChart.showLoading();
    setTimeout(() => {
      this.smoothChart.hideLoading();
      this.smoothChart.setOption(this.option);
    }, 1000);
    window.onresize = () => {
      this.smoothChart.resize();
    };
  },
};
</script>

<style scoped>
.echarts {
  width: 50%;
  height: 400px;
  box-shadow: 0 0 15px -5px grey;
  border-radius: 20px;
  padding-inline: 5px;
  padding-top: 20px;
  padding-bottom: 0;
}
@media screen and (max-width: 600px) {
  .echarts {
    width: 100%;
    height: 300px;
  }
}
</style>
