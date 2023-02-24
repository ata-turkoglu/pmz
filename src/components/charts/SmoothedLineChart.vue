<template>
  <div id="echart" ref="echart" class="echarts"></div>
</template>

<script>
import * as echarts from "echarts";
import moment from "moment";
import { mapGetters } from "vuex";

export default {
  data: () => ({
    smoothChart: null,
    chartLoaded: false,
    dryerConsumption: 48,
    option: {
      tooltip: {
        trigger: "item",
        axisPointer: {
          type: "line",
        },
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {},
        },
      },
      legend: {
        data: [
          { name: "Reducer" },
          { name: "Dryer" },
          { name: "ReducerHour" },
          { name: "DryerHour" },
        ],
      },
      /* emphasis: {
        focus: "series",
      }, */
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
          name: "CNG",
          position: "left",
          alignTicks: true,
          axisLine: {
            show: true,
          },
          axisLabel: {
            formatter: "{value} sm3",
          },
        },
        {
          type: "value",
          name: "Çalışma Saati",
          position: "right",
          axisLine: {
            show: true,
          },
          axisLabel: {
            formatter: "{value} saat",
          },
        },
      ],
      series: [
        {
          name: "Reducer",
          data: [],
          type: "line",
          smooth: true,
          yAxisIndex: 0,
          color: "#4E342E",
        },
        {
          name: "Dryer",
          data: [],
          type: "line",
          smooth: true,
          yAxisIndex: 0,
          color: "#FF8F00",
        },
        {
          name: "DryerHour",
          data: [],
          type: "bar",
          yAxisIndex: 1,
          color: "#FFECB3",
        },
        {
          name: "ReducerHour",
          data: [],
          type: "bar",
          yAxisIndex: 1,
          color: "#D7CCC8",
        },
      ],
    },
  }),
  computed: {
    ...mapGetters({
      formList: "getHeavyMineralsForms",
    }),
  },
  methods: {
    setChart() {
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
    getRange(startDate, endDate, type) {
      let fromDate = moment(startDate);
      let toDate = moment(endDate);
      let diff = toDate.diff(fromDate, type);
      let range = [];
      for (let i = 0; i < diff; i++) {
        range.push(moment(startDate).add(i, type));
      }
      return range;
    },
    setLastweek() {
      let startDate = moment().subtract(12, "days").format();
      // date range
      let range = this.getRange(
        startDate,
        moment().subtract(4, "days").format(),
        "days"
      );
      let days = range
        .slice(1)
        .map((itm) => moment.weekdays(true, itm.weekday()).substring(0, 2));
      let calculatedData = this.setDataByDateRange(
        range[0],
        range[range.length - 1]
      );
      console.log("calculatedData", calculatedData);

      this.option.xAxis.data = days;

      this.option.series.find((itm) => itm.name == "Dryer").data =
        calculatedData.map((itm) => itm.dryerTotalConsumption);
      this.option.series.find((itm) => itm.name == "DryerHour").data =
        calculatedData.map((itm) => itm.dryerWorkingTime);

      this.option.series.find((itm) => itm.name == "Reducer").data =
        calculatedData.map((itm) => itm.reducerTotalConsumption);
      this.option.series.find((itm) => itm.name == "ReducerHour").data =
        calculatedData.map((itm) => itm.reducerWorkingTime);
    },
    setDataByDateRange(startDate, endDate) {
      let list = this.formList
        .filter(
          (item) =>
            moment(item.date) > startDate &&
            moment(item.date) < endDate &&
            item.shift == 3
        )
        .reverse();

      let calculatedList = list.map((el, index) => {
        let obj = {
          cngTimer: el.cngTimer,
          cng: list[index - 1] ? el.cngTimer - list[index - 1].cngTimer : 0,
          date: el.date,
          dryerKilnTimer: el.dryerKilnTimer,
          dryerWorkingTime: list[index - 1]
            ? el.dryerKilnTimer - list[index - 1].dryerKilnTimer
            : 0,
          reducerKilnTimer: el.reducerKilnTimer,
          reducerWorkingTime: list[index - 1]
            ? el.reducerKilnTimer - list[index - 1].reducerKilnTimer
            : 0,
        };
        return {
          date: obj.date,
          dryerWorkingTime: obj.dryerWorkingTime,
          dryerTotalConsumption: obj.dryerWorkingTime * this.dryerConsumption,
          dryerHourlyAvarageConsumption: +(
            (obj.dryerWorkingTime * this.dryerConsumption) /
            obj.dryerWorkingTime
          ).toFixed(2),
          reducerWorkingTime: obj.reducerWorkingTime,
          reducerTotalConsumption:
            obj.cng - obj.dryerWorkingTime * this.dryerConsumption,
          reducerHourlyAvarageConsumption: +(
            (obj.cng - obj.dryerWorkingTime * this.dryerConsumption) /
            obj.reducerWorkingTime
          ).toFixed(2),
        };
      });

      return calculatedList.slice(1);
    },
  },
  created() {
    if (
      this.$store.state.activityForms == [] ||
      this.$store.state.activityForms.length <= 0
    ) {
      this.$store.dispatch("getFacilityActivityForms", 2).then(() => {
        this.setLastweek();
        this.setChart();
      });
    }
  },
  mounted() {
    this.setLastweek();
    this.setChart();
  },
};
</script>

<style scoped>
.echarts {
  width: 100%;
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
