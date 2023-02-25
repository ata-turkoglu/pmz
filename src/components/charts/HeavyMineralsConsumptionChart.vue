<template>
  <div class="chart-container">
    <span class="title">Günlük Toplam Tüketim</span>
    <div id="chart" :style="$vuetify.display.smAndDown"></div>
  </div>
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
        bottom: "2%",
      },
      legend: {
        type: "scroll",
        data: [
          "İndirgeme Toplam",
          "İndirgeme ÇS",
          "Kurutma Toplam",
          "Kurutma ÇS",
        ],
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
          name: "İndirgeme Toplam",
          data: [],
          type: "line",
          smooth: true,
          yAxisIndex: 0,
          color: "#4E342E",
        },
        {
          name: "Kurutma Toplam",
          data: [],
          type: "line",
          smooth: true,
          yAxisIndex: 0,
          color: "#FF8F00",
        },
        {
          name: "Kurutma ÇS",
          data: [],
          type: "bar",
          yAxisIndex: 1,
          color: "#FFECB3",
        },
        {
          name: "İndirgeme ÇS",
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

      this.chartOption.series.find((itm) => itm.name == "Kurutma Toplam").data =
        this.chartData.map((itm) => itm.dryerTotalConsumption);
      this.chartOption.series.find((itm) => itm.name == "Kurutma ÇS").data =
        this.chartData.map((itm) => itm.dryerWorkingTime);

      this.chartOption.series.find(
        (itm) => itm.name == "İndirgeme Toplam"
      ).data = this.chartData.map((itm) => itm.reducerTotalConsumption);
      this.chartOption.series.find((itm) => itm.name == "İndirgeme ÇS").data =
        this.chartData.map((itm) => itm.reducerWorkingTime);
    },
    setChart() {
      let chartDom = document.getElementById("chart");
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
    setTimeout(() => {
      this.setChart();
    }, 300);
  },
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: fit-content;
  box-shadow: 0 0 15px -5px grey;
  border-radius: 20px;
  padding-top: 20px;
}
.title {
  display: flex;
  align-self: flex-start;
  padding-left: 5%;
  font-size: 1.2rem;
  font-weight: 600;
}
#chart {
  width: 100%;
  height: 400px;
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
