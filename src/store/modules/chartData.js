import axios from "axios";

axios.defaults.baseURL = process.env.VUE_APP_BACKEND;

export default {
  namespaced: true,
  state: {
    chartData: {
      heavyMineralsConsumption: null,
    },
  },
  getters: {
    getHeavyMineralsConsumptionData: (state) => {
      return state.chartData.heavyMineralsConsumption;
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
          console.log("result", result);
          await commit("setChartData", {
            chartData: result.data,
            facility,
          });
          return true;
        });
    },
  },
};