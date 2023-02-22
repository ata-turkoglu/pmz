import { createStore } from "vuex";

export default createStore({
  state: {
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
  },
  getters: {},
  mutations: {},
  actions: {},
  modules: {},
});
