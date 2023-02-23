<template>
  <div class="container1">
    <div class="form-list">
      <div
        v-for="item in formList"
        :key="item.id"
        class="form-list-item"
        :style="activeListItem(item.id) ? { backgroundColor: '#0D47A1' } : ''"
        @click="selectForm(item)"
      >
        <span class="form-list-item-date">{{
          item.date.split("-").reverse().join(".")
        }}</span>
        <span class="form-list-item-shift">
          {{ findShiftNameById(item.shift) }}
        </span>
      </div>
    </div>
    <HeavyMineralsActivityForm
      v-if="selectedItem != null"
      :isEdit="true"
      :item="selectedItem"
      :key="selectedItem.id"
    />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import HeavyMineralsActivityForm from "./HeavyMineralsActivityForm.vue";

export default {
  components: { HeavyMineralsActivityForm },
  data: () => ({
    selectedItem: null,
  }),
  computed: {
    ...mapGetters({
      formList: "getHeavyMineralsForms",
    }),
  },
  created() {
    if (
      this.$store.state.activityForms == [] ||
      this.$store.state.activityForms.length <= 0
    ) {
      this.$store.dispatch("getFacilityActivityForms", 2);
    }
  },
  methods: {
    selectForm(item) {
      console.log("item", item);
      console.log("list", this.$store.state.activityForms);
      this.selectedItem = item;
    },
    findShiftNameById(id) {
      return this.$store.state.shifts.find((itm) => itm.id == id).name;
    },
    activeListItem(id) {
      return this.selectedItem != null && this.selectedItem.id == id;
    },
  },
};
</script>
<style scoped>
.container1 {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  padding-block: 10px;
}
.form-list {
  min-width: "15%";
  width: "fit-content";
}
.form-list-item {
  background-color: #1565c0;
  color: white;
  border-radius: 3px;
  margin-bottom: 1px;
  padding-block: 10px;
  padding-left: 20px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.form-list-item-date,
.form-list-item-shift {
  width: 50%;
  display: flex;
  align-items: flex-start;
  margin-right: 20px;
}
@media screen and (max-width: 600px) {
  .container1 {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .form-list {
    height: fit-content;
    width: 90%;
    max-width: 90%;
    max-height: 250px;
    overflow: scroll;
    margin-bottom: 20px;
    padding-inline: 10px;
  }
}
</style>
