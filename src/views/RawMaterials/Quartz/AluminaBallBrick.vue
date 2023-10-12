<template>
    <div class="quartzPurchasedBallBrick">
        <div class="quartzPurchasedBallBrick_content">
            <span style="font-size: 1.3rem" class="mb-8">
                <b>Alumina Bilya - Tuğla</b>
            </span>
            <v-file-input
                label="Excel Yükle"
                variant="outlined"
                accept=".xlsx"
                class="quartzPurchasedBallBrick_content_file-input"
                @change="fileAdded"
            ></v-file-input>
            <span v-if="lastDate != null">
                En Son Eklenen Tarih:
                {{ lastDate }}
            </span>
            <VueDatePicker
                v-if="excelFile != null"
                :min-date="minDate"
                :disabled="excelFile == null"
                ref="vDatePicker"
                class="datepicker ml-5 mt-5"
                v-model="selectedDate"
                position="left"
                :format="vdpInputFormat"
                placeholder="Tarih Seç"
            >
                <template #action-select>
                    <p class="vdp-select" @click="selectDate">Seç</p>
                </template>
            </VueDatePicker>
            <v-btn
                v-if="excelFile != null"
                :disabled="excelFile == null"
                class="mt-5"
                @click="checkFile"
            >
                Check
            </v-btn>
            <table class="excelTable" v-if="tableState">
                <thead class="thead">
                    <tr>
                        <th>Tarih</th>
                        <th>Firma</th>
                        <th>Ürün</th>
                        <th>Boyut</th>
                        <th>Miktar (kg)</th>
                        <th>Birim Fiyat</th>
                        <th>Tutar</th>
                        <th>Döviz Cinsi</th>
                        <th>Döviz Kuru</th>
                        <th>Birim Fiyat (Döviz)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="bodyRow">
                        <td>{{ data.invoice_date }}</td>
                        <td>{{ data.supplier }}</td>
                        <td>{{ data.material }}</td>
                        <td>{{ data.material_attribute }}</td>
                        <td>{{ data.amount }}</td>
                        <td>{{ data.unit_price }}</td>
                        <td>{{ data.total_price }}</td>
                        <td>{{ data.currency_unit }}</td>
                        <td>{{ data.exchange_rate }}</td>
                        <td>{{ data.foreign_unit_price }}</td>
                    </tr>
                </tbody>
            </table>
            <v-btn
                v-if="tableState"
                :disabled="excelFile == null || selectedDate == null"
                class="mt-5"
                @click="sendData"
            >
                Gönder
            </v-btn>
        </div>
    </div>
</template>

