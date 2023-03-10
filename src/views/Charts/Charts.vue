<template>
  <div class="container py-3">
    <v-tabs v-model="selectedTab">
      <v-tab v-for="facility in facilities" :value="facility.id">{{
        facility.name
      }}</v-tab>
    </v-tabs>
    <v-window id="chart-windows" v-model="selectedTab" class="py-1">
      <v-window-item :value="2">
        <HeavyMineralsGraphs />
      </v-window-item>
    </v-window>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import HeavyMineralsCharts from "./HeavyMineralsCharts";
export default {
  components: { HeavyMineralsGraphs },
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
  padding: 10px;
  padding-top: 0;
}
@media screen and (max-width: 600px) {
  .container {
    padding-inline: 0;
  }
}
</style>
