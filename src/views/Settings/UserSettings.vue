<template>
  <div class="container">
    <!-- Table -->
    <v-data-table
      :headers="headers"
      :items="users"
      :sort-by="[{ key: 'username', order: 'asc' }]"
      class="elevation-1"
    >
      <template v-slot:item.role="{ item }">
        <span>{{ tableRole(item.raw.role) }}</span>
      </template>
      <template v-slot:item.status="{ item }">
        <v-checkbox-btn v-model="item.raw.status" disabled></v-checkbox-btn>
      </template>
      <template v-slot:item.last_login="{ item }">
        <span>{{ tableDate(item.raw.last_login) }}</span>
      </template>
      <template v-slot:item.signup_date="{ item }">
        <span>{{ tableDate(item.raw.signup_date) }}</span>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon size="small" class="me-2" @click="editItem(item.raw)">
          mdi-pencil
        </v-icon>
        <v-icon size="small" @click="deleteItem(item.raw)"> mdi-delete </v-icon>
      </template>
    </v-data-table>

    <!-- Edit Modal -->
    <v-dialog v-model="dialogs.edit" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5" style="color: #0d47a1"
            >Kullanıcıyı Düzenle</span
          >
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="editedItem.username"
                label="Kullanıcı Adı"
                variant="outlined"
                hide-details="true"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-select
                v-model="editedItem.role"
                label="Rol"
                variant="outlined"
                hide-details="true"
                :items="roles"
                item-value="id"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-checkbox
                v-model="editedItem.status"
                label="Aktif"
                hide-details="true"
              ></v-checkbox>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="dialogs.edit = false">
            Cancel
          </v-btn>
          <v-btn
            color="blue-darken-4"
            variant="text"
            :loading="$store.state.users.buttons.editUserSaveButtonLoading"
            @click="save"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogs.error" width="auto">
      <ErrorDialog
        :errorText="'Kaydetme Başarısız Oldu'"
        @close="dialogs.error = false"
      />
    </v-dialog>
  </div>
</template>

<script>
import { VDataTable } from "vuetify/labs/VDataTable";
import { mapGetters } from "vuex";
import moment from "moment";
import ErrorDialog from "../../components/common/ErrorDialog.vue";
export default {
  components: {
    VDataTable,
    ErrorDialog,
  },
  data: () => ({
    dialogs: {
      edit: false,
      delete: false,
      error: false,
    },
    headers: [
      { title: "ID", key: "id" },
      { title: "İsim", key: "username", sortable: true },
      { title: "Role", key: "role", align: "start", sortable: true },
      { title: "Aktif", key: "status", align: "start", sortable: true },
      { title: "Son Giriş", key: "last_login", align: "start", sortable: true },
      {
        title: "Kayıt Tarihi",
        key: "signup_date",
        align: "start",
        sortable: true,
      },
      { title: "işlem", key: "actions", align: "start" },
    ],
    editedItem: {
      username: null,
      role: null,
      status: null,
    },
  }),
  computed: {
    ...mapGetters({
      users: "users/getUsers",
      roles: "users/getRoles",
    }),
  },
  methods: {
    editItem(item) {
      this.dialogs.edit = true;
      this.editedItem = {
        id: item.id,
        username: item.username,
        role: item.role,
        status: item.status,
      };
    },
    tableRole(role) {
      return this.roles.find((itm) => itm.id == role).title;
    },
    tableDate(date) {
      return moment(date).format("lll");
    },
    deleteItem(item) {},
    save() {
      this.$store.state.users.buttons.editUserSaveButtonLoading = true;
      this.$store
        .dispatch("users/updateUser", this.editedItem)
        .then((state) => {
          if (state) {
            this.dialogs.edit = false;
          } else {
            this.dialogs.error = true;
          }
        });
    },
  },
  created() {
    moment.locale("tr");
    if (this.users.length <= 0) {
      this.$store.dispatch("users/getUsers");
    }
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  padding: 10px;
  margin-top: 20px;
}
.user-table {
  max-width: 600px;
  padding: 10px;
}
.table-item {
  color: red !important;
}
::v-deep .v-data-table__td {
  text-align: start !important;
}
</style>
