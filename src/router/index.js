import { createRouter, createWebHistory } from "vue-router";
import store from "../store/index";
import SignIn from "../views/SignIn";
import Login from "../views/Login";
import HomeView from "../views/HomeView";
import NewActivityForm from "../views/ActivityForms/NewActivityForm.vue";
import ActivityFormList from "../views/ActivityForms/ActivityFormList.vue";
import Graphs from "../views/Graphs/Graphs";
import Settings from "../views/Settings/Settings";

const routes = [
  {
    path: "/signin",
    name: "Signin",
    component: SignIn,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/",
    name: "Home",
    component: HomeView,
    children: [
      {
        path: "/activity-form/new",
        name: "newActivityForm",
        component: NewActivityForm,
      },
      {
        path: "/activity-form/list",
        name: "ActivityFormList",
        component: ActivityFormList,
      },
      {
        path: "/graphs",
        name: "Graps",
        component: Graphs,
      },
      {
        path: "/settings",
        name: "Settings",
        component: Settings,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.name !== "Login" && !store.state.users.authenticated) {
    next({ name: "Login" });
  } else {
    next();
  }
});

export default router;
