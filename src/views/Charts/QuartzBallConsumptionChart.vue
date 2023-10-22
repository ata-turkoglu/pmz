<template>
    <div class="container">
        <div class="selections">
            <h3 class="mb-5">BİLYA TÜKETİMİ</h3>
            <span style="display: flex; font-weight: 600">Tarih Seç:</span>
            <VueDatePicker
                ref="vDatePickerQ"
                class="datepicker"
                v-model="selectedDateRange"
                range
                :preset-ranges="presetRanges"
                :enable-time-picker="false"
                position="left"
                :format="vdpInputFormat"
            >
                <template #action-select>
                    <p class="vdp-select" @click="selectDate">Seç</p>
                </template>
            </VueDatePicker>
            <v-btn
                class="datepicker justify-self-start mt-5"
                @click="getChart()"
                :disabled="getChartButtonDisabled"
                >Grafik</v-btn
            >
            <div>
                <div v-if="productionChartState" class="total-data mt-5 pa-3">
                    <div
                        class="total-section mr-16"
                        :class="$vuetify.display.smAndDown ? 'mb-5' : ''"
                    >
                        <div>
                            <span>Toplam Üretim:</span>
                            <span class="ml-2">
                                {{ totalData.produced.toFixed(2) }} ton
                            </span>
                        </div>
                        <hr style="width: 100%" class="my-2" />
                        <div>
                            <span>Değirmen 1 Toplam Tüketim:</span>
                            <span class="ml-2">
                                {{ totalData.consumed_mill1.toFixed(2) }} kg
                            </span>
                        </div>
                        <hr style="width: 100%" class="my-2" />
                        <div>
                            <span>Değirmen 2 Toplam Tüketim:</span>
                            <span class="ml-2">
                                {{ totalData.consumed_mill2.toFixed(2) }} kg
                            </span>
                        </div>
                        <hr style="width: 100%" class="my-2" />
                        <div>
                            <span>Toplam Tüketim:</span>
                            <span class="ml-2">
                                {{ totalData.consumed.toFixed(2) }} kg
                            </span>
                        </div>
                        <hr style="width: 100%" class="my-2" />
                        <div>
                            <span>Ton Başına Ortalama Tüketim:</span>
                            <span class="ml-2">
                                {{
                                    totalData.avarageConsumptionByProduced.toFixed(
                                        2
                                    )
                                }}
                                kg/ton
                            </span>
                        </div>
                        <hr style="width: 100%" class="my-2" />
                        <div>
                            <span>Bilye Fiyatı:</span>
                            <span class="ml-2">
                                {{ this.totalData.ballPriceForeign }} $
                            </span>
                        </div>
                        <hr style="width: 100%" class="my-2" />
                        <div>
                            <span><b>Ton Başına Maliyet:</b></span>
                            <span class="ml-2">
                                <b
                                    >{{
                                        totalData.costByProduced.toFixed(2)
                                    }}
                                    $/ton</b
                                >
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="charts">
            <QuartzBallConsumptionByProduce
                v-if="productionChartState"
                :xAxis="production_xAxis"
                :chartData="production_calculatedData"
            />
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import moment from "moment";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import QuartzBallConsumptionByProduce from "../../components/charts/QuartzBallConsumptionByProduce.vue";
import { packagingWeights } from "../../utils/helpers/quartz";

