import { createStore } from "vuex";
import axios from "axios";
import moment from "moment";
import users from "./modules/users";
import chartData from "./modules/chartData";
import rawMaterials from "./modules/rawMaterials";
import analysis from "./modules/analysis";
moment.locale("tr");
axios.defaults.baseURL = process.env.VUE_APP_BACKEND;

export default createStore({
    state: {
        activityForms: [],
        facilities: [
            {
                id: 1,
                name: "Agrega",
                disabled: true,
            },
            {
                id: 2,
                name: "Ağır Mineraller",
                disabled: false,
            },
            {
                id: 3,
                name: "Altın",
                disabled: true,
            },
            {
                id: 4,
                name: "Kum",
                disabled: true,
            },
            {
                id: 5,
                name: "Kuvars Kırma",
                disabled: true,
            },
            {
                id: 6,
                name: "Kuvars Öğütme",
                disabled: true,
            },
            {
                id: 7,
                name: "Taş Kırma",
                disabled: true,
            },
        ],
        shifts: [
            {
                id: 1,
                name: "Gece 00:00-08:00",
            },
            {
                id: 2,
                name: "Gündüz 08:00-16:00",
            },
            {
                id: 3,
                name: "Akşam 16:00-24:00",
            },
        ],
        buttons: {
            activityFormSaveButtonLoading: false,
        },
        commonDialogs: {
            routePermissionDialog: false,
            loginErrorDialog: false,
            successDialog: false,
            errorDialog: false,
        },
        commonErrorText: null,
    },
    getters: {
        getFacilities: (state) => {
            return state.facilities.filter((itm) => {
                return !itm.disabled;
            });
        },
        getHeavyMineralsForms: (state) => {
            return state.activityForms
                .filter((itm) => itm.facility == 2)
                .sort((a, b) => b.shift - a.shift)
                .sort((a, b) => new Date(b.date) - new Date(a.date));
        },
    },
    mutations: {
        setFacilities(state, data) {
            state.facilities = data;
        },
        setActivityForms(state, data) {
            data.forEach((item) => {
                item.date = moment(item.date)
                    .format("L")
                    .split(".")
                    .reverse()
                    .join("-");
            });
            state.activityForms.push(...data);
        },
        addNewActivityForm(state, data) {
            state.activityForms.push(data);
            state.buttons.activityFormSaveButtonLoading = false;
        },
        updateActivityForm(state, data) {
            let date, shift;

            let foundItem = state.activityForms.find(
                (itm) => itm.id == data.id
            );

            foundItem.shift == 1
                ? (date = moment(data.date)
                      .subtract(1, "days")
                      .format("YYYY-MM-DD"))
                : (date = foundItem.date);
            foundItem.shift == 1 ? (shift = 3) : (shift = foundItem.shift - 1);

            let previousItem = state.activityForms.find(
                (itm) => itm.date == date && itm.shift == shift
            );

            foundItem.facility = data.facility;
            foundItem.shift = data.shift;
            foundItem.dryerKilnTimer = data.dryerKilnTimer;
            foundItem.reducerKilnTimer = data.reducerKilnTimer;
            foundItem.cngTimer = data.cngTimer;
            foundItem.productsText = data.productsText;
            foundItem.malfunctionsText = data.malfunctionsText;
            foundItem.otherActivities = data.otherActivities;
            foundItem.dryerDiff =
                foundItem.dryerKilnTimer - previousItem.dryerKilnTimer;
            foundItem.reducerDiff =
                foundItem.reducerKilnTimer - previousItem.reducerKilnTimer;
            foundItem.cngDiff = foundItem.cngTimer - previousItem.cngTimer;
            foundItem.dryerTotal =
                previousItem.dryerTotal + foundItem.dryerDiff;
            foundItem.reducerTotal =
                previousItem.reducerTotal + foundItem.reducerDiff;
            foundItem.cngTotal = previousItem.cngTotal + foundItem.cngDiff;

            state.buttons.activityFormSaveButtonLoading = false;
        },
    },
    actions: {
        getAllFacilities({ commit }) {
            return axios.get("/facilities/getAll").then((result) => {
                commit("setFacilities", result.data);
            });
        },
        getFacilityActivityForms({ commit }, facility) {
            return axios
                .get("/activity-forms/getFacilityForms/" + facility)
                .then((result) => {
                    commit("setActivityForms", result.data);
                })
                .then(() => {
                    return true;
                });
        },
        addNewActivityForm({ commit, state }, data) {
            return axios.post("/activity-forms/add", data).then((result) => {
                if (result.data[0]?.id) {
                    data.id = result.data[0].id;
                    commit("addNewActivityForm", data);
                    state.commonDialogs.successDialog = true;
                } else if (result.data?.error) {
                    state.commonErrorText = result.data.error;
                    state.commonDialogs.errorDialog = true;
                    state.buttons.activityFormSaveButtonLoading = false;
                } else {
                    console.log("addNewActivityForm Error");
                }
            });
        },
        updateActivityForm({ commit, state }, data) {
            return axios.put("/activity-forms/update", data).then((result) => {
                if (result.data[0]?.id) {
                    commit("updateActivityForm", data);
                    state.commonDialogs.successDialog = true;
                } else if (result.data?.error) {
                    state.commonErrorText = result.data.error;
                    state.commonDialogs.errorDialog = true;
                    state.buttons.activityFormSaveButtonLoading = false;
                } else {
                    console.log("updateActivityForm Error");
                }
            });
        },
    },
    modules: { users, chartData, rawMaterials, analysis },
});
