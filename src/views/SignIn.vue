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
        :loading="false"
        class="form-input"
        block
        variant="outlined"
        @click="signIn"
        :disabled="!formValidation"
      >
        Giriş
      </v-btn>
    </v-card>
  </div>
</template>

<script>
export default {
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
    signIn() {
      this.$store.dispatch("users/signIn", {
        username: this.username,
        password: this.password,
        confirmPassword: this.confirmPassword,
      });
    },
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
  padding: 20px;
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
