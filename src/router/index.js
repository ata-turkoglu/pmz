import { createRouter, createWebHistory } from "vue-router";
import store from "../store/index";
import permissions from "@/mixins/permissions";
import SignUp from "../views/SignUp";
import Login from "../views/Login";
import HomeView from "../views/HomeView";
import NewActivityForm from "../views/ActivityForms/NewActivityForm.vue";
import ActivityFormList from "../views/ActivityForms/ActivityFormList.vue";
import Charts from "../views/Charts/Charts";
import Coal from "../views/RawMaterials/Coal";
import Settings from "../views/Settings/Settings";
import reducerProcess from "../views/Process/Reducer";

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
                path: "/charts",
                name: "charts",
                component: Charts,
            },
            {
                path: "/raw/coal",
                name: "coal",
                component: Coal,
            },
            {
                path: "/process/heavy-minerals/reducer",
                name: "process-heavy-minerals-reducer",
                component: reducerProcess,
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
    if (to.name == "Signup" || to.name == "PasswordReset") {
        next();
    } else if (to.name !== "Login" && !store.state.users.authenticated) {
        next({ name: "Login" });
    } else {
        next();
    }
});

export default router;
