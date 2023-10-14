import axios from "@/plugins/axios";
import moment from "moment";
import store from "@/store";

export default {
    namespaced: true,
    state: {
        productionChartDataByDate: null,
        dispatchedChartDataByDate: null,
        lastProductionData: [],
    },
    getters: {
        getProductionChartDataByDate(state) {
            return state.productionChartDataByDate;
        },
        getDispatchedChartDataByDate(state) {
            return state.dispatchedChartDataByDate;
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
    },
};
