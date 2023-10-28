import { createStore } from "vuex";
import axios from "@/plugins/axios";
import moment from "moment";
import users from "./modules/users";
import bills from "./modules/bills";
import heavyMineralsChartData from "./modules/HeavyMinerals/chartData";
import heavyMineralsRawMaterials from "./modules/HeavyMinerals/rawMaterials";
import heavyMineralsAnalysis from "./modules/HeavyMinerals/analysis";
import heavyMineralsProcess from "./modules/HeavyMinerals/process";
import heavyMineralsProduction from "./modules/HeavyMinerals/production";
import quartz from "./modules/Quartz/quartz";
import quartzProduction from "./modules/Quartz/production";
import quartzRawMaterials from "./modules/Quartz/rawMaterials";
import quartzWorkingHours from "./modules/Quartz/workingHours";

moment.locale("tr");

export default createStore({
    state: {
        activityForms: [],
        facilities: [
            {
                id: 1,
                name: "Agrega",
                path: "/agregate",
                disabled: true,
            },
            {
                id: 2,
                name: "Ağır Mineraller",
                path: "/heavy-minerals",
                disabled: false,
            },
            {
                id: 3,
                name: "Altın",
                path: "/gold",
                disabled: true,
            },
            {
                id: 4,
                name: "Kum",
                path: "/sand",
                disabled: true,
            },
            {
                id: 5,
                name: "Kuvars",
                path: "/quartz",
                disabled: false,
            },
            {
                id: 6,
                name: "Kuvars Kırma",
                disabled: true,
            },
            {
                id: 7,
                name: "Kuvars Eleme",
                disabled: true,
            },
            {
                id: 8,
                name: "Kuvars Öğütme",
                disabled: true,
            },
            {
                id: 9,
                name: "Silis",
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
        dbProducts: [],
        dbProductPackagings: [],
        commonErrorText: null,
        drawer: false,
        appBarSelectedFacility: null,
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
        getDbProducts: (state) => {
            return state.dbProducts;
        },
        getDbProductPackagings: (state) => {
            return state.dbProductPackagings;
        },
        getDbProduct: (state) => (id) => {
            return state.dbProducts.find((itm) => itm.id == id);
        },
        getDbProductPackaging: (state) => (id) => {
            return state.dbProductPackagings.find((itm) => itm.id == id);
        },
    },
    mutations: {
        setFacilities(state, data) {
            state.facilities = data;
        },
        setActivityForms(state, data) {
            let activityForms = data.activityForms;
            activityForms.forEach((item) => {
                item.date = moment(item.date)
                    .format("L")
                    .split(".")
                    .reverse()
                    .join("-");
                item.produced = data.producedList.filter(
                    (itm) => itm.form_id == item.id
                );
            });
            state.activityForms.push(...activityForms);
        },
        addNewActivityForm(state, data) {
            state.activityForms.push(Object.assign({}, data));
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
        SET_DB_PRODUCTS(state, data) {
            state.dbProducts = data;
        },
        SET_DB_PRODUCT_PACKAGING(state, data) {
            state.dbProductPackagings = data;
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
                if (result.status == 200) {
                    data.id = result.data.formId;
                    data.producedIds = result.data.producedIds;
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
        async updateActivityForm({ commit, state }, data) {
            return axios
                .put("/activity-forms/update", data)
                .then(async (result) => {
                    if (result.status == 200) {
                        await commit("updateActivityForm", data);
                        state.commonDialogs.successDialog = true;
                        return true;
                    } else if (result.data?.error) {
                        state.commonErrorText = result.data.error;
                        state.commonDialogs.errorDialog = true;
                        state.buttons.activityFormSaveButtonLoading = false;
                        return false;
                    } else {
                        console.log("updateActivityForm Error");
                        return false;
                    }
                });
        },
        getDbProducts({ commit }) {
            return axios.get("/utils/getProducts").then((result) => {
                if (result.status == 200) {
                    commit("SET_DB_PRODUCTS", result.data);
                    return true;
                } else {
                    return false;
                }
            });
        },
        getDbProductPackagings({ commit }) {
            return axios.get("/utils/getProductPackagings").then((result) => {
                if (result.status == 200) {
                    commit("SET_DB_PRODUCT_PACKAGING", result.data);
                    return true;
                } else {
                    return false;
                }
            });
        },
    },
    modules: {
        users,
        bills,
        heavyMineralsAnalysis,
        heavyMineralsChartData,
        heavyMineralsProcess,
        heavyMineralsProduction,
        heavyMineralsRawMaterials,
        quartz,
        quartzProduction,
        quartzRawMaterials,
        quartzWorkingHours,
    },
});
