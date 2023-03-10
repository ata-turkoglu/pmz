<template>
  <div class="container">
    <v-card class="login-modal" variant="outlined">
      <v-text-field
        class="form-input mb-3"
        label="Kullanıcı Adı"
        variant="outlined"
        density="compact"
        v-model="username"
        :rules="[(v) => checkUsername || 'Boş bırakamazsınız']"
      ></v-text-field>
      <v-text-field
        class="form-input mb-3"
        label="Şifre"
        variant="outlined"
        density="compact"
        v-model="password"
        :rules="[(v) => checkPassword || 'Boş bırakamazsınız']"
        required
        :type="show1 ? 'text' : 'password'"
        :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append-inner="show1 = !show1"
      ></v-text-field>
      <v-checkbox
        density="compact"
        label="Beni Hatırla"
        v-model="rememberMe"
      ></v-checkbox>
      <v-btn
        :loading="$store.state.users.buttons.loginButtonLoading"
        class="form-input"
        block
        variant="outlined"
        @click="login"
        :disabled="!formValidation"
        >Giriş</v-btn
      >
      <div style="display: flex; justify-content: space-between" width="100%">
        <span
          style="color: black; cursor: pointer; font-size: 0.8rem"
          class="mt-4 mb-0 mr-2"
          @click="$router.push('/password-reset')"
        >
          Şifremi Değiştir
        </span>
        <span
          style="color: black; cursor: pointer"
          class="mt-4 mb-0 mr-2"
          @click="$router.push('/signup')"
        >
          Kayıt Ol
        </span>
      </div>
    </v-card>
    <v-dialog
      v-model="$store.state.commonDialogs.loginErrorDialog"
      width="auto"
    >
      <ErrorDialog
        :errorText="$store.state.commonErrorText"
        @close="
          [
            ($store.state.commonDialogs.loginErrorDialog = false),
            ($store.state.commonErrorText = null),
          ]
        "
      />
    </v-dialog>
  </div>
</template>

<script>
import ErrorDialog from "../components/common/ErrorDialog.vue";
export default {
  components: { ErrorDialog },
  data: () => ({
    username: null,
    password: null,
    rememberMe: true,
    validation: {
      username: false,
      password: false,
    },
    show1: false,
  }),
  computed: {
    checkUsername() {
      this.validation.username = !!this.username;
      return !!this.username;
    },
    checkPassword() {
      this.validation.password = !!this.password;
      return !!this.password;
    },
    formValidation() {
      return Object.values(this.validation).every((el) => el);
    },
  },
  methods: {
    login() {
      this.$store.state.users.buttons.loginButtonLoading = true;
      this.$store.dispatch("users/login", {
        username: this.username,
        password: this.password,
        rememberMe: this.rememberMe,
      });
    },
  },
  beforeMount() {
    localStorage.getItem("username") &&
      (this.username = localStorage.getItem("username")) &&
      (this.validation.username = true);
  },
};
</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 90vh;
}
.login-modal {
  width: fit-content;
  height: fit-content;
  padding-inline: 20px;
  padding-top: 30px;
  padding-bottom: 15px;
}
.form-input {
  z-index: 1;
  width: 300px;
  border-color: black;
}
@media screen and (max-width: 600px) {
  .container {
    width: 100%;
  }
  .login-modal {
    width: 100%;
    margin: 15px;
  }
  .form-input {
    width: 100%;
  }
}
</style>
