import { createRouter, createWebHistory } from "vue-router";
import store from "../store/index";
import permissions from "@/mixins/permissions";
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
    path: "/password-reset",
    name: "PasswordReset",
    component: SignIn,
    props: true,
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
        beforeEnter: (to, from) => {
          if (permissions.methods.accessSettings()) {
            return true;
          } else {
            store.state.commonDialogs.routePermissionDialog = true;
            return false;
          }
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.name == "Signin" || to.name == "PasswordReset") {
    next();
  } else if (to.name !== "Login" && !store.state.users.authenticated) {
    next({ name: "Login" });
  } else {
    next();
  }
});

export default router;
