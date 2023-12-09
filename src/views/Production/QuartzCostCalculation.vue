<template>
    <div class="costCalculation">
        <div
            class="mb-10 d-flex"
            :style="display.xs ? 'flex-direction:column' : ''"
        >
            <v-text-field
                variant="outlined"
                density="compact"
                style="width: 300px"
                label="Toplam Üretim (Ton)"
                v-model="producted"
                hide-details
                type="number"
                class="mr-5 mb-5"
            ></v-text-field>
            <v-combobox
                label="Süre"
                class="mr-5 mb-5"
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
                class="mr-5 mb-5"
                style="width: 100px"
                label="Euro"
                v-model="currency.euro"
                hide-details
                type="number"
            ></v-text-field>
            <v-text-field
                variant="outlined"
                density="compact"
                class="mr-5 mb-5"
                style="width: 100px"
                label="Dolar"
                v-model="currency.dollar"
                hide-details
                type="number"
            ></v-text-field>
            <v-text-field
                variant="outlined"
                density="compact"
                style="width: 200px"
                label="Kuvars Personel Gideri (TL)"
                v-model="personnelExpenses"
                hide-details
                type="number"
                class="mr-5 mb-5"
            ></v-text-field>
        </div>
        <div
            class="mb-10 d-flex"
            :style="display.xs ? 'flex-direction:column' : ''"
        >
            <v-text-field
                variant="outlined"
                density="compact"
                style="width: 150px"
                label="Hammadde Fiyat (TL)"
                v-model="rawMaterialPrice"
                hide-details
                type="number"
                class="mr-5 mb-5"
            ></v-text-field>
            <v-text-field
                variant="outlined"
                density="compact"
                style="width: 150px"
                label="Kayıp Oranı (%)"
                v-model="lossRate"
                hide-details
                type="number"
                class="mr-5 mb-5"
            ></v-text-field>
        </div>
        <div
            class="distributors"
            :style="display.xs ? 'flex-direction:column' : ''"
        >
            <ElectricityDistribution
                :width="'30%'"
                :duration="productionDuration"
                @result="setElectricityCost"
                class="mb-10"
            />
            <FuelDistribution
                :width="'30%'"
                :duration="productionDuration"
                @result="fuelCost"
                class="mb-10"
            />
            <MaintenanceDistribution
                :width="'30%'"
                :duration="productionDuration"
                @result="maintenanceCost"
                class="mb-10"
            />
        </div>
        <div class="my-8">
            <span>
                <b> Üretim Maliyeti: </b>
                {{ costPerProduction.toFixed(2).toLocaleString("tr") }}
                TL/ton
            </span>
            <br />
            <span>
                <b> Personel Gideri: </b>
                {{ personnelExpensesPerTon.toFixed(2).toLocaleString("tr") }}
                TL/ton
            </span>
            <br />
            <span>
                <b>Bilye: </b>
                {{
                    millBallCost != null
                        ? millBallCost.toFixed(2).toLocaleString("tr")
                        : 0
                }}
                TL/ton
            </span>
        </div>
        <div
            class="productCostByPackaging"
            :style="display.xs ? 'flex-direction:column' : ''"
        >
            <div class="productTypes" :style="display.xs ? 'width:100%' : ''">
                <span><h2>Eleme</h2></span>
                <v-text-field
                    variant="outlined"
                    density="compact"
                    style="width: 200px"
                    label="Ek Maliyetler(TL)"
                    v-model="extraScreeningCost"
                    hide-details
                    type="number"
                    class="mt-5 mb-5"
                ></v-text-field>
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
            <div class="productTypes" :style="display.xs ? 'width:100%' : ''">
                <span style="width: fit-content"><h2>Öğütme</h2></span>
                <v-text-field
                    variant="outlined"
                    density="compact"
                    style="width: 200px"
                    label="Ek Maliyetler(TL)"
                    v-model="extraGrindingCost"
                    hide-details
                    type="number"
                    class="mt-5 mb-5"
                ></v-text-field>
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
                                    operatingExpenses.grinding +
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
                                    operatingExpenses.grinding +
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
                                    operatingExpenses.grinding +
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
import { useDisplay } from "vuetify/lib/framework.mjs";
export default {
    components: {
        ElectricityDistribution,
        FuelDistribution,
        MaintenanceDistribution,
    },
    setup() {
        const store = useStore();

        const display = ref(useDisplay());

        const currency = reactive({
            /* euro: null,
            dollar: null, */
            euro: 31,
            dollar: 28,
        });

        const millBallCost = ref(null);

        //const producted = ref(null);
        const producted = ref(40000);
        const productionDuration = ref(null);

        const personnelExpenses = ref(6000000);
        const extraScreeningCost = ref(0);
        const extraGrindingCost = ref(0);

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

        const personnelExpensesPerTon = computed(() => {
            return personnelExpenses.value / parseFloat(producted.value);
        });

        const totalMainCost = computed(() => {
            return (
                costs.electricity +
                    costs.fuel +
                    costs.maintenance +
                    personnelExpensesPerTon.value || 0
            );
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
                screening:
                    extraScreeningCost.value == ""
                        ? costPerProduction.value
                        : costPerProduction.value +
                          parseFloat(extraScreeningCost.value),
                grinding:
                    extraGrindingCost.value == ""
                        ? costPerProduction.value + millBallCost.value
                        : costPerProduction.value +
                          millBallCost.value +
                          parseFloat(extraGrindingCost.value),
            };
        });

        store
            .dispatch("quartzProduction/getBallConsumptionByDateRange", {
                startDate: "2023-01-01",
                endDate: "2023-12-31",
            })
            .then(async (state) => {
                if (state) {
                    millBallCost.value = await calculateTotal();
                }
            });

        const calculateTotal = async () => {
            let totalProducedByDateRange = 0;
            let totalConsumptionByDateRange = 0;
            await store.getters[
                "quartzProduction/getBallConsumptionDataByDate"
            ].forEach((item) => {
                totalProducedByDateRange += item.totalProduced;
                totalConsumptionByDateRange += parseFloat(
                    item.totalDailyBallConsumption
                );
            });
            const avarageConsumptionByProduced =
                totalConsumptionByDateRange / totalProducedByDateRange;
            const ballPriceForeign = parseFloat(
                store.state.quartzProduction.purchasedMillBalls[0]
                    .foreign_unit_price
            );
            const costByProduced =
                avarageConsumptionByProduced *
                ballPriceForeign *
                currency.dollar;
            return parseFloat(costByProduced);
        };

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
            millBallCost,
            display,
            personnelExpenses,
            personnelExpensesPerTon,
            extraScreeningCost,
            extraGrindingCost,
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
