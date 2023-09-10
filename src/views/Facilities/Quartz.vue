<template>
    <Navbar><span>Quartz</span></Navbar>
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
            store.state.appBarSelectedFacility ??= "/quartz";
        });
        return { route };
    },
};
</script>
