<template>
    <div id="heavyMineralsMain">
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
                <v-list-item
                    prepend-icon="mdi-script-text-outline"
                    title="Üretim"
                    class="nav-list-item"
                    to="/heavy-minerals/production"
                ></v-list-item>
            </v-list>
        </Navbar>
        <div v-if="route.name == 'HeavyMinerals'">
            <v-expansion-panels>
                <v-expansion-panel>
                    <v-expansion-panel-title>
                        <div class="panel-title">
                            <ul>
                                <li class="mb-2">05.08.2023</li>
                                <li>Ağır Mineraller Hammadde Ölçümü</li>
                            </ul>
                        </div>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <div class="panel-text">
                            <ul>
                                <li>Ocakta en üstte çalışılıyor</li>
                                <li>
                                    En üst spirallerin atığında %10 civarı ağır
                                    mineraller bulunuyor
                                </li>
                                <li>
                                    Sallantılı masalardan atığa giden kısımda
                                    %25 ağır mineraller var
                                </li>
                                <li>
                                    Havuza gelen ağır minerallerin miktarı 1
                                    ton/saat
                                </li>
                            </ul>
                        </div>
                    </v-expansion-panel-text>
                </v-expansion-panel>
            </v-expansion-panels>
        </div>
        <RouterView v-else class="r-view"></RouterView>
    </div>
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
            store.state.appBarSelectedFacility = "/heavy-minerals";
        });
        return { route };
    },
};
</script>
<style lang="scss" scoped>
.nav-list-item {
    display: flex;
    color: white;
    cursor: pointer;
}

#heavyMineralsMain {
    width: 100%;
    height: 100%;
    padding: 30px;

    .panel-title {
        li {
            display: block;
            text-align: start;
        }
    }
    .panel-text {
        padding-left: 10px;
        padding-top: 10px;
        li {
            text-align: start;
        }
    }
    .r-view {
        width: 100%;
        height: 100%;
    }
}
@media screen and (max-width: 600px) {
    #heavyMineralsMain {
        padding: 10px 10px 30px 10px;
    }
}
</style>
