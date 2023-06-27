<template>
    <div class="container">
        <div class="first mt-5">
            <v-text-field
                class="inputs"
                label="Bigbag No"
                variant="outlined"
                v-model="formData.bigbagNo"
            ></v-text-field>
            <v-text-field
                class="inputs"
                label="+400"
                variant="outlined"
                v-model="formData.p400"
            ></v-text-field>
            <v-text-field
                class="inputs"
                label="-212"
                variant="outlined"
                v-model="formData.m212"
            ></v-text-field>
            <v-text-field
                class="inputs"
                label="-160"
                variant="outlined"
                v-model="formData.m160"
            ></v-text-field>
            <v-text-field
                class="inputs"
                label="Açıklama"
                variant="outlined"
                v-model="formData.comment"
            ></v-text-field>
        </div>
    </div>
</template>

<script>
import { reactive, computed, watch } from "vue";
export default {
    setup() {
        let formData = reactive({
            id: null,
            bigbagNo: null,
            p400: null,
            m212: null,
            m160: null,
            comment: null,
        });
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
