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
            <div class="average-data mt-5 pa-3">
                <div
                    class="avarage-section mr-16"
                    :class="$vuetify.display.smAndDown ? 'mb-5' : ''"
                >
                    <span><b>Genel Ortalamalar</b></span>
                    <div>
                        <span>İndirgeme:</span>
                        <span class="ml-2"
                            >{{
                                totalAvarages.reducer
                            }}
                            sm<sup>3</sup>/saat</span
                        >
                    </div>
                    <div>
                        <span>Kurutma:</span>
                        <span class="ml-2"
                            >{{ totalAvarages.dryer }} sm<sup>3</sup>/saat</span
                        >
                    </div>
                </div>
                <div class="avarage-section">
                    <span><b>Seçilen tarihlerde ortalamalar</b></span>
                    <div>
                        <span>İndirgeme:</span>
                        <span class="ml-2" v-if="selectedAvarages.reducer"
                            >{{
                                selectedAvarages.reducer
                            }}
                            sm<sup>3</sup>/saat</span
                        >
                    </div>
                    <div>
                        <span>Kurutma:</span>
                        <span class="ml-2" v-if="selectedAvarages.dryer"
                            >{{
                                selectedAvarages.dryer
                            }}
                            sm<sup>3</sup>/saat</span
                        >
                    </div>
                </div>
            </div>
        </div>
        <div class="charts">
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
        dryerConsumption: 46.2,
        consumption_calculatedData: null,
        consumption_xAxis: null,
        selectedDateRange: null,
        presetRanges: [],
        totalAvarages: {},
        selectedAvarages: {},
    }),
    computed: {
        ...mapGetters({
            chartData: "chartData/getHeavyMineralsConsumptionData",
            lastTotal: "chartData/getLastTotalData",
        }),
    },
    methods: {
        selectDate() {
            this.$refs.vDatePicker.selectDate();
        },
        vdpInputFormat(date) {
            return `${moment(date[0]).format("L")} - ${moment(date[1]).format(
                "L"
            )}`;
        },
        setPresentRanges() {
            this.presetRanges = [
                {
                    label: " 7_Gün ",
                    range: [
                        moment().subtract(7, "days").format(),
                        moment().format(),
                    ],
                },
                {
                    label: " Son_1_Ay ",
                    range: [
                        moment().subtract(1, "months").format(),
                        moment().format(),
                    ],
                },
                {
                    label: " Bu_Ay ",
                    range: [
                        moment().startOf("month").format(),
                        moment().format(),
                    ],
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
        setDataByDateRange(dateList) {
            let list = [];
            dateList.forEach((dateItem) => {
                let found = this.chartData.find((itm) => itm.date == dateItem);
                let obj = {
                    date: dateItem,
                    dryer: {
                        workingTime: null,
                        totalConsumption: null,
                        hourlyAvarageConsumption: null,
                    },
                    reducer: {
                        workingTime: null,
                        totalConsumption: null,
                        hourlyAvarageConsumption: null,
                    },
                };
                if (found) {
                    if (found.reducerWorkingTime != 0) {
                        obj.dryer.workingTime = +found.dryerWorkingTime;
                        obj.dryer.totalConsumption =
                            found.dryerWorkingTime * this.dryerConsumption;
                        obj.dryer.hourlyAvarageConsumption =
                            +(
                                (found.dryerWorkingTime *
                                    this.dryerConsumption) /
                                found.dryerWorkingTime
                            ).toFixed(2) || null;

                        obj.reducer.workingTime = +found.reducerWorkingTime;
                        obj.reducer.totalConsumption =
                            found.cngConsumption -
                            found.dryerWorkingTime * this.dryerConsumption;
                        obj.reducer.hourlyAvarageConsumption =
                            +(
                                (found.cngConsumption -
                                    found.dryerWorkingTime *
                                        this.dryerConsumption) /
                                found.reducerWorkingTime
                            ).toFixed(2) || null;
                    } else {
                        obj.reducer.workingTime = 0;
                        obj.reducer.totalConsumption = 0;
                        obj.reducer.hourlyAvarageConsumption = 0;

                        obj.dryer.workingTime = +found.dryerWorkingTime;
                        obj.dryer.totalConsumption = found.cngConsumption;
                        obj.dryer.hourlyAvarageConsumption =
                            +(
                                found.cngConsumption / found.dryerWorkingTime
                            ).toFixed(2) || null;
                    }
                    list.push(obj);
                } else {
                    list.push(obj);
                }
            });
            return list;
        },
        setXAxis() {
            return new Promise((resolve) => {
                this.consumptionChartState = false;
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
                    this.consumption_xAxis = range.map((itm) =>
                        itm.format("DD/MM")
                    );
                }

                resolve(range.map((itm) => itm.format("YYYY-MM-DD")));
            });
        },
        setAvarages() {
            this.$store
                .dispatch("chartData/getLastTotalData", { facility: 2 })
                .then(() => {
                    let dryerPartOfCng =
                        this.lastTotal.dryerTotal * this.dryerConsumption;
                    let reducerPartOfCng =
                        this.lastTotal.cngTotal - dryerPartOfCng;

                    this.totalAvarages.dryer = (
                        dryerPartOfCng / this.lastTotal.dryerTotal
                    ).toFixed(2);

                    this.totalAvarages.reducer = (
                        reducerPartOfCng / this.lastTotal.reducerTotal
                    ).toFixed(2);
                });
        },
        calculateAvarage(list) {
            return (list.reduce((a, b) => a + b, 0) / list.length).toFixed(2);
        },
    },
    created() {
        this.setPresentRanges();
        this.setAvarages();
    },
    watch: {
        selectedDateRange: {
            handler(val) {
                if (val != [] || val.length <= 0) {
                    this.$store
                        .dispatch("chartData/getDailyChartDataByDateRange", {
                            facility: 2,
                            startDate: moment(val[0]).format("YYYY-MM-DD"),
                            endDate: moment(val[1]).format("YYYY-MM-DD"),
                        })
                        .then(() => {
                            this.setXAxis()
                                .then((list) => {
                                    this.consumption_calculatedData =
                                        this.setDataByDateRange(list);
                                })
                                .then(() => {
                                    this.selectedAvarages.dryer =
                                        this.calculateAvarage(
                                            this.consumption_calculatedData
                                                .map(
                                                    (item) =>
                                                        item.dryer
                                                            .hourlyAvarageConsumption ||
                                                        0
                                                )
                                                .filter((itm) => itm != 0)
                                        );
                                    this.selectedAvarages.reducer =
                                        this.calculateAvarage(
                                            this.consumption_calculatedData
                                                .map(
                                                    (item) =>
                                                        item.reducer
                                                            .hourlyAvarageConsumption ||
                                                        0
                                                )
                                                .filter((itm) => itm != 0)
                                        );
                                    this.consumptionChartState = true;
                                });
                        });
                }
            },
        },
    },
};
</script>

<style scoped>
.container {
    width: 100%;
    min-height: 90vh;
    margin-top: 10px;
    padding: 10px;
}
.selections {
    padding-block: 20px;
    padding-inline: 10px;
}
.charts {
    width: 100%;
    height: 100%;
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
    border: 1px solid rgb(215, 215, 215);
    border-radius: 4px;
    width: fit-content;
}
.avarage-section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}
@media screen and (max-width: 600px) {
    .container {
        margin-inline: 0;
        padding-inline: 0;
        min-height: 90vh;
        padding: 10px;
    }
    .selections {
        padding: 0;
        margin-bottom: 20px;
    }
    .datepicker {
        width: 100%;
    }
    .average-data {
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
    }
    .charts {
        width: 100%;
        height: 100%;
        padding: 0;
    }
}
</style>
