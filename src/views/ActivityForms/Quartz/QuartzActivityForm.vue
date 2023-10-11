<template>
    <div class="quartzActivityForm">
        <div class="quartzActivityForm_content">
            <v-file-input
                label="Excel Yükle"
                variant="outlined"
                accept=".xlsx"
                class="quartzActivityForm_content_file-input"
                @change="fileAdded"
            ></v-file-input>
            <span v-if="lastDate != null">
                En Son Eklenen Tarih
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
                v-if="selectedDate != null && excelFile != null"
                :disabled="excelFile == null && selectedDate == null"
                class="mt-5"
                @click="checkFile"
                >Check</v-btn
            >
            <table class="excelTable" v-if="tableState">
                <thead class="thead">
                    <tr>
                        <th></th>
                        <th colspan="2">Kırma</th>
                        <th colspan="2">Öğütme 1</th>
                        <th colspan="2">Öğütme 2</th>
                        <th colspan="2">Eleme</th>
                        <th colspan="2"></th>
                    </tr>
                    <tr>
                        <th>Tarih</th>
                        <th>Bitiş</th>
                        <th>Çalışılan Saat</th>
                        <th>Bitiş</th>
                        <th>Çalışılan Saat</th>
                        <th>Bitiş</th>
                        <th>Çalışılan Saat</th>
                        <th>Bitiş</th>
                        <th>Çalışılan Saat</th>
                        <th>Kırma Ton</th>
                        <th>Yıkanan Araç</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="bodyRow">
                        <td>{{ data.date }}</td>
                        <td>{{ data.crushing.timer }}</td>
                        <td>{{ data.crushing.duration }}</td>
                        <td>{{ data.mill1.timer }}</td>
                        <td>{{ data.mill1.duration }}</td>
                        <td>{{ data.mill2.timer }}</td>
                        <td>{{ data.mill2.duration }}</td>
                        <td>{{ data.screening.timer }}</td>
                        <td>{{ data.screening.duration }}</td>
                        <td>{{ data.crushed }}</td>
                        <td>{{ data.washed }}</td>
                    </tr>
                </tbody>
            </table>
            <v-btn
                v-if="tableState"
                :disabled="excelFile == null || selectedDate == null"
                class="mt-5"
                @click="sendData"
                >Gönder</v-btn
            >
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
        store.dispatch("quartzWorkingHours/getLastWorkingHoursData");
        const monthsIndex = {
            OCAK: 4,
            ŞUBAT: 36,
            MART: 68,
            NİSAN: 100,
            MAYIS: 132,
            HAZİRAN: 164,
            TEMMUZ: 196,
            AĞUSTOS: 228,
            EYLÜL: 260,
            EKIM: 292,
            KASIM: 324,
            ARALIK: 356,
        };
        const headers = {
            crushing: {
                timer: "C",
                duration: "D",
            },
            mill1: {
                timer: "G",
                duration: "H",
            },
            mill2: {
                timer: "K",
                duration: "L",
            },
            screening: {
                timer: "O",
                duration: "P",
            },
            crushed: "R",
            washed: "S",
        };
        const vDatePicker = ref(null);
        const selectedDate = ref(null);
        const excelFile = ref(null);
        const tableState = ref(false);
        let data = ref(null);
        let index = null;
        let date = null;
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
                    let wsname = wb.SheetNames[0];
                    let ws = wb.Sheets[wsname];

                    data.value = {
                        date: moment(date).format("YYYY-MM-DD"),
                        crushing: {
                            timer: ws[headers.crushing.timer + index]?.v,
                            duration: ws[headers.crushing.duration + index]?.v,
                        },
                        mill1: {
                            timer: ws[headers.mill1.timer + index]?.v,
                            duration: ws[headers.mill1.duration + index]?.v,
                        },
                        mill2: {
                            timer: ws[headers.mill2.timer + index]?.v,
                            duration: ws[headers.mill2.duration + index]?.v,
                        },
                        screening: {
                            timer: ws[headers.screening.timer + index]?.v,
                            duration: ws[headers.screening.duration + index]?.v,
                        },
                        crushed: ws[headers.crushed + index]?.v,
                        washed: ws[headers.washed + index]?.v,
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

        const lastDate = computed(() => {
            return (
                moment(store.state.quartzWorkingHours.lastWorkingHoursDate)
                    .locale("tr")
                    .format("DD-MM-YYYY") || null
            );
        });

        const minDate = computed(() => {
            return (
                moment(store.state.quartzWorkingHours.lastWorkingHoursDate)
                    .add(1, "day")
                    .locale("tr")
                    .format() || null
            );
        });

        watch(
            () => selectedDate.value,
            (val) => {
                date = moment(val).locale("tr");
                let day = date.date();
                let month = date.month();
                let monthName = moment()
                    .month(month)
                    .format("MMMM")
                    .toUpperCase();
                index = monthsIndex[monthName] + (day - 1);
            }
        );

        const sendData = () => {
            store
                .dispatch("quartzWorkingHours/addWorkingHours", data.value)
                .then(() => {
                    reset();
                });
        };

        const reset = () => {
            store.dispatch("quartzWorkingHours/getLastWorkingHoursData");
            selectedDate.value = null;
            tableState.value = false;
            data.value = null;
            index = null;
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
.quartzActivityForm {
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
