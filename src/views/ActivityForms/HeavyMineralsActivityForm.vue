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
        v-model="dryerKilnTimer"
      ></v-text-field>
      <v-text-field
        class="inputs"
        label="İndirgeme Fırını Çalışma Saati"
        variant="outlined"
        type="number"
        v-model="reducerKilnTimer"
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
        v-if="!isEdit"
        class="mr-4"
        color="blue-grey-lighten-5"
        width="100px"
        @click="reset"
      >
        Temizle
      </v-btn>
      <v-btn :loading="false" color="blue-darken-4" width="100px" @click="save"
        >Kaydet</v-btn
      >
    </v-row>
  </div>
</template>

<script>
export default {
  props: ["isEdit", "item"],
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
  }),
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
    reset() {
      this.dryerKilnTimer = null;
      this.reducerKilnTimer = null;
      this.cngTimer = null;
      this.productsText = null;
      this.malfunctionsText = null;
      this.otherActivities = null;
    },
    save() {
      this.$store.dispatch("addNewActivityForm", {
        date: this.selectedDate,
        facility: this.selectedFacility,
        shift: this.selectedShift,
        dryerKilnTimer: this.dryerKilnTimer,
        reducerKilnTimer: this.reducerKilnTimer,
        cngTimer: this.cngTimer,
        productsText: this.productsText,
        malfunctionsText: this.malfunctionsText,
        otherActivities: this.otherActivities,
      });
    },
  },
  watch: {
    selectedDate: {
      handler(val) {
        console.log(val);
      },
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
