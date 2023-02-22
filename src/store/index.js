import { createStore } from "vuex";
import axios from "axios";
const api = process.env.VUE_APP_BACKEND;

export default createStore({
  state: {
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
  },
  getters: {
    getFacilities: (state) => {
      return state.facilities.filter((itm) => {
        return !itm.disabled;
      });
    },
  },
  mutations: {},
  actions: {
    getAllFacilities({ commit }) {
      return axios
        .get("http://localhost:3000" + "/facilities/getAll")
        .then((result) => {
          console.log("result", result);
        });
    },
  },
  modules: {},
});
