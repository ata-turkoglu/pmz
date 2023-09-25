import axios from "@/plugins/axios";
import moment from "moment";
import store from "../../index";

export default {
    namespaced: true,
    state: {
        lastWorkingHoursDate: null,
    },
    getters: {},
    mutations: {
        SET_LAST_DATE(state, data) {
            state.lastWorkingHoursDate = data.workday;
        },
        CHANGE_LAST_DATE(state, data) {
            state.lastWorkingHoursDate = moment(
                data.date,
                "YYYY-MM-DD"
            ).format();
        },
    },
    actions: {
        addWorkingHours({ commit }, data) {
            return axios
                .post("/activity-forms/quartz/working-hours", data)
                .then((result) => {
                    if (result.status == 200) {
                        commit("CHANGE_LAST_DATE", data);
                        store.state.commonDialogs.successDialog = true;
                        return true;
                    } else {
                        store.state.commonErrorText = result.statusText;
                        store.state.commonDialogs.errorDialog = true;
                        return false;
                    }
                })
                .catch((error) => {
                    store.state.commonErrorText = error;
                    store.state.commonDialogs.errorDialog = true;
                    return false;
                });
        },
        getLastWorkingHoursData({ commit }) {
            return axios
                .get("/activity-forms/quartz/last-working-hours")
                .then((result) => {
                    if (result.status == 200) {
                        commit("SET_LAST_DATE", result.data[0]);
                        return true;
                    } else {
                        return false;
                    }
                })
                .catch((error) => {
                    /* store.state.commonErrorText = error;
                    store.state.commonDialogs.errorDialog = true; */
                    return false;
                });
        },
    },
};
