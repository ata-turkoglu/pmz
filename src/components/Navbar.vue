<template>
    <v-navigation-drawer
        v-model="store.state.drawer"
        class="px-3 py-2 navbar"
        temporary
        color="blue-darken-4"
        width="30%"
    >
        <slot></slot>
        <template #append>
            <slot name="append"></slot>
        </template>
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
<style scoped>
.navbar {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
}
</style>
