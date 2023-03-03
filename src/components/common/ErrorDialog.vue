<template>
  <v-card width="300px">
    <v-card-title style="text-align: center">
      <v-icon
        icon="mdi-exclamation-thick"
        size="sm"
        class="mb-1"
        color="#D50000"
      />
      <span style="color: #d50000">Hata</span>
    </v-card-title>
    <v-card-text style="text-align: center">{{ errorText }} </v-card-text>
    <v-card-actions>
      <v-btn color="blue-darken-4" block @click="close"> Tamam </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ["errorText"],
  data: () => ({}),
  methods: {
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped></style>
