<template>
    <div class="quartzStocktaking">
        <h3>Kuvars Stok ({{ dataDate }})</h3>
        <VDataTable
            :headers="headers"
            :items="items"
            class="elevation-1 mt-5 mb-12"
            density="compact"
            :items-per-page="-1"
        >
            <template v-slot:bottom> </template>
        </VDataTable>
    </div>
</template>
<script>
import { computed } from "vue";
import { useStore } from "vuex";
import { VDataTable } from "vuetify/lib/labs/components";
import moment from "moment";
export default {
    components: { VDataTable },
    setup() {
        const store = useStore();
        const headers = [
            { title: "İsim", key: "product_name", align: "start" },
            { title: "Bigbag", key: "bigbag_total", align: "start" },
            {
                title: "Farklı Bigbag",
                key: "diff_bigbag_total",
                align: "start",
            },
            { title: "Palet", key: "pallet_total", align: "start" },
            { title: "Torba", key: "pp_total", align: "start" },
        ];

        const items = computed(() => {
            return store.state.quartzProduction.lastProductionData;
        });

        const dataDate = computed(() => {
            return moment(items.value[0]?.workday).format("DD-MM-YYYY");
        });
        return { headers, items, dataDate };
    },
};
</script>
<style scoped>
.quartzStocktaking {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
}
:v-deep .v-table td {
    text-align: center !important;
}
</style>
