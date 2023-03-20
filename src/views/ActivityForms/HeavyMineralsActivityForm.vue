<template>
  <div class="container">
    <div class="selections">
      <v-text-field
        value="Ağır Mineraller"
        variant="solo"
        readonly
        class="inputs"
      ></v-text-field>
      <v-text-field
        class="inputs"
        label="Tarih"
        variant="solo"
        type="date"
        v-model="selectedDate"
      ></v-text-field>
      <v-select
        label="Vardiya"
        :items="$store.state.shifts"
        item-title="name"
        item-value="id"
        variant="solo"
        class="inputs"
        :active="true"
        v-model="selectedShift"
      ></v-select>
    </div>
    <div class="timers mt-2">
      <v-text-field
        class="inputs"
        label="Kurutma Fırını Çalışma Saati"
        variant="outlined"
        type="number"
        :placeholder="String(previousData.dryerKilnTimer)"
        v-model="dryerKilnTimer"
        :hint="setHint"
        :rules="[
          checkTimerValue(
            dryerKilnTimer,
            previousData.dryerKilnTimer,
            true,
            'dryer'
          ),
        ]"
      ></v-text-field>
      <v-text-field
        class="inputs"
        label="İndirgeme Fırını Çalışma Saati"
        variant="outlined"
        type="number"
        :placeholder="String(previousData.reducerKilnTimer)"
        v-model="reducerKilnTimer"
        :hint="setHint"
        :rules="[
          checkTimerValue(
            reducerKilnTimer,
            previousData.reducerKilnTimer,
            true,
            'reducer'
          ),
        ]"
      ></v-text-field>
      <v-text-field
        class="inputs"
        label="CNG Saati"
        variant="outlined"
        type="number"
        :placeholder="String(previousData.cngTimer)"
        v-model="cngTimer"
        :hint="setHint"
        :rules="[
          checkTimerValue(cngTimer, previousData.cngTimer, false, 'cng'),
        ]"
      ></v-text-field>
    </div>
    <div class="notes mt-4">
      <v-textarea
        label="Ürünler"
        variant="outlined"
        class="inputs"
        v-model="productsText"
      ></v-textarea>
      <v-textarea
        label="Arızalar"
        variant="outlined"
        class="inputs"
        v-model="malfunctionsText"
      ></v-textarea>
      <v-textarea
        label="Diğer Faaliyetler"
        variant="outlined"
        class="inputs"
        v-model="otherActivities"
      ></v-textarea>
    </div>
    <v-row
      v-if="isEdit ? (editPermission ? true : false) : true"
      class="mt-4"
      :class="$vuetify.display.smAndDown ? 'px-3' : 'px-9'"
      align="center"
      justify="end"
    >
      <v-btn
        v-if="!isEdit"
        class="mr-4"
        color="blue-grey-lighten-5"
        width="100px"
        @click="reset"
      >
        Temizle
      </v-btn>
      <v-btn
        :loading="$store.state.buttons.activityFormSaveButtonLoading"
        color="blue-darken-4"
        width="100px"
        @click="save"
        :disabled="!checkValidation()"
        >Kaydet</v-btn
      >
    </v-row>
    <v-dialog v-model="$store.state.commonDialogs.successDialog" width="auto">
      <InfoDialog
        :infoText="'Başarılı'"
        @close="$store.state.commonDialogs.successDialog = false"
      />
    </v-dialog>
    <v-dialog v-model="$store.state.commonDialogs.errorDialog" width="auto">
      <ErrorDialog
        :errorText="$store.state.commonErrorText"
        @close="
          [
            ($store.state.commonDialogs.errorDialog = false),
            ($store.state.commonErrorText = null),
          ]
        "
      />
    </v-dialog>
  </div>
</template>

