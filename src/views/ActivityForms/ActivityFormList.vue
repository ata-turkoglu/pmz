<template>
  <div class="container">
    <v-tabs v-model="selectedTab">
      <v-tab v-for="facility in facilities" :value="facility.id">{{
        facility.name
      }}</v-tab>
    </v-tabs>
    <v-window v-model="selectedTab" class="py-1">
      <v-window-item :value="1">
        <AgregatesActivityFormList />
      </v-window-item>
      <v-window-item :value="2">
        <HeavyMineralsActivityFormList />
      </v-window-item>
    </v-window>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import AgregatesActivityFormList from "./AgregatesActivityFormList.vue";
import HeavyMineralsActivityFormList from "./HeavyMineralsActivityFormList.vue";
export default {
  components: { AgregatesActivityFormList, HeavyMineralsActivityFormList },
  data: () => ({
    selectedTab: null,
  }),
  computed: {
    ...mapGetters({ facilities: "getFacilities" }),
  },
  beforeMount() {
    this.selectedTab = this.facilities[0].id;
  },
};
</script>
<style scoped>
.container {
  width: 100%;
  padding: 10px;
}
</style>
