<template>
    <v-layout class="homeView">
        <v-app-bar color="blue-darken-4" flat>
            <template v-slot:prepend>
                <v-app-bar-nav-icon
                    v-if="!mainState"
                    @click.stop="setDrawerState"
                    color="white"
                />
            </template>
            <div style="width: fit-content; min-width: 160px">
                <v-app-bar-title
                    v-if="mainState"
                    style="color: white; cursor: pointer"
                    @click="$router.push('/')"
                    >Data is tool for enhancing intuition</v-app-bar-title
                >
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
                            @click="$store.state.appBarSelectedFacility = null"
                            >Ana Sayfa</v-list-item
                        >
                    </template>
                </v-select>
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
            <RouterView></RouterView>
        </v-main>
    </v-layout>
</template>

<script>
export default {
    name: "HomeView",
    data: () => ({}),
    computed: {
        mainState() {
            return this.$store.state.appBarSelectedFacility == null;
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
}
.menu-item {
    width: fit-content;
}
</style>
