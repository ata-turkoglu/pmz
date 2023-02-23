import { createStore } from "vuex";
import axios from "axios";
import moment from "moment";
moment.locale("tr");
const api = process.env.VUE_APP_BACKEND;

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
  },
  getters: {
    getFacilities: (state) => {
      return state.facilities.filter((itm) => {
        return !itm.disabled;
      });
    },
    getHeavyMineralsForms: (state) => {
      return state.activityForms.filter((itm) => itm.facility == 2);
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
  },
  actions: {
    getAllFacilities({ commit }) {
      return axios
        .get("http://localhost:3000" + "/facilities/getAll")
        .then((result) => {
          commit("setFacilities", result.data);
        });
    },
    getFacilityActivityForms({ commit }, facility) {
      return axios
        .get(
          "http://localhost:3000" +
            "/activity-forms/getFacilityForms/" +
            facility
        )
        .then((result) => {
          commit("setActivityForms", result.data);
        });
    },
    addNewActivityForm({ commit }, data) {
      return axios
        .put("http://localhost:3000" + "/activity-forms/add", data)
        .then((result) => {
          console.log("addNewActivityForm", result);
        });
    },
  },
  modules: {},
});
