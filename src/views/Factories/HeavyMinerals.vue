<template>
    <Navbar>
        <v-list>
            <v-list-group>
                <template v-slot:activator="{ props }">
                    <v-list-item
                        v-bind="props"
                        prepend-icon="mdi-clipboard-outline"
                        title="Faaliyet Formu"
                        class="nav-list-item"
                    ></v-list-item>
                </template>
                <v-list-item
                    title="Yeni Form"
                    prepend-icon="mdi-clipboard-edit-outline"
                    to="/heavy-minerals/activity-form/new"
                    class="justify-start"
                ></v-list-item>
                <v-list-item
                    title="Form Listesi"
                    prepend-icon="mdi-clipboard-list-outline"
                    to="/heavy-minerals/activity-form/list"
                    class="justify-start"
                ></v-list-item>
            </v-list-group>
            <v-list-item
                prepend-icon="mdi-chart-line"
                title="Grafikler"
                class="nav-list-item"
                to="/heavy-minerals/charts"
            >
            </v-list-item>
            <v-list-group>
                <template v-slot:activator="{ props }">
                    <v-list-item
                        v-bind="props"
                        prepend-icon="mdi-truck-outline"
                        title="Hammadde Giriş"
                        class="nav-list-item"
                    ></v-list-item>
                </template>
                <v-list-item
                    title="Kömür"
                    prepend-icon="mdi-fire"
                    to="/heavy-minerals/raw/coal"
                    class="justify-start"
                ></v-list-item>
            </v-list-group>
            <v-list-group>
                <template v-slot:activator="{ props }">
                    <v-list-item
                        v-bind="props"
                        prepend-icon="mdi-state-machine"
                        title="Proses Giriş"
                        class="nav-list-item"
                    ></v-list-item>
                </template>
                <v-list-item
                    title="Kömür - Ağır Mineral"
                    prepend-icon="mdi-vector-polyline-plus"
                    to="/heavy-minerals/process/reducer"
                    class="justify-start"
                ></v-list-item>
            </v-list-group>
            <v-list-group>
                <template v-slot:activator="{ props }">
                    <v-list-item
                        v-bind="props"
                        prepend-icon="mdi-test-tube"
                        title="Analizler"
                        class="nav-list-item"
                    ></v-list-item>
                </template>
                <v-list-item
                    title="80 Mesh"
                    to="/heavy-minerals/analysis/80mesh"
                    class="justify-start"
                ></v-list-item>
                <v-list-item
                    title="180 Mesh"
                    to="/heavy-minerals/analysis/180mesh"
                    class="justify-start"
                ></v-list-item>
                <v-list-item
                    title="3060 Mesh"
                    to="/heavy-minerals/analysis/3060mesh"
                    class="justify-start"
                ></v-list-item>
            </v-list-group>
        </v-list>
    </Navbar>
    <RouterView></RouterView>
</template>
<script>
import Navbar from "@/components/Navbar.vue";
import { onBeforeMount } from "vue";
import { useStore } from "vuex";
export default {
    components: { Navbar },
    setup() {
        const store = useStore();
        onBeforeMount(() => {
            store.state.drawer = true;
            store.state.appBarSelectedFacility ??= "/heavy-minerals";
        });
        return {};
    },
};
</script>
