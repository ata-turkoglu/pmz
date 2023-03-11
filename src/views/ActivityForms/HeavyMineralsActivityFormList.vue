<template>
  <div class="container1">
    <div class="form-list">
      <div
        v-for="item in formList"
        :key="item.id"
        class="form-list-item"
        :style="
          activeListItem(item.id) ? { backgroundColor: 'rgb(230,230,230)' } : ''
        "
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
    <div class="form-container">
      <HeavyMineralsActivityForm
        v-if="selectedItem != null"
        :isEdit="true"
        :editPermission="formList[0].id == selectedItem.id"
        :item="selectedItem"
        :key="selectedItem.id"
      />
    </div>
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
  justify-content: flex-start;
  padding-block: 10px;
  min-height: 90vh;
}
.form-list {
  min-width: "20%";
  width: "fit-content";
  padding-right: 10px;
  max-height: 90vh;
  overflow-y: scroll;
}
.form-container {
  width: 90%;
  max-width: 90%;
  height: fit-content;
}
.form-list-item {
  /* background-color: #1565c0;
  border-radius: 5px;
  color: white; */
  border-bottom: 1px solid rgb(220, 220, 220);
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
    margin-bottom: 30px;
    padding-inline: 10px;
  }
}
</style>
