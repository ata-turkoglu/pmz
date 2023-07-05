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
                label="+212"
                variant="outlined"
                v-model="formData.p212"
                type="number"
            ></v-text-field>
            <v-text-field
                class="inputs"
                label="+160"
                variant="outlined"
                v-model="formData.p160"
                type="number"
            ></v-text-field>
            <v-text-field
                class="inputs"
                label="-90"
                variant="outlined"
                v-model="formData.m90"
                type="number"
            ></v-text-field>
            <v-text-field
                class="inputs"
                label="Açıklama"
                variant="outlined"
                v-model="formData.notes"
            ></v-text-field>
        </div>
        <div class="second pr-3">
            <v-btn color="blue-darken-3 mr-3" width="100px" @click="reset()"
                >Temizle</v-btn
            >
            <v-btn
                :loading="
                    $store.state.analysis.buttons
                        .analysis180MeshSaveButtonLoading
                "
                :disabled="
                    $store.state.analysis.buttons
                        .analysis180MeshSaveButtonLoading
                "
                color="blue-darken-4"
                width="100px"
                @click="save()"
                >{{ formData.id ? "Değiştir" : "Ekle" }}</v-btn
            >
        </div>
        <v-data-table
            :headers="headers"
            :items="items"
            :items-per-page="10"
            class="elevation-1 mt-8"
        >
            <template v-slot:item.actions="{ item }">
                <v-icon size="small" class="me-2" @click="editItem(item.raw)">
                    mdi-pencil
                </v-icon>
                <v-icon size="small" @click="deleteItem(item.raw)">
                    mdi-delete
                </v-icon>
            </template></v-data-table
        >
    </div>
</template>

<script>
import { reactive, computed } from "vue";
import { useStore } from "vuex";
import { VDataTable } from "vuetify/lib/labs/components";
export default {
    components: { VDataTable },
    setup() {
        const store = useStore();

        const headers = [
            {
                title: "Bigbag No",
                key: "bigbagNo",
                align: "start",
            },
            { title: "+212", key: "p212", align: "end" },
            { title: "+160", key: "p160", align: "end" },
            { title: "-90", key: "m90", align: "end" },
            { title: "Açıklama", key: "notes", align: "end" },
            { title: "", key: "actions", align: "end" },
        ];

        const items = computed(() =>
            store.state.analysis.analysis180Mesh.sort(
                (a, b) => b.bigbagQueue - a.bigbagQueue
            )
        );

        let formData = reactive({
            id: null,
            bigbagNo: "0180",
            p212: null,
            p160: null,
            m90: null,
            notes: null,
        });

        let editMode = false;

        store.dispatch("analysis/get180Mesh");

        const save = () => {
            if (editMode) {
                store
                    .dispatch("analysis/update180Mesh", formData)
                    .then((state) => {
                        if (state) reset();
                    });
            } else {
                store
                    .dispatch("analysis/save180Mesh", formData)
                    .then((state) => {
                        if (state) reset();
                    });
            }
        };

        const editItem = (item) => {
            console.log(item);
            editMode = true;
            formData.id = item.id;
            formData.bigbagNo = "0" + item.bigbagNo.toString();
            formData.p212 = item.p212;
            formData.p160 = item.p160;
            formData.m90 = item.m90;
            formData.notes = item.notes;
        };

        const deleteItem = (item) => {
            if (confirm("Silmek istediğinize emin misiniz?")) {
                store.dispatch("analysis/delete180Mesh", item.id);
            }
        };

        const reset = () => {
            editMode = false;
            formData.id = null;
            formData.bigbagNo = "0180";
            formData.p212 = null;
            formData.p160 = null;
            formData.m90 = null;
            formData.notes = null;
        };

        return {
            formData,
            save,
            deleteItem,
            editItem,
            reset,
            headers,
            items,
            editMode,
        };
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
    width: 100%;
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
