<template>
    <div class="fuelRatios" :style="{ width }">
        <div class="sliderContainer mb-5">
            <div class="d-flex align-center mb-5">
                <v-icon
                    class="mr-2"
                    icon="mdi-gas-station"
                    size="x-large"
                ></v-icon>
                <span>Kuvars <b>Mazot</b> Kullanım Oranı</span>
            </div>
            <div class="amountByDuration mb-4">
                <input
                    class="activationCheck mr-5"
                    type="checkbox"
                    v-model="activeInputs"
                />
                <v-text-field
                    class="mr-5"
                    style="max-width: 40% !important"
                    label="Toplam Miktar (litre)"
                    density="compact"
                    variant="outlined"
                    type="number"
                    hide-details
                    v-model="fuelAmount"
                    min="0"
                    :disabled="!activeInputs"
                ></v-text-field>
                <v-combobox
                    style="max-width: 30% !important"
                    label="Süre"
                    :items="['Ay', '6 Ay', 'Yıl']"
                    density="compact"
                    variant="outlined"
                    hide-details
                    v-model="amountDuration"
                    :disabled="!activeInputs"
                ></v-combobox>
            </div>
            <v-slider
                class="slider"
                v-model="fuelQuartzRatio"
                :min="0"
                :max="100"
                :step="1"
                color="blue-darken-4"
            >
                <template v-slot:append>
                    <span style="width: 50px"> % {{ fuelQuartzRatio }} </span>
                </template>
            </v-slider>
            <div class="text-caption mb-5 ml-1">
                {{ quartzUsageCost.toLocaleString("tr") + " TL" }}
            </div>
        </div>
        <div class="sliderContainer">
            <div
                class="d-flex align-center"
                :class="fuelDistributorCheck ? 'mb-5' : 'mb-2'"
            >
                <input
                    type="checkbox"
                    class="activationCheck mr-2"
                    v-model="fuelDistributorCheck"
                />
                <v-icon
                    class="mr-2"
                    icon="mdi-gas-station"
                    size="x-large"
                ></v-icon>
                <span>Kuvars <b>Mazot</b> Dağılımı</span>
            </div>
            <div v-show="fuelDistributorCheck">
                <div class="sliderRow">
                    <label>Yıkama</label>
                    <v-slider
                        v-model="fuelQuartzSubRatio.washing"
                        :min="0"
                        :max="100"
                        :step="1"
                        color="blue-darken-4"
                        hide-details
                    >
                        <template v-slot:append>
                            <span style="width: 50px">
                                % {{ fuelQuartzSubRatio.washing }}
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
                        v-model="fuelQuartzSubRatio.crushing"
                        :min="0"
                        :max="100"
                        :step="1"
                        color="blue-darken-4"
                        hide-details
                    >
                        <template v-slot:append>
                            <span style="width: 50px">
                                % {{ fuelQuartzSubRatio.crushing }}
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
                        v-model="fuelQuartzSubRatio.screening"
                        :min="0"
                        :max="100"
                        :step="1"
                        color="blue-darken-4"
                        hide-details
                    >
                        <template v-slot:append>
                            <span style="width: 50px">
                                % {{ fuelQuartzSubRatio.screening }}
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
                        v-model="fuelQuartzSubRatio.grinding"
                        :min="0"
                        :max="100"
                        :step="1"
                        color="blue-darken-4"
                        hide-details
                    >
                        <template v-slot:append>
                            <span style="width: 50px">
                                % {{ fuelQuartzSubRatio.grinding }}
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

        const activeInputs = ref(true);
        const fuelDistributorCheck = ref(true);
        const fuelAmount = ref(null);
        const amountDuration = ref(null);
        const fuelData = ref(null);
        const fuelQuartzRatio = ref(null);
        const fuelQuartzSubRatio = reactive({
            washing: null,
            crushing: null,
            screening: null,
            grinding: null,
        });

        store
            .dispatch("bills/getFuelDataByDateRange", {
                startDate: "2023-01-01",
                endDate: "2023-10-29",
            })
            .then((result) => {
                if (result.state) {
                    fuelData.value = result.data;
                    console.log("fuelData", fuelData.value);
                }
            });

        const fuelTotalCost = computed(() => {
            return (
                parseFloat(fuelAmount.value) *
                parseFloat(fuelData.value?.unit_price_vat)
            );
        });

        const quartzUsageCost = computed(() => {
            if (activeInputs) {
                return (fuelTotalCost.value * fuelQuartzRatio.value) / 100;
            } else {
                if (fuelData.value?.total_price_vat) {
                    return (
                        (parseFloat(fuelData.value.total_price_vat) *
                            fuelQuartzRatio.value) /
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
                    (quartzUsageCost.value * fuelQuartzSubRatio.washing) / 100
                );
            } else {
                return 0;
            }
        });

        const crushingUsageCost = computed(() => {
            if (quartzUsageCost) {
                return (
                    (quartzUsageCost.value * fuelQuartzSubRatio.crushing) / 100
                );
            } else {
                return 0;
            }
        });

        const screeningUsageCost = computed(() => {
            if (quartzUsageCost) {
                return (
                    (quartzUsageCost.value * fuelQuartzSubRatio.screening) / 100
                );
            } else {
                return 0;
            }
        });

        const grindingUsageCost = computed(() => {
            if (quartzUsageCost) {
                return (
                    (quartzUsageCost.value * fuelQuartzSubRatio.grinding) / 100
                );
            } else {
                return 0;
            }
        });

        watch(
            () => fuelAmount.value,
            (val) => {
                if (amountDuration.value != null) {
                    emit("result", {
                        value: val,
                        duration: amountDuration.value,
                    });
                }
            }
        );

        watch(
            () => amountDuration.value,
            (val) => {
                if (fuelAmount.value != null) {
                    emit("result", {
                        value: fuelAmount.value,
                        duration: val,
                    });
                }
            }
        );

        return {
            fuelQuartzRatio,
            fuelQuartzSubRatio,
            quartzUsageCost,
            washingUsageCost,
            crushingUsageCost,
            screeningUsageCost,
            grindingUsageCost,
            activeInputs,
            fuelAmount,
            amountDuration,
            fuelDistributorCheck,
        };
    },
};
</script>

<style lang="scss" scoped>
.fuelRatios {
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
