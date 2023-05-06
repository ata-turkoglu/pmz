<template>
  <div class="container">
    <div class="first mt-5">
      <v-text-field
        class="inputs"
        label="Firma İsmi"
        variant="outlined"
        v-model="formData.companyName"
      ></v-text-field>
      <v-text-field
        class="inputs"
        label="Tarih"
        type="datetime-local"
        variant="outlined"
        v-model="formData.dateTime"
      ></v-text-field>
      <v-text-field
        class="inputs"
        label="Miktar"
        variant="outlined"
        v-model="formData.amount"
      ></v-text-field>
      <v-text-field
        class="inputs"
        label="Birim Fiyat"
        variant="outlined"
        v-model="formData.unitPrice"
      ></v-text-field>
      <v-text-field
        class="inputs"
        label="Toplam Fiyat"
        variant="outlined"
        v-model="formData.totalPrice"
      ></v-text-field>
    </div>
    <span>{{ formData }}</span>
    <div class="second pr-3">
      <v-btn
        :loading="false"
        color="blue-darken-4"
        width="100px"
        @click="save()"
        >Ekle</v-btn
      >
    </div>
  </div>
</template>

<script>
import { reactive } from "vue";
export default {
  setup() {
    let formData = reactive({
      companyName: null,
      dateTime: null,
      amount: null,
      unitPrice: null,
      totalPrice: null,
    });

    function save() {
      console.log("----");
    }
    return { formData, save };
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  padding: 10px;
}
.first {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.inputs {
  max-width: 30%;
  margin-inline: 10px;
}
.second {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-right: 10px;
}

@media screen and (max-width: 600px) {
  .first {
    flex-direction: column;
  }
  .inputs {
    max-width: 100%;
    width: 100%;
  }
}
</style>
