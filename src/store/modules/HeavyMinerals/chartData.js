import axios from "axios";
import store from "@/store";

export default {
    namespaced: true,
    state: {
        chartData: {
            heavyMineralsConsumption: null,
            heavyMineralsLastTotal: null,
            heavyMineralsPreviousTotalForEdit: null,
        },
    },
    getters: {
        getHeavyMineralsConsumptionData: (state) => {
            return state.chartData.heavyMineralsConsumption;
        },
        getLastTotalData: (state) => {
            return state.chartData.heavyMineralsLastTotal;
        },
    },
    mutations: {
        setChartData: (state, data) => {
            switch (data.facility) {
                case 2:
                    state.chartData.heavyMineralsConsumption = data.chartData;
                    break;

                default:
                    break;
            }
        },
        setLastTotal: (state, data) => {
            switch (data.facility) {
                case 2:
                    state.chartData.heavyMineralsLastTotal = data.chartData;
                    break;

                default:
                    break;
            }
        },
        setPreviousTotalForEdit: (state, data) => {
            switch (data.facility) {
                case 2:
                    state.chartData.heavyMineralsPreviousTotalForEdit =
                        data.chartData;
                    break;

                default:
                    break;
            }
        },
    },
    actions: {
        async getDailyChartDataByDateRange(
            { commit },
            { facility, startDate, endDate }
        ) {
            return axios
                .get("/chart-data/daily", {
                    params: {
                        facility,
                        startDate,
                        endDate,
                    },
                })
                .then(async (result) => {
                    await commit("setChartData", {
                        chartData: result.data,
                        facility,
                    });
                    return true;
                })
                .catch((error) => {
                    store.state.commonErrorText = error;
                    store.state.commonDialogs = true;
                    return false;
                });
        },
        async getLastTotalData({ commit }, { facility }) {
            return axios
                .get("/chart-data/get-last-total", {
                    params: {
                        facility,
                    },
                })
                .then(async (result) => {
                    await commit("setLastTotal", {
                        chartData: result.data[0],
                        facility,
                    });
                    return true;
                })
                .catch((error) => {
                    store.state.commonErrorText = error;
                    store.state.commonDialogs = true;
                    return false;
                });
        },
        async getPreviousTotalDataForEdit({ commit }, { facility }) {
            return axios
                .get("/chart-data/get-previous-total-for-edit", {
                    params: {
                        facility,
                    },
                })
                .then(async (result) => {
                    await commit("setPreviousTotalForEdit", {
                        chartData: result.data[0],
                        facility,
                    });
                    return true;
                })
                .catch((error) => {
                    store.state.commonErrorText = error;
                    store.state.commonDialogs = true;
                    return false;
                });
        },
    },
};
