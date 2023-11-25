<template>
    <div class="costCalculation">
        <div class="mb-10 d-flex">
            <v-text-field
                variant="outlined"
                density="compact"
                style="width: 300px"
                label="Toplam Üretim (Ton)"
                v-model="producted"
                hide-details
                type="number"
            ></v-text-field>
            <v-combobox
                label="Süre"
                class="ml-5 mr-5"
                style="width: 100px"
                variant="outlined"
                density="compact"
                :items="['Ay', '6 Ay', 'Yıl']"
                v-model="productionDuration"
                hide-details
            ></v-combobox>
            <v-text-field
                variant="outlined"
                density="compact"
                class="mr-5"
                style="width: 100px"
                label="Euro"
                v-model="currency.euro"
                hide-details
                type="number"
            ></v-text-field>
            <v-text-field
                variant="outlined"
                density="compact"
                class="mr-5"
                style="width: 100px"
                label="Dolar"
                v-model="currency.dollar"
                hide-details
                type="number"
            ></v-text-field>
        </div>
        <div class="mb-10 d-flex">
            <v-text-field
                variant="outlined"
                density="compact"
                style="width: 150px"
                label="Hammadde Fiyat (TL)"
                v-model="rawMaterialPrice"
                hide-details
                type="number"
                class="mr-5"
            ></v-text-field>
            <v-text-field
                variant="outlined"
                density="compact"
                style="width: 150px"
                label="Kayıp Oranı (%)"
                v-model="lossRate"
                hide-details
                type="number"
            ></v-text-field>
        </div>
        <div class="distributors">
            <ElectricityDistribution
                :width="'30%'"
                :duration="productionDuration"
                @result="setElectricityCost"
            />
            <FuelDistribution
                :width="'30%'"
                :duration="productionDuration"
                @result="fuelCost"
            />
            <MaintenanceDistribution
                :width="'30%'"
                :duration="productionDuration"
                @result="maintenanceCost"
            />
        </div>
        <div class="my-8">
            <span>
                <b>
                    {{ costPerProduction.toFixed(2).toLocaleString("tr") }}
                    TL/ton
                </b>
            </span>
        </div>
        <div class="productCostByPackaging">
            <div class="productTypes">
                <span><h2>Eleme</h2></span>
                <div class="p-type">
                    <h3>Bigbag</h3>
                    <div class="imgContainer">
                        <img src="../../assets/images/packaging/bigbag.png" />
                    </div>
                    <span>
                        <b>Hammadde: </b>
                        {{ rawMaterialCost.toFixed(2).toLocaleString("tr") }}
                        TL/ton
                    </span>
                    <span>
                        <b>Operasyon Giderleri: </b>
                        {{
                            operatingExpenses.screening
                                .toFixed(2)
                                .toLocaleString("tr")
                        }}
                        TL/ton
                    </span>
                    <span>
                        <b>Paketleme: </b>
                        {{
                            bigbagPackagingCostPerTon
                                .toFixed(2)
                                .toLocaleString("tr")
                        }}
                        TL/ton
                    </span>
                    <div class="totalPrice">
                        <span>
                            <b>Toplam: </b>
                            {{
                                (
                                    rawMaterialCost +
                                    operatingExpenses.screening +
                                    bigbagPackagingCostPerTon
                                )
                                    .toFixed(2)
                                    .toLocaleString("tr")
                            }}
                            TL/ton
                        </span>
                    </div>
                </div>
                <div class="p-type">
                    <h3>pp Torba</h3>
                    <div class="imgContainer">
                        <img src="../../assets/images/packaging/ppBag.png" />
                    </div>
                    <span>
                        <b>Hammadde: </b>
                        {{ rawMaterialCost.toFixed(2).toLocaleString("tr") }}
                        TL/ton
                    </span>
                    <span>
                        <b>Operasyon Giderleri: </b>
                        {{
                            operatingExpenses.screening
                                .toFixed(2)
                                .toLocaleString("tr")
                        }}
                        TL/ton
                    </span>
                    <span>
                        <b>Paketleme: </b>
                        {{
                            ppBagPackegingCostPerTon
                                .toFixed(2)
                                .toLocaleString("tr")
                        }}
                        TL/ton
                    </span>
                    <div class="totalPrice">
                        <span>
                            <b>Toplam: </b>
                            {{
                                (
                                    rawMaterialCost +
                                    operatingExpenses.screening +
                                    ppBagPackegingCostPerTon
                                )
                                    .toFixed(2)
                                    .toLocaleString("tr")
                            }}
                            TL/ton
                        </span>
                    </div>
                </div>
            </div>
            <div class="productTypes">
                <span><h2>Öğütme</h2></span>
                <div class="p-type">
                    <h3>Silobas</h3>
                    <div class="imgContainer">
                        <img src="../../assets/images/packaging/silobas.png" />
                    </div>
                    <span>
                        <b>Hammadde: </b>
                        {{ rawMaterialCost.toFixed(2).toLocaleString("tr") }}
                        TL/ton
                    </span>
                    <span>
                        <b>Operasyon Giderleri: </b>
                        {{
                            operatingExpenses.grinding
                                .toFixed(2)
                                .toLocaleString("tr")
                        }}
                        TL/ton
                    </span>
                    <span>
                        <b>Paketleme: </b>
                        0 TL/ton
                    </span>
                    <div class="totalPrice">
                        <span>
                            <b>Toplam: </b>
                            {{
                                (
                                    rawMaterialCost +
                                    operatingExpenses.screening +
                                    0
                                )
                                    .toFixed(2)
                                    .toLocaleString("tr")
                            }}
                            TL/ton
                        </span>
                    </div>
                </div>
                <div class="p-type">
                    <h3>Bigbag</h3>
                    <div class="imgContainer">
                        <img src="../../assets/images/packaging/bigbag.png" />
                    </div>
                    <span>
                        <b>Hammadde: </b>
                        {{ rawMaterialCost.toFixed(2).toLocaleString("tr") }}
                        TL/ton
                    </span>
                    <span>
                        <b>Operasyon Giderleri: </b>
                        {{
                            operatingExpenses.grinding
                                .toFixed(2)
                                .toLocaleString("tr")
                        }}
                        TL/ton
                    </span>
                    <span>
                        <b>Paketleme: </b>
                        {{
                            bigbagPackagingCostPerTon
                                .toFixed(2)
                                .toLocaleString("tr")
                        }}
                        TL/ton
                    </span>
                    <div class="totalPrice">
                        <span>
                            <b>Toplam: </b>
                            {{
                                (
                                    rawMaterialCost +
                                    operatingExpenses.screening +
                                    bigbagPackagingCostPerTon
                                )
                                    .toFixed(2)
                                    .toLocaleString("tr")
                            }}
                            TL/ton
                        </span>
                    </div>
                </div>
                <div class="p-type">
                    <h3>Kraft</h3>
                    <div class="imgContainer">
                        <img src="../../assets/images/packaging/craftBag.png" />
                    </div>
                    <span>
                        <b>Hammadde: </b>
                        {{ rawMaterialCost.toFixed(2).toLocaleString("tr") }}
                        TL/ton
                    </span>
                    <span>
                        <b>Operasyon Giderleri: </b>
                        {{
                            operatingExpenses.grinding
                                .toFixed(2)
                                .toLocaleString("tr")
                        }}
                        TL/ton
                    </span>
                    <span>
                        <b>Paketleme: </b>
                        {{
                            craftBagPackegingCostPerTon
                                .toFixed(2)
                                .toLocaleString("tr")
                        }}
                        TL/ton
                    </span>
                    <div class="totalPrice">
                        <span>
                            <b>Toplam: </b>
                            {{
                                (
                                    rawMaterialCost +
                                    operatingExpenses.screening +
                                    craftBagPackegingCostPerTon
                                )
                                    .toFixed(2)
                                    .toLocaleString("tr")
                            }}
                            TL/ton
                        </span>
                    </div>
                </div>
            </div>
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
import { packagingWeights } from "@/utils/helpers/quartz";
export default {
    components: {
        ElectricityDistribution,
        FuelDistribution,
        MaintenanceDistribution,
    },
    setup() {
        const store = useStore();

        const currency = reactive({
            /* euro: null,
            dollar: null, */
            euro: 31,
            dollar: 28,
        });

        //const producted = ref(null);
        const producted = ref(50000);
        const productionDuration = ref("Yıl");

        const rawMaterialPrice = ref(420);
        const lossRate = ref(3);

        const costs = reactive({
            electricity: null,
            fuel: null,
            maintenance: null,
        });

        const setElectricityCost = (e) => {
            costs.electricity = e.portion;
        };

        const fuelCost = (e) => {
            costs.fuel = e.portion;
        };

        const maintenanceCost = (e) => {
            costs.maintenance = e.portion;
        };

        const totalMainCost = computed(() => {
            return costs.electricity + costs.fuel + costs.maintenance || 0;
        });

        const costPerProduction = computed(() => {
            return totalMainCost.value / parseFloat(producted.value) || 0;
        });

        const bigbagPackagingCostPerTon = computed(() => {
            const data = store.getters["quartzRawMaterials/getLastBigbagData"];
            const weight = packagingWeights.bigbag;
            return (
                (parseFloat(data?.foreign_unit_price) *
                    parseFloat(currency.euro)) /
                    weight || 0
            );
        });

        const craftBagPackegingCostPerTon = computed(() => {
            const cratfData =
                store.getters["quartzRawMaterials/getLastCraftBagData"];
            const palletData =
                store.getters["quartzRawMaterials/getLastPalletData"];
            const weight = packagingWeights.pallet;
            const amount = weight / packagingWeights.craft;
            const craftCost =
                amount *
                parseFloat(cratfData?.foreign_unit_price) *
                parseFloat(currency.euro);
            const palletCost = parseFloat(palletData?.unit_price);
            return (craftCost + palletCost) / weight || 0;
        });

        const ppBagPackegingCostPerTon = computed(() => {
            const ppData = store.getters["quartzRawMaterials/getLastPPBagData"];
            const bigBagData =
                store.getters["quartzRawMaterials/getLastBigbagData"];
            const weight = packagingWeights.bigbag;
            const amount = weight / packagingWeights.pp;
            const ppCost = amount * parseFloat(ppData?.unit_price);
            const bigBagCost =
                parseFloat(bigBagData?.foreign_unit_price) *
                parseFloat(currency.euro);
            return (ppCost + bigBagCost) / weight || 0;
        });

        const rawMaterialCost = computed(() => {
            return (
                parseFloat(rawMaterialPrice.value) /
                (1 - parseFloat(lossRate.value) / 100)
            );
        });

        const operatingExpenses = computed(() => {
            return {
                screening: costPerProduction.value || 0,
                grinding: costPerProduction.value || 0,
            };
        });

        return {
            setElectricityCost,
            fuelCost,
            maintenanceCost,
            producted,
            productionDuration,
            costPerProduction,
            currency,
            bigbagPackagingCostPerTon,
            craftBagPackegingCostPerTon,
            ppBagPackegingCostPerTon,
            operatingExpenses,
            rawMaterialPrice,
            lossRate,
            rawMaterialCost,
        };
    },
};
</script>

<style lang="scss" scoped>
.costCalculation {
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding-bottom: 5rem;
    .distributors {
        width: 100%;
        height: fit-content;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
    }
    .productCostByPackaging {
        width: 100%;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;

        .productTypes {
            width: 48%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            padding: 1rem;

            .p-type {
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: flex-start;
                box-shadow: 0 0 8px -5px grey;
                padding: 1rem;
                margin-block: 0.5rem;

                .imgContainer {
                    width: 100%;
                    height: fit-content;
                    margin-block: 10px;

                    img {
                        width: 100px;
                        height: 100px;
                        object-fit: contain;
                    }
                }
                .totalPrice {
                    border: 1px solid gray;
                    padding-inline: 10px;
                    padding-block: 5px;
                    border-radius: 3px;
                    margin-top: 5px;
                }
            }
        }
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
