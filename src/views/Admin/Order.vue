<template>
  <div id="Order">
    <!-- Layout -->
    <DashboardLayout />

    <!-- DB TABLE -->
    <v-card color="pa-0" tile flat>
      <v-data-table
        :headers="headers"
        :items="orders"
        :fixed-header="true"
        :loading="dataTableLoading"
        :items-per-page="5"
        :footer-props="{
          'items-per-page-options': [pagination.total],
          prevIcon: '',
          nextIcon: '',
        }"
        loading-text="Fetching Data"
        height="85vh"
        id="dt_table_order"
        class="elevation-0"
        dense
        disable-pagination
      >
      </v-data-table>
    </v-card>

    <!-- NOTIFICATION -->
    <v-snackbar
      v-model="snackbar.show"
      :timeout="snackbar.time"
      :color="snackbar.color"
      top
      outlined
      right
    >
      <v-icon small color="red" left v-if="snackbar.color == 'red'">
        mdi-close-circle
      </v-icon>
      <v-icon small color="green" left v-else>mdi-check-circle</v-icon>
      {{ snackbar.message }}
    </v-snackbar>
  </div>
</template>

<script>
import DashboardLayout from "../../components/DashboardLayout";
import DialogCardLoading from "../../components/DialogCardLoading";
import moment from "moment";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { json2excel, excel2json } from "js2excel";
import { jsPDF } from "jspdf";
export default {
  name: "Order",
  components: {
    DashboardLayout,
    DialogCardLoading,
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      url: {
        order: "order",
      },
      dataTableLoading: true,
      dataTableFullscreen: false,

      existData: -1,
      appAccess: 0, //ACCESS PERMISSION FOR po
      editedIndex: -1,

      DTbtnColor: "indigo lighten-1 ",
      ModelHeaderColor: "blue-grey lighten-5",
      search: "",
      moment: moment,

      headers: [],
      orders: [],
      headersList: [],
      selectedHeaders: [],

      snackbar: {
        show: false,
        time: 3000,
        message: "",
        color: "",
      },
      pagination: {
        current: 1,
        localCurrentPage: parseInt(localStorage.getItem("po_pk")),
        total: 1,
      },
      dtPagination: {
        first_page_url: "",
        from: "",
        last_page: "",
        last_page_url: "",
        next_page_url: "",
        path: "",
        per_page: "",
        prev_page_url: "",
        to: "",
        total: "",
        links: [],
      },
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "NEW TASK" : "Edit TASK ";
    },
    submitBtn() {
      return this.editedIndex === -1 ? "SAVE" : "UPDATE";
    },
  },
  methods: {
    onExpandTable(e) {
      if (e == "e") {
        let x = this.$gl.onFullscreenDataTable("dt_table_task");
        if (x) this.dataTableFullscreen = true;
      } else {
        let x = this.$gl.onExitFullScreenDataTable();
        if (x) this.dataTableFullscreen = false;
      }
    },
    focusSearchKey() {
      this.$refs.searchbar_ref.$refs.input.focus();
    },
    onAccessPermission() {
      let access = JSON.parse(localStorage.getItem("token_access"));
      let currentUser = JSON.parse(localStorage.getItem("user"));
      this.appAccess = access[5];

      this.currentUser = Object.assign(currentUser);
    },
    notification(m, c) {
      this.snackbar = {
        show: true,
        message: m,
        color: c,
      };
    },
  },
};
</script>

<style></style>
