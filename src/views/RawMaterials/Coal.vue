<template>
    <div class="coal_container">
        <div class="first mt-5">
            <v-text-field
                class="inputs"
                label="Firma İsmi"
                variant="outlined"
                hint="Boş bırakılamaz"
                persistent-hint
                v-model="formData.companyName"
            ></v-text-field>
            <v-text-field
                class="inputs"
                label="Tarih"
                type="datetime-local"
                variant="outlined"
                hint="Boş bırakılamaz"
                persistent-hint
                v-model="formData.dateTime"
            ></v-text-field>
            <v-text-field
                class="inputs"
                label="Miktar"
                variant="outlined"
                suffix="kg"
                type="Number"
                hint="Boş bırakılamaz"
                persistent-hint
                v-model="formData.amount"
                :max="32767"
                :min="1"
            ></v-text-field>
            <v-text-field
                class="inputs"
                label="Birim Fiyat"
                variant="outlined"
                suffix="ton/TL"
                type="Number"
                v-model="formData.unitPrice"
            ></v-text-field>
            <v-text-field
                class="inputs"
                label="Toplam Fiyat"
                variant="outlined"
                suffix="TL"
                type="Number"
                v-model="formData.totalPrice"
            ></v-text-field>
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
            <template v-slot:item.amount="{ item }">
                <span>{{ item.raw.amount + " kg" }}</span>
            </template>
            <template v-slot:item.unitPrice="{ item }">
                <span>{{ item.raw.unitPrice + " TL" }}</span>
            </template>
            <template v-slot:item.totalPrice="{ item }">
                <span>{{ item.raw.totalPrice + " TL" }}</span>
            </template>
            <template v-slot:item.dateTime="{ item }">
                <span>{{ parseDate(item.raw) }}</span>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon size="small" class="me-2" @click="editItem(item.raw)">
                    mdi-pencil
                </v-icon>
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
            {
                title: "Firma",
                key: "companyName",
                align: "start",
            },
            { title: "Tarih", key: "dateTime", align: "end" },
            { title: "Miktar", key: "amount", align: "end" },
            { title: "Fiyat", key: "unitPrice", align: "end" },
            { title: "Toplam", key: "totalPrice", align: "end" },
            { title: "", key: "actions" },
        ];

        let editMode = false;

        let formData = reactive({
            id: null,
            companyName: null,
            dateTime: null,
            amount: null,
            unitPrice: null,
            totalPrice: null,
        });

        const items = computed(() =>
            store.state.heavyMineralsRawMaterials.coalData.sort(
                (a, b) => new Date(b.dateTime) - new Date(a.dateTime)
            )
        );
        const addButtonState = computed(
            () =>
                store.state.heavyMineralsRawMaterials.buttons.coalAddButtonState
        );
        const buttonState = computed(() => {
            if (formData.companyName == null) return false;
            if (formData.companyName.trim() == "") return false;
            if (formData.amount == null) return false;
            if (formData.amount < 1) return false;
            if (formData.dateTime == null) return false;
            return true;
        });

        const parseDate = (item) => {
            return moment(item.dateTime).format("LLL");
        };

        store.dispatch("heavyMineralsRawMaterials/getCoalData");

        watch(
            () => formData.amount,
            (val) => {
                if (val != null || formData.unitPrice != null) {
                    formData.totalPrice =
                        (formData.amount * formData.unitPrice) / 1000;
                }
            },
            { deep: true }
        );
        watch(
            () => formData.unitPrice,
            (val) => {
                if (val != null || formData.val != null) {
                    formData.totalPrice =
                        (formData.amount * formData.unitPrice) / 1000;
                }
            },
            { deep: true }
        );

        const reset = () => {
            editMode = false;
            formData.id = null;
            formData.companyName = null;
            formData.dateTime = null;
            formData.amount = null;
            formData.unitPrice = null;
            formData.totalPrice = null;
        };

        function editItem(item) {
            editMode = true;
            formData.id = item.id;
            formData.companyName = item.companyName;
            formData.dateTime = moment(item.dateTime).format(
                "YYYY-MM-DDTHH:mm"
            );
            formData.amount = item.amount;
            formData.unitPrice = item.unitPrice;
            formData.totalPrice = item.totalPrice;
        }

        function deleteItem(item) {
            if (confirm("Silmek istediğinize emin misiniz?")) {
                store.dispatch(
                    "heavyMineralsRawMaterials/deleteCoalEntry",
                    item.id
                );
            }
        }

        function save() {
            if (editMode) {
                formData.amount = Number(formData.amount);
                formData.unitPrice = Number(formData.unitPrice);
                formData.totalPrice = Number(formData.totalPrice);
                store.state.heavyMineralsRawMaterials.buttons.addButtonState = false;
                store
                    .dispatch(
                        "heavyMineralsRawMaterials/updateCoalEntry",
                        formData
                    )
                    .then((state) => {
                        if (state) reset();
                    });
            } else {
                formData.amount = Number(formData.amount);
                formData.unitPrice = Number(formData.unitPrice);
                formData.totalPrice = Number(formData.totalPrice);
                store.state.heavyMineralsRawMaterials.buttons.addButtonState = false;
                store
                    .dispatch(
                        "heavyMineralsRawMaterials/addNewCoalEntry",
                        formData
                    )
                    .then((state) => {
                        if (state) reset();
                    });
            }
        }
        return {
            formData,
            addButtonState,
            buttonState,
            headers,
            items,
            parseDate,
            save,
            editItem,
            deleteItem,
            reset,
        };
    },
};
</script>

<style scoped>
.coal_container {
    width: 100%;
    height: fit-content;
    overflow: auto;
    padding: 10px;
}
.first {
    display: flex;
    align-items: center;
    justify-content: space-around;
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

@media screen and (max-width: 600px) {
    .first {
        flex-direction: column;
    }
    .inputs {
        max-width: 100%;
        width: 100%;
    }
}
</style>
