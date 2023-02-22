<template>
  <div class="container">
    <div class="selections">
      <v-select
        label="Tesis"
        :items="selectableFacilities"
        item-title="name"
        item-value="id"
        variant="solo"
        class="inputs"
        :active="true"
        v-model="selectedFacility"
        @update:model-value="selectFacility"
      ></v-select>
      <v-text-field
        class="inputs"
        label="Tarih"
        variant="solo"
        type="date"
        v-model="selectedDate"
      ></v-text-field>
      <v-select
        label="Vardiya"
        :items="shifts"
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
        v-model="dryerKilnTimer"
      ></v-text-field>
      <v-text-field
        class="inputs"
        label="İndirgeme Fırını Çalışma Saati"
        variant="outlined"
        type="number"
        v-model="reductionKilnTimer"
      ></v-text-field>
      <v-text-field
        class="inputs"
        label="CNG Saati"
        variant="outlined"
        type="number"
        v-model="cngTimer"
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
    <v-row class="mt-4 px-7" align="center" justify="end">
      <v-btn
        class="mr-4"
        color="blue-grey-lighten-5"
        width="100px"
        @click="reset"
      >
        Temizle
      </v-btn>
      <v-btn :loading="false" color="blue-darken-4" width="100px" @click="save"
        >Save</v-btn
      >
    </v-row>
  </div>
</template>

<script>
export default {
  props: ["data", "date", "facility", "shift"],
  data: () => ({
    selectedDate: null,
    selectedFacility: null,
    selectedShift: null,
    dryerKilnTimer: null,
    reductionKilnTimer: null,
    cngTimer: null,
    productsText: null,
    malfunctionsText: null,
    otherActivities: null,
    shifts: [
      {
        id: 1,
        name: "Gece",
      },
      {
        id: 2,
        name: "Gündüz",
      },
      {
        id: 3,
        name: "Akşam",
      },
    ],
  }),
  methods: {
    reset() {
      this.dryerKilnTimer = null;
      this.reductionKilnTimer = null;
      this.cngTimer = null;
      this.productsText = null;
      this.malfunctionsText = null;
      this.otherActivities = null;
    },
    save() {
      console.log({
        date: this.data.date,
        facility: this.data.facility,
        shift: this.data.shift,
        dryerKilnTimer: this.dryerKilnTimer,
        reductionKilnTimer: this.reductionKilnTimer,
        cngTimer: this.cngTimer,
        productsText: this.productsText,
        malfunctionsText: this.malfunctionsText,
        otherActivities: this.otherActivities,
      });
    },
  },
};
</script>

<style scoped>
.container {
  width: 100%;
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
