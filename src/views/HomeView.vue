<template>
    <v-app>
        <v-layout class="homeView">
            <v-app-bar color="blue-darken-4" flat height="65" :absolute="false">
                <template v-slot:prepend>
                    <v-app-bar-nav-icon
                        v-if="!mainState && !settingState"
                        @click.stop="setDrawerState"
                        color="white"
                    />
                    <v-app-bar-nav-icon
                        v-if="settingState"
                        icon="mdi-home"
                        @click.stop="$router.push('/')"
                    ></v-app-bar-nav-icon>
                </template>
                <div style="width: fit-content; min-width: 160px">
                    <v-app-bar-title
                        v-if="mainState || settingState"
                        style="color: white; cursor: pointer"
                        @click="$router.push('/')"
                    >
                        Data is tool for enhancing intuition
                    </v-app-bar-title>
                    <v-select
                        variant="outlined"
                        density="compact"
                        :hide-details="true"
                        v-model="$store.state.appBarSelectedFacility"
                        :items="$store.getters.getFacilities"
                        item-title="name"
                        item-value="path"
                        v-else
                    >
                        <template v-slot:prepend-item>
                            <v-list-item
                                @click="
                                    $store.state.appBarSelectedFacility = null
                                "
                            >
                                Ana Sayfa
                            </v-list-item>
                        </template>
                    </v-select>
                </div>
                <template v-slot:append>
                    <v-menu>
                        <template v-slot:activator="{ props }">
                            <v-btn
                                icon="mdi-dots-vertical"
                                v-bind="props"
                            ></v-btn>
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
            <v-main class="ma-0 pa-0 vmain">
                <RouterView />
            </v-main>
        </v-layout>
    </v-app>
</template>

<script>
export default {
    name: "HomeView",
    data: () => ({}),
    computed: {
        mainState() {
            return this.$store.state.appBarSelectedFacility == null;
        },
        settingState() {
            return this.$route.name == "Settings";
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
        "$store.state.appBarSelectedFacility": {
            handler(val) {
                if (val == null) {
                    this.$router.push("/");
                } else {
                    this.$router.push(val);
                }
            },
        },
    },
};
</script>

<style lang="scss" scoped>
.homeView {
    width: 100%;
    height: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;
}
.menu-item {
    width: fit-content;
}
.vmain {
    padding-top: 65px !important;
    height: calc(100% - 65px);
    height: -moz-calc(100% - 65px);
    height: -webkit-calc(100% - 65px);
}
</style>
