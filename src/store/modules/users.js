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
      if (data.rememberMe) {
        localStorage.setItem("auth_token", data.token);
      }

      let decoded = jwt.decode(data.token, process.env.JWT_SECRET_KEY);
      state.user = {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role,
      };

      state.buttons.loginButtonLoading = false;
      state.authenticated = true;
      router.push("/");
    },
  },
  actions: {
    signIn({ commit }, data) {
      return axios.post("/users/signin", data).then((result) => {
        console.log(result);
      });
    },
    login({ commit }, data) {
      return axios
        .post("/users/login", {
          username: data.username,
          password: data.password,
        })
        .then((result) => {
          if (result.data.token) {
            commit("setUser", {
              token: result.data.token,
              rememberMe: data.rememberMe,
            });
          }
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
