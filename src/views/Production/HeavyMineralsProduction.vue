<template>
    <div class="HeavyMineralsProduction">
        <div style="display: block; width: 100%">
            <VueDatePicker
                ref="vDatePicker2"
                class="datepicker"
                v-model="selectedDateRange"
                range
                :preset-ranges="presetRanges"
                :enable-time-picker="false"
                position="left"
                :format="vdpInputFormat"
                placeholder="Tarih Seç"
            >
                <template #action-select>
                    <p class="vdp-select" @click="selectDate">Seç</p>
                </template>
            </VueDatePicker>
        </div>

        <v-data-table
            v-if="items.length > 0"
            :headers="headers"
            :items="items"
            :group-by="groupBy"
            class="elevation-1 mb-10"
            density="compact"
        >
            <template
                v-slot:group-header="{
                    item,
                    columns,
                    toggleGroup,
                    isGroupOpen,
                }"
            >
                <tr>
                    <td :colspan="columns.length" class="table-td">
                        <b>{{ item.value }}</b>
                        <v-btn
                            size="small"
                            variant="text"
                            :icon="isGroupOpen(item) ? 'mdi-minus' : 'mdi-plus'"
                            @click="toggleGroup(item)"
                        >
                        </v-btn>
                    </td>
                </tr>
            </template>
            <template v-slot:item.definition="{ item }">
                <span>
                    <b>{{ item.raw.definition }}</b>
                </span>
            </template>
            <template v-slot:item.totalWeight="{ item }">
                <span>
                    <b>{{ item.raw.totalWeight + " ton" }}</b>
                </span>
            </template>
            <template v-slot:bottom> </template>
        </v-data-table>
    </div>
</template>

<script>
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import { VDataTable } from "vuetify/lib/labs/components";
import moment from "moment";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
export default {
    components: { VDataTable, VueDatePicker },
    setup() {
        const store = useStore();

        const vDatePicker2 = ref(null);
        const selectedDateRange = ref(null);
        const presetRanges = ref(null);
        const groupBy = ref([{ key: "date" }]);

        const headers = [
            /*             {
                title: "Tarih",
                key: "date",
                align: "end",
            }, */
            { title: "Ürün", key: "definition", align: "end" },
            { title: "Paketleme", key: "packaging", align: "end" },
            { title: "Adet", key: "amount", align: "end" },
            { title: "Toplam (ton)", key: "totalWeight", align: "end" },
        ];

        const items = computed(() => {
            return store.state.heavyMineralsProduction
                .productionDataByDateRange;
        });

        const vdpInputFormat = (date) => {
            return `${moment(date[0]).format("L")} - ${moment(date[1]).format(
                "L"
            )}`;
        };

        const setPresentRanges = () => {
            presetRanges.value = [
                {
                    label: " 7_Gün ",
                    range: [
                        moment().subtract(7, "days").format(),
                        moment().format(),
                    ],
                },
                {
                    label: " Son_1_Ay ",
                    range: [
                        moment().subtract(1, "months").format(),
                        moment().format(),
                    ],
                },
                {
                    label: " Bu_Ay ",
                    range: [
                        moment().startOf("month").format(),
                        moment().format(),
                    ],
                },
            ];
        };
        setPresentRanges();

        const selectDate = () => {
            vDatePicker2.value.selectDate();
        };

        watch(
            () => selectedDateRange.value,
            (val) => {
                store.dispatch(
                    "heavyMineralsProduction/getProductionDataByDateRange",
                    {
                        facility: 2,
                        startDate: moment(val[0]).format("YYYY-MM-DD"),
                        endDate: moment(val[1]).format("YYYY-MM-DD"),
                    }
                );
            }
        );

        return {
            vdpInputFormat,
            vDatePicker2,
            presetRanges,
            headers,
            items,
            selectedDateRange,
            selectDate,
            groupBy,
        };
    },
};
</script>
<style lang="scss" scoped>
.HeavyMineralsProduction {
    width: 100%;
    padding: 10px;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    .datepicker {
        width: 30%;
        margin-block: 20px;
    }
}

.table-td {
    text-align: left;
    width: 100%;
}

@media screen and (max-width: 600px) {
    .HeavyMineralsProduction {
        .datepicker {
            margin-top: 0;
            width: 100%;
        }
    }
}
</style>
