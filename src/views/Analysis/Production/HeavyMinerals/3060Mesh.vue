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
                label="+600"
                variant="outlined"
                v-model="formData.p600"
                type="number"
            ></v-text-field>
            <v-text-field
                class="inputs"
                label="+400"
                variant="outlined"
                v-model="formData.p400"
                type="number"
            ></v-text-field>
            <v-text-field
                class="inputs"
                label="-212"
                variant="outlined"
                v-model="formData.m212"
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
                        .analysis3060MeshSaveButtonLoading
                "
                :disabled="
                    $store.state.analysis.buttons
                        .analysis3060MeshSaveButtonLoading
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
import { reactive, computed, watch } from "vue";
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
            { title: "+600", key: "p600", align: "end" },
            { title: "+400", key: "p400", align: "end" },
            { title: "-212", key: "m212", align: "end" },
            { title: "Açıklama", key: "notes", align: "end" },
            { title: "", key: "actions", align: "end" },
        ];

        const items = computed(() =>
            store.state.analysis.analysis3060Mesh.sort(
                (a, b) => b.bigbagQueue - a.bigbagQueue
            )
        );

        let formData = reactive({
            id: null,
            bigbagNo: "3060",
            p600: null,
            p400: null,
            m212: null,
            notes: null,
        });

        let editMode = false;

        store.dispatch("analysis/get3060Mesh");

        const save = () => {
            if (editMode) {
                store
                    .dispatch("analysis/update3060Mesh", formData)
                    .then((state) => {
                        if (state) reset();
                    });
            } else {
                store
                    .dispatch("analysis/save3060Mesh", formData)
                    .then((state) => {
                        if (state) reset();
                    });
            }
        };

        const editItem = (item) => {
            console.log(item);
            editMode = true;
            formData.id = item.id;
            formData.bigbagNo = item.bigbagNo.toString();
            formData.p600 = item.p600;
            formData.p400 = item.p400;
            formData.m212 = item.m212;
            formData.notes = item.notes;
        };

        const deleteItem = (item) => {
            if (confirm("Silmek istediğinize emin misiniz?")) {
                store.dispatch("analysis/delete3060Mesh", item.id);
            }
        };

        const reset = () => {
            editMode = false;
            formData.id = null;
            formData.bigbagNo = "3060";
            formData.p600 = null;
            formData.p400 = null;
            formData.m212 = null;
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
