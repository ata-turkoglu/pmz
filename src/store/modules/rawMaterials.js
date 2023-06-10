import axios from "axios";
import moment from "moment";

axios.defaults.baseURL = process.env.VUE_APP_BACKEND;

export default {
    namespaced: true,
    state: {
        coalData: [],
        buttons: {
            coalAddButtonState: false,
        },
    },
    getters: {
        getCoalData(state) {
            return state.coalData.sort(
                (a, b) => moment(a.acceptance_date) - moment(b.acceptance_date)
            );
        },
    },
    mutations: {
        SET_COAL_DATA: (state, data) => {
            state.coalData = [];
            data.forEach((item) => {
                let obj = {
                    id: item.id,
                    companyName: item.company_name,
                    dateTime: item.acceptance_date,
                    amount: item.amount,
                    totalPrice: item.total_price,
                    unitPrice: item.unit_price,
                };
                state.coalData.push(obj);
            });
        },

        ADD_COAL_DATA: (state, data) => {
            console.log(data);
            state.coalData.unshift(data);
        },

        UPDATE_COAL_DATA: (state, data) => {
            let found = state.coalData.find((itm) => itm.id == data.id);
            found.companyName = data.companyName;
            found.dateTime = data.dateTime;
            found.amount = data.amount;
            found.totalPrice = data.totalPrice;
            found.unitPrice = data.unitPrice;
        },

        DELETE_COAL_DATA: (state, id) => {
            let index = state.coalData.findIndex((itm) => itm.id == id);
            state.coalData.splice(index, 1);
        },
    },
    actions: {
        async getCoalData({ commit }) {
            return axios.get("/rawMaterials/getCoalData").then((result) => {
                commit("SET_COAL_DATA", result.data);
            });
        },
        async addNewCoalEntry({ commit }, data) {
            return axios
                .post("/rawMaterials/addCoalEntry", data)
                .then(async (result) => {
                    let id = result.data[0].id;
                    if (id) {
                        data.id = id;
                        await commit("ADD_COAL_DATA", data);
                        return true;
                    } else {
                        console.log(result);
                        return false;
                    }
                });
        },
        async updateCoalEntry({ commit }, data) {
            return axios
                .patch("/rawMaterials/updateCoalEntry", data)
                .then(async (result) => {
                    if (result.data == "OK") {
                        await commit("UPDATE_COAL_DATA", data);
                        return true;
                    } else {
                        console.log(result);
                        return false;
                    }
                });
        },
        async deleteCoalEntry({ commit }, id) {
            return axios
                .delete("/rawMaterials/deleteCoalEntry", { data: { id } })
                .then(async (result) => {
                    if (result.data == "OK") {
                        await commit("DELETE_COAL_DATA", id);
                        return true;
                    }
                });
        },
    },
};
