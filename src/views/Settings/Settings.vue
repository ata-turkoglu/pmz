<template>
  <div class="container">
    <v-tabs v-model="selectedTab">
      <v-tab value="1"> Kullanıcılar </v-tab>
    </v-tabs>
    <v-window id="setting-windows" v-model="selectedTab" class="py-1">
      <v-window-item value="1">
        <UserSettings />
      </v-window-item>
    </v-window>
  </div>
</template>

<script>
import UserSettings from "./UserSettings.vue";
export default {
  components: { UserSettings },
  data: () => ({
    selectedTab: null,
  }),
};
</script>

<style scoped>
.container {
  width: 100%;
  padding: 10px;
}
@media screen and (max-width: 600px) {
  .container {
    padding-inline: 5px;
  }
}
</style>
