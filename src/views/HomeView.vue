<template>
  <v-layout>
    <v-app-bar color="blue-darken-4" flat>
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" color="white" />
      </template>
      <v-app-bar-title style="color: white"
        >Data is tool for enhancing intuition</v-app-bar-title
      >
      <template v-slot:append>
        <v-btn icon="mdi-dots-vertical" color="white"></v-btn>
      </template>
    </v-app-bar>
    <v-navigation-drawer
      class="px-3 py-2"
      v-model="drawer"
      temporary
      color="blue-darken-4"
    >
      <v-list>
        <v-list-item
          prepend-icon="mdi-clipboard-edit-outline"
          title="Faaliyet Formu"
          class="nav-list-item"
          to="/activity-form"
        >
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-chart-line"
          title="Grafikler"
          class="nav-list-item"
          to="/graphs"
        >
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main class="ma-0 pa-0">
      <RouterView></RouterView>
    </v-main>
  </v-layout>
</template>

<script>
export default {
  name: "HomeView",
  components: {},
  data: () => ({
    drawer: false,
  }),
};
</script>

<style scoped>
.nav-list-item {
  display: flex;
  color: white;
  cursor: pointer;
}
</style>