<script>
import InfoDialog from "@/components/common/InfoDialog.vue";
import ErrorDialog from "@/components/common/ErrorDialog.vue";
import moment from "moment";
export default {
  props: ["isEdit", "editPermission", "item"],
  components: { InfoDialog, ErrorDialog },
  data: () => ({
    id: null,
    selectedDate: null,
    selectedFacility: 2,
    selectedShift: null,
    dryerKilnTimer: null,
    reducerKilnTimer: null,
    cngTimer: null,
    productsText: null,
    malfunctionsText: null,
    otherActivities: null,
    previousData: {
      dryerKilnTimer: null,
      reducerKilnTimer: null,
      cngTimer: null,
    },
    fieldValidation: {
      dryer: false,
      reducer: false,
      cng: false,
    },
  }),
  created() {
    if (!this.isEdit) {
      this.$store
        .dispatch("chartData/getLastTotalData", { facility: 2 })
        .then(() => {
          const { date, shift, dryerKilnTimer, reducerKilnTimer, cngTimer } =
            this.$store.state.chartData.chartData.heavyMineralsLastTotal;

          if (shift == 3) {
            this.selectedShift = 1;
            this.selectedDate = moment(date)
              .add(1, "days")
              .format("YYYY-MM-DD");
          } else {
            this.selectedShift = +shift + 1;
            this.selectedDate = date;
          }

          this.previousData.dryerKilnTimer = dryerKilnTimer;
          this.previousData.reducerKilnTimer = reducerKilnTimer;
          this.previousData.cngTimer = cngTimer;
        });
    }
  },
  mounted() {
    if (this.isEdit && this.item != null) {
      this.id = this.item.id;
      this.selectedDate = this.item.date;
      this.selectedFacility = this.item.facility;
      this.selectedShift = this.item.shift;
      this.dryerKilnTimer = this.item.dryerKilnTimer;
      this.reducerKilnTimer = this.item.reducerKilnTimer;
      this.cngTimer = this.item.cngTimer;
      this.productsText = this.item.productsText;
      this.malfunctionsText = this.item.malfunctionsText;
      this.otherActivities = this.item.otherActivities;
    }
  },
  methods: {
    checkTimerValue(newVal, lastVal, timer, field) {
      if (!newVal) {
        this.fieldValidation[field] = false;
        return "Boş bırakılamaz";
      }
      if (newVal < lastVal) {
        this.fieldValidation[field] = false;
        return "Eski değerden küçük olamaz";
      }
      if (newVal - lastVal > 9 && timer) {
        this.fieldValidation[field] = false;
        return "Mesai saatinden büyük olamaz";
      }
      this.fieldValidation[field] = true;
      return true;
    },
    checkValidation() {
      return Object.values(this.fieldValidation).every((item) => item);
    },
    reset() {
      this.dryerKilnTimer = null;
      this.reducerKilnTimer = null;
      this.cngTimer = null;
      this.productsText = null;
      this.malfunctionsText = null;
      this.otherActivities = null;
    },
    save() {
      this.$store.state.buttons.activityFormSaveButtonLoading = true;
      let data = {
        date: this.selectedDate,
        facility: this.selectedFacility,
        shift: this.selectedShift,
        dryerKilnTimer: Number(this.dryerKilnTimer),
        reducerKilnTimer: Number(this.reducerKilnTimer),
        cngTimer: Number(this.cngTimer),
        productsText: this.productsText,
        malfunctionsText: this.malfunctionsText,
        otherActivities: this.otherActivities,
      };
      if (this.isEdit) {
        this.$store.dispatch("updateActivityForm", {
          id: this.id,
          ...data,
        });
      } else {
        this.$store.dispatch("addNewActivityForm", data);
      }
    },
  },
  computed: {
    setHint() {
      switch (this.selectedShift) {
        case 1:
          return "8.00 daki çalışma saati";

        case 2:
          return "16.00 daki çalışma saati";

        case 3:
          return "24.00 daki çalışma saati";

        default:
          return "";
      }
    },
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  min-height: 90vh;
  height: fit-content;
}
.selections {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.timers {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.notes {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.inputs {
  max-width: 30%;
  margin-inline: 10px;
}
@media screen and (max-width: 600px) {
  .selections {
    flex-direction: column;
  }
  .timers {
    flex-direction: column;
  }
  .notes {
    flex-direction: column;
  }
  .inputs {
    width: 100%;
    max-width: 100%;
  }
}
</style>
