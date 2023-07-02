import axios from "axios";

axios.defaults.baseURL = process.env.VUE_APP_BACKEND;

export default {
    namespaced: true,
    state: {
        buttons: {
            analysis80MeshSaveButtonLoading: false,
        },
    },
    getters: {},
    mutations: {},
    actions: {
        async save3060Mesh({ commit }, data) {
            console.log(data);
            return axios
                .post("/analysis/save3060Mesh", data)
                .then(async (result) => {
                    console.log(result);
                });
        },
        async save80Mesh({ commit }, data) {
            console.log(data);
            return axios
                .post("/analysis/save80Mesh", data)
                .then(async (result) => {
                    console.log(result);
                });
        },
        async save180Mesh({ commit }, data) {
            console.log(data);
            return axios
                .post("/analysis/save180Mesh", data)
                .then(async (result) => {
                    console.log(result);
                });
        },
    },
};
