<template>
    <div class="quartzPurchasedBallBrick">
        <div class="quartzPurchasedBallBrick_content">
            <span style="font-size: 1.3rem" class="mb-8">
                <b>Elektrik Faturası</b>
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
                month-picker
                locale="tr"
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
                        <th>Gündüz</th>
                        <th>Puant</th>
                        <th>Gece</th>
                        <th>Toplam (kwh)</th>
                        <th>Birim Fiyat</th>
                        <th>Tutar</th>
                        <th>Dağıtım Bedeli</th>
                        <th>Toplam</th>
                        <th>Vergi</th>
                        <th>Matrah</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="bodyRow">
                        <td>{{ data.date }}</td>
                        <td>{{ data.daytime }}</td>
                        <td>{{ data.evening }}</td>
                        <td>{{ data.night }}</td>
                        <td>{{ data.amount }}</td>
                        <td>{{ data.unit_price }}</td>
                        <td>{{ data.usage_fee }}</td>
                        <td>{{ data.distrubtion_fee }}</td>
                        <td>{{ data.total_price }}</td>
                        <td>{{ data.tax }}</td>
                        <td>{{ data.tax_and_total }}</td>
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
        let date = moment().locale("tr");

        const headers = {
            invoice_date: "A",
            daytime: "F",
            evening: "F",
            night: "F",
            amount: "F",
            unit_price: "G",
            usage_fee: "H",
            distrubtion_fee: "H",
            total_price: "I",
            tax: "K",
            tax_and_total: "L",
        };

        const months = [2, 6, 10, 14, 18, 22, 26, 30, 34, 38, 42, 46];

        const getLastDate = () => {
            store.dispatch("bills/getLastElectricityData").then((result) => {
                if (result.state) {
                    lastDate.value = result.data?.invoice_date
                        ? moment(result.data.invoice_date, "YYYY-MM-DD")
                              .locale("tr")
                              .format("MMMM YYYY")
                        : null;
                }
            });
        };

        getLastDate();

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

                    let ws = wb.Sheets["TRAFO SAYAÇ ELEKTRİK KULLANIMI"];

                    let ndate = moment();
                    let monthRow = months[date.month()];

                    ndate.set({
                        year: selectedDate.value.year,
                        month: selectedDate.value.month,
                        date: 15,
                    });

                    data.value = {
                        invoice_date: ndate.format("YYYY-MM-DD"),
                        date: ws[headers.invoice_date + monthRow]?.v,
                        daytime: ws[headers.daytime + monthRow]?.v.toFixed(3),
                        evening:
                            ws[headers.evening + (monthRow + 1)]?.v.toFixed(3),
                        night: ws[headers.night + (monthRow + 2)]?.v.toFixed(3),
                        amount: ws[headers.amount + (monthRow + 3)]?.v.toFixed(
                            3
                        ),
                        unit_price:
                            ws[headers.unit_price + monthRow]?.v.toFixed(3),
                        usage_fee:
                            ws[headers.usage_fee + monthRow]?.v.toFixed(3),
                        distrubtion_fee:
                            ws[
                                headers.distrubtion_fee + (monthRow + 3)
                            ]?.v.toFixed(3),
                        total_price:
                            ws[headers.total_price + monthRow]?.v.toFixed(3),
                        tax: ws[headers.tax + (monthRow + 3)]?.v.toFixed(3),
                        tax_and_total:
                            ws[headers.tax_and_total + monthRow]?.v.toFixed(3),
                    };
                    tableState.value = true;
                };
            } else {
            }
        };

        const vdpInputFormat = (date) => {
            return moment(date).format("MM/YYYY");
        };

        const selectDate = () => {
            vDatePicker.value.selectDate();
        };

        const minDate = computed(() => {
            return lastDate.value
                ? moment(lastDate.value, "MMMM YYYY")
                      .add(1, "month")
                      .locale("tr")
                      .format()
                : null;
        });

        watch(
            () => selectedDate.value,
            (val) => {
                date = moment(val).locale("tr");
            }
        );

        const sendData = () => {
            store
                .dispatch("bills/addElectricityBillData", data.value)
                .then((res) => {
                    reset();
                    if (res) {
                        getLastDate();
                    }
                });
        };

        const reset = () => {
            selectedDate.value = null;
            tableState.value = false;
            data.value = null;
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
