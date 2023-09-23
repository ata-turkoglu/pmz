import axios from "@/plugins/axios";
import store from "../../index";

export default {
    namespaced: true,
    state: {
        reducerFeedingData: [],
    },
    getters: {},
    mutations: {
        SET_REDUCER_FEEDING_DATA(state, data) {
            state.reducerFeedingData = data;
        },
        ADD_REDUCER_FEEDING_DATA(state, data) {
            state.reducerFeedingData.push(data);
        },
        DELETE_REDUCER_FEEDING_DATA(state, id) {
            let index = state.reducerFeedingData.findIndex(
                (itm) => itm.id == id
            );
            state.reducerFeedingData.splice(index, 1);
        },
    },
    actions: {
        async getReducerFeedingData({ commit }) {
            return axios
                .get("/process/getReducerFeedingData")
                .then((result) => {
                    commit("SET_REDUCER_FEEDING_DATA", result.data);
                })
                .catch((error) => {
                    store.state.commonErrorText = error;
                    store.state.commonDialogs = true;
                    return false;
                });
        },

        async addReducerFeedingData({ commit }, data) {
            return axios
                .post("/process/addReducerFeeding", data)
                .then(async (result) => {
                    let id = result.data[0].id;
                    if (id) {
                        data.id = id;
                        await commit("ADD_REDUCER_FEEDING_DATA", data);
                        return true;
                    } else {
                        console.log(result);
                        return false;
                    }
                })
                .catch((error) => {
                    store.state.commonErrorText = error;
                    store.state.commonDialogs = true;
                    return false;
                });
        },

        async deleteReducerFeedingData({ commit }, id) {
            return axios
                .delete("/process/deleteReducerFeedingData", { data: { id } })
                .then(async (result) => {
                    if (result.data == "OK") {
                        await commit("DELETE_REDUCER_FEEDING_DATA", id);
                        return true;
                    }
                })
                .catch((error) => {
                    store.state.commonErrorText = error;
                    store.state.commonDialogs = true;
                    return false;
                });
        },
    },
};
