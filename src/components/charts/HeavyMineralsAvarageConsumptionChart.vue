<template>
  <div id="chart2"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  props: ["xAxis", "chartData"],
  data: () => ({
    chartOption: {
      tooltip: {
        trigger: "item",
        axisPointer: {
          type: "cross",
        },
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      legend: {
        data: ["Reducer Avarage", "Dryer Avarage"],
      },
      xAxis: {
        data: [],
        type: "category",
        name: "",
        axisTick: {
          alignWithLabel: true,
        },
      },
      yAxis: [
        {
          type: "value",
          name: "Ortalama m3/s",
          position: "left",
          axisLine: {
            show: true,
          },
          nameTextStyle: {
            align: "left",
          },
        },
      ],
      series: [
        {
          name: "Reducer Avarage",
          data: [],
          type: "line",
          smooth: true,
          color: "#4E342E",
          symbolSize: 20,
        },
        {
          name: "Dryer Avarage",
          data: [],
          type: "line",
          smooth: true,
          color: "#FF8F00",
          symbolSize: 20,
        },
      ],
    },
  }),
  methods: {
    setIncomingData() {
      this.chartOption.xAxis.data = this.xAxis;

      this.chartOption.series.find((itm) => itm.name == "Dryer Avarage").data =
        this.chartData.map((itm) => itm.dryerHourlyAvarageConsumption);

      this.chartOption.series.find(
        (itm) => itm.name == "Reducer Avarage"
      ).data = this.chartData.map((itm) => itm.reducerHourlyAvarageConsumption);
    },
    setChart() {
      var chartDom = document.getElementById("chart2");
      let myChart = echarts.init(chartDom);

      myChart.showLoading();
      setTimeout(() => {
        myChart.hideLoading();
        myChart.setOption(this.chartOption);
      }, 1000);
      window.onresize = () => {
        myChart.resize();
      };
    },
  },
  created() {
    this.setIncomingData();
  },
  mounted() {
    this.setChart();
  },
};
</script>

<style scoped>
#chart2 {
  width: 100%;
  height: 400px;
  box-shadow: 0 0 15px -5px grey;
  border-radius: 20px;
  padding-inline: 5px;
  padding-top: 20px;
  padding-bottom: 0;
}
@media screen and (max-width: 600px) {
  #chart2 {
    width: 100%;
    height: 300px;
  }
}
</style>