export default {
    components: {
        VueDatePicker,
        QuartzBallConsumptionByProduce,
    },
    data() {
        return {
            productionChartState: false,
            production_xAxis: null,
            production_calculatedData: null,
            selectedDateRange: null,
            presetRanges: [],
            totalData: {
                produced: null,
                consumed: null,
                consumed_mill1: null,
                consumed_mill2: null,
                avarageConsumptionByProduced: null,
                ballPrice: null,
                ballPriceForeign: null,
                costByProduced: null,
            },
        };
    },
    computed: {
        ...mapGetters({
            chartData: "quartzProduction/getBallConsumptionDataByDate",
        }),
        getChartButtonDisabled() {
            return (
                this.selectedDateRange == null ||
                this.selectedDateRange == [] ||
                this.selectedDateRange.length <= 0
            );
        },
    },
    methods: {
        selectAllProducts() {
            this.selectedProduct = "Hepsi";
            this.$refs.productSelection.menu = false;
        },
        selectDate() {
            this.$refs.vDatePickerQ.selectDate();
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
        setXAxis() {
            return new Promise((resolve) => {
                this.productionChartState = false;
                //let startDate = moment(this.selectedDateRange[0]).subtract(1, "days");
                let startDate = moment(this.selectedDateRange[0]);
                let endDate = moment(this.selectedDateRange[1]);

                let range = this.getRange(startDate, endDate, "days");

                if (range.length <= 7 && false) {
                    //set week days
                    this.production_xAxis = range.map((itm) =>
                        moment.weekdays(true, itm.weekday()).substring(0, 2)
                    );
                } else if (range.length <= 31 && range.length > 7 && false) {
                    this.production_xAxis = range.map((itm) => itm.date());
                } else {
                    this.production_xAxis = range.map((itm) =>
                        itm.format("DD/MM")
                    );
                }

                resolve(range.map((itm) => itm.format("YYYY-MM-DD")));
            });
        },
        setDataByDateRange(dateList) {
            let list = [];
            dateList.forEach((dateItem) => {
                let found = this.chartData.find(
                    (itm) => itm.workday == dateItem
                );
                let obj = {
                    workday: dateItem,
                    consumptionByProduced: null,
                    dailyBallConsumption_mill1: null,
                    dailyBallConsumption_mill2: null,
                    mill1_diff: null,
                    mill2_diff: null,
                    totalDailyBallConsumption: null,
                    totalProduced: null,
                    produced: [
                        { product_name: "TURBO FİLTRE", totalAmount: null },
                        { product_name: "45 M", totalAmount: null },
                        { product_name: "63 M", totalAmount: null },
                        { product_name: "75 M", totalAmount: null },
                        { product_name: "150 M", totalAmount: null },
                    ],
                };
                if (found) {
                    list.push({ ...found });
                } else {
                    list.push(obj);
                }
            });
            return list;
        },
        async calculateTotal() {
            let totalProducedByDateRange = 0;
            let totalWorkHourByDateRange = 0;
            let totalConsumptionByDateRange_mill1 = 0;
            let totalConsumptionByDateRange_mill2 = 0;
            let totalConsumptionByDateRange = 0;
            await this.chartData.forEach((item) => {
                totalProducedByDateRange += item.totalProduced;
                totalWorkHourByDateRange +=
                    parseFloat(item.mill1_diff) + parseFloat(item.mill2_diff);
                totalConsumptionByDateRange += parseFloat(
                    item.totalDailyBallConsumption
                );
                totalConsumptionByDateRange_mill1 +=
                    item.dailyBallConsumption_mill1;
                totalConsumptionByDateRange_mill2 +=
                    item.dailyBallConsumption_mill2;
            });

            this.totalData.produced = totalProducedByDateRange;
            this.totalData.consumed_mill1 = totalConsumptionByDateRange_mill1;
            this.totalData.consumed_mill2 = totalConsumptionByDateRange_mill2;
            this.totalData.consumed = totalConsumptionByDateRange;
            this.totalData.avarageConsumptionByProduced =
                totalConsumptionByDateRange / totalProducedByDateRange;
            this.totalData.ballPrice = parseFloat(
                this.$store.state.quartzProduction.purchasedBallMills[0]
                    .unit_price
            );
            this.totalData.ballPriceForeign =
                this.$store.state.quartzProduction.purchasedBallMills[0].foreign_unit_price;
            this.totalData.costByProduced =
                this.totalData.avarageConsumptionByProduced *
                this.totalData.ballPriceForeign;
        },
        getChart() {
            this.$store
                .dispatch("quartzProduction/getBallConsumptionByDateRange", {
                    startDate: moment(this.selectedDateRange[0]).format(
                        "YYYY-MM-DD"
                    ),
                    endDate: moment(this.selectedDateRange[1]).format(
                        "YYYY-MM-DD"
                    ),
                })
                .then(() => {
                    this.setXAxis()
                        .then((list) => {
                            return this.setDataByDateRange(list);
                        })
                        .then((data) => {
                            this.production_calculatedData = data;
                            return this.calculateTotal();
                        })
                        .then((data) => {
                            //this.totalData = data;
                            this.productionChartState = true;
                        });
                });
        },
    },
};
</script>

<style scoped>
.container {
    width: 100%;
    min-height: 90vh;
    padding-bottom: 50px;
}
.selections {
    padding-block: 20px;
    padding-inline: 10px;
    display: flex;
    flex-direction: column;
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
.total-data {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border: 1px solid rgb(215, 215, 215);
    border-radius: 4px;
    width: fit-content;
}
.total-section {
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
