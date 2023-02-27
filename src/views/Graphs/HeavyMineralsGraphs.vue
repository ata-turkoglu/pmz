<template>
  <div class="container">
    <div class="selections">
      <VueDatePicker
        class="datepicker"
        v-model="selectedDateRange"
        range
        :preset-ranges="presetRanges"
        :enable-time-picker="false"
      />
    </div>
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
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import HeavyMineralsConsumptionChart from "../../components/charts/HeavyMineralsConsumptionChart.vue";
import HeavyMineralsAvarageConsumptionChart from "../../components/charts/HeavyMineralsAvarageConsumptionChart.vue";
export default {
  components: {
    VueDatePicker,
    HeavyMineralsConsumptionChart,
    HeavyMineralsAvarageConsumptionChart,
  },
  data: () => ({
    consumptionChartState: false,
    dryerConsumption: 48,
    consumption_calculatedData: null,
    consumption_xAxis: null,
    selectedDateRange: null,
    presetRanges: [],
    conut: 0,
  }),
  computed: {
    ...mapGetters({
      formList: "getHeavyMineralsForms",
    }),
  },
  methods: {
    setPresentRanges() {
      this.presetRanges = [
        {
          label: " 7_Gün ",
          range: [moment().subtract(7, "days").format(), moment().format()],
        },
        {
          label: " 1_Ay ",
          range: [moment().subtract(1, "months").format(), moment().format()],
        },
        {
          label: " Bu_Ay ",
          range: [moment().startOf("month").format(), moment().format()],
        },
      ];
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
    setDataByDateRange(range) {
      //activity list day by day between selected dates
      let list = this.formList
        .filter(
          (item) =>
            moment(item.date) > range[0] &&
            moment(item.date) < range[range.length - 1] &&
            item.shift == 3
        )
        .reverse();

      let calculatedList = list.map((el, index) => {
        return {
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
      });

      let rangeData = [];

      range
        .map((itm) => itm.format("L").split(".").reverse().join("-"))
        .forEach((el) => {
          let foundDay = calculatedList.find((itm) => itm.date == el);
          if (foundDay) {
            rangeData.push({
              date: foundDay.date,
              dryer: {
                workingTime: foundDay.dryerWorkingTime,
                totalConsumption:
                  foundDay.dryerWorkingTime * this.dryerConsumption,
                hourlyAvarageConsumption:
                  +(
                    (foundDay.dryerWorkingTime * this.dryerConsumption) /
                    foundDay.dryerWorkingTime
                  ).toFixed(2) || 0,
              },
              reducer: {
                workingTime: foundDay.reducerWorkingTime,
                totalConsumption:
                  foundDay.cng -
                  foundDay.dryerWorkingTime * this.dryerConsumption,
                hourlyAvarageConsumption:
                  +(
                    (foundDay.cng -
                      foundDay.dryerWorkingTime * this.dryerConsumption) /
                    foundDay.reducerWorkingTime
                  ).toFixed(2) || 0,
              },
            });
          } else {
            rangeData.push({
              date: el.date,
              dryer: {
                workingTime: 0,
                totalConsumption: 0,
                hourlyAvarageConsumption: 0,
              },
              reducer: {
                workingTime: 0,
                totalConsumption: 0,
                hourlyAvarageConsumption: 0,
              },
            });
          }
        });

      //calculation of day data
      /*       let calculatedList = list.map((el, index) => {
        let obj = {
          cngTimer: el.cngTimer,
          cng: list[index - 1] ? el.cngTimer - list[index - 1].cngTimer : null,
          date: el.date,
          dryerKilnTimer: el.dryerKilnTimer,
          dryerWorkingTime: list[index - 1]
            ? el.dryerKilnTimer - list[index - 1].dryerKilnTimer
            : null,
          reducerKilnTimer: el.reducerKilnTimer,
          reducerWorkingTime: list[index - 1]
            ? el.reducerKilnTimer - list[index - 1].reducerKilnTimer
            : null,
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
      }); */
      //return calculatedList.slice(1);

      return rangeData;
    },
    setXAxis() {
      this.consumptionChartState = false;
      setTimeout(() => {
        let startDate = moment(this.selectedDateRange[0]);
        let endDate = moment(this.selectedDateRange[1]);
        let diff = endDate.diff(startDate, "days");

        let range = this.getRange(startDate, endDate, "days");

        if (diff <= 7) {
          //set week days
          this.consumption_xAxis = range.map((itm) =>
            moment.weekdays(true, itm.weekday()).substring(0, 2)
          );
        } else if (diff <= 31 && diff > 7) {
          this.consumption_xAxis = range.map((itm) => itm.date());
        } else {
          this.consumption_xAxis = range.map((itm) => itm.format("DD/MM"));
        }

        //calculate data
        this.consumption_calculatedData = this.setDataByDateRange(range);
        this.consumptionChartState = true;
      }, 100);
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
        this.setPresentRanges();
      });
    } else {
      this.setPresentRanges();
    }
  },
  watch: {
    selectedDateRange: {
      handler() {
        this.setXAxis();
      },
    },
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  min-height: 50vh;
  margin-top: 10px;
  padding: 10px;
}
.selections {
  padding-block: 20px;
  padding-inline: 10px;
}
.datepicker {
  width: 20%;
}
@media screen and (max-width: 600px) {
  .container {
    margin-inline: 0;
    padding-inline: 5px;
  }
  .datepicker {
    width: 50%;
  }
}
</style>
