import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView";
import ActivityForm from "../views/AvtifityForm/ActivityForm.vue";
import HeavyMineralsActivityForm from "../views/AvtifityForm/HeavyMineralsActivityForm.vue";
import AgregatesActivityForm from "../views/AvtifityForm/AgregatesActivityForm.vue";
import Graphs from "../components/Graphs.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    children: [
      {
        path: "/activity-form",
        name: "ActivityForm",
        component: ActivityForm,
        props: true,
        children: [
          {
            path: "/activity-form/1",
            name: "Agregates-ActivityForm",
            component: AgregatesActivityForm,
            props: true,
          },
          {
            path: "/activity-form/2",
            name: "HeavyMinerals-ActivityForm",
            component: HeavyMineralsActivityForm,
            props: true,
          },
        ],
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
