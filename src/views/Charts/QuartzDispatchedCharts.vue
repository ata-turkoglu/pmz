<template>
    <div class="container">
        <div class="selections">
            <h3 class="mb-5">SEVK</h3>
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
            <span style="display: flex; margin-top: 15px; font-weight: 600"
                >Ürün Seç:</span
            >
            <v-select
                ref="productSelection"
                class="datepicker"
                variant="outlined"
                density="compact"
                :items="products"
                v-model="selectedProduct"
            >
                <template v-slot:prepend-item>
                    <v-list-item @click="selectAllProducts">
                        Hepsi
                    </v-list-item>
                </template>
            </v-select>
            <v-btn
                class="datepicker justify-self-start"
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
                            <span>Bigbag:</span>
                            <span class="ml-2">
                                {{ totalData.bigbag }} ton
                            </span>
                        </div>
                        <div>
                            <span>Silobas:</span>
                            <span class="ml-2">
                                {{ totalData.silobas }} ton
                            </span>
                        </div>
                        <div>
                            <span>Palet:</span>
                            <span class="ml-2">
                                {{ totalData.pallet }} ton
                            </span>
                        </div>
                        <div>
                            <span>Torba:</span>
                            <span class="ml-2"> {{ totalData.pp }} ton </span>
                        </div>
                        <div>
                            <span>Farklı Bigbag:</span>
                            <span class="ml-2">
                                {{ totalData.diffBigbag }} ton
                            </span>
                        </div>
                        <div>
                            <span><b>Toplam:</b></span>
                            <span class="ml-2">
                                <b>{{ totalData.total }} ton</b>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="charts">
            <QuartzProductionChart
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
import QuartzProductionChart from "../../components/charts/QuartzProductionChart.vue";
import { packagingWeights } from "../../utils/helpers/quartz";

export default {
    components: {
        VueDatePicker,
        QuartzProductionChart,
    },
    data() {
        return {
            productionChartState: false,
            production_xAxis: null,
            production_calculatedData: null,
            selectedDateRange: null,
            presetRanges: [],
            totalData: {
                bigbag: null,
                silobas: null,
                pallet: null,
                pp: null,
                diffBigbag: null,
                total: null,
            },
            selectedProduct: "Hepsi",
            products: [
                "TURBO FİLTRE",
                "Renkli filtre",
                "45 M",
                "63 M",
                "75 M",
                "150 M BIGBAG",
                "150 M (PALET)25kg",
                "150 M SİLOBAS",
                "0 - 200 M",
                "0 - 300 M",
                "100 - 300 M",
                "0 - 400 M",
                "100-500 M",
                "0 - 600 M",
                "300 - 700 M",
                "0 - 1000 M",
                "600 - 1000 M",
                "600 - 1200 M",
                "400 - 2500 M",
                "1200 - 2500 M",
                "1000 - 3000 M",
                "2500 - 4000 M",
                "3000 - 5000 M",
                "5000 - 8000 M",
                "25 - 60 MM",
            ],
        };
    },
    computed: {
        ...mapGetters({
            chartData: "quartzProduction/getDispatchedChartDataByDate",
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
                let found = this.chartData.find((itm) => itm.date == dateItem);
                let obj = {
                    date: dateItem,
                    bigbagValue: null,
                    diffBigbagValue: null,
                    palletValue: null,
                    ppValue: null,
                    silobasValue: null,
                };
                if (found) {
                    obj.bigbagValue =
                        found.bigbag != null
                            ? found.bigbag * packagingWeights.bigbag.toFixed(1)
                            : null;
                    obj.diffBigbagValue =
                        found.diffBigbag != null
                            ? found.diffBigbag *
                              packagingWeights.bigbag.toFixed(1)
                            : null;
                    obj.palletValue =
                        found.pallet != null
                            ? found.pallet * packagingWeights.pallet.toFixed(1)
                            : null;
                    obj.ppValue =
                        found.pp != null
                            ? found.pp * packagingWeights.pp.toFixed(1)
                            : null;
                    obj.silobasValue =
                        found.silobas != null
                            ? found.silobas *
                              packagingWeights.silobas.toFixed(1)
                            : null;
                    list.push(obj);
                } else {
                    list.push(obj);
                }
            });
            return list;
        },
        async calculateTotal(data) {
            return new Promise((resolve) => {
                let reducerObj = {
                    bigbag: [],
                    silobas: [],
                    pallet: [],
                    pp: [],
                    diffBigbag: [],
                };
                data.forEach((item) => {
                    reducerObj.bigbag.push(item.bigbagValue);
                    reducerObj.silobas.push(item.silobasValue);
                    reducerObj.pallet.push(item.palletValue);
                    reducerObj.pp.push(item.ppValue);
                    reducerObj.diffBigbag.push(item.diffBigbagValue);
                });

                resolve(reducerObj);
            })
                .then((list) => {
                    return {
                        bigbag: list.bigbag.reduce((a, b) => a + b, 0),
                        silobas: list.silobas.reduce((a, b) => a + b, 0),
                        pallet: list.pallet.reduce((a, b) => a + b, 0),
                        pp: list.pp.reduce((a, b) => a + b, 0),
                        diffBigbag: list.diffBigbag.reduce((a, b) => a + b, 0),
                    };
                })
                .then((list) => {
                    list.total = Object.values(list).reduce((a, b) => a + b, 0);
                    return list;
                });
        },
        getChart() {
            this.$store
                .dispatch(
                    "quartzProduction/getDispatchedChartDataByDateRange",
                    {
                        facility: 5,
                        startDate: moment(this.selectedDateRange[0]).format(
                            "YYYY-MM-DD"
                        ),
                        endDate: moment(this.selectedDateRange[1]).format(
                            "YYYY-MM-DD"
                        ),
                        product:
                            this.selectedProduct == "Hepsi"
                                ? null
                                : this.selectedProduct,
                    }
                )
                .then(() => {
                    this.setXAxis()
                        .then((list) => {
                            return this.setDataByDateRange(list);
                        })
                        .then((data) => {
                            this.production_calculatedData = data;
                            return this.calculateTotal(data);
                        })
                        .then((data) => {
                            this.totalData = data;
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
    width: 30%;
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
    .total-data {
        width: 100%;
    }
}
</style>
