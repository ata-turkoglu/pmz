<template>
  <div class="container">
    <v-tabs v-model="selectedTab" bg-color="primary">
      <v-tab value="1">Agrega</v-tab>
      <v-tab value="2">Ağır Mineralller</v-tab>
    </v-tabs>
    <v-window v-model="selectedTab">
      <v-window-item value="1">
        <AgregatesActivityForm />
      </v-window-item>
      <v-window-item value="2">
        <HeavyMineralsActivityForm />
      </v-window-item>
    </v-window>
  </div>
</template>
<script>
import AgregatesActivityForm from "./AgregatesActivityForm.vue";
import HeavyMineralsActivityForm from "./HeavyMineralsActivityForm.vue";
export default {
  components: { AgregatesActivityForm, HeavyMineralsActivityForm },
  data: () => ({
    selectedTab: null,
  }),
  computed: {
    selectableFacilities() {
      return this.$store.state.facilities.filter((itm) => !itm.disabled);
    },
  },
  methods: {
    selectFacility(val) {
      this.$router.push({
        path: "/activity-form/" + val,
        params: {
          date: this.selectedDate,
          facility: this.selectedFacility,
          shift: this.selectedShift,
        },
      });
    },
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  padding: 10px;
}
.inputs {
  max-width: 30%;
  margin-inline: 10px;
}
@media screen and (max-width: 600px) {
  .inputs {
    width: 100%;
    max-width: 100%;
  }
}
</style>
