import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView";
import NewActivityForm from "../views/ActivityForms/NewActivityForm.vue";
import ActivityFormList from "../views/ActivityForms/ActivityFormList.vue";
import Graphs from "../views/Graphs/Graphs";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    children: [
      /*       {
        path: "/activity-form",
        name: "NewActivityForm",
        component: NewActivityForm,
        children: [],
      }, */
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
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
