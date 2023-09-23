<template>
    <div class="hm_production_container">
        <div class="first mt-5">
            <v-text-field
                class="inputs"
                label="Tarih"
                type="datetime-local"
                variant="outlined"
                v-model="formData.dateTime"
            ></v-text-field>
            <v-text-field
                :disabled="formData.calculatedCoal == null"
                class="inputs"
                label="Kömür Besleme"
                suffix="kg/saat"
                variant="solo"
                v-model="formData.calculatedCoal"
                readonly
            ></v-text-field>
            <v-text-field
                :disabled="formData.calculatedHeavyMinerals == null"
                class="inputs"
                label="Ağır Mineraller Besleme"
                suffix="kg/saat"
                variant="solo"
                v-model="formData.calculatedHeavyMinerals"
                readonly
            ></v-text-field>
            <v-text-field
                :disabled="formData.ratio == null"
                class="inputs"
                label="Kömür/Ağır Mineral Oranı"
                variant="solo"
                v-model="formData.ratio"
                readonly
                prefix="% "
            ></v-text-field>
        </div>
        <div class="first">
            <v-text-field
                class="inputs"
                label="Kömür Frekans (Hz)"
                variant="outlined"
                v-model="formData.coalHz"
                type="number"
                min="0"
                max="50"
            ></v-text-field>
            <v-text-field
                class="inputs"
                label="Kömür Miktarı (gr)"
                variant="outlined"
                v-model="formData.coalAmount"
                type="number"
                min="0"
            ></v-text-field>
            <v-text-field
                class="inputs"
                label="Ağır Mineral Frekans (Hz)"
                variant="outlined"
                v-model="formData.heavyMineralHz"
                type="number"
                min="0"
                max="50"
            ></v-text-field>
            <v-text-field
                class="inputs"
                label="Ağır Mineral Miktarı (gr)"
                variant="outlined"
                v-model="formData.heavyMineralAmount"
                type="number"
                min="0"
            ></v-text-field>
        </div>
        <div class="first">
            <v-text-field
                class="inputs"
                label="Baca Fan (Hz)"
                variant="outlined"
                v-model="formData.flueFan"
                type="number"
                min="0"
                max="50"
            ></v-text-field>
            <v-text-field
                class="inputs"
                label="Fırın Hız (Hz)"
                variant="outlined"
                v-model="formData.kilnSpeed"
                type="number"
                min="0"
                max="50"
            ></v-text-field>
            <v-text-field
                class="inputs"
                label="Sıcaklık (°C)"
                variant="outlined"
                v-model="formData.temp"
                type="number"
                min="0"
            ></v-text-field>
            <v-select
                class="inputs"
                label="Yanma Puanı"
                :items="selectOptions"
                v-model="formData.score"
                variant="solo"
            >
            </v-select>
        </div>
        <div class="second pr-3">
            <v-btn color="blue-darken-3 mr-3" width="100px" @click="reset()"
                >Temizle</v-btn
            >
            <v-btn
                :disabled="!addButtonState && !buttonState"
                :loading="addButtonState"
                color="blue-darken-4"
                width="100px"
                @click="save()"
                >{{ formData.id ? "Değiştir" : "Ekle" }}</v-btn
            >
        </div>
        <v-data-table
            :headers="headers"
            :items="items"
            :items-per-page="10"
            class="elevation-1 mt-8"
        >
            <template v-slot:item.dateTime="{ item }">
                <span>{{ parseDate(item.raw) }}</span>
            </template>
            <template v-slot:item.coalHz="{ item }">
                <span>{{ item.raw.coalHz }}</span>
                <span class="suffix">Hz</span>
            </template>
            <template v-slot:item.calculatedCoal="{ item }">
                <span>{{ item.raw.calculatedCoal }}</span>
                <span class="suffix">kg/saat</span>
            </template>
            <template v-slot:item.heavyMineralHz="{ item }">
                <span>{{ item.raw.heavyMineralHz }}</span>
                <span class="suffix">Hz</span>
            </template>
            <template v-slot:item.calculatedHeavyMinerals="{ item }">
                <span>{{ item.raw.calculatedHeavyMinerals }}</span>
                <span class="suffix">kg/saat</span>
            </template>
            <template v-slot:item.ratio="{ item }">
                <span>{{ "% " + item.raw.ratio }}</span>
            </template>
            <template v-slot:item.flueFan="{ item }">
                <span>{{ item.raw.flueFan }}</span>
                <span v-if="item.raw.flueFan != null" class="suffix">Hz</span>
            </template>
            <template v-slot:item.kilnSpeed="{ item }">
                <span>{{ item.raw.kilnSpeed }}</span>
                <span v-if="item.raw.kilnSpeed != null" class="suffix">Hz</span>
            </template>
            <template v-slot:item.temp="{ item }">
                <span>{{ item.raw.temp }}</span>
                <span v-if="item.raw.temp != null" class="suffix">°C</span>
            </template>
            <template v-slot:item.score="{ item }">
                <span>{{ getSelectOptionTitle(item.raw.score) }}</span>
            </template>
            <template v-slot:item.actions="{ item }">
                <!-- <v-icon size="small" class="me-2" @click="editItem(item.raw)">
                    mdi-pencil
                </v-icon> -->
                <v-icon size="small" @click="deleteItem(item.raw)">
                    mdi-delete
                </v-icon>
            </template>
        </v-data-table>
    </div>