<script>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { useStore } from "vuex";
import { ref } from "vue";
import { read } from "xlsx";
import moment from "moment";
import { watch, computed } from "vue";
export default {
    components: { VueDatePicker },
    setup() {
        const store = useStore();

        const vDatePicker = ref(null);
        const selectedDate = ref(null);
        const excelFile = ref(null);
        const tableState = ref(false);
        const lastDate = ref(null);

        let data = ref(null);
        let dateIndex = null;
        let date = moment().locale("tr");

        const headers = {
            invoice_date: "B",
            supplier: "C",
            material: "E",
            material_attribute: "F",
            amount: "G",
            unit_price: "H",
            total_price: "I",
            exchange_rate: "K",
            foreign_unit_price: "L",
        };

        store
            .dispatch("quartzRawMaterials/getLastPurchasedPackagingDate", {
                facility: [5],
                materials: ["Alumina Bilya", "Alumina Tuğla"],
            })
            .then((result) => {
                if (result.state) {
                    lastDate.value = moment(
                        result.data.invoice_date,
                        "YYYY-MM-DD"
                    )
                        .locale("tr")
                        .format("D MMM YYYY");
                }
            });

        const fileAdded = (e) => {
            excelFile.value = e.target.files[0];
        };

        const checkFile = () => {
            if (excelFile.value != null) {
                let FR = new FileReader();
                FR.readAsArrayBuffer(excelFile.value);
                FR.onload = function (e) {
                    let bytes = new Uint8Array(e.target.result);
                    let wb = read(bytes);

                    let year = date.year();
                    let ws = wb.Sheets[year];

                    let found = "found";
                    let rowIndex = 2;
                    let foundState = false;

                    while (!foundState) {
                        found = ws[`B${rowIndex}`];
                        if (found?.w == dateIndex) {
                            foundState = true;
                        } else if (!found) {
                            alert("Bulunamadı");
                            break;
                        } else {
                            rowIndex++;
                        }
                    }

                    data.value = {
                        facility: 5,
                        invoice_date: ws[headers.invoice_date + rowIndex]?.w,
                        supplier: ws[headers.supplier + rowIndex]?.v,
                        material: ws[headers.material + rowIndex]?.v,
                        material_attribute:
                            ws[headers.material_attribute + rowIndex]?.v,
                        amount: ws[headers.amount + rowIndex]?.v.toFixed(2),
                        unit: "kg",
                        unit_price:
                            ws[headers.unit_price + rowIndex]?.v.toFixed(3),
                        total_price:
                            ws[headers.total_price + rowIndex]?.v.toFixed(2),
                        foreign_unit_price:
                            ws[
                                headers.foreign_unit_price + rowIndex
                            ]?.v.toFixed(2),
                        exchange_rate:
                            ws[headers.exchange_rate + rowIndex]?.v.toFixed(3),
                        currency_unit: "$",
                    };
                    tableState.value = true;
                };
            } else {
            }
        };

        const vdpInputFormat = (date) => {
            return moment(date).format("L");
        };

        const selectDate = () => {
            vDatePicker.value.selectDate();
        };

        const minDate = computed(() => {
            return (
                moment(lastDate.value, "D MMM YYYY")
                    .add(1, "day")
                    .locale("tr")
                    .format() || null
            );
        });

        watch(
            () => selectedDate.value,
            (val) => {
                date = moment(val).locale("tr");
                dateIndex = date.format("M/D/YY");
            }
        );

        const sendData = () => {
            store
                .dispatch("quartzRawMaterials/addConsumableData", data.value)
                .then((res) => {
                    reset();
                    if (res.state) {
                        store
                            .dispatch(
                                "quartzRawMaterials/getLastPurchasedPackagingDate",
                                {
                                    facility: [5],
                                    materials: [
                                        "Alumina Bilya",
                                        "Alumina Tuğla",
                                    ],
                                }
                            )
                            .then((result) => {
                                if (result.state) {
                                    lastDate.value = moment(
                                        result.data.invoice_date,
                                        "YYYY-MM-DD"
                                    )
                                        .locale("tr")
                                        .format("D MMM YYYY");
                                }
                            });
                    }
                });
        };

        const reset = () => {
            selectedDate.value = null;
            tableState.value = false;
            data.value = null;
            dateIndex = null;
            date = null;
        };
        return {
            vDatePicker,
            data,
            fileAdded,
            checkFile,
            sendData,
            selectDate,
            vdpInputFormat,
            selectedDate,
            excelFile,
            tableState,
            lastDate,
            minDate,
        };
    },
};
</script>
<style lang="scss" scoped>
.quartzPurchasedBallBrick {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    @media screen and (max-width: 600px) {
        flex-direction: column;
        min-width: 100%;
        padding: 1rem;
    }

    &_content {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        &_file-input {
            min-width: 400px;
            @media screen and (max-width: 600px) {
                min-width: unset;
                width: 100%;
            }
        }
    }
}
.datepicker {
    width: fit-content;
}

.excelTable {
    margin-top: 20px;
    width: 1000px;
    border: 1px solid grey;
}
thead {
    width: 100%;
}
td {
    border-top: 1px solid grey;
    border-left: 1px solid grey;
    padding-block: 20px;
    text-align: center;
}
th {
    border-left: 1px solid grey;
    min-width: 100px;
    padding-inline: 5px;
}
:is(td, th):first-of-type {
    border-left: none;
}
.vdp-select {
    color: #1565c0;
    cursor: pointer;
    font-weight: 600;
}
</style>
