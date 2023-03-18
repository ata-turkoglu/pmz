<template>
  <div class="chart-container">
    <span class="title">Günlük Toplam Tüketim</span>
    <div id="chart"></div>
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
          "İndirgeme Tüketim",
          "İndirgeme ÇS",
          "Kurutma Tüketim",
          "Kurutma ÇS",
        ],
      },
      xAxis: {
        data: [],
        type: "category",
        name: "Gün",
        axisTick: {
          alignWithLabel: true,
        },
        nameLocation: "center",
        nameTextStyle: {
          align: "center",
          verticalAlign: "top",
          lineHeight: 35,
          fontWeight: "bold",
        },
      },
      yAxis: [
        {
          type: "value",
          name: "CNG sm3",
          position: "left",
          axisLine: {
            show: true,
          },
          nameTextStyle: {
            align: "left",
            fontWeight: "bold",
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
            fontWeight: "bold",
          },
        },
      ],
      series: [
        {
          name: "İndirgeme Tüketim",
          data: [],
          type: "line",
          smooth: true,
          yAxisIndex: 0,
          color: "#4E342E",
          symbolSize: 10,
        },
        {
          name: "Kurutma Tüketim",
          data: [],
          type: "line",
          smooth: true,
          yAxisIndex: 0,
          color: "#FF8F00",
          symbolSize: 10,
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

      this.chartOption.series.find(
        (itm) => itm.name == "Kurutma Tüketim"
      ).data = this.chartData.map((itm) => itm.dryer.totalConsumption);
      this.chartOption.series.find((itm) => itm.name == "Kurutma ÇS").data =
        this.chartData.map((itm) => itm.dryer.workingTime);

      this.chartOption.series.find(
        (itm) => itm.name == "İndirgeme Tüketim"
      ).data = this.chartData.map((itm) => itm.reducer.totalConsumption);
      this.chartOption.series.find((itm) => itm.name == "İndirgeme ÇS").data =
        this.chartData.map((itm) => itm.reducer.workingTime);
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
#chart {
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
    padding-top: 20px;
    border-bottom: 1px solid rgb(220, 220, 220);
  }
  #chart {
    width: 100%;
    height: 300px;
  }
}
</style>
