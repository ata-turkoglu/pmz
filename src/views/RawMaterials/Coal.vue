<template>
    <div class="container">
        <div class="first mt-5">
            <v-text-field
                class="inputs"
                label="Firma İsmi"
                variant="outlined"
                v-model="formData.companyName"
            ></v-text-field>
            <v-text-field
                class="inputs"
                label="Tarih"
                type="datetime-local"
                variant="outlined"
                v-model="formData.dateTime"
            ></v-text-field>
            <v-text-field
                class="inputs"
                label="Miktar"
                variant="outlined"
                suffix="kg"
                type="Number"
                v-model="formData.amount"
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
            <v-btn
                :disabled="addButtonState"
                :loading="addButtonState"
                color="blue-darken-4"
                width="100px"
                @click="save()"
                >Ekle</v-btn
            >
        </div>
        <v-data-table
            :headers="headers"
            :items="items"
            :items-per-page="10"
            class="elevation-1 mt-8"

        >
            <template v-slot:item.actions="{ item }">
                <v-icon size="small" class="me-2" @click="editItem(item.raw)">
                    mdi-pencil
                </v-icon>
                <v-icon size="small" @click="deleteItem(item.raw)">
                    mdi-delete
                </v-icon>
            </template></v-data-table
        >
    </div>
</template>

<script>
import { reactive, computed, watch } from "vue";
import { useStore } from "vuex";
import { VDataTable } from "vuetify/lib/labs/components";
export default {
    components: { VDataTable },
    setup() {
        const store = useStore();

        const headers = [
            {
                title: "Firma",
                key: "company_name",
            },
            { title: "Tarih", key: "acceptance_date" },
            { title: "Miktar", key: "amount" },
            { title: "Fiyat", key: "unit_price" },
            { title: "Toplam", key: "total_price" },
            { title: "", key: "actions" },
        ];

        let formData = reactive({
            companyName: null,
            dateTime: null,
            amount: null,
            unitPrice: null,
            totalPrice: null,
        });

        const items = computed(() => store.state.rawMaterials.coalData);
        const addButtonState = computed(
            () => store.state.rawMaterials.buttons.addButtonState
        );

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

        function save() {
            formData.amount = Number(formData.amount);
            formData.unitPrice = Number(formData.unitPrice);
            formData.totalPrice = Number(formData.totalPrice);
            store.state.rawMaterials.buttons.addButtonState = false;
            store.dispatch("rawMaterials/addNewCoalEntry", formData);
            console.log("save", formData);
        }
        return { formData, addButtonState, headers, items, save };
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
