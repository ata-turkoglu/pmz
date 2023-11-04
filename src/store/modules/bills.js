import axios from "@/plugins/axios";

export default {
    namespaced: true,
    state: {},
    getters: {},
    mutations: {},
    actions: {
        async addElectricityBillData({ commit }, data) {
            let newData = { ...data };
            delete newData.date;
            return axios
                .post("/bills/addElectricityBillData", newData)
                .then(async (result) => {
                    if (result.status == 200) {
                        return true;
                    } else {
                        return false;
                    }
                });
        },
        async getLastElectricityData({ commit }) {
            return axios
                .get("/bills/getLastElectricityData")
                .then(async (result) => {
                    if (result.status == 200) {
                        return { state: true, data: result.data[0] };
                    } else {
                        return false;
                    }
                });
        },
        async addFuelBillData({ commit }, data) {
            let newData = { ...data };
            delete newData.date;
            return axios
                .post("/bills/addFuelBillData", newData)
                .then(async (result) => {
                    if (result.status == 200) {
                        return true;
                    } else {
                        return false;
                    }
                });
        },
        async getFuelDataByDateRange({ commit }, { startDate, endDate }) {
            return axios
                .get("/bills/fuelDataByDateRange", {
                    params: {
                        startDate,
                        endDate,
                    },
                })
                .then(async (result) => {
                    if (result.status == 200) {
                        return { state: true, data: result.data[0] };
                    } else {
                        return false;
                    }
                });
        },
    },
};
