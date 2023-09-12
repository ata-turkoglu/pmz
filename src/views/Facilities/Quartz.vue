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
