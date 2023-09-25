<template>
    <Navbar>
        <v-list>
            <v-list-item
                prepend-icon="mdi-chart-line"
                title="Grafikler"
                class="nav-list-item"
                to="/quartz/charts"
            >
            </v-list-item>
            <v-list-group>
                <template v-slot:activator="{ props }">
                    <v-list-item
                        v-bind="props"
                        prepend-icon="mdi-clipboard-plus-outline"
                        title="Veri Girişi"
                        class="nav-list-item"
                    ></v-list-item>
                </template>
                <v-list-item
                    title="Bilya Şarj"
                    prepend-icon="mdi-shape-circle-plus"
                    to="/quartz/raw/ball-charge"
                    class="justify-start"
                ></v-list-item>
                <v-list-item
                    title="Çalışma Saatleri"
                    prepend-icon="mdi-timeline-plus-outline"
                    to="/quartz/activity-form/new"
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
import { useRoute } from "vue-router";
export default {
    components: { Navbar },
    setup() {
        const store = useStore();
        const route = useRoute();
        onBeforeMount(() => {
            store.state.drawer = true;
            store.state.appBarSelectedFacility = "/quartz";
        });
        return { route };
    },
};
</script>
