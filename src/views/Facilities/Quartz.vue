<template>
    <div id="quartzMain">
        <Navbar>
            <v-list>
                <v-list-item
                    prepend-icon="mdi-text-box-outline"
                    title="Stoklar"
                    class="nav-list-item"
                    to="/quartz"
                >
                </v-list-item>
                <v-list-group>
                    <template v-slot:activator="{ props }">
                        <v-list-item
                            v-bind="props"
                            prepend-icon="mdi-chart-line"
                            title="Grafikler"
                            class="nav-list-item"
                        ></v-list-item>
                    </template>
                    <v-list-item
                        prepend-icon="mdi-sticker-plus-outline"
                        title="Üretim"
                        class="nav-list-item"
                        to="/quartz/charts/produced"
                    >
                    </v-list-item>
                    <v-list-item
                        prepend-icon="mdi-truck-delivery-outline"
                        title="Sevk"
                        class="nav-list-item"
                        to="/quartz/charts/dispatch"
                    ></v-list-item>
                    <v-list-item
                        prepend-icon="mdi-minus-circle-multiple-outline"
                        title="Bilya Tüketimi"
                        class="nav-list-item"
                        to="/quartz/charts/ball-consumption"
                    >
                    </v-list-item>
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
                        title="Bilya Şarj"
                        prepend-icon="mdi-shape-circle-plus"
                        to="/quartz/raw/ball-charge"
                        class="justify-start"
                    ></v-list-item>
                </v-list-group>
                <v-list-item
                    title="Maliyet Hesaplama"
                    prepend-icon="mdi-calculator-variant"
                    to="/quartz/cost-calculation"
                    class="justify-start"
                ></v-list-item>
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
                        title="Çalışma Saatleri"
                        prepend-icon="mdi-timeline-plus-outline"
                        to="/quartz/activity-form/new"
                        class="justify-start"
                    ></v-list-item>
                    <v-list-item
                        title="Bigbag - Torba"
                        prepend-icon="mdi-layers-plus"
                        to="/quartz/raw/purchased-bags"
                        class="justify-start"
                    ></v-list-item>
                    <v-list-item
                        title="Palet"
                        prepend-icon="mdi-playlist-plus"
                        to="/quartz/raw/purchased-pallets"
                        class="justify-start"
                    ></v-list-item>
                    <v-list-item
                        title="Alumina Bilya-Tuğla"
                        prepend-icon="mdi-shape-plus"
                        to="/quartz/raw/purchased-ball-brick"
                        class="justify-start"
                    ></v-list-item>
                    <v-list-item
                        title="Elektrik Faturası"
                        prepend-icon="mdi-lightning-bolt-outline"
                        to="/quartz/raw/electricity-bill"
                        class="justify-start"
                    ></v-list-item>
                    <v-list-item
                        title="Yakıt Faturası"
                        prepend-icon="mdi-gas-station"
                        to="/quartz/raw/fuel-bill"
                        class="justify-start"
                    ></v-list-item>
                </v-list-group>
            </v-list>
            <template #append>
                <v-list-item @click="checkMails"> Check Mails </v-list-item>
            </template>
        </Navbar>
        <QuartzStockTaking v-if="route.name == 'Quartz'" />
        <RouterView v-else></RouterView>
    </div>
</template>
<script>
import Navbar from "@/components/Navbar.vue";
import { onBeforeMount } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import QuartzStockTaking from "../Stocktaking/QuartzStocktaking";
export default {
    components: { Navbar, QuartzStockTaking },
    setup() {
        const store = useStore();
        const route = useRoute();
        store.dispatch("quartzProduction/getLastStocktakingData");

        const checkMails = () => {
            store.dispatch("quartzProduction/checkStocktakingMails");
        };

        onBeforeMount(() => {
            store.state.drawer = true;
            store.state.appBarSelectedFacility = "/quartz";
        });
        return { route, checkMails };
    },
};
</script>

<style scoped>
#quartzMain {
    width: 100%;
    height: 100%;
    padding: 30px;
}
.nav-list-item {
    display: flex;
    color: white;
    cursor: pointer;
}
@media screen and (max-width: 600px) {
    #quartzMain {
        padding: 10px 10px 30px 10px;
    }
}
</style>
