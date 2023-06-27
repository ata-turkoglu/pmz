<template>
    <div class="container">
        <div class="first mt-5">
            <v-text-field
                class="inputs"
                label="Tarih"
                type="datetime-local"
                variant="outlined"
                v-model="formData.dateTime"
            ></v-text-field>
            <v-text-field
                class="inputs"
                label="Kömür Frekans"
                variant="outlined"
                v-model="formData.coalHz"
            ></v-text-field>
            <v-text-field
                class="inputs"
                label="Kömür Miktarı"
                variant="outlined"
                v-model="formData.coalAmount"
            ></v-text-field>
            <v-text-field
                class="inputs"
                label="Ağır Mineral Frekans"
                variant="outlined"
                v-model="formData.heavyMineralHz"
            ></v-text-field>
            <v-text-field
                class="inputs"
                label="Ağır Mineral Miktarı"
                variant="outlined"
                v-model="formData.heavyMineralAmount"
            ></v-text-field>
        </div>
    </div>
</template>

<script>
import { reactive, computed, watch } from "vue";
import moment from "moment";
export default {
    setup() {
        let formData = reactive({
            id: null,
            dateTime: null,
            selectedShift: null,
            coalHz: null,
            coalAmount: null,
            heavyMineralHz: null,
            heavyMineralAmount: null,
        });

        return { formData };
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
