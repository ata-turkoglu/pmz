<template>
  <div class="container">
    <v-tabs v-model="selectedTab">
      <v-tab v-for="facility in facilities" :value="facility.id">{{
        facility.name
      }}</v-tab>
    </v-tabs>
    <v-window id="chart-windows" v-model="selectedTab" class="py-1">
      <v-window-item :value="2">
        <HeavyMineralsCharts />
      </v-window-item>
    </v-window>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import HeavyMineralsCharts from "./HeavyMineralsCharts";
export default {
  components: { HeavyMineralsCharts },
  data: () => ({
    selectedTab: null,
  }),
  computed: {
    ...mapGetters({ facilities: "getFacilities" }),
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  min-height: 90vh;
  padding: 10px;
}
@media screen and (max-width: 600px) {
  .container {
    padding-inline: 5px;
  }
}
</style>
