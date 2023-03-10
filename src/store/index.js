import { createStore } from "vuex";
import axios from "axios";
import moment from "moment";
import users from "./modules/users";
import chartData from "./modules/chartData";
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
        name: "Gece",
      },
      {
        id: 2,
        name: "Gündüz",
      },
      {
        id: 3,
        name: "Akşam",
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
      let foundItem = state.activityForms.find((itm) => itm.id == data.id);

      foundItem.date = data.date;
      foundItem.facility = data.facility;
      foundItem.shift = data.shift;
      foundItem.dryerKilnTimer = data.dryerKilnTimer;
      foundItem.reducerKilnTimer = data.reducerKilnTimer;
      foundItem.cngTimer = data.cngTimer;
      foundItem.productsText = data.productsText;
      foundItem.malfunctionsText = data.malfunctionsText;
      foundItem.otherActivities = data.otherActivities;

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
          console.log(result.data);
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
          state.buttons.activityFormSaveButtonLoading = false;
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
        console.log("updateActivityForm", result);
        if (!result.error) {
          commit("updateActivityForm", data);
        }
      });
    },
  },
  modules: { users, chartData },
});
