<template>
  <div class="container">
    <v-card class="login-modal" variant="outlined">
      <v-text-field
        class="form-input mb-3"
        label="Kullanıcı Adı"
        variant="outlined"
        density="compact"
        v-model="username"
        hint="örnek: isim.soyisim"
        :rules="[(v) => checkUsername || 'Boş bırakamazsınız']"
        required
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
      <v-text-field
        class="form-input mb-3"
        label="Şifre"
        variant="outlined"
        density="compact"
        v-model="confirmPassword"
        :rules="[
          (v) => checkConfirmPassword || 'Boş bırakamazsınız',
          (v) => v == password || 'Şifreler eşleşmiyor',
        ]"
        required
        :type="show2 ? 'text' : 'password'"
        :append-inner-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append-inner="show2 = !show2"
      ></v-text-field>
      <v-btn
        :loading="$store.state.users.buttons.signupButtonLoading"
        class="form-input"
        block
        variant="outlined"
        @click="signUp"
        :disabled="!formValidation"
      >
        {{ resetPassword ? "Gönder" : "Kayıt" }}
      </v-btn>
      <div style="display: flex; justify-content: flex-end" width="100%">
        <span
          style="color: black; cursor: pointer"
          class="mt-4 mb-0 mr-2"
          @click="$router.push('/login')"
        >
          Giriş Ekranı
        </span>
      </div>
    </v-card>
    <v-dialog v-model="$store.state.commonDialogs.successDialog" width="auto">
      <InfoDialog
        :infoText="'Başarılı'"
        @close="
          [
            ($store.state.commonDialogs.successDialog = false),
            $router.push('/login'),
          ]
        "
      />
    </v-dialog>
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
import InfoDialog from "../components/common/InfoDialog.vue";
import ErrorDialog from "../components/common/ErrorDialog.vue";
export default {
  components: { InfoDialog, ErrorDialog },
  data: () => ({
    username: null,
    password: null,
    confirmPassword: null,
    validation: {
      username: false,
      password: false,
      confirmPassword: false,
    },
    show1: false,
    show2: false,
    resetPassword: false,
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
    checkConfirmPassword() {
      this.validation.confirmPassword =
        !!this.confirmPassword && this.password === this.confirmPassword;
      return !!this.confirmPassword && this.password === this.confirmPassword;
    },
    formValidation() {
      return Object.values(this.validation).every((el) => el);
    },
  },
  methods: {
    signUp() {
      this.$store.state.users.buttons.signupButtonLoading = true;
      if (this.resetPassword) {
        this.$store.dispatch("users/passwordReset", {
          username: this.username,
          password: this.password,
          confirmPassword: this.confirmPassword,
        });
      } else {
        this.$store.dispatch("users/signUp", {
          username: this.username,
          password: this.password,
          confirmPassword: this.confirmPassword,
        });
      }
    },
  },
  created() {
    this.resetPassword = this.$route.name == "PasswordReset";
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
.login-form {
  width: 100%;
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
