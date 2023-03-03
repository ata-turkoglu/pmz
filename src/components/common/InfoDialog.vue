<template>
  <v-card width="300px">
    <v-card-title style="text-align: center">
      <v-icon icon="mdi-check-all" size="lg" class="mb-1" color="#0d47a1" />
    </v-card-title>
    <v-card-text style="text-align: center">{{ infoText }} </v-card-text>
    <v-card-actions>
      <v-btn color="blue-darken-4" block @click="close"> Tamam </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ["infoText"],
  data: () => ({}),
  methods: {
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped></style>
