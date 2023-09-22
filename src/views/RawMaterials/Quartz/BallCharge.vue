<template>
    <div class="ballChargePage">
        <div class="selections">
            <v-text-field
                class="inputs"
                label="Tarih"
                variant="solo"
                type="date"
                v-model="selectedDate"
            ></v-text-field>
            <v-select
                label="Değirmen"
                :items="store.state.quartz.ballMills"
                variant="solo"
                item-value="id"
                item-title="name"
                class="inputs"
                v-model="selectedMill"
            ></v-select>
            <v-text-field
                class="inputs"
                label="Çalışma Saati"
                variant="outlined"
                type="number"
                v-model="timer"
            ></v-text-field>
        </div>
        <div class="selections">
            <v-text-field
                class="inputs"
                label="Miktar"
                variant="outlined"
                type="number"
                suffix=" kg"
                hide-details="true"
                v-model="amount"
            ></v-text-field>
            <v-textarea
                label="Notlar"
                variant="outlined"
                class="inputs"
                :class="$vuetify.display.smAndDown ? 'mt-6' : ''"
            ></v-textarea>
        </div>
        <v-row
            class="mt-4"
            :class="$vuetify.display.smAndDown ? 'px-3' : 'px-9'"
            align="center"
            justify="end"
        >
            <v-btn
                class="mr-4"
                color="blue-grey-lighten-5"
                width="100px"
                @click="reset"
            >
                Temizle
            </v-btn>
            <v-btn
                :loading="
                    store.state.quartzRawMaterials.buttons
                        .ballMillChargeSaveButtonLoading
                "
                color="blue-darken-4"
                width="100px"
                @click="save"
                :disabled="!checkValidation()"
                >Kaydet</v-btn
            >
        </v-row>
        <div class="charge-list">
            <v-checkbox
                v-model="showList"
                label="Listeyi göster"
                :disabled="showListDisabled"
            ></v-checkbox>
            <v-data-table
                v-if="showList"
                :headers="headers"
                :items="store.state.quartzRawMaterials.ballCharges"
                class="elevation-1"
                :group-by="groupBy"
                density="compact"
                :items-per-page="-1"
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
                            <b>{{ getMillName(item.value) }}</b>
                            <v-btn
                                size="small"
                                variant="text"
                                :icon="
                                    isGroupOpen(item) ? 'mdi-minus' : 'mdi-plus'
                                "
                                @click="toggleGroup(item)"
                            >
                            </v-btn>
                        </td>
                    </tr>
                </template>
                <template v-slot:item.amount="{ item }">
                    <span>
                        <b>{{ item.raw.amount + " kg" }}</b>
                    </span>
                </template>
                <template v-slot:bottom> </template>
            </v-data-table>
        </div>
    </div>
</template>
<script>
import moment from "moment";
import { ref, watch } from "vue";
import { useStore } from "vuex";
import { VDataTable } from "vuetify/lib/labs/components";
export default {
    components: { VDataTable },
    setup() {
        const store = useStore();

        const selectedDate = ref(null);
        const selectedMill = ref(null);
        const timer = ref(null);
        const amount = ref(null);
        const notes = ref(null);
        const showList = ref(false);
        const showListDisabled = ref(false);

        const headers = [
            { title: "Tarih", align: "end", key: "workday" },
            { title: "Çalışma Saati", align: "end", key: "timer" },
            { title: "Fark", align: "end", key: "timer_diff" },
            { title: "Miktar", align: "end", key: "amount" },
            { title: "Notlar", align: "end", key: "notes" },
        ];

        const groupBy = ref([{ key: "mill" }]);

        const getMillName = (id) => {
            return store.state.quartz.ballMills.find((itm) => itm.id == id)
                .name;
        };

        const checkValidation = () => {
            if (selectedDate.value == null) return false;
            if (selectedMill.value == null) return false;
            if (timer.value == null || timer.value == "") return false;
            if (amount.value == null || amount.value == "") return false;
            return true;
        };

        const reset = () => {
            selectedDate.value = null;
            selectedMill.value = null;
            timer.value = null;
            amount.value = null;
            notes.value = null;
        };

        const save = () => {
            showListDisabled.value = true;
            let data = {
                workday: moment(selectedDate.value).format("YYYY-MM-DD"),
                mill: selectedMill.value,
                timer: timer.value,
                amount: amount.value,
                notes: notes.value,
            };
            store
                .dispatch("quartzRawMaterials/addBallChargeData", data)
                .then((state) => {
                    showListDisabled.value = false;
                });
        };

        watch(
            () => showList.value,
            (val) => {
                if (
                    val &&
                    store.state.quartzRawMaterials.ballCharges.length <= 0
                ) {
                    store.dispatch("quartzRawMaterials/getBallChargeData");
                }
            }
        );
        return {
            store,
            selectedDate,
            selectedMill,
            timer,
            amount,
            notes,
            showList,
            showListDisabled,
            headers,
            save,
            reset,
            checkValidation,
            store,
            groupBy,
            getMillName,
        };
    },
};
</script>

<style lang="scss" scoped>
.ballChargePage {
    width: 100%;
    height: fit-content;
    padding-top: 20px;
    padding-inline: 20px;
    padding-bottom: 50px;

    .selections {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .inputs {
        width: 30%;
        max-width: 30%;
    }
}
.table-td {
    text-align: left;
    width: 100%;
}
@media screen and (max-width: 600px) {
    .ballChargePage {
        padding-inline: 10px;
        .selections {
            flex-direction: column;
        }
        .inputs {
            width: 100%;
            max-width: 100%;
        }
    }
}
</style>