</template>

<script>
import { reactive, computed, watch } from "vue";
import { useStore } from "vuex";
import { VDataTable } from "vuetify/lib/labs/components";
import moment from "moment";
export default {
    components: { VDataTable },
    setup() {
        const store = useStore();

        const headers = [
            { title: "Tarih", key: "dateTime", align: "start" },
            { title: "Kömür (Hz)", key: "coalHz", align: "start" },
            { title: "Kömür (kg/saat)", key: "calculatedCoal", align: "start" },
            { title: "Mineral (Hz)", key: "heavyMineralHz", align: "start" },
            {
                title: "Mineral (kg/saat)",
                key: "calculatedHeavyMinerals",
                align: "start",
            },
            { title: "Oran", key: "ratio", align: "start" },
            { title: "Fan (Hz)", key: "flueFan", align: "start" },
            { title: "Fırın Hız (Hz)", key: "kilnSpeed", align: "start" },
            { title: "Sıcaklık", key: "temp", align: "start" },
            { title: "Yanma", key: "score", align: "start" },
            { title: "", key: "actions" },
        ];

        let formData = reactive({
            id: null,
            dateTime: null,
            coalHz: null,
            coalAmount: null,
            calculatedCoal: null,
            heavyMineralHz: null,
            heavyMineralAmount: null,
            calculatedHeavyMinerals: null,
            ratio: null,
            flueFan: null,
            kilnSpeed: null,
            temp: null,
            score: null,
        });

        const items = computed(() =>
            store.state.heavyMineralsProcess.reducerFeedingData.sort(
                (a, b) => new Date(b.dateTime) - new Date(a.dateTime)
            )
        );

        const selectOptions = [
            { title: "Tehlikeli", value: 5 },
            { title: "Çok", value: 4 },
            { title: "Normal", value: 3 },
            { title: "Kötü", value: 2 },
            { title: "Çok Kötü", value: 1 },
            { title: "Yanmıyor", value: 0 },
        ];

        const getSelectOptionTitle = (val) => {
            return selectOptions.find((itm) => itm.value == val)?.title || null;
        };

        store.dispatch("heavyMineralsProcess/getReducerFeedingData");

        const ratio = computed(() => {
            return (
                +(
                    (formData.calculatedCoal /
                        formData.calculatedHeavyMinerals) *
                    100
                ).toFixed(1) || null
            );
        });

        const parseDate = (item) => {
            return moment(item.dateTime).format("LLL");
        };

        watch(
            () => formData.coalAmount,
            (val) => {
                if (val >= 0) {
                    formData.calculatedCoal = (val * 60) / 1000;
                }
            }
        );

        watch(
            () => formData.heavyMineralAmount,
            (val) => {
                if (val >= 0) {
                    formData.calculatedHeavyMinerals =
                        ((val / 20) * 3600) / 1000;
                }
            }
        );

        watch(
            () => formData.calculatedCoal,
            (val) => {
                if (
                    val != 0 &&
                    val != null &&
                    formData.calculatedHeavyMinerals != 0 &&
                    formData.calculatedHeavyMinerals != null
                ) {
                    formData.ratio = +(
                        (val / formData.calculatedHeavyMinerals) *
                        100
                    ).toFixed(1);
                } else {
                    formData.ratio = null;
                }
            }
        );

        watch(
            () => formData.calculatedHeavyMinerals,
            (val) => {
                if (
                    val != 0 &&
                    val != null &&
                    formData.calculatedCoal != 0 &&
                    formData.calculatedCoal != null
                ) {
                    formData.ratio = +(
                        (formData.calculatedCoal / val) *
                        100
                    ).toFixed(1);
                } else {
                    formData.ratio = null;
                }
            }
        );

        const addButtonState = computed(
            () =>
                store.state.heavyMineralsRawMaterials.buttons.coalAddButtonState
        );
        const buttonState = computed(() => {
            if (formData.dateTime == null) return false;
            if (formData.coalHz == null) return false;
            if (formData.heavyMineralHz == null) return false;
            if (formData.coalHz < 1) return false;
            if (formData.heavyMineralHz < 1) return false;
            if (formData.coalHz > 50) return false;
            if (formData.heavyMineralHz > 50) return false;
            if (formData.coalAmount == null) return false;
            if (formData.heavyMineralAmount == null) return false;
            if (formData.coalAmount < 0) return false;
            if (formData.heavyMineralAmount < 0) return false;
            if (formData.flueFan < 0) return false;
            if (formData.kilnSpeed < 0) return false;
            if (formData.temp < 0) return false;
            if (formData.score < 0) return false;
            return true;
        });

        const reset = () => {};

        const save = () => {
            let obj = {
                dateTime: formData.dateTime,
                coalHz: formData.coalHz,
                calculatedCoal: formData.calculatedCoal,
                heavyMineralHz: formData.heavyMineralHz,
                calculatedHeavyMinerals: formData.calculatedHeavyMinerals,
                ratio: formData.ratio,
                flueFan: formData.flueFan,
                kilnSpeed: formData.kilnSpeed,
                temp: formData.temp,
                score: formData.score,
            };
            store.dispatch("heavyMineralsProcess/addReducerFeedingData", obj);
        };

        const editItem = (item) => {};

        const deleteItem = (item) => {
            if (confirm("Silmek istediğinize emin misiniz?")) {
                store.dispatch(
                    "heavyMineralsProcess/deleteReducerFeedingData",
                    item.id
                );
            }
        };

        return {
            formData,
            ratio,
            reset,
            save,
            parseDate,
            editItem,
            deleteItem,
            buttonState,
            addButtonState,
            headers,
            items,
            selectOptions,
            getSelectOptionTitle,
        };
    },
};
</script>

<style scoped>
.hm_production_container {
    width: 100%;
    height: max-content;
    overflow: auto;
    padding: 10px;
}
.first {
    display: flex;
    align-items: center;
    justify-content: space-around;
    max-width: 100%;
}
.inputs {
    width: 100%;
    margin-inline: 10px;
}

.second {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-right: 10px;
}

.suffix {
    margin-inline: 3px;
    font-size: 0.8rem;
    color: grey;
}

@media screen and (max-width: 600px) {
    .first {
        flex-direction: column;
    }
    .inputs {
        width: 100%;
    }
}
</style>
