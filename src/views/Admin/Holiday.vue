<template>
  <div id="Holiday">
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
        id="dt_table_holiday"
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
                {{ $t("holiday.title") }}
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

            <!-- CALANDER VIEW -->
            <v-btn icon small @click="updateRange">
              <v-icon small>mdi-calendar-multiple-check</v-icon>
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

        <!-- COLUMN ID -->
        <template v-slot:[`item.id`]="{ item, index }">
          <div
            class="d-flex index_id_column"
            :title="item.holiday_status == '0' ? 'PENDING' : 'ACTIVE'"
          >
            <v-sheet
              :color="item.holiday_status == '0' ? 'orange' : 'green'"
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
            title="View"
            @click="onEditItem(item, 'view')"
          >
            mdi-eye
          </v-icon>

          <v-icon
            id="dt-edit-action-button"
            class="pa-2 ml-1 orange darken-1"
            x-small
            dark
            title="Edit "
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
             title="Delete "
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
        <v-card-text class="ma-0 pa-3  ">
          <ValidationObserver ref="form">
            <v-row class="ma-0 pa-0  mt-5 ">
              <!--TITLE -->
              <v-col md="3" sm="6" cols="12" class="">
                <ValidationProvider
                  rules="required"
                  name="HOLIDAY TITLE"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="editedItem.holiday_title"
                    :label="errors[0] ? errors[0] : 'HOLIDAY TITLE'"
                    :error-messages="errors"
                    dense
                    hide-details=""
                  >
                  </v-text-field>
                </ValidationProvider>
              </v-col>

              <!-- TYPE -->
              <v-col md="2" sm="6" cols="12" class="">
                <ValidationProvider
                  rules="required"
                  name="HOLIDAY TYPE"
                  v-slot="{ errors }"
                >
                  <v-select
                    :items="holidayTypeOptions"
                    v-model="editedItem.holiday_type"
                    :label="errors[0] ? errors[0] : 'HOLIDAY TYPE'"
                    :error-messages="errors"
                    hide-details=""
                    clearable
                    dense
                    item-text="option"
                    item-value="index"
                  ></v-select>
                </ValidationProvider>
              </v-col>

              <!-- IS REPERAT -->
              <v-col md="2" sm="6" cols="12" class="">
                <ValidationProvider
                  rules="required"
                  name="REPEAT"
                  v-slot="{ errors }"
                >
                  <v-select
                    :items="repeatOptions"
                    v-model="editedItem.is_repeat"
                    :label="errors[0] ? errors[0] : 'REPEAT'"
                    :error-messages="errors"
                    hide-details=""
                    clearable
                    dense
                    item-text="option"
                    item-value="index"
                  ></v-select>
                </ValidationProvider>
              </v-col>

              <!--   DATE -->
              <v-col md="2" sm="6" cols="6">
                <ValidationProvider
                  rules="required"
                  name="DATE"
                  v-slot="{ errors }"
                >
                  <v-menu
                    v-model="datePicker"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <ValidationProvider
                        rules="required"
                        name="DATE"
                        v-slot="{ errors }"
                      >
                        <v-text-field
                          v-model="editedItem.holiday_date"
                          :label="errors[0] ? errors[0] : 'DATE'"
                          :error-messages="errors"
                          hide-details=""
                          dense
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </ValidationProvider>
                    </template>
                    <v-date-picker
                      v-model="editedItem.holiday_date"
                      dateFormat="mm-YYYY"
                      :color="DTbtnColor"
                      @input="datePicker = false"
                    ></v-date-picker>
                  </v-menu>
                </ValidationProvider>
              </v-col>

              <!-- STATUS -->
              <v-col md="2" sm="6" cols="12" class="">
                <ValidationProvider
                  rules="required"
                  name="STATUS"
                  v-slot="{ errors }"
                >
                  <v-select
                    :items="statusOption"
                    v-model="editedItem.holiday_status"
                    :label="errors[0] ? errors[0] : 'STATUS'"
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

          <p class="ma-2">{{ editedItem.holiday_title }}</p>
        </v-card-title>

        <v-card-text class="ma-0  ">
          <div class="d-flex justify-space-between">
            <p><v-icon left small>mdi-calendar-check</v-icon> HOLIDAY DATE</p>
            <p>
              {{ editedItem.holiday_date }}
            </p>
          </div>

          <div class="d-flex justify-space-between">
            <p><v-icon left small>mdi-call-merge</v-icon> TYPE</p>
            <p>
              {{
                editedItem.holiday_type == 1 ? "HALF DAY OFF" : "FULL DAY OFF"
              }}
            </p>
          </div>

          <div class="d-flex justify-space-between">
            <p><v-icon left small>mdi-repeat</v-icon> IS REPEAT</p>
            <p>{{ editedItem.is_repeat == 0 ? "NO" : "YES" }}</p>
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

    <!-- CALANDER VIEW MODEL -->
    <v-dialog v-model="calanderView" max-width="374" fullscreen scrollable>
      <v-card class=" " flat tile max-width="374">
        <DialogCardLoading />
        <v-card-title :class="ModelHeaderColor">
          <span class="headline blue-grey--text text--darken-3 d-flex">
            HOLIDAY CALENDAR
          </span>
          <v-spacer></v-spacer>
          <v-icon @click="calanderView = false">mdi-close</v-icon>
        </v-card-title>
        <v-card-text class=" ma-2 ">
          <div class="d-flex justify-space-between">
            <v-row class="fill-height">
              <v-col>
                <v-sheet height="64">
                  <v-toolbar flat>
                    <v-btn
                      outlined
                      class="mr-4"
                      color="grey darken-2"
                      @click="setToday"
                    >
                      Today
                    </v-btn>
                    <v-btn fab text small color="grey darken-2" @click="prev">
                      <v-icon small>
                        mdi-chevron-left
                      </v-icon>
                    </v-btn>
                    <v-btn fab text small color="grey darken-2" @click="next">
                      <v-icon small>
                        mdi-chevron-right
                      </v-icon>
                    </v-btn>
                    <v-toolbar-title v-if="$refs.calendar">
                      {{ $refs.calendar.title }}
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-menu bottom right>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          outlined
                          color="grey darken-2"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <span>{{ typeToLabel[type] }}</span>
                          <v-icon right>
                            mdi-menu-down
                          </v-icon>
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item @click="type = 'day'">
                          <v-list-item-title>Day</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="type = 'week'">
                          <v-list-item-title>Week</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="type = 'month'">
                          <v-list-item-title>Month</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="type = '4day'">
                          <v-list-item-title>4 days</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-toolbar>
                </v-sheet>
                <v-sheet height="600">
                  <v-calendar
                    ref="calendar"
                    v-model="focus"
                    color="primary"
                    :events="events"
                    :event-color="getEventColor"
                    :type="type"
                    @click:event="showEvent"
                    @click:more="viewDay"
                    @click:date="viewDay"
                    @change="updateRange"
                  ></v-calendar>
                  <v-menu
                    v-model="selectedOpen"
                    :close-on-content-click="false"
                    :activator="selectedElement"
                    offset-x
                  >
                    <v-card color="grey lighten-4" min-width="350px" flat>
                      <v-toolbar :color="selectedEvent.color" dark>
                        <v-toolbar-title
                          v-html="selectedEvent.name"
                        ></v-toolbar-title>
                      </v-toolbar>
                    </v-card>
                  </v-menu>
                </v-sheet>
              </v-col>
            </v-row>
          </div>
        </v-card-text>

        <v-divider class="mx-4"></v-divider>
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
        baseURL: "holiday",
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
      datePicker: false,
      calanderView: false,

      existData: -1,
      appAccess: 0, //ACCESS PERMISSION
      editedIndex: -1,

      moment: moment,
      pageKey: "holiday_pk",
      activeColumns: "holiday_active_columns",
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

      holidayTypeOptions: [
        { option: "HALF DAY OFF", index: 1 },
        { option: "FULL DAY OFF", index: 2 },
      ],
      repeatOptions: [
        { option: "YES", index: 1 },
        { option: "NO", index: 0 },
      ],

      statusOption: [
        { option: "ACTIVE", index: 1 },
        { option: "PENDING", index: 0 },
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
        localCurrentPage: parseInt(localStorage.getItem("holiday_pk")),
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
          text: "Date",
          align: "center",
          sortable: true,
          value: "holiday_date",
          align: "start",
        },
        {
          text: "TITLE",
          align: "center",
          sortable: true,
          value: "holiday_title",
          align: "start",
        },
        {
          text: "TYPE",
          align: "center",
          sortable: true,
          value: "holiday_type",
          align: "start",
        },

        {
          text: "Actions",
          value: "actions",
          sortable: false,
          width: "15%",
          align: "center",
          class: "dark--text",
        },
      ],

      //   v-calander
      focus: "",
      type: "month",
      typeToLabel: {
        month: "Month",
        week: "Week",
        day: "Day",
        "4day": "4 Days",
      },
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      colors: [
        "blue",
        "indigo",
        "deep-purple",
        "cyan",
        "green",
        "orange",
        "grey darken-1",
      ],
      holidayTitle: [],
    };
  },
  created() {
    // console.log("initializing");
    // console.log("----------------------------------------------");
    localStorage.setItem(this.pageKey, 1);
    this.onInitialize(this.pageKey);
    this.datatableColumnVisibility(this.activeColumns);
  },
  beforeMount() {
    this.onAccessPermission();
    this.onInitializeExportColumns();
  },
  mounted() {
    // this.$refs.calendar.checkChange();
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "NEW HOLIDAY" : "Edit HOLIDAY";
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
          console.log("onInitialize Holiday", i);
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
            this.itemData.push(e);
            this.holidayTitle.push(e.holiday_title);
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
          holiday_date: this.editedItem.holiday_date,
          holiday_status: this.editedItem.holiday_status,
          holiday_title: this.editedItem.holiday_title,
          holiday_type: this.editedItem.holiday_type,
          is_repeat: this.editedItem.is_repeat,
        };

        if (this.editedIndex > -1) {
          // UPDATE
          this.$http
            .put(this.url.baseURL + "/" + obj.id, obj)
            .then((response) => {
              this.submitLoading = false;
              this.onInitialize();
              this.closeForm();
              this.notification(
                "Recode has been updated successfully",
                "green"
              );
            })
            .catch((err) => {
              this.submitLoading = false;

              this.notification("FAILED TO UPDATE .", "red");
              this.$gl.Unauthorized(err.response.status);
            });
        } else {
          // STORE
          this.$http
            .post(this.url.baseURL, obj)
            .then((response) => {
              this.onInitialize();
              this.closeForm();
              this.submitLoading = false;
              this.notification("Recode has been added successfully", "green");
            })
            .catch((err) => {
              this.submitLoading = false;

              this.notification("FAILED TO SAVE", "red");
            });
        }
      });
    },

    onEditItem(e, type) {
      this.editedItem = Object.assign({});
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
        this.itemData.splice(0);
        this.onInitialize(this.pageKey);
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
          DATE: element.holiday_date,
          TITLE: element.holiday_title,
          TYPE: element.holiday_type,
          REPEAT: element.is_repeat,
          STATUS: element.holiday_status == 0 ? "PENDING" : "ACTIVE",
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
            DATE: element.holiday_date,
            TITLE: element.holiday_title,
            TYPE: element.holiday_type,
            REPEAT: element.is_repeat,
            STATUS: element.holiday_status == 0 ? "PENDING" : "ACTIVE",
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
          width: this.pdfLayout == "l" ? 94 : 64,
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
      this.excelTitles = ["DATE", "TITLE", "REPEAT", "STATUS"];

      this.pdfTitles = ["DATE", "TITLE", "REPEAT", "STATUS"];
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
      this.appAccess = access[8];

      this.currentUser = Object.assign(currentUser);
    },

    focusSearchKey() {
      this.$refs.searchbar_ref.$refs.input.focus();
    },

    onExpandTable(e) {
      if (e == "e") {
        let x = this.$gl.onFullscreenDataTable("dt_table_holiday");
        if (x) this.dataTableFullscreen = true;
      } else {
        let x = this.$gl.onExitFullScreenDataTable();
        if (x) this.dataTableFullscreen = false;
      }
    },

    notification(m, c) {
      this.snackbar = {
        show: true,
        message: m,
        color: c,
      };
    },

    // v-calander function
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.selectedOpen = true))
        );
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    updateRange({ start, end }) {
      this.calanderView = true;
      console.log(start, end);
      const events = [];
      this.itemData.forEach((element) => {
        events.push({
          name: element.holiday_title,
          start: element.holiday_date,
          color: this.colors[this.rnd(0, this.colors.length - 1)],
        });
      });
      this.events = events;
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
  },
};
</script>

<style></style>
