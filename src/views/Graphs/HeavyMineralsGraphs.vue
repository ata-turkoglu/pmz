<template>
  <div class="container">
    <HeavyMineralsConsumptionChart
      v-if="consumptionChartState"
      :xAxis="consumption_xAxis"
      :chartData="consumption_calculatedData"
      style="margin-bottom: 20px"
    />
    <HeavyMineralsAvarageConsumptionChart
      v-if="consumptionChartState"
      :xAxis="consumption_xAxis"
      :chartData="consumption_calculatedData"
    />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import moment from "moment";
import HeavyMineralsConsumptionChart from "../../components/charts/HeavyMineralsConsumptionChart.vue";
import HeavyMineralsAvarageConsumptionChart from "../../components/charts/HeavyMineralsAvarageConsumptionChart.vue";
export default {
  components: {
    HeavyMineralsConsumptionChart,
    HeavyMineralsAvarageConsumptionChart,
  },
  data: () => ({
    consumptionChartState: false,
    dryerConsumption: 48,
    consumption_calculatedData: null,
    consumption_xAxis: null,
  }),
  computed: {
    ...mapGetters({
      formList: "getHeavyMineralsForms",
    }),
  },
  methods: {
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
    setDataByDateRange(startDate, endDate) {
      //activity list day by day between selected dates
      let list = this.formList
        .filter(
          (item) =>
            moment(item.date) > startDate &&
            moment(item.date) < endDate &&
            item.shift == 3
        )
        .reverse();

      //calculation of day data
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
    setLastWeekData() {
      //start date
      let startDate = moment().subtract(13, "days").format();

      // date range
      let range = this.getRange(
        startDate,
        moment().subtract(6, "days").format(),
        "days"
      );

      //set week days
      this.consumption_xAxis = range
        .slice(1)
        .map((itm) => moment.weekdays(true, itm.weekday()).substring(0, 2));

      //calculate data
      this.consumption_calculatedData = this.setDataByDateRange(
        range[0],
        range[range.length - 1]
      );
      this.consumptionChartState = true;
    },
  },
  created() {
    if (
      this.$store.state.activityForms == [] ||
      this.$store.state.activityForms.length <= 0
    ) {
      this.$store.dispatch("getFacilityActivityForms", 2).then(() => {
        this.setLastWeekData();
      });
    } else [this.setLastWeekData()];
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  margin-top: 10px;
  padding: 10px;
}
@media screen and (max-width: 600px) {
  .container {
    margin-inline: 0;
    padding-inline: 5px;
  }
}
</style>
