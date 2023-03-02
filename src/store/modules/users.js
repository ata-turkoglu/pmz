import axios from "axios";
import jwt from "vue-jwt-decode";
import router from "../../router/index";

axios.defaults.baseURL = process.env.VUE_APP_BACKEND;

export default {
  namespaced: true,
  state: {
    user: null,
    authenticated: false,
    buttons: {
      loginButtonLoading: false,
    },
  },
  getters: {},
  mutations: {
    setUser: (state, data) => {
      state.user = data;

      state.buttons.loginButtonLoading = false;
      state.authenticated = true;
      if (router.currentRoute.value.name == "Login") {
        router.push("/");
      }
    },
    removeUser: (state) => {
      state.user = null;
    },
  },
  actions: {
    async getUsers({ commit }) {
      return axios.get("/users/all").then((result) => {
        console.log(result);
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

//id
//username
//password
//role
//status
//signupdate
//lastlogindate
//token
