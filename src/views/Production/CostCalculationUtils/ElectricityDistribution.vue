<template>
    <div class="electricityRatios" :style="{ width }">
        <div class="sliderContainer mb-5">
            <div class="d-flex align-center mb-5">
                <v-icon
                    class="mr-2"
                    icon="mdi-lightning-bolt-outline"
                    size="x-large"
                ></v-icon>
                <span>Kuvars <b>Elektrik</b> Kullanım Oranı</span>
            </div>
            <div class="amountByDuration mb-4">
                <input
                    class="activationCheck mr-5"
                    type="checkbox"
                    v-model="manuelEntryActive"
                />
                <v-text-field
                    class="mr-5"
                    style="max-width: 40% !important"
                    label="Miktar (TL)"
                    density="compact"
                    variant="outlined"
                    type="number"
                    hide-details
                    v-model="costAmount"
                    :disabled="!manuelEntryActive"
                ></v-text-field>
                <v-combobox
                    style="max-width: 30% !important"
                    label="Süre"
                    :items="['Ay', '6 Ay', 'Yıl']"
                    density="compact"
                    variant="outlined"
                    hide-details
                    v-model="amountDuration"
                    :disabled="!manuelEntryActive"
                ></v-combobox>
            </div>
            <v-slider
                class="slider"
                v-model="electrcityBillQuartzRatio"
                :min="0"
                :max="100"
                :step="1"
                color="blue-darken-4"
            >
                <template v-slot:append>
                    <span style="width: 50px">
                        % {{ electrcityBillQuartzRatio }}
                    </span>
                </template>
            </v-slider>
            <div class="text-caption mb-5 ml-1">
                {{ quartzUsageCost.toLocaleString("tr") + " TL" }}
            </div>
        </div>
        <div class="sliderContainer">
            <div
                class="d-flex align-center"
                :class="electricityDistributorCheck ? 'mb-5' : 'mb-2'"
            >
                <input
                    class="activationCheck mr-2"
                    type="checkbox"
                    v-model="electricityDistributorCheck"
                />
                <v-icon
                    class="mr-2"
                    icon="mdi-lightning-bolt-outline"
                    size="x-large"
                ></v-icon>
                <span>Kuvars <b>Elektrik</b> Dağılımı</span>
            </div>
            <div v-show="electricityDistributorCheck">
                <div class="sliderRow">
                    <label>Yıkama</label>
                    <v-slider
                        v-model="electrcityQuartzSubRatio.washing"
                        :min="0"
                        :max="100"
                        :step="1"
                        color="blue-darken-4"
                        hide-details
                    >
                        <template v-slot:append>
                            <span style="width: 50px">
                                % {{ electrcityQuartzSubRatio.washing }}
                            </span>
                        </template>
                    </v-slider>
                </div>
                <div class="text-caption mb-5 ml-2">
                    {{ washingUsageCost.toLocaleString("tr") + " TL" }}
                </div>
                <div class="sliderRow">
                    <label>Kırma</label>
                    <v-slider
                        v-model="electrcityQuartzSubRatio.crushing"
                        :min="0"
                        :max="100"
                        :step="1"
                        color="blue-darken-4"
                        hide-details
                    >
                        <template v-slot:append>
                            <span style="width: 50px">
                                % {{ electrcityQuartzSubRatio.crushing }}
                            </span>
                        </template>
                    </v-slider>
                </div>
                <div class="text-caption mb-5 ml-2">
                    {{ crushingUsageCost.toLocaleString("tr") + " TL" }}
                </div>
                <div class="sliderRow">
                    <label>Eleme</label>
                    <v-slider
                        v-model="electrcityQuartzSubRatio.screening"
                        :min="0"
                        :max="100"
                        :step="1"
                        color="blue-darken-4"
                        hide-details
                    >
                        <template v-slot:append>
                            <span style="width: 50px">
                                % {{ electrcityQuartzSubRatio.screening }}
                            </span>
                        </template>
                    </v-slider>
                </div>
                <div class="text-caption mb-5 ml-2">
                    {{ screeningUsageCost.toLocaleString("tr") + " TL" }}
                </div>
                <div class="sliderRow">
                    <label>Öğütme</label>
                    <v-slider
                        v-model="electrcityQuartzSubRatio.grinding"
                        :min="0"
                        :max="100"
                        :step="1"
                        color="blue-darken-4"
                        hide-details
                    >
                        <template v-slot:append>
                            <span style="width: 50px">
                                % {{ electrcityQuartzSubRatio.grinding }}
                            </span>
                        </template>
                    </v-slider>
                </div>
                <div class="text-caption mb-5 ml-2">
                    {{ grindingUsageCost.toLocaleString("tr") + " TL" }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from "moment";
import { computed, ref, reactive, watch } from "vue";
import { useStore } from "vuex";
export default {
    props: ["width"],
    setup(props, { emit }) {
        const store = useStore();

        const manuelEntryActive = ref(true);
        const electricityDistributorCheck = ref(false);
        const costAmount = ref(null);
        const amountDuration = ref(null);

        const electrcityData = ref(null);
        const electrcityBillQuartzRatio = ref(null);
        const electrcityQuartzSubRatio = reactive({
            washing: null,
            crushing: null,
            screening: null,
            grinding: null,
        });

        store.dispatch("bills/getLastElectricityData").then((result) => {
            if (result.state) {
                electrcityData.value = result.data;
                console.log("electrcityData", electrcityData.value);
            }
        });

        const quartzUsageCost = computed(() => {
            if (manuelEntryActive) {
                if (costAmount.value) {
                    return (
                        (parseFloat(costAmount.value) *
                            electrcityBillQuartzRatio.value) /
                        100
                    );
                } else {
                    return 0;
                }
            } else {
                if (electrcityData.value?.tax_and_total) {
                    return (
                        (parseFloat(electrcityData.value.tax_and_total) *
                            electrcityBillQuartzRatio.value) /
                        100
                    );
                } else {
                    return 0;
                }
            }
        });

        const washingUsageCost = computed(() => {
            if (quartzUsageCost) {
                return (
                    (quartzUsageCost.value * electrcityQuartzSubRatio.washing) /
                    100
                );
            } else {
                return 0;
            }
        });

        const crushingUsageCost = computed(() => {
            if (quartzUsageCost) {
                return (
                    (quartzUsageCost.value *
                        electrcityQuartzSubRatio.crushing) /
                    100
                );
            } else {
                return 0;
            }
        });

        const screeningUsageCost = computed(() => {
            if (quartzUsageCost) {
                return (
                    (quartzUsageCost.value *
                        electrcityQuartzSubRatio.screening) /
                    100
                );
            } else {
                return 0;
            }
        });

        const grindingUsageCost = computed(() => {
            if (quartzUsageCost) {
                return (
                    (quartzUsageCost.value *
                        electrcityQuartzSubRatio.grinding) /
                    100
                );
            } else {
                return 0;
            }
        });

        watch(
            () => costAmount.value,
            (val) => {
                if (amountDuration.value != null && quartzUsageCost.value) {
                    emit("result", {
                        total: parseFloat(val),
                        portion: quartzUsageCost.value,
                        duration: amountDuration.value,
                    });
                }
            }
        );

        watch(
            () => amountDuration.value,
            (val) => {
                if (costAmount.value != null && quartzUsageCost.value != null) {
                    emit("result", {
                        total: parseFloat(costAmount.value),
                        portion: quartzUsageCost.value,
                        duration: val,
                    });
                }
            }
        );

        watch(
            () => quartzUsageCost.value,
            (val) => {
                if (costAmount.value != null && amountDuration.value != null) {
                    emit("result", {
                        total: parseFloat(costAmount.value),
                        portion: val,
                        duration: amountDuration.value,
                    });
                }
            }
        );

        return {
            electrcityBillQuartzRatio,
            electrcityQuartzSubRatio,
            quartzUsageCost,
            washingUsageCost,
            crushingUsageCost,
            screeningUsageCost,
            grindingUsageCost,
            manuelEntryActive,
            costAmount,
            amountDuration,
            electricityDistributorCheck,
        };
    },
};
</script>

<style lang="scss" scoped>
.electricityRatios {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    .sliderContainer {
        min-width: 300px;
        width: 100%;
        padding: 1rem 1rem 0.5rem 1rem;
        box-shadow: 0 0 13px -3px rgb(200, 200, 200);
        border-radius: 5px;
        background-color: #f7f7f7;

        .amountByDuration {
            display: flex;
            align-items: center;
            justify-content: flex-start;
        }
        .activationCheck {
            cursor: pointer;
            accent-color: #0d47a1;
        }

        .sliderRow {
            display: flex;
            align-items: center;

            label {
                width: 80px;
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
