import axios from "axios";
import moment from "moment";

export default {
    namespaced: true,
    state: {
        productionChartDataByDate: null,
    },
    getters: {
        getProductionChartDataByDate(state) {
            return state.productionChartDataByDate;
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
                };
            });
            state.productionChartDataByDate = list;
        },
    },
    actions: {
        async getProductionChartDataByDateRange(
            { commit },
            { facility, startDate, endDate }
        ) {
            return axios
                .get("/chart-data/production", {
                    params: {
                        facility,
                        startDate,
                        endDate,
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
                    store.state.commonDialogs = true;
                    return false;
                });
        },
    },
};
