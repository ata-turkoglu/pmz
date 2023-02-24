<template>
  <div id="chart" :style="$vuetify.display.smAndDown"></div>
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
        data: ["Reducer Total", "Reducer WH", "Dryer Total", "Dryer WH"],
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
          name: "CNG sm3",
          position: "left",
          alignTicks: true,
          axisLine: {
            show: true,
          },
          nameTextStyle: {
            align: "left",
          },
        },
        {
          type: "value",
          name: "Çalışma Saati",
          position: "right",
          axisLine: {
            show: true,
          },
          nameTextStyle: {
            align: "right",
          },
        },
      ],
      series: [
        {
          name: "Reducer Total",
          data: [],
          type: "line",
          smooth: true,
          yAxisIndex: 0,
          color: "#4E342E",
        },
        {
          name: "Dryer Total",
          data: [],
          type: "line",
          smooth: true,
          yAxisIndex: 0,
          color: "#FF8F00",
        },
        {
          name: "Dryer WH",
          data: [],
          type: "bar",
          yAxisIndex: 1,
          color: "#FFECB3",
        },
        {
          name: "Reducer WH",
          data: [],
          type: "bar",
          yAxisIndex: 1,
          color: "#D7CCC8",
        },
      ],
    },
  }),
  methods: {
    setIncomingData() {
      this.chartOption.xAxis.data = this.xAxis;

      this.chartOption.series.find((itm) => itm.name == "Dryer Total").data =
        this.chartData.map((itm) => itm.dryerTotalConsumption);
      this.chartOption.series.find((itm) => itm.name == "Dryer WH").data =
        this.chartData.map((itm) => itm.dryerWorkingTime);

      this.chartOption.series.find((itm) => itm.name == "Reducer Total").data =
        this.chartData.map((itm) => itm.reducerTotalConsumption);
      this.chartOption.series.find((itm) => itm.name == "Reducer WH").data =
        this.chartData.map((itm) => itm.reducerWorkingTime);
    },
    setChart() {
      var chartDom = document.getElementById("chart");
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
#chart {
  width: 100%;
  height: 400px;
  box-shadow: 0 0 15px -5px grey;
  border-radius: 20px;
  padding-inline: 5px;
  padding-top: 20px;
  padding-bottom: 0;
}
@media screen and (max-width: 600px) {
  #chart {
    width: 100%;
    height: 300px;
  }
}
</style>
