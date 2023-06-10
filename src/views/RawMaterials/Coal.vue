<template>
    <div class="container">
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
            },
            { title: "Tarih", key: "dateTime" },
            { title: "Miktar", key: "amount" },
            { title: "Fiyat", key: "unitPrice" },
            { title: "Toplam", key: "totalPrice" },
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
            store.state.rawMaterials.coalData.sort(
                (a, b) => new Date(b.dateTime) - new Date(a.dateTime)
            )
        );
        const addButtonState = computed(
            () => store.state.rawMaterials.buttons.coalAddButtonState
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

        store.dispatch("rawMaterials/getCoalData");

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
            console.log(item);
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
            confirm("Silmek istediğinize emin misiniz?");
            if (confirm) {
                store.dispatch("rawMaterials/deleteCoalEntry", item.id);
            }
        }

        function save() {
            if (editMode) {
                formData.amount = Number(formData.amount);
                formData.unitPrice = Number(formData.unitPrice);
                formData.totalPrice = Number(formData.totalPrice);
                store.state.rawMaterials.buttons.addButtonState = false;
                store
                    .dispatch("rawMaterials/updateCoalEntry", formData)
                    .then((state) => {
                        //if (state) reset();
                    });
            } else {
                formData.amount = Number(formData.amount);
                formData.unitPrice = Number(formData.unitPrice);
                formData.totalPrice = Number(formData.totalPrice);
                store.state.rawMaterials.buttons.addButtonState = false;
                store
                    .dispatch("rawMaterials/addNewCoalEntry", formData)
                    .then((state) => {
                        //if (state) reset();
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
.container {
    width: 100%;
    height: 100%;
    padding: 10px;
}
.first {
    display: flex;
    align-items: center;
    justify-content: space-around;
}
.inputs {
    max-width: 30%;
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
