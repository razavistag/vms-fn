<template>
  <div id="Accounts">
    <!-- Layout -->
    <DashboardLayout />

    <!-- DB TABLE -->
    <v-card color="pa-0" tile flat>
      <v-data-table
        :headers="headers"
        :items="itemData"
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
        id="dt_table_accounts"
        class="elevation-0"
        dense
        disable-pagination
      >
        <!-- TABLE TOP -->
        <template v-slot:top>
          <v-toolbar flat id="toolbar">
            <v-toolbar-title class="h6" id="v_table_title_size">
              <!-- TABLE MAXIMIZE ICON -->
              <v-icon
                small
                left
                @click="onExpandTable('e')"
                v-if="!dataTableFullscreen"
                title="Expand Data Table"
              >
                mdi-image-filter-center-focus-strong
              </v-icon>

              <!-- TABLE MINIMIZE ICON -->
              <v-icon
                v-else
                @click="onExpandTable('m')"
                title="Minimize Data Table"
              >
                mdi-arrow-expand
              </v-icon>

              <!-- TABLE TITLE  -->
              <span v-animate-css="'fadeIn'">
                {{ $t("account.title") }}
              </span>
            </v-toolbar-title>

            <v-divider class="mx-4" inset vertical></v-divider>

            <!-- COPY TO Clipboard -->
            <v-btn icon small @click="onClipboard">
              <v-icon small>mdi-clipboard-edit-outline</v-icon>
            </v-btn>

            <v-spacer></v-spacer>
            <!-- SEARCH TEXT -->
            <div v-shortkey="['alt', 's']" @shortkey="focusSearchKey">
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                @input="onSearch"
                label="Search ..."
                ref="searchbar_ref"
                type="input"
                hide-details
                dense
                class="shrink mx-4 my-4  v_toolbar_search_text_field"
              >
              </v-text-field>
            </div>

            <!-- REFRESH BUTTONS -->
            <v-btn
              :color="DTbtnColor"
              class=" ma-1 text-center"
              id="v_toolbar_refresh_btn"
              outlined
              v-shortkey="['alt', 'r']"
              @shortkey="onRefresh()"
              small
              @click="onRefresh"
            >
              <v-icon left dark class="v_toolbar_refresh_icon">
                mdi-refresh
              </v-icon>

              <span class="v_toolbar_refresh_text">
                <!-- REFRESH -->
                {{ $t("button.refresh") }}
              </span>
            </v-btn>

            <!--HIDE COLUMNS-->
            <v-menu top :close-on-content-click="false">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  :color="DTbtnColor"
                  class=" ma-1"
                  outlined
                  small
                  v-bind="attrs"
                  v-on="on"
                  v-shortkey="['alt', 'd']"
                >
                  <v-icon left dark> mdi-eye </v-icon>

                  <span class="v_toolbar_display_column_text">
                    {{ $t("button.displayColumns") }}
                  </span>
                </v-btn>
              </template>
              <v-list>
                <v-list-item-content
                  v-for="(item, i) in headersList"
                  :key="i"
                  dense
                  class="pl-4 pr-4 pt-0 pb-0 ma-0"
                >
                  <v-checkbox
                    class="pa-0 ma-0  "
                    hide-details=""
                    v-model="selectedHeaders"
                    :label="item.text"
                    :value="item.value"
                    multiple
                    @change="onChangeColumn"
                  ></v-checkbox>
                </v-list-item-content>
              </v-list>
            </v-menu>

            <!-- ADD BUTTONS -->
            <v-btn
              :color="DTbtnColor"
              class=" ma-1"
              outlined
              small
              v-shortkey="['alt', 'n']"
              @shortkey="onNewDialog()"
              @click="onNewDialog"
              v-show="appAccess >= 2"
            >
              <v-icon left dark class=""> mdi-plus </v-icon>
              <span class="v_toolbar_add_project_text">
                {{ $t("button.addAccounts") }}
              </span>
            </v-btn>
          </v-toolbar>
        </template>

        <!-- CUSTOM COLUMN -->
        <!-- <template v-slot:[`item.coumnName`]="{ item }">
          {{ item.coumnName }}
        </template> -->

        <!-- TABLE ACTIONS -->
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            class="pa-2  ml-1 blue darken-1"
            id="dt-view-action-button"
            x-small
            dark
            title="View Projects"
            @click="onEditItem(item, 'view')"
          >
            mdi-eye
          </v-icon>

          <v-icon
            id="dt-edit-action-button"
            class="pa-2 ml-1 orange darken-1"
            x-small
            dark
            title="Edit Projects"
            @click="onEditItem(item, 'edit')"
            v-show="appAccess >= 3"
          >
            mdi-pencil
          </v-icon>

          <v-icon
            id="dt-trash-action-button"
            x-small
            dark
            class="pa-2 ml-1 red darken-1"
            title="Delete Projects"
            @click="onDeleteItem(item)"
            v-show="appAccess >= 4"
          >
            mdi-delete
          </v-icon>
        </template>

        <!-- FOOTER PAGE TEXT -->
        <template v-slot:[`footer.page-text`]>
          <div class="d-flex align-center justify-end dt_footer  ">
            <p class="pt-5">Projects Per Page: {{ dtPagination.per_page }}</p>

            <!-- <v-col cols="12" sm="2">
              <v-select
                v-model="selectedPageCount"
                :items="pageCount"
                dense
                hide-details=""
                hide-selected
                @change="onPaginateChange"
              ></v-select>
            </v-col> -->

            <p class="pt-5 ml-4">
              Projects: {{ dtPagination.from }} - {{ dtPagination.total }}
            </p>

            <v-pagination
              class="text-right"
              v-model="pagination.localCurrentPage"
              :length="pagination.total"
              @input="onInitialize"
              total-visible="0"
            ></v-pagination>
          </div>
        </template>

        <!-- EMPTY TABLE -->
        <template v-slot:no-data>
          <div v-if="existData == 1">
            <p class="pa-2">RECODES NOT FOUND</p>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- ADD MODEL FORM -->
    <v-dialog
      v-model="formAddmModel"
      max-width="1400px"
      persistent
      content-class="add-form-dialog"
      scrollable
    >
      <v-card tile flat>
        <DialogCardLoading />
        <v-card-title :class="ModelHeaderColor">
          <span class="headline blue-grey--text text--darken-3 d-flex">
            <v-icon left color="">mdi-timeline-text</v-icon> {{ formTitle }}
            <span v-if="editedIndex != -1">
              {{ editedItem.name }}
            </span>
          </span>
          <v-spacer></v-spacer>
          <v-icon @click="closeForm">mdi-close</v-icon>
        </v-card-title>

        <!-- MODEL BODY -->
        <v-card-text class="ma-0 pa-3 d-flex">
          <ValidationObserver ref="form">
            <v-row class="ma-0 pa-0  mt-5 ">
              <!-- CUSTOM TEXT FIELD -->
              <v-col md="12" sm="6" cols="12" class="">
                <ValidationProvider
                  rules="required"
                  name="CUSTOM TEXT FIELD"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="editedItem.custom"
                    :label="errors[0] ? errors[0] : 'CUSTOM TEXT FIELD'"
                    :error-messages="errors"
                    dense
                    hide-details=""
                  >
                  </v-text-field>
                </ValidationProvider>
              </v-col>
            </v-row>
          </ValidationObserver>
        </v-card-text>

        <v-card-actions class="fixed-bottom">
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeForm">
            Cancel
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="save"
            :loading="submitLoading"
          >
            {{ submitBtn }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- DELETE MODEL FORM -->
    <v-dialog v-model="formDeleteModel" max-width="550" persistent>
      <v-card>
        <v-card-title :class="ModelHeaderColor">
          DELETE CONFIRMATION

          <v-spacer></v-spacer>
          <v-icon @click="formDeleteModel = false">mdi-close</v-icon>
        </v-card-title>

        <v-card-text class="pa-3">
          ARE YOU SURE YOUR WANT TO
          <strong>DELETE </strong> ?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="formDeleteModel = false">
            CANCEL
          </v-btn>

          <v-btn color="red darken-1" text @click="onDeleteConfirm">
            DELETE
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
  name: "Accounts",
  components: {
    DashboardLayout,
    DialogCardLoading,
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      url: {
        baseURL: "account",
      },

      dataTableLoading: true,
      dataTableFullscreen: false,
      exportExecelLoading: false,
      exportPDFLoading: false,
      formDeleteModel: false,
      pdfLayout: null,
      submitLoading: false,
      formAddmModel: false,
      formViewModel: false,

      existData: -1,
      appAccess: 0, //ACCESS PERMISSION
      editedIndex: -1,

      moment: moment,
      pageKey: "accounts_pk",
      activeColumns: "accounts_active_columns",
      DTbtnColor: "indigo lighten-1 ",
      ModelHeaderColor: "blue-grey lighten-5",
      search: "",

      itemData: [], // Array for DataTable
      headers: [],
      headersList: [],
      selectedHeaders: [],
      excelTitles: [],
      pdfTitles: [],
      selectedExcelTitle: [],
      selectedPDFTitle: [],

      currentUser: {},
      editedItem: {},
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
      headersMap: [
        {
          text: "",
          align: "center",
          sortable: true,
          value: "id",
          align: "start",
          width: "1%",
        },

        {
          text: "NAME",
          align: "center",
          sortable: true,
          value: "account_name",
          align: "start",
        },

        {
          text: "Actions",
          value: "actions",
          sortable: false,
          width: "10%",
          align: "center",
          class: "dark--text",
        },
      ],
    };
  },
  created() {
    // console.log("initializing Accounts");
    // console.log("----------------------------------------------");
    localStorage.setItem(this.pageKey, 1);
    this.onInitialize(this.pageKey);
    this.datatableColumnVisibility(this.activeColumns);
  },
  beforeMount() {
    this.onAccessPermission();
    this.onInitializeExportColumns();
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "NEW " : "Edit ";
    },
    submitBtn() {
      return this.editedIndex === -1 ? "SAVE" : "UPDATE";
    },
  },

  methods: {
    onInitialize(e) {
      this.itemData.splice(0);
      this.$http
        .get(this.url.baseURL + "?page=" + e)
        .then((response) => {
          let i = response.data;
          console.log("onInitialize Account", i);
          this.dataTableLoading = false;
          this.dtPagination = {
            first_page_url: i.objects.first_page_url,
            from: i.objects.from,
            last_page: i.objects.last_page,
            last_page_url: i.objects.last_page_url,
            next_page_url: i.objects.next_page_url,
            path: i.objects.path,
            per_page: i.objects.per_page,
            prev_page_url: i.objects.prev_page_url,
            to: i.objects.to,
            total: i.objects.total,
            links: i.objects.links.forEach((element) => {
              element;
            }),
          };
          this.pagination.total = i.objects.last_page;

          i.objects.data.forEach((e) => {
            this.itemData.push({
              id: e.id,
              account_name: e.account_name,
            });
          });
        })
        .catch((err) => {
          if (err.response) {
            this.$gl.Unauthorized(err.response.status);
          }
        });
    },

    onNewDialog() {
      this.formAddmModel = true;
    },

    closeForm() {
      this.$nextTick(() => {
        this.formAddmModel = false;
        this.editedIndex = -1;
        this.$refs.form.reset();

        this.editedItem = Object.assign({});
      });
    },

    save() {
      this.$refs.form.validate().then((success) => {
        if (!success) {
          return;
        }

        this.submitLoading = true;

        const obj = {
          id: this.editedItem.id,
          name: this.editedItem.name,
        };

        if (this.editedIndex > -1) {
          // UPDATE USER
          this.$http
            .put(this.url.baseURL + obj.id, obj)
            .then((response) => {
              this.submitLoading = false;
              this.closeForm();
              this.notification("User has been updated successfully", "green");
            })
            .catch((err) => {
              this.submitLoading = false;

              this.notification("FAILED TO UPDATE .", "red");
              this.$gl.Unauthorized(err.response.status);
            });
        } else {
          // STORE USER
          this.$http
            .post(this.url.baseURL, obj)
            .then((response) => {
              this.onInitialize();
              this.closeForm();
              this.submitLoading = false;
              this.notification("User has been added successfully", "green");
            })
            .catch((err) => {
              this.submitLoading = false;

              this.notification("FAILED TO SAVE", "red");
            });
        }
      });
    },

    onEditItem(e, type) {
      this.editedIndex = this.itemData.indexOf(e);

      this.$http
        .get(this.url.baseURL + "/getEditItem/" + e.id)
        .then((response) => {
          let i = response.data.objects;
          this.editedItem.push(i);
        });

      if (type == "edit") {
        this.formAddmModel = true;
      } else {
        this.formViewModel = true;
      }
    },

    onDeleteItem(e) {
      this.formDeleteModel = true;
      this.editedItem = Object.assign(e);
    },

    onDeleteConfirm() {
      /**  server API and Function for delete **/
      this.$http
        .delete(this.url.baseURL + "/" + this.editedItem.id)
        .then((response) => {
          this.notification(response.data.message, "green");
          this.onInitialize();
          this.formDeleteModel = false;
        })
        .catch((response) => {
          this.notification("Error Fround. ITEM NOT DELETED", "red");
        });
    },

    onSearch(e) {
      /** Define page key | objects to array | server API and Function for search **/
      this.dataTableLoading = true;
      if (this.search.length > 0) {
        this.$http
          .get(this.url.baseURL + "/getSearchItem/" + e)
          .then((response) => {
            let i = response.data.objects;
            this.itemData.splice(0);
            i.forEach((e) => {
              this.itemData.push({
                id: e.id,
                column1: e.column1,
                column2: e.column2,
              });
            }, 4000);
            this.dataTableLoading = false;
          });
      } else {
        this.itemData.splice(0);
        this.onInitialize(this.pageKey);
        this.dataTableLoading = false;
      }
    },

    onRefresh() {
      this.onInitialize();
    },

    onInitializeExportColumns() {
      // DEFINE COLUMNS FOR EXPORT OPTIONS
      this.excelTitles = ["COLUMN 1", "COLUMN 2"];

      this.pdfTitles = ["COLUMN 1", "COLUMN 2"];

      this.selectedExcelTitle = this.excelTitles;
      this.selectedPDFTitle = this.excelTitles;
    },
    onChangeColumn(e) {
      this.headers.splice(0);
      localStorage.setItem(this.activeColumns, JSON.stringify(e));
      let headersMap = this.headersMap;
      let selected_arr = e;
      let filtered = headersMap.filter(({ value }) =>
        selected_arr.includes(value)
      );

      filtered.forEach((element) => {
        this.headers.push(element);
      });
    },
    datatableColumnVisibility(e) {
      let x = JSON.parse(localStorage.getItem(e));
      let y = this.headersMap.slice(1, -1);

      y.forEach((element) => {
        this.headersList.push(element);
      });

      if (x == null) {
        let obj = this.headersMap;
        let result = obj.map((col) => col.value);
        localStorage.setItem(e, JSON.stringify(result));

        result.forEach((element) => {
          this.selectedHeaders.push(element);
        });
        this.headersMap.forEach((element) => {
          this.headers.push(element);
        });
      } else {
        x.forEach((element) => {
          this.selectedHeaders.push(element);
        });

        let headersMap = this.headersMap;
        let selected_arr = x;
        let filtered = headersMap.filter(({ value }) =>
          selected_arr.includes(value)
        );

        this.headers.splice(0);
        filtered.forEach((element) => {
          this.headers.push(element);
        });
      }
    },

    onClipboard() {
      let jsonObject = JSON.stringify(this.itemData);
      navigator.clipboard.writeText(jsonObject);
    },

    onAccessPermission() {
      let access = JSON.parse(localStorage.getItem("token_access"));
      let currentUser = JSON.parse(localStorage.getItem("user"));
      this.appAccess = access[7];

      this.currentUser = Object.assign(currentUser);
    },

    focusSearchKey() {
      this.$refs.searchbar_ref.$refs.input.focus();
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
