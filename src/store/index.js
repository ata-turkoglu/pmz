import { createStore } from "vuex";
import axios from "axios";
import moment from "moment";
moment.locale("tr");
axios.defaults.baseURL = process.env.VUE_APP_BACKEND;

export default createStore({
  state: {
    activityForms: [],
    facilities: [
      {
        id: 1,
        name: "Agrega",
        disabled: false,
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
        .sort((a, b) => a.id - b.id);
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
      console.log(data);
      state.activityForms.push(...data);
    },
    updateActivityForms(state, data) {
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
          commit("setActivityForms", result.data);
        });
    },
    addNewActivityForm({ commit }, data) {
      return axios.put("/activity-forms/add", data).then((result) => {
        console.log("addNewActivityForm", result);
        state.buttons.activityFormSaveButtonLoading = false;
      });
    },
    updateActivityForm({ commit, state }, data) {
      return axios.put("/activity-forms/update", data).then((result) => {
        console.log("updateActivityForm", result);
        if (!result.error) {
          commit("updateActivityForms", data);
        }
      });
    },
  },
  modules: {},
});
