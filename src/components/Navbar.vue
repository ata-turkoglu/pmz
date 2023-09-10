<template>
    <v-navigation-drawer
        v-model="store.state.drawer"
        class="px-3 py-2"
        temporary
        color="blue-darken-4"
        width="30%"
    >
        <slot></slot>
    </v-navigation-drawer>
</template>
<script>
import { useStore } from "vuex";
export default {
    setup() {
        const store = useStore();

        return { store };
    },
};
</script>
<style scoped></style>
