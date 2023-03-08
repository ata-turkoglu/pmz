<template>
  <div class="chart-container">
    <span class="title">Günlük Ortalama Tüketim</span>
    <div id="chart2"></div>
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
        z: 1,
        data: ["İndirgeme Ortalama", "Kurutma Ortalama"],
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
          name: "İndirgeme Ortalama",
          data: [],
          type: "line",
          smooth: true,
          color: "#4E342E",
          symbolSize: 20,
        },
        {
          name: "Kurutma Ortalama",
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

      this.chartOption.series.find(
        (itm) => itm.name == "Kurutma Ortalama"
      ).data = this.chartData.map((itm) => itm.dryer.hourlyAvarageConsumption);

      this.chartOption.series.find(
        (itm) => itm.name == "İndirgeme Ortalama"
      ).data = this.chartData.map(
        (itm) => itm.reducer.hourlyAvarageConsumption
      );
    },
    setChart() {
      let chartDom = document.getElementById("chart2");
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
  border-radius: 4px;
  padding-top: 20px;
  border: 1px solid rgb(220, 220, 220);
}
.title {
  display: flex;
  align-self: flex-start;
  padding-left: 5%;
  font-size: 1.2rem;
  font-weight: 600;
}
#chart2 {
  width: 100%;
  height: 400px;
  padding-inline: 5px;
  padding-top: 20px;
  padding-bottom: 0;
}
@media screen and (max-width: 600px) {
  .chart-container {
    width: 100%;
    height: fit-content;
    box-shadow: unset;
    border-radius: 0;
    border-bottom: 1px solid rgb(220, 220, 220);
  }
  #chart2 {
    width: 100%;
    height: 300px;
  }
}
</style>
