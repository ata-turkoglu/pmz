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
                    dateTime: moment(item.acceptance_date).format("LLL"),
                    amount: item.amount,
                    totalPrice: item.total_price,
                    unitPrice: item.unit_price,
                };
                state.coalData.push(obj);
            });
        },
        ADD_COAL_DATA: (state, data) => {
            console.log("ADD_COAL_DATA", data);
            state.coalData.unshift(data);
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
                .then((result) => {
                    let id = result.data[0].id;
                    if (id) {
                        data.id = id;
                        commit("ADD_COAL_DATA", data);
                    } else {
                        console.log(result);
                    }
                });
        },
        async deleteCoalEntry({ commit }, id) {
            return axios
                .delete("/rawMaterials/deleteCoalEntry", { data: { id } })
                .then((result) => {
                    if (result.data == "OK") {
                        commit("DELETE_COAL_DATA", id);
                    }
                });
        },
    },
};
