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
                v-model="formData.notes"
            ></v-text-field>
        </div>
        <v-row
            v-if="isEdit ? (editPermission ? true : false) : true"
            class="mt-4"
            :class="$vuetify.display.smAndDown ? 'px-3' : 'px-9'"
            align="center"
            justify="end"
        >
            <v-btn
                :loading="
                    $store.state.analysis.buttons
                        .analysis80MeshSaveButtonLoading
                "
                color="blue-darken-4"
                width="100px"
                @click="save()"
                >Kaydet</v-btn
            >
        </v-row>
    </div>
</template>

<script>
import { reactive, computed, watch } from "vue";
import { useStore } from "vuex";
export default {
    setup() {
        const store = useStore();
        let formData = reactive({
            id: null,
            bigbagNo: "0080",
            p400: null,
            m212: null,
            m160: null,
            notes: null,
        });
        const save = () => {
            store.dispatch("analysis/save80Mesh", formData);
        };
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
