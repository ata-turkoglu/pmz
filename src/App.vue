<template>
  <div class="main-container">
    <nav></nav>
    <router-view />
    <v-dialog
      v-model="$store.state.commonDialogs.routePermissionDialog"
      width="auto"
    >
      <ErrorDialog
        :errorText="'Giriş için izniniz yok'"
        @close="$store.state.commonDialogs.routePermissionDialog = false"
      />
    </v-dialog>
  </div>
</template>

<script>
import ErrorDialog from "./components/common/ErrorDialog.vue";
export default {
  components: { ErrorDialog },
  data: () => ({}),
  created() {
    //this.$store.dispatch("getAllFacilities");
  },
  beforeCreate() {
    this.$store.dispatch("users/userExist").then(() => {
      !this.$store.state.users.authenticated && this.$router.push("/login");
    });
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.main-container {
  width: 100%;
  height: 100%;
}
nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
