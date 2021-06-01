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

            <!-- SELECT OPTION FOR EXPORT TO EXCEL -->
            <v-menu bottom right :close-on-content-click="false">
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon small v-bind="attrs" v-on="on">
                  <v-icon small>mdi-file-export</v-icon>
                </v-btn>
              </template>

              <v-list>
                <v-list-item-content
                  v-for="(item, i) in excelTitles"
                  :key="i"
                  dense
                  class="pl-4 pr-4 pt-0 pb-0 ma-0"
                >
                  <v-checkbox
                    class="pa-0 ma-0  "
                    hide-details=""
                    v-model="selectedExcelTitle"
                    :label="item"
                    :value="item"
                  ></v-checkbox>
                </v-list-item-content>

                <v-btn
                  small
                  @click="exportToExcel"
                  :color="DTbtnColor"
                  dark
                  class="ma-4"
                  :loading="exportExecelLoading"
                >
                  EXPORT EXCEL
                </v-btn>
              </v-list>
            </v-menu>

            <!-- SELECT OPTION FOR EXPORT TO PDF -->
            <v-menu bottom right :close-on-content-click="false">
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon small v-bind="attrs" v-on="on">
                  <v-icon small>mdi-file-pdf</v-icon>
                </v-btn>
              </template>

              <v-list>
                <v-list-item-content
                  v-for="(item, i) in pdfTitles"
                  :key="i"
                  dense
                  class="pl-4 pr-4 pt-0 pb-0 ma-0"
                >
                  <v-checkbox
                    class="pa-0 ma-0  "
                    hide-details=""
                    v-model="selectedPDFTitle"
                    :label="item"
                    :value="item"
                  ></v-checkbox>
                </v-list-item-content>

                <v-list dense>
                  <v-subheader>Choose Layout</v-subheader>
                  <v-radio-group
                    v-model="pdfLayout"
                    mandatory
                    class="ma-0 ml-1 mr-1"
                  >
                    <v-radio label="landscape" value="l"></v-radio>
                    <v-radio label="portrait" value="p"></v-radio>
                  </v-radio-group>
                </v-list>

                <v-btn
                  small
                  @click="exportToPdf"
                  :color="DTbtnColor"
                  :loading="exportPDFLoading"
                  dark
                  class="mb-4 ml-4 mr-4"
                >
                  EXPORT PDF
                </v-btn>
              </v-list>
            </v-menu>

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
              <span class="v_toolbar_add_button_text">
                {{ $t("button.addAccounts") }}
              </span>
            </v-btn>
          </v-toolbar>
        </template>

        <!--COLUMN ID -->
        <template v-slot:[`item.id`]="{ item, index }">
          <div
            class="d-flex index_id_column"
            :title="item.account_status == '0' ? 'PENDING' : 'ACTIVE'"
          >
            <v-sheet
              :color="item.account_status == '0' ? 'orange' : 'green'"
              class="ma-0 pa-0"
              height="30"
              width="3"
            ></v-sheet>

            <span class="ma-1">{{ index + 1 }}</span>
          </div>
        </template>

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
        <v-card-text class="ma-0 ">
          <ValidationObserver ref="form">
            <v-row class="pl-6 mt-5 ">
              <!-- NAME -->
              <v-col md="3" sm="6" cols="12" class="">
                <ValidationProvider
                  rules="required"
                  name="NAME"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="editedItem.account_name"
                    :label="errors[0] ? errors[0] : 'NAME'"
                    :error-messages="errors"
                    dense
                    clearable
                    hide-details=""
                  >
                  </v-text-field>
                </ValidationProvider>
              </v-col>

              <!-- ACCOUNT NUMBER -->
              <v-col md="3" sm="6" cols="12" class="">
                <ValidationProvider
                  rules="required"
                  name="ACCOUNT NUMBER"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="editedItem.account_no"
                    :label="errors[0] ? errors[0] : 'ACCOUNT NUMBER'"
                    :error-messages="errors"
                    dense
                    clearable
                    hide-details=""
                  >
                  </v-text-field>
                </ValidationProvider>
              </v-col>

              <!-- OPENING BALANCE -->
              <v-col md="2" sm="6" cols="12" class="">
                <ValidationProvider
                  rules="required"
                  name="OPENING BALANCE"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="editedItem.account_op_balance"
                    :label="errors[0] ? errors[0] : 'OPENING BALANCE'"
                    :error-messages="errors"
                    dense
                    clearable
                    hide-details=""
                  >
                  </v-text-field>
                </ValidationProvider>
              </v-col>

              <!-- SWIFT CODE -->
              <v-col md="2" sm="6" cols="12" class="">
                <ValidationProvider
                  rules="required"
                  name="SWIFT CODE"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="editedItem.account_swift_code"
                    :label="errors[0] ? errors[0] : 'SWIFT CODE'"
                    :error-messages="errors"
                    dense
                    clearable
                    hide-details=""
                  >
                  </v-text-field>
                </ValidationProvider>
              </v-col>

              <!-- ACCOUNT TYPE -->
              <v-col md="2" sm="6" cols="12" class="">
                <ValidationProvider
                  rules="required"
                  name="ACCOUNT TYPE"
                  v-slot="{ errors }"
                >
                  <v-select
                    :items="accountTypeOptions"
                    v-model="editedItem.account_type"
                    :label="errors[0] ? errors[0] : 'ACCOUNT TYPE'"
                    :error-messages="errors"
                    hide-details=""
                    clearable
                    dense
                    item-text="option"
                    item-value="index"
                  ></v-select>
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

    <!-- VIEW MODEL -->
    <v-dialog v-model="formViewModel" max-width="374" scrollable>
      <v-card class=" " max-width="374">
        <v-card-title class="  d-flex">
          <v-sheet
            :color="editedItem.account_status == '0' ? 'orange' : 'green'"
            class=" "
            height="30"
            width="3"
          ></v-sheet>

          <p class="ma-2">{{ editedItem.account_name }}</p>
        </v-card-title>

        <v-card-text class="ma-0  ">
          <div class="d-flex justify-space-between">
            <p><v-icon left small>mdi-bank</v-icon> Account Number</p>
            <p>
              {{ editedItem.account_no }}
            </p>
          </div>

          <div class="d-flex justify-space-between">
            <p><v-icon left small>mdi-qrcode-edit</v-icon> Swift Code</p>
            <p>
              {{ editedItem.account_swift_code }}
            </p>
          </div>

          <div class="d-flex justify-space-between">
            <p>
              <v-icon left small>mdi-format-list-bulleted-type</v-icon> ACCOUNT
              TYPE
            </p>
            <p>
              {{
                editedItem.account_type == 1
                  ? "Current account"
                  : editedItem.account_type == 2
                  ? "Savings account"
                  : editedItem.account_type == 3
                  ? "Salary account"
                  : editedItem.account_type == 4
                  ? "Fixed deposit account"
                  : null
              }}
            </p>
          </div>

          <div class="d-flex justify-space-between">
            <p><v-icon left small>mdi-cash</v-icon> OPENING BALANCE</p>
            <p>Rs. {{ editedItem.account_op_balance }}</p>
          </div>
        </v-card-text>

        <v-divider class="mx-4"></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :color="DTbtnColor" text @click="formViewModel = false">
            CANCEL
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

      accountTypeOptions: [
        { option: "Current account", index: 1 },
        { option: "Savings account", index: 2 },
        { option: "Salary account", index: 3 },
        { option: "Fixed deposit account", index: 4 },
      ],

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
          text: "ACCOUNT NO",
          align: "center",
          sortable: true,
          value: "account_no",
          align: "start",
        },

        {
          text: "OP BALANCE",
          align: "center",
          sortable: true,
          value: "account_op_balance",
          align: "start",
        },

        {
          text: "SWIFT CODE",
          align: "center",
          sortable: true,
          value: "account_swift_code",
          align: "start",
        },

        {
          text: "TYPE",
          align: "center",
          sortable: true,
          value: "account_type",
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
      return this.editedIndex === -1 ? "NEW ACCOUNT" : "Edit ACCOUNT";
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
              account_no: e.account_no,
              account_op_balance: e.account_op_balance,
              account_status: e.account_status,
              account_swift_code: e.account_swift_code,
              account_type: e.account_type,
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
          account_name: this.editedItem.account_name,
          account_no: this.editedItem.account_no,
          account_op_balance: this.editedItem.account_op_balance,
          account_swift_code: this.editedItem.account_swift_code,
          account_type: this.editedItem.account_type,
          account_status: 0,
        };

        if (this.editedIndex > -1) {
          // UPDATE USER
          this.$http
            .put(this.url.baseURL + "/" + obj.id, obj)
            .then((response) => {
              this.submitLoading = false;
              this.onInitialize();

              this.closeForm();
              this.notification(
                "Record has been updated successfully",
                "green"
              );
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
              this.notification("Record  has been added successfully", "green");
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
          this.editedItem = Object.assign(i);
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
            console.log(i);

            this.itemData.splice(0);
            i.forEach((e) => {
              this.itemData.push(e);
            }, 4000);
            this.dataTableLoading = false;
          });
      } else {
        this.onInitialize(this.pageKey);
        this.itemData.splice(0);
        this.dataTableLoading = false;
      }
    },

    onRefresh() {
      this.onInitialize();
    },

    exportToExcel() {
      this.exportExecelLoading = true;
      let objects = [];
      this.itemData.forEach((element) => {
        objects.push({
          "ACCOUNT NAME": element.account_name,
          "ACCOUNT NUMBER": element.account_no,
          "OPENING BALANCE": element.account_op_balance,
          "SWIFT CODE": element.account_swift_code,
          "ACCOUNT TYPE": element.account_type,
        });
      });

      let jsonObject = objects;
      let selectedArray = this.selectedExcelTitle;
      let filteredJsonObject = jsonObject.map(function(entry) {
        return selectedArray.reduce(function(res, key) {
          res[key] = entry[key];
          return res;
        }, {});
      });

      let data = filteredJsonObject;
      let fileName = this.moment().unix() + "_file";
      try {
        json2excel({
          data,
          name: fileName,
          formateDate: "yyyy/mm/dd",
        });
        this.notification(
          fileName + " has been exported successfully",
          "green"
        );

        setTimeout(() => {
          this.exportExecelLoading = false;
        }, 4000);
      } catch (e) {
        console.error("export error");
        this.exportExecelLoading = false;
        this.notification(fileName + " Export Failed. Please try again", "red");
      }
    },

    exportToPdf() {
      this.exportPDFLoading = true;
      let fileName = this.moment().unix() + "_file";

      try {
        let user = JSON.parse(localStorage.getItem("user"));
        let header = [];
        let data = [];
        let jsonObject = data;
        let selectedArray = this.selectedPDFTitle;

        const pdf = new jsPDF({
          orientation: this.pdfLayout,
          unit: "mm",
          format: "a4",
          putOnlyUsedFonts: true,
          compress: true,
          //   encryption: {
          //     userPassword: user.phone,
          //     ownerPassword: "admin",
          //     userPermissions: ["print", "modify", "copy", "annot-forms"],
          //   },
        });

        this.selectedPDFTitle.forEach((element, key) => {
          header.push(element);
        });
        this.itemData.forEach((element) => {
          data.push({
            "ACCOUNT NAME": element.account_name,
            "ACCOUNT NUMBER": element.account_no,
            "OPENING BALANCE": element.account_op_balance.toString(),
            "SWIFT CODE": element.account_swift_code,
            "ACCOUNT TYPE": element.account_type,
          });
        });

        let filteredData = jsonObject.map(function(entry) {
          return selectedArray.reduce(function(res, key) {
            res[key] = entry[key];
            return res;
          }, {});
        });

        let headerConfig = header.map((key) => ({
          name: key,
          prompt: key,
          width: this.pdfLayout == "l" ? 76 : 52,
          align: "center",
          padding: 0,
        }));

        let ColumnConfig = {
          headerBackgroundColor: "#c5cae9",
          fontSize: 10,
          autoSize: false,
        };

        pdf.table(5, 5, filteredData, headerConfig, ColumnConfig);
        // pdf.autoPrint({ variant: "non-conform" });
        pdf.save(fileName + ".pdf");

        this.notification(
          fileName + " has been exported successfully",
          "green"
        );

        setTimeout(() => {
          this.exportPDFLoading = false;
        }, 4000);
      } catch (e) {
        console.error("export error", e);
        this.exportPDFLoading = false;
        this.notification(fileName + " Export Failed. Please try again", "red");
      }
    },

    onInitializeExportColumns() {
      // DEFINE COLUMNS FOR EXPORT OPTIONS
      this.excelTitles = [
        "ACCOUNT NAME",
        "ACCOUNT NUMBER",
        "SWIFT CODE",
        "OPENING BALANCE",
        "ACCOUNT TYPE",
      ];

      this.pdfTitles = [
        "ACCOUNT NAME",
        "ACCOUNT NUMBER",
        "SWIFT CODE",
        "OPENING BALANCE",
        "ACCOUNT TYPE",
      ];

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
