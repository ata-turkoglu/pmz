import axios from "axios";
import jwt from "vue-jwt-decode";
import router from "../../router/index";

axios.defaults.baseURL = process.env.VUE_APP_BACKEND;

export default {
  namespaced: true,
  state: {
    user: null,
    users: [],
    authenticated: false,
    buttons: {
      loginButtonLoading: false,
      editUserSaveButtonLoading: false,
    },
    roles: [
      { id: 1, value: "developer", title: "Geliştirici" },
      { id: 2, value: "manager", title: "Yönetici" },
      { id: 3, value: "foreman", title: "Formen" },
      { id: 4, value: "worker", title: "İşçi" },
    ],
  },
  getters: {
    getUsers: (state) => {
      return state.users;
    },
    getRoles: (state) => {
      return state.roles;
    },
  },
  mutations: {
    setUser: (state, data) => {
      state.user = data;

      state.buttons.loginButtonLoading = false;
      state.authenticated = true;
      if (router.currentRoute.value.name == "Login") {
        router.push("/");
      }
    },

    setUsers: (state, data) => {
      state.users = data;
    },

    updateUser: (state, data) => {
      let index = state.users.findIndex((itm) => itm.id == data.id);
      state.users.splice(index, 1, data);

      state.buttons.editUserSaveButtonLoading = false;
    },

    removeUser: (state) => {
      state.user = null;
    },
  },
  actions: {
    async getUsers({ commit }) {
      return axios.get("/users/all").then((result) => {
        commit("setUsers", result.data);
      });
    },

    async updateUser({ commit }, data) {
      return axios.put("/users/update", data).then((result) => {
        if (result.data[0].id) {
          commit("updateUser", data);
          return true;
        } else {
          return false;
        }
      });
    },

    async signIn({ commit }, data) {
      return axios.post("/users/signin", data).then((result) => {
        console.log(result);
      });
    },

    async login({ commit }, data) {
      return axios
        .post("/users/login", {
          username: data.username,
          password: data.password,
        })
        .then((result) => {
          if (result.data.token) {
            localStorage.setItem("auth_token", result.data.token);
            if (data.rememberMe) {
              localStorage.setItem("username", data.username);
            } else {
              localStorage.removeItem("username");
            }

            return jwt.decode(
              result.data.token,
              process.env.VUE_APP_JWT_SECRET_KEY
            );
          }
        })
        .then((decoded) => {
          commit("setUser", {
            id: decoded.id,
            username: decoded.username,
            role: decoded.role,
          });
        });
    },

    async logout({ commit, state }) {
      localStorage.removeItem("auth_token");
      state.authenticated = false;
      commit("removeUser");
      router.push({ name: "Login" });
    },

    async userExist({ commit }) {
      return new Promise(async (resolve) => {
        let auth_token = window.localStorage.getItem("auth_token");
        if (auth_token) {
          let decoded = jwt.decode(
            auth_token,
            process.env.VUE_APP_JWT_SECRET_KEY
          );
          if (decoded.exp * 1000 > Date.now()) {
            await commit("setUser", {
              id: decoded.id,
              username: decoded.username,
              role: decoded.role,
            });
          }
        }
        resolve();
      });
    },
  },
};
