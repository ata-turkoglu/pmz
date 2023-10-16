import axios from "@/plugins/axios";
import moment from "moment";
import store from "@/store";
import { packagingWeights } from "../../../utils/helpers/quartz";

const setBallConsumptionData = async (data) => {
    const {
        startDate,
        endDate,
        ballCharges,
        millsWorkingHours,
        producedByMills,
    } = data;
    let dateRange = [];
    let mill1Charges = [];
    let mill2Charges = [];
    return new Promise(async (resolve) => {
        await ballCharges.forEach((item) => {
            item.consumptionByHour =
                item.timer_diff != "0.0"
                    ? parseFloat(item.amount) / parseFloat(item.timer_diff)
                    : null;

            if (item.mill == 1) {
                mill1Charges.push(item);
            } else if (item.mill == 2) {
                mill2Charges.push(item);
            }
        });
        console.log("ballCharges", ballCharges);
        resolve();
    })
        .then(async () => {
            await millsWorkingHours.forEach((item) => {
                //
                const foundConsumption_Mill1 =
                    mill1Charges.find((itm) => item.workday <= itm.workday)
                        ?.consumptionByHour || null;
                //
                if (foundConsumption_Mill1 != null) {
                    item.dailyBallConsumption_mill1 =
                        foundConsumption_Mill1 * parseFloat(item.mill1_diff);
                } else {
                    item.dailyBallConsumption_mill1 =
                        mill1Charges[mill1Charges.length - 1]
                            .consumptionByHour * parseFloat(item.mill1_diff);
                }
                //
                const foundConsumption_Mill2 =
                    mill2Charges.find((itm) => item.workday <= itm.workday)
                        ?.consumptionByHour || null;
                //
                if (foundConsumption_Mill2 != null) {
                    item.dailyBallConsumption_mill2 =
                        foundConsumption_Mill2 * parseFloat(item.mill2_diff);
                } else {
                    item.dailyBallConsumption_mill2 =
                        mill2Charges[mill2Charges.length - 1]
                            .consumptionByHour * parseFloat(item.mill2_diff);
                }
                //
                item.totalDailyBallConsumption =
                    item.dailyBallConsumption_mill1 +
                    item.dailyBallConsumption_mill2;

                item.producedData = producedByMills.filter(
                    (itm) => itm.workday == item.workday
                );
            });
            console.log("millsWorkingHours", [...millsWorkingHours]);
            return millsWorkingHours;
        })
        .then((workingHours) => {
            workingHours.forEach(async (day) => {
                if (day.producedData.length > 0) {
                    await day.producedData.forEach((product) => {
                        product.totalAmount =
                            Number(product.bigbag_produced) *
                                packagingWeights.bigbag +
                            Number(product.diff_bigbag_produced) *
                                packagingWeights.bigbag +
                            Number(product.pallet_produced) *
                                packagingWeights.pallet +
                            Number(product.pp_produced) * packagingWeights.pp +
                            Number(product.silobas_produced) *
                                packagingWeights.silobas;
                    });
                    day.produced = [];
                    day.produced.push({
                        product_name: "45 M",
                        totalAmount: day.producedData.find(
                            (itm) => itm.product_name == "45 M"
                        ).totalAmount,
                    });
                    day.produced.push({
                        product_name: "63 M",
                        totalAmount: day.producedData.find(
                            (itm) => itm.product_name == "63 M"
                        ).totalAmount,
                    });
                    day.produced.push({
                        product_name: "75 M",
                        totalAmount: day.producedData.find(
                            (itm) => itm.product_name == "75 M"
                        ).totalAmount,
                    });
                    day.produced.push({
                        product_name: "150 M",
                        totalAmount: await day.producedData
                            .filter(
                                (itm) =>
                                    itm.product_name == "150 M BIGBAG" ||
                                    itm.product_name == "150 M SİLOBAS" ||
                                    itm.product_name == "150 M (PALET)25 kg"
                            )
                            .reduce((a, b) => {
                                return a + b.totalAmount;
                            }, 0),
                    });
                    day.totalProduced = await day.produced.reduce((a, b) => {
                        return a + b.totalAmount;
                    }, 0);
                    day.consumptionByProduced = (
                        day.totalDailyBallConsumption / day.totalProduced
                    ).toFixed(3);
                } else {
                    day.totalProduced = 0;
                    day.consumptionByProduced = 0;
                }
                day.workday = moment(day.workday).format("YYYY-MM-DD");
                delete day.producedData;
            });
            return workingHours;
        });
};

