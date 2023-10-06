import { createRouter, createWebHistory } from "vue-router";
import store from "../store/index";
import permissions from "@/mixins/permissions";
import SignUp from "../views/SignUp";
import Login from "../views/Login";
import HomeView from "../views/HomeView";
import MainView from "../views/MainView.vue";
import HeavyMinerals from "../views/Facilities/HeavyMinerals";
import Quartz from "../views/Facilities/Quartz";
import QuartzMillBallCharge from "../views/RawMaterials/Quartz/BallCharge.vue";
import NewQuartzsActivityForm from "../views/ActivityForms/Quartz/QuartzActivityForm";
import HeavyMineralsActivityFormList from "../views/ActivityForms/HeavyMinerals/HeavyMineralsActivityFormList.vue";
import NewHeavyMineralsActivityForm from "../views/ActivityForms/HeavyMinerals/HeavyMineralsActivityForm.vue";
import HeavyMineralsCharts from "../views/Charts/HeavyMineralsCharts";
import QuartzProductionCharts from "../views/Charts/QuartzProductionCharts";
import QuartzStockTaking from "../views/Stocktaking/QuartzStocktaking";
import Coal from "../views/RawMaterials/Coal";
import Settings from "../views/Settings/Settings";
import ReducerProcess from "../views/Process/Reducer";
import Analysis3060Mesh from "../views/Analysis/Production/HeavyMinerals/3060Mesh.vue";
import Analysis80Mesh from "../views/Analysis/Production/HeavyMinerals/80Mesh.vue";
import Analysis180Mesh from "../views/Analysis/Production/HeavyMinerals/180Mesh.vue";
import HeavyMineralsProduction from "../views/Production/HeavyMineralsProduction.vue";

const routes = [
    {
        path: "/signup",
        name: "Signup",
        component: SignUp,
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
    },
    {
        path: "/password-reset",
        name: "PasswordReset",
        component: SignUp,
        props: true,
    },
    {
        path: "/",
        name: "Home",
        component: HomeView,
        children: [
            {
                path: "/",
                name: "MainView",
                component: MainView,
            },
            {
                path: "heavy-minerals",
                name: "HeavyMinerals",
                component: HeavyMinerals,
                children: [
                    {
                        path: "activity-form/new",
                        name: "NewHeavyMineralsActivityForm",
                        component: NewHeavyMineralsActivityForm,
                    },
                    {
                        path: "activity-form/list",
                        name: "HeavyMineralsActivityFormList",
                        component: HeavyMineralsActivityFormList,
                    },
                    {
                        path: "charts",
                        name: "HeavyMineralsCharts",
                        component: HeavyMineralsCharts,
                    },
                    {
                        path: "raw/coal",
                        name: "Coal",
                        component: Coal,
                    },
                    {
                        path: "process/reducer",
                        name: "ProcessHeavyMineralsReducer",
                        component: ReducerProcess,
                    },
                    {
                        path: "analysis/3060mesh",
                        name: "analysisHeavyMinerals3060Mesh",
                        component: Analysis3060Mesh,
                    },
                    {
                        path: "analysis/80mesh",
                        name: "AnalysisHeavyMinerals80Mesh",
                        component: Analysis80Mesh,
                    },
                    {
                        path: "analysis/180mesh",
                        name: "AnalysisHeavyMinerals180Mesh",
                        component: Analysis180Mesh,
                    },
                    {
                        path: "production",
                        name: "HeavyMineralsProduction",
                        component: HeavyMineralsProduction,
                    },
                ],
            },
            {
                path: "quartz",
                name: "Quartz",
                component: Quartz,
                children: [
                    {
                        path: "charts",
                        name: "QuartzProductionCharts",
                        component: QuartzProductionCharts,
                    },
                    {
                        path: "raw/ball-charge",
                        name: "QuartzMillBallCharge",
                        component: QuartzMillBallCharge,
                    },
                    {
                        path: "activity-form/new",
                        name: "NewQuartzsActivityForm",
                        component: NewQuartzsActivityForm,
                    },
                ],
            },
            {
                path: "settings",
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
    if (to.name == "Signup" || to.name == "PasswordReset") {
        next();
    } else if (to.name !== "Login" && !store.state.users.authenticated) {
        next({ name: "Login" });
    } else {
        next();
    }
});

export default router;
