<template>
    <v-layout class="homeView">
        <v-app-bar color="blue-darken-4" flat>
            <template v-slot:prepend>
                <v-app-bar-nav-icon
                    v-if="!main"
                    @click.stop="setDrawerState"
                    color="white"
                />
            </template>
            <div style="width: fit-content; min-width: 160px">
                <v-app-bar-title
                    v-if="main"
                    style="color: white; cursor: pointer"
                    @click="$router.push('/')"
                    >Data is tool for enhancing intuition</v-app-bar-title
                >
                <v-select
                    variant="outlined"
                    density="compact"
                    :hide-details="true"
                    v-model="$store.state.appBarSelectedFactory"
                    :items="$store.getters.getFacilities"
                    item-title="name"
                    item-value="path"
                    v-else
                >
                    <template v-slot:prepend-item>
                        <v-list-item @click="$router.push('/')"
                            >Ana Sayfa</v-list-item
                        >
                    </template></v-select
                >
            </div>
            <template v-slot:append>
                <v-menu>
                    <template v-slot:activator="{ props }">
                        <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
                    </template>
                    <v-list>
                        <v-list-item
                            title="Ayarlar"
                            class="menu-item"
                            @click="goToSettings"
                        />
                        <v-list-item
                            title="Çıkış"
                            class="menu-item"
                            @click="logout"
                        />
                    </v-list>
                </v-menu>
            </template>
        </v-app-bar>
        <v-main class="ma-0 pa-0">
            <div v-if="main" class="mainView">
                <div
                    class="mainView_item"
                    @click="$router.push('/heavy-minerals')"
                >
                    <span>Ağır Mineraller Tesisi</span>
                </div>
                <div class="mainView_item" @click="$router.push('/quartz')">
                    <span>Kuvars Tesisi</span>
                </div>
            </div>
            <RouterView v-else></RouterView>
        </v-main>
    </v-layout>
</template>

<script>
export default {
    name: "HomeView",
    data: () => ({
        drawer: false,
        selectedFactory: null,
    }),
    computed: {
        main() {
            return this.$route.path == "/";
        },
    },
    methods: {
        setDrawerState() {
            this.$store.state.drawer = !this.$store.state.drawer;
        },
        goToSettings() {
            this.$router.push("/settings");
        },
        logout() {
            this.$store.dispatch("users/logout");
        },
    },
    watch: {
        "$store.state.appBarSelectedFactory": {
            handler(val) {
                this.$router.push(val);
            },
        },
    },
};
</script>

<style lang="scss" scoped>
@mixin flexCenter {
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: center;
    justify-items: center;
}
.homeView {
    width: 100%;
    height: 100%;
}
.menu-item {
    width: fit-content;
}
.mainView {
    width: 100%;
    height: 100%;
    padding: 1rem;
    &_item:first-of-type {
        margin-top: 1rem;
    }
    &_item {
        @include flexCenter;
        height: 10%;
        margin-bottom: 2rem;
        border: 1px solid rgb(200, 200, 200);
        width: 100%;
        cursor: pointer;
        background-color: rgb(238, 246, 255);
        span {
            font-size: 1.2rem;
            font-weight: 600;
        }
    }
}
</style>
