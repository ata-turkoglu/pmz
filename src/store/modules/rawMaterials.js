import axios from "axios";

axios.defaults.baseURL = process.env.VUE_APP_BACKEND;

export default {
    namespaced: true,
    state: {
        coalData: [],
        buttons: {
            addButtonState: false,
        },
    },
    getters: {
        getCoalData(state) {
            return state.coalData;
        },
    },
    mutations: {
        SET_COAL_DATA: (state, data) => {
            console.log(data)
            state.coalData = data;
        },
    },
    actions: {
        async addNewCoalEntry({ commit }, data) {
            return axios
                .post("/rawMaterials/addCoalEntry", data)
                .then((result) => {});
        },
        async getCoalData({ commit }, data) {
            return axios.get("/rawMaterials/getCoalData").then((result) => {
                commit("SET_COAL_DATA", result.data);
            });
        },
    },
};