export default {
    namespaced: true,
    state: {
        productionChartDataByDate: null,
        dispatchedChartDataByDate: null,
        lastProductionData: [],
        ballConsumptionDataByDate: [],
    },
    getters: {
        getProductionChartDataByDate(state) {
            return state.productionChartDataByDate;
        },
        getDispatchedChartDataByDate(state) {
            return state.dispatchedChartDataByDate;
        },
        getBallConsumptionDataByDate(state) {
            return state.ballConsumptionDataByDate;
        },
    },
    mutations: {
        SET_PRODUCTION_CHART_DATA(state, { chartData, facility }) {
            let list = [];

            list = chartData.map((item) => {
                return {
                    date: moment(item.workday).format("YYYY-MM-DD"),
                    bigbag: item.bigbag != null ? Number(item.bigbag) : null,
                    diffBigbag:
                        item.diffBigbag != null
                            ? Number(item.diffBigbag)
                            : null,
                    pallet: item.pallet != null ? Number(item.pallet) : null,
                    pp: item.pp != null ? Number(item.pp) : null,
                    silobas: item.silobas != null ? Number(item.silobas) : null,
                };
            });
            state.productionChartDataByDate = list;
        },
        SET_DISPATCHED_CHART_DATA(state, { chartData, facility }) {
            let list = [];

            list = chartData.map((item) => {
                return {
                    date: moment(item.workday).format("YYYY-MM-DD"),
                    bigbag: item.bigbag != null ? Number(item.bigbag) : null,
                    diffBigbag:
                        item.diffBigbag != null
                            ? Number(item.diffBigbag)
                            : null,
                    pallet: item.pallet != null ? Number(item.pallet) : null,
                    pp: item.pp != null ? Number(item.pp) : null,
                    silobas: item.silobas != null ? Number(item.silobas) : null,
                };
            });
            state.dispatchedChartDataByDate = list;
        },
        SET_LAST_DATA(state, data) {
            new Promise(() => {
                state.lastProductionData = [...data];
            });
        },
        SET_BALL_CONSUMPTION(state, data) {
            state.ballConsumptionDataByDate = data;
        },
    },
    actions: {
        async getProductionChartDataByDateRange(
            { commit },
            { facility, startDate, endDate, product }
        ) {
            return axios
                .get("/chart-data/production", {
                    params: {
                        facility,
                        startDate,
                        endDate,
                        product,
                    },
                })
                .then(async (result) => {
                    await commit("SET_PRODUCTION_CHART_DATA", {
                        chartData: result.data,
                        facility,
                    });
                    return true;
                })
                .catch((error) => {
                    store.state.commonErrorText = error;
                    store.state.commonDialogs.errorDialog = true;
                    return false;
                });
        },
        async getDispatchedChartDataByDateRange(
            { commit },
            { facility, startDate, endDate, product }
        ) {
            return axios
                .get("/chart-data/dispatched", {
                    params: {
                        facility,
                        startDate,
                        endDate,
                        product,
                    },
                })
                .then(async (result) => {
                    await commit("SET_DISPATCHED_CHART_DATA", {
                        chartData: result.data,
                        facility,
                    });
                    return true;
                })
                .catch((error) => {
                    store.state.commonErrorText = error;
                    store.state.commonDialogs.errorDialog = true;
                    return false;
                });
        },
        getLastStocktakingData({ commit }) {
            return axios
                .get("/production/lastStocktakingData")
                .then(async (result) => {
                    if (result.status == 200) {
                        await commit("SET_LAST_DATA", result.data);
                        return true;
                    } else {
                        return false;
                    }
                });
        },
        checkStocktakingMails() {
            return axios.get("/utils/checkMails").then((result) => {
                if (result.status == 200) {
                    return true;
                } else {
                    return false;
                }
            });
        },
        getBallConsumptionByDateRange({ commit }, data) {
            return axios
                .get("/production/ballConsumption", {
                    params: data,
                })
                .then(async (result) => {
                    console.log(result);
                    if (result.status == 200) {
                        const newData = await setBallConsumptionData({
                            ...data,
                            ...result.data,
                        });
                        commit("SET_BALL_CONSUMPTION", newData);
                        return true;
                    } else {
                        return false;
                    }
                });
        },
    },
};
