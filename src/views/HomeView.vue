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
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
          </template>
          <v-list>
            <v-list-item
              title="Ayarlar"
              class="menu-item"
              @click="goToSettings"
            />
            <v-list-item title="Çıkış" class="menu-item" @click="logout" />
          </v-list>
        </v-menu>
      </template>
    </v-app-bar>
    <v-navigation-drawer
      class="px-3 py-2"
      v-model="drawer"
      temporary
      color="blue-darken-4"
      width="30%"
    >
      <v-list>
        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-clipboard-outline"
              title="Faaliyet Formu"
              class="nav-list-item"
            ></v-list-item>
          </template>
          <v-list-item
            title="Yeni Form"
            prepend-icon="mdi-clipboard-edit-outline"
            to="/activity-form/new"
            class="justify-start"
          ></v-list-item>
          <v-list-item
            title="Form Listesi"
            prepend-icon="mdi-clipboard-list-outline"
            to="/activity-form/list"
            class="justify-start"
          ></v-list-item>
        </v-list-group>
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
  methods: {
    goToSettings() {
      this.$router.push("/settings");
    },
    logout() {
      this.$store.dispatch("users/logout");
    },
  },
};
</script>

<style scoped>
.nav-list-item {
  display: flex;
  color: white;
  cursor: pointer;
}
.menu-item {
  width: fit-content;
}
</style>
