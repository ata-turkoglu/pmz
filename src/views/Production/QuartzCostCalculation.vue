<template>
    <div class="costCalculation">
        <div class="mb-10 d-flex">
            <v-text-field
                variant="outlined"
                density="compact"
                style="width: 300px"
                label="Toplam Üretim"
                hide-details
            ></v-text-field>
            <v-combobox
                label="Süre"
                class="ml-5"
                style="width: 100px"
                variant="outlined"
                density="compact"
                :items="['Ay', '6 Ay', 'Yıl']"
                hide-details
            ></v-combobox>
        </div>
        <div class="distributors">
            <ElectricityDistribution :width="'30%'" @result="electricityCost" />
            <FuelDistribution :width="'30%'" @result="fuelCost" />
            <MaintenanceDistribution :width="'30%'" @result="maintenanceCost" />
        </div>
    </div>
</template>

<script>
import moment from "moment";
import { computed, ref, watch, reactive } from "vue";
import { useStore } from "vuex";
import ElectricityDistribution from "./CostCalculationUtils/ElectricityDistribution.vue";
import FuelDistribution from "./CostCalculationUtils/FuelDistribution.vue";
import MaintenanceDistribution from "./CostCalculationUtils/MaintenanceDistribution.vue";
export default {
    components: {
        ElectricityDistribution,
        FuelDistribution,
        MaintenanceDistribution,
    },
    setup() {
        const store = useStore();

        const electricityCost = (e) => {
            console.log("electricityCost", e);
        };

        const fuelCost = () => {};

        const maintenanceCost = () => {};

        return {
            electricityCost,
            fuelCost,
            maintenanceCost,
        };
    },
};
</script>

<style lang="scss" scoped>
.costCalculation {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    .distributors {
        width: 100%;
        height: fit-content;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
    }
}

/* Chrome, Safari, Edge, Opera */
::v-deep .v-field__input {
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    /* Firefox */
    input[type="number"] {
        -moz-appearance: textfield;
    }
}
</style>
