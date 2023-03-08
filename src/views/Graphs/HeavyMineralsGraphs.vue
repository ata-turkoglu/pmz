<template>
  <div class="container">
    <div class="selections">
      <VueDatePicker
        ref="vDatePicker"
        class="datepicker"
        v-model="selectedDateRange"
        range
        :preset-ranges="presetRanges"
        :enable-time-picker="false"
        position="left"
        :format="vdpInputFormat"
        placeholder="Tarih Seç"
      >
        <template #action-select>
          <p class="vdp-select" @click="selectDate">Seç</p>
        </template>
      </VueDatePicker>
      <div class="average-data">
        <div>
          <span>Genel Ortalama</span>
        </div>
        <div>
          <span>Seçilen tarihlerde ortalama</span>
        </div>
      </div>
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
      chartData: "chartData/getHeavyMineralsConsumptionData",
    }),
  },
  methods: {
    selectDate() {
      this.$refs.vDatePicker.selectDate();
    },
    vdpInputFormat(date) {
      return `${moment(date[0]).format("L")} - ${moment(date[1]).format("L")}`;
    },
    setPresentRanges() {
      this.presetRanges = [
        {
          label: " 7_Gün ",
          range: [moment().subtract(7, "days").format(), moment().format()],
        },
        {
          label: " Son_1_Ay ",
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
      for (let i = 0; i <= diff; i++) {
        range.push(moment(startDate).add(i, type));
      }
      return range;
    },
    setDataByDateRange() {
      return this.chartData.map((item) => {
        return {
          date: item.date,
          dryer: {
            workingTime: item.dryerWorkingTime,
            totalConsumption: item.dryerWorkingTime * this.dryerConsumption,
            hourlyAvarageConsumption:
              +(
                (item.dryerWorkingTime * this.dryerConsumption) /
                item.dryerWorkingTime
              ).toFixed(2) || 0,
          },
          reducer: {
            workingTime: item.reducerWorkingTime,
            totalConsumption:
              item.cngConsumption -
              item.dryerWorkingTime * this.dryerConsumption,
            hourlyAvarageConsumption:
              +(
                (item.cngConsumption -
                  item.dryerWorkingTime * this.dryerConsumption) /
                item.reducerWorkingTime
              ).toFixed(2) || 0,
          },
        };
      });
    },
    setXAxis() {
      this.consumptionChartState = false;
      setTimeout(() => {
        //let startDate = moment(this.selectedDateRange[0]).subtract(1, "days");
        let startDate = moment(this.selectedDateRange[0]);
        let endDate = moment(this.selectedDateRange[1]);

        let range = this.getRange(startDate, endDate, "days");

        if (range.length <= 7 && false) {
          //set week days
          this.consumption_xAxis = range.map((itm) =>
            moment.weekdays(true, itm.weekday()).substring(0, 2)
          );
        } else if (range.length <= 31 && range.length > 7) {
          this.consumption_xAxis = range.map((itm) => itm.date());
        } else {
          this.consumption_xAxis = range.map((itm) => itm.format("DD/MM"));
        }

        this.consumptionChartState = true;
      }, 100);
    },
  },
  created() {
    this.setPresentRanges();
  },
  watch: {
    selectedDateRange: {
      handler(val) {
        this.$store
          .dispatch("chartData/getDailyChartDataByDateRange", {
            facility: 2,
            startDate: moment(val[0]).format("YYYY-MM-DD"),
            endDate: moment(val[1]).format("YYYY-MM-DD"),
          })
          .then(() => {
            this.setXAxis();
            this.consumption_calculatedData = this.setDataByDateRange();
          });
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
  width: 30%;
}
.vdp-select {
  color: #1565c0;
  cursor: pointer;
  font-weight: 600;
}
.average-data {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
@media screen and (max-width: 600px) {
  .container {
    margin-inline: 0;
    padding-inline: 0;
    min-height: 90vh;
  }
  .datepicker {
    width: 100%;
  }
}
</style>
