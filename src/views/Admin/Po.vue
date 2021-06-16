<template>
  <div id="Dashboard">
    <!-- Layout -->
    <DashboardLayout />

    <!-- DB TABLE -->
    <v-card color="pa-0" tile flat>
      <v-data-table
        :headers="headers"
        :items="pos"
        :fixed-header="true"
        :loading="dataTableLoading"
        :items-per-page="-1"
        :footer-props="{
          prevIcon: '',
          nextIcon: '',
        }"
        loading-text="Fetching Data"
        height="85vh"
        id="dt_table_podashboard"
        class="elevation-0"
        dense
      >
        <!-- TABLE TOP -->
        <template v-slot:top>
          <v-toolbar flat id="toolbar">
            <v-toolbar-title class="h6" id="v_table_title_size">
              <!-- TABLE MAXIMIZE ICON -->
              <v-icon
                small
                left
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
                {{ $t("po.title") }}
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
                label="Search ..."
                ref="searchbar_ref"
                type="input"
                hide-details
                dense
                class="shrink mx-4 my-4  v_toolbar_search_text_field"
              >
                <template v-slot:append>
                  <v-icon
                    :class="DTbtnColor + 'pa-1 rounded-top pointer'"
                    color="white"
                    @click="onSearch(search)"
                  >
                    mdi-magnify
                  </v-icon>
                </template>
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
                {{ $t("button.addpo") }}
              </span>
            </v-btn>
          </v-toolbar>
        </template>

        <!--COLUMN ID -->
        <template v-slot:[`item.id`]="{ item, index }">
          <div
            class="d-flex index_id_column"
            :title="
              item.status == '1'
                ? 'PENDING'
                : item.status == '2'
                ? 'CHECKING'
                : item.status == '3'
                ? 'ACTIVE'
                : null
            "
          >
            <v-sheet
              :color="
                item.status == '1'
                  ? 'orange'
                  : item.status == '2'
                  ? 'blue'
                  : item.status == '3'
                  ? 'green'
                  : null
              "
              class="ma-0 pa-0"
              height="30"
              width="3"
            ></v-sheet>
            <span class="ma-1">{{ index + 1 }}</span>
          </div>
        </template>

        <!-- COLUMN PRIORITY -->
        <template v-slot:[`item.priority`]="{ item }">
          <v-chip
            x-small
            :color="
              item.priority == 'CRITICAL'
                ? '#C62828'
                : item.priority == 'HIGH'
                ? '#F57C00'
                : item.priority == 'MEDIUM'
                ? '#0091EA'
                : item.priority == 'LOW'
                ? '#4527A0'
                : null
            "
            dark
          >
            {{ item.priority }}
          </v-chip>
        </template>

        <!-- TABLE ACTIONS -->
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            class="pa-2 teal darken-1"
            id="dt-attchment-action-button"
            x-small
            dark
            title="Attachments"
            v-if="item.attachments"
            @click="onAttachment(item)"
          >
            mdi-attachment mdi-rotate-90
          </v-icon>

          <v-icon
            class="pa-2 teal darken-1"
            id="dt-attchment-action-button"
            x-small
            dark
            title="No Attachments found"
            v-else
          >
            mdi-attachment mdi-rotate-90 mdi-dark
          </v-icon>

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
            <p class="pt-5 ml-4">
              Items: {{ dtPagination.from }} - {{ dtPagination.total }}
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
      content-class="po-form-dialog"
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
            <v-row
              class="ma-0 pa-0  mt-5 poFormStyle"
              v-for="(i, k) in formList"
              :key="k"
            >
              <!-- AXIOS PROGRESS -->
              <v-col
                md="12"
                sm="3"
                cols="12"
                class="ma-0 pa-0 "
                v-if="i.AxiosProgressCount != 0"
              >
                <v-progress-linear
                  v-model="i.AxiosProgressCount"
                  height="15"
                  class="w-50"
                  buffer-value="0"
                  stream
                >
                  <span class="blue-grey--text text--lighten-1">{{
                    i.AxiosProgressCount
                  }}</span>
                </v-progress-linear>
              </v-col>

              <v-col
                md="12"
                sm="3"
                cols="12"
                class="ma-0 pa-0 "
                v-if="i.AxiosSuccess == true"
                buffer-value="0"
                stream
              >
                <v-progress-linear
                  :color="i.AxiosSuccessResponse == 200 ? 'teal' : 'red'"
                  value="100"
                  height="15"
                  class="w-50"
                >
                  <span class="white--text">{{ i.AxiosSuccessMessage }}</span>
                </v-progress-linear>
              </v-col>

              <!-- ST DATE -->
              <v-col md="1" sm="3" cols="12" class="">
                <ValidationProvider
                  rules="required"
                  name="St Date"
                  v-slot="{ errors }"
                >
                  <v-menu
                    v-model="i.stDatePicker"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <ValidationProvider
                        rules="required"
                        name="St Date"
                        v-slot="{ errors }"
                      >
                        <v-text-field
                          v-model="i.stDate"
                          :label="errors[0] ? errors[0] : 'St Date'"
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
                      v-model="i.stDate"
                      dateFormat="mm-YYYY"
                      :color="DTbtnColor"
                      @input="i.stDatePicker = false"
                    ></v-date-picker>
                  </v-menu>
                </ValidationProvider>
              </v-col>

              <!-- AGENT -->
              <v-col md="2" sm="3" cols="12" class="">
                <ValidationProvider
                  rules="required"
                  name="Agent"
                  v-slot="{ errors }"
                >
                  <v-autocomplete
                    v-model="i.userSelectedList"
                    :items="agentUserList"
                    :search-input.sync="getAgentUserList"
                    :label="errors[0] ? errors[0] : 'Agent'"
                    :error-messages="errors"
                    item-text="name"
                    item-value="id"
                    return-object
                    dense
                    hide-no-data
                    hide-details=""
                    hide-selected
                    single-line
                  >
                    <template v-slot:selection="data">
                      {{ data.item.name }}
                    </template>
                    <template v-slot:item="{ item }">
                      {{ item.name }}
                    </template>
                  </v-autocomplete>
                </ValidationProvider>
              </v-col>

              <!-- VENDOR -->
              <v-col md="2" sm="3" cols="12" class="">
                <ValidationProvider
                  rules="required"
                  name="Vendor"
                  v-slot="{ errors }"
                >
                  <v-autocomplete
                    v-model="i.vendorSelectedList"
                    :items="vendorUserList"
                    :search-input.sync="getVendortUserList"
                    :label="errors[0] ? errors[0] : 'Vendor'"
                    :error-messages="errors"
                    item-text="name"
                    item-value="id"
                    return-object
                    dense
                    hide-no-data
                    hide-details=""
                    hide-selected
                    single-line
                  >
                    <template v-slot:selection="data">
                      {{ data.item.name }}
                    </template>
                    <template v-slot:item="{ item }">
                      {{ item.name }}
                    </template>
                  </v-autocomplete>
                </ValidationProvider>
              </v-col>

              <!-- CUSTOMER -->
              <v-col md="2" sm="3" cols="12" class="">
                <ValidationProvider
                  rules="required"
                  name="Customer"
                  v-slot="{ errors }"
                >
                  <v-autocomplete
                    v-model="i.customerSelectedList"
                    :items="customerUserList"
                    :search-input.sync="getCustomertUserList"
                    :label="errors[0] ? errors[0] : 'Customer'"
                    :error-messages="errors"
                    item-text="name"
                    item-value="id"
                    return-object
                    dense
                    hide-no-data
                    hide-details=""
                    hide-selected
                    single-line
                  >
                    <template v-slot:selection="data">
                      {{ data.item.name }}
                    </template>
                    <template v-slot:item="{ item }">
                      {{ item.name }}
                    </template>
                  </v-autocomplete>
                </ValidationProvider>
              </v-col>

              <!-- REQUESTEDBY -->
              <v-col md="2" sm="3" cols="12" class="">
                <ValidationProvider
                  rules="required"
                  name="Requested by"
                  v-slot="{ errors }"
                >
                  <v-autocomplete
                    v-model="i.requestedBySelectedList"
                    :items="requestedUserList"
                    :search-input.sync="getRequestedtUserList"
                    :label="errors[0] ? errors[0] : 'Requested by'"
                    :error-messages="errors"
                    item-text="name"
                    item-value="id"
                    return-object
                    dense
                    hide-no-data
                    hide-details=""
                    hide-selected
                    single-line
                  >
                    <template v-slot:selection="data">
                      {{ data.item.name }}
                    </template>
                    <template v-slot:item="{ item }">
                      {{ item.name }}
                    </template>
                  </v-autocomplete>
                </ValidationProvider>
              </v-col>

              <!-- COPMANY -->
              <v-col md="2" sm="3" cols="12" class="">
                <ValidationProvider
                  rules="required"
                  name="Company"
                  v-slot="{ errors }"
                >
                  <v-autocomplete
                    v-model="i.companySelectedList"
                    :items="companyUserList"
                    :search-input.sync="getCompanyUserList"
                    :label="errors[0] ? errors[0] : 'Company'"
                    :error-messages="errors"
                    item-text="company"
                    item-value="company"
                    return-object
                    dense
                    hide-no-data
                    hide-details=""
                    hide-selected
                    single-line
                    spellcheck="false"
                  >
                    <template v-slot:selection="data">
                      {{ data.item.company }}
                    </template>
                    <template v-slot:item="{ item }">
                      {{ item.company }}
                    </template>
                  </v-autocomplete>
                </ValidationProvider>
              </v-col>

              <!-- ADD / REMOVE TAB -->
              <v-col
                md="1"
                sm="3"
                cols="12"
                class="white d-flex justify-center"
              >
                <!-- REMOVE ROW BUTTON -->
                <v-btn
                  depressed
                  plain
                  icon
                  color="red"
                  v-if="formList.length > 1"
                  @click="remomvePOList(k)"
                >
                  <v-icon>
                    mdi-delete
                  </v-icon>
                </v-btn>
                <!-- ADD ROW BUTTON -->
                <v-btn
                  depressed
                  plain
                  icon
                  :color="DTbtnColor"
                  v-if="k == formList.length - 1"
                  @click="addNewPO(k)"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-col>

              <!-- PRIORITY -->
              <v-col md="2" sm="3" cols="12" class="">
                <ValidationProvider
                  rules="required"
                  name="Priority"
                  v-slot="{ errors }"
                >
                  <v-select
                    :items="priorityOptions"
                    v-model="i.priority"
                    :label="errors[0] ? errors[0] : 'Priority'"
                    :error-messages="errors"
                    class="pa-0 ma-0"
                    hide-details=""
                    dense
                    item-text="option"
                    item-value="index"
                  ></v-select>
                </ValidationProvider>
              </v-col>

              <!-- CUS PO NUMBER -->
              <v-col md="2" sm="3" cols="12" class="">
                <ValidationProvider
                  rules="required"
                  name="Cus Po Number"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="i.cus_po_number"
                    :label="errors[0] ? errors[0] : 'Cus Po Number'"
                    :error-messages="errors"
                    dense
                    hide-details=""
                  >
                  </v-text-field>
                </ValidationProvider>
              </v-col>

              <!--  PO NUMBER -->
              <v-col md="1" sm="3" cols="12" class="">
                <ValidationProvider
                  rules="required"
                  name="PO Number"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="i.po_number"
                    :label="errors[0] ? errors[0] : 'PO Number'"
                    :error-messages="errors"
                    dense
                    hide-details=""
                  >
                  </v-text-field>
                </ValidationProvider>
              </v-col>

              <!--  CO NUMBER -->
              <v-col md="1" sm="3" cols="12" class="">
                <ValidationProvider
                  rules="required"
                  name="CO Number"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="i.control_number"
                    :label="errors[0] ? errors[0] : 'CO Number'"
                    :error-messages="errors"
                    dense
                    hide-details=""
                  >
                  </v-text-field>
                </ValidationProvider>
              </v-col>

              <!--  STYLE -->
              <v-col md="1" sm="3" cols="12" class="">
                <ValidationProvider
                  rules="required"
                  name="Style"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="i.style"
                    :label="errors[0] ? errors[0] : 'Style'"
                    :error-messages="errors"
                    dense
                    hide-details=""
                  >
                  </v-text-field>
                </ValidationProvider>
              </v-col>

              <!--  NOS -->
              <v-col md="1" sm="3" cols="12" class="">
                <ValidationProvider
                  rules="required"
                  name="NOS"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="i.nos"
                    :label="errors[0] ? errors[0] : 'NOS'"
                    :error-messages="errors"
                    dense
                    hide-details=""
                  >
                  </v-text-field>
                </ValidationProvider>
              </v-col>

              <!--  QTY -->
              <v-col md="1" sm="3" cols="12" class="">
                <ValidationProvider
                  rules="required"
                  name="QTY"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="i.qty"
                    :label="errors[0] ? errors[0] : 'QTY'"
                    :error-messages="errors"
                    dense
                    hide-details=""
                  >
                  </v-text-field>
                </ValidationProvider>
              </v-col>

              <!--  TOTAL -->
              <v-col md="1" sm="3" cols="12" class="">
                <ValidationProvider
                  rules="required"
                  name="TOTAL"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="i.total"
                    :label="errors[0] ? errors[0] : 'TOTAL'"
                    :error-messages="errors"
                    dense
                    hide-details=""
                  >
                  </v-text-field>
                </ValidationProvider>
              </v-col>

              <!--  ATTACHMENTS -->
              <v-col md="2" sm="3" cols="12" class="">
                <ValidationProvider
                  rules=""
                  name="ATTACHMENTS"
                  v-slot="{ errors }"
                >
                  <v-file-input
                    v-model="i.attachments"
                    multiple
                    prepend-icon=""
                    :label="errors[0] ? errors[0] : 'ATTACHMENTS'"
                    dense
                    hide-details=""
                    @change="onAttachmentSelected($event, k)"
                  >
                    <template v-slot:selection="{ index, text }">
                      <span
                        v-if="index < 1"
                        class="overline grey--text text--darken-3 ml-2"
                      >
                        {{ i.attachments.length }} Files Attched
                      </span>
                    </template>
                  </v-file-input>
                </ValidationProvider>
              </v-col>

              <!-- ATTACHMENT LISTS -->
              <v-col
                md="12"
                sm="12"
                cols="12"
                class="  d-flex align-center blue-grey lighten-4 pa-0 pl-2"
                v-if="i.attachments.length > 0"
              >
                <p class="ma-1">ATTACHMENTS:</p>
                <div v-for="(i, index) in i.attachments" :key="index">
                  <v-chip
                    small
                    class="ma-1 white--text"
                    close
                    color="blue-grey"
                    @click:close="removeAttachment(k, index)"
                  >
                    <v-icon
                      left
                      small
                      v-if="editedIndex != -1"
                      @click="viewEditAttachment(i.name)"
                    >
                      mdi-table-eye
                    </v-icon>
                    {{ i.name }}
                  </v-chip>
                </div>
              </v-col>

              <!-- OVERLAY -->
              <v-overlay :value="overlay">
                <v-progress-circular
                  indeterminate
                  size="64"
                ></v-progress-circular>
              </v-overlay>
            </v-row>
          </ValidationObserver>
        </v-card-text>
        <v-card-actions class="fixed-bottom">
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeForm" plain>
            Cancel
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="save"
            :loading="submitLoading"
            plain
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
          ARE YOU SURE YOUR WANT TO DELETE
          <strong> PO - {{ editedItem.po_number }}</strong> ?
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

    <!-- VIEWMODEL -->
    <v-dialog
      v-model="formViewModel"
      max-width="1400px"
      persistent
      content-class="po-form-dialog"
      scrollable
    >
      <v-card tile flat>
        <DialogCardLoading />
        <v-card-title :class="ModelHeaderColor">
          <span class="headline blue-grey--text text--darken-3 d-flex">
            <v-icon left color="">mdi-timeline-text</v-icon>
            PO VIEW
          </span>
          <v-spacer></v-spacer>
          <v-icon @click="formViewModel = false">mdi-close</v-icon>
        </v-card-title>

        <!-- MODEL BODY -->
        <v-card-text class="ma-0 pa-3 d-flex">
          <v-row
            class="ma-0 pa-0  mt-5 poViewFormStyle"
            v-for="(i, k) in formList"
            :key="k"
          >
            <!-- ST DATE -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="po_user_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-calendar</v-icon>
                <strong> ST DATE </strong>
              </div>
              <div class="ml-7">
                {{ i.stDate }}
              </div>
            </v-col>

            <!-- AGENT NAME -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="po_user_col_border d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-clipboard-account</v-icon>
                <strong> AGENT NAME -</strong>
              </div>
              <div class="ml-7">
                {{ i.userSelectedList.name }}
              </div>
            </v-col>

            <!-- AGENT EMAIL -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="po_user_col_border d-flex flex-column align-start "
            >
              <div>
                <v-icon small left>mdi-email-outline</v-icon>
                <strong> AGENT EMAIL -</strong>
              </div>
              <div class="ml-7">
                {{ i.userSelectedList.email }}
              </div>
            </v-col>

            <!-- VENDOR NAME -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="po_user_col_border d-flex flex-column align-start "
            >
              <div>
                <v-icon small left>mdi-clipboard-account</v-icon>
                <strong> VENDOR NAME -</strong>
              </div>
              <div class="ml-7">
                {{ i.vendorSelectedList.name }}
              </div>
            </v-col>

            <!-- VENDOR EMAIL -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="po_user_col_border d-flex flex-column align-start "
            >
              <div>
                <v-icon small left>mdi-email-outline</v-icon>
                <strong> VENDOR EMAIL -</strong>
              </div>
              <div class="ml-7">
                {{ i.vendorSelectedList.email }}
              </div>
            </v-col>

            <!-- CUSTOMER NAME -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="po_user_col_border d-flex flex-column align-start "
            >
              <div>
                <v-icon small left>mdi-clipboard-account</v-icon>
                <strong> CUSTOMER NAME -</strong>
              </div>
              <div class="ml-7">
                {{ i.customerSelectedList.name }}
              </div>
            </v-col>

            <!-- CUSTOMER EMAIL -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="po_user_col_border d-flex flex-column align-start "
            >
              <div>
                <v-icon small left>mdi-email-outline</v-icon>
                <strong> CUSTOMER EMAIL -</strong>
              </div>
              <div class="ml-7">
                {{ i.customerSelectedList.email }}
              </div>
            </v-col>

            <!-- REQUESTEDBY NAME -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="po_user_col_border d-flex flex-column align-start "
            >
              <div>
                <v-icon small left>mdi-clipboard-account</v-icon>
                <strong> REQUESTED NAME -</strong>
              </div>
              <div class="ml-7">
                {{ i.requestedBySelectedList.name }}
              </div>
            </v-col>

            <!-- REQUESTEDBY EMAIL -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="po_user_col_border d-flex flex-column align-start "
            >
              <div>
                <v-icon small left>mdi-email-outline</v-icon>
                <strong> REQUESTED EMAIL -</strong>
              </div>
              <div class="ml-7">
                {{ i.requestedBySelectedList.email }}
              </div>
            </v-col>

            <!-- COPMANY -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="po_user_col_border d-flex flex-column align-start "
            >
              <div>
                <v-icon small left>mdi-office-building-outline</v-icon>
                <strong> COPMANY -</strong>
              </div>
              <div class="ml-7">
                {{ i.companySelectedList.company }}
              </div>
            </v-col>

            <!-- EMPTY -->
            <v-col md="3" sm="3" cols="12" class=""> </v-col>
            <!-- EMPTY -->
            <v-col md="3" sm="3" cols="12" class=" "> </v-col>

            <!-- PRIORITY -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="po_user_col_border d-flex flex-row align-start "
            >
              <div>
                <v-icon small left>mdi-priority-high</v-icon>
                <strong> PRIORITY -</strong>
              </div>
              <div class="ml-7">
                {{
                  i.priority.index == 1
                    ? "CRITICAL"
                    : i.priority.index == 2
                    ? "HIGH"
                    : i.priority.index == 3
                    ? "MEDIUM"
                    : i.priority.index == 4
                    ? "LOW"
                    : null
                }}
              </div>
            </v-col>

            <!-- CUS PO NUMBER -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="po_user_col_border d-flex flex-row align-start "
            >
              <div>
                <v-icon small left>mdi-drag</v-icon>
                <strong> CUS PO NUMBER -</strong>
              </div>
              <div class="ml-7">
                {{ i.cus_po_number }}
              </div>
            </v-col>

            <!--   PO NUMBER -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="po_user_col_border d-flex flex-row align-start "
            >
              <div>
                <v-icon small left>mdi-drag</v-icon>
                <strong> PO NUMBER -</strong>
              </div>
              <div class="ml-7">
                {{ i.po_number }}
              </div>
            </v-col>

            <!--  CO NUMBER -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="po_user_col_border d-flex flex-row align-start "
            >
              <div>
                <v-icon small left>mdi-drag</v-icon>
                <strong> CO NUMBER -</strong>
              </div>
              <div class="ml-7">
                {{ i.control_number }}
              </div>
            </v-col>

            <!--  STYLE -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="po_user_col_border d-flex flex-row align-start "
            >
              <div>
                <v-icon small left>mdi-drag</v-icon>
                <strong>STYLE -</strong>
              </div>
              <div class="ml-7">
                {{ i.style }}
              </div>
            </v-col>

            <!--  NOS -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="po_user_col_border d-flex flex-row align-start "
            >
              <div>
                <v-icon small left>mdi-drag</v-icon>
                <strong>NOS -</strong>
              </div>
              <div class="ml-7">
                {{ i.nos }}
              </div>
            </v-col>

            <!--  QTY -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="po_user_col_border d-flex flex-row align-start "
            >
              <div>
                <v-icon small left>mdi-drag</v-icon>
                <strong>QTY -</strong>
              </div>
              <div class="ml-7">
                {{ i.qty }}
              </div>
            </v-col>

            <!--  TOTAL -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="po_user_col_border d-flex flex-row align-start "
            >
              <div>
                <v-icon small left>mdi-drag</v-icon>
                <strong>TOTAL -</strong>
              </div>

              <div class="ml-7">
                {{ i.total }}
              </div>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-text class="ma-0 pa-3 d-flex">
          <v-row
            class="ma-0 pa-0  mt-5 poViewFormStyle"
            v-for="(i, k) in formList"
            :key="k"
          >
            <!--  ATTCHMENTS -->
            <v-col md="3" sm="3" cols="12" class="po_user_col_border d-flex  ">
              <v-icon small left>mdi-drag</v-icon>
              <strong>ATTCHMENTS</strong>
            </v-col>

            <!--  ATTCHMENTS -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="po_user_col_border d-flex "
              v-for="(i, k) in i.attachments"
              :key="k"
            >
              <v-icon small left @click="viewEditAttachment(i.name)"
                >mdi-table-eye</v-icon
              >
              <strong>{{ i.name }}</strong>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="fixed-bottom"> </v-card-actions>
      </v-card>
    </v-dialog>

    <!--SEPERATE ATTACHMENT MODEL -->
    <v-dialog
      v-model="seperateAttachmentModel"
      max-width="550"
      persistent
      content-class="poAttachmentFormDialog"
      scrollable
    >
      <v-card tile flat>
        <DialogCardLoading />
        <v-card-title :class="ModelHeaderColor">
          <span class="headline blue-grey--text text--darken-3 d-flex">
            <v-icon left color="">mdi-attachment mdi-rotate-90 </v-icon>
            ATTACHMENTS
          </span>
          <v-spacer></v-spacer>
          <v-icon @click="seperateAttachmentModel = false">mdi-close</v-icon>
        </v-card-title>

        <!-- MODEL BODY -->
        <v-card-text class="ma-0 pa-3">
          <v-list subheader two-line>
            <v-list-item v-for="(i, key) in viewAttachmentList" :key="key">
              <v-list-item-avatar size="40">
                <v-icon class="grey lighten-1" dark small>
                  mdi-file-tree
                </v-icon>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title v-text="i"></v-list-item-title>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn icon>
                  <v-icon
                    color="grey lighten-1"
                    small
                    @click="viewEditAttachment(i)"
                  >
                    mdi-format-horizontal-align-right
                  </v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-card-actions class="fixed-bottom"> </v-card-actions>
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
  name: "po",
  components: {
    DashboardLayout,
    DialogCardLoading,
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      url: {
        po: "po",
      },

      dataTableLoading: true,
      dataTableFullscreen: false,
      exportExecelLoading: false,
      exportPDFLoading: false,
      formDeleteModel: false,
      pdfLayout: null,
      submitLoading: false,
      formAddmModel: false,
      seperateAttachmentModel: false,
      formViewModel: false,
      stDatePicker: false,
      overlay: false,

      existData: -1,
      appAccess: 0, //ACCESS PERMISSION FOR po
      editedIndex: -1,

      moment: moment,
      DTbtnColor: "indigo lighten-1 ",
      ModelHeaderColor: "blue-grey lighten-5",
      search: "",
      getAgentUserList: "",
      getVendortUserList: "",
      getCustomertUserList: "",
      getRequestedtUserList: "",
      getCompanyUserList: "",

      pos: [],
      headers: [],
      headersList: [],
      selectedHeaders: [],
      excelTitles: [],
      pdfTitles: [],
      selectedExcelTitle: [],
      selectedPDFTitle: [],
      agentUserList: [],
      vendorUserList: [],
      customerUserList: [],
      requestedUserList: [],
      companyUserList: [],
      formList: [],
      viewAttachmentList: [],

      currentUser: {},
      editedItem: {
        stDate: "",
        userSelectedList: "",
        vendorSelectedList: "",
        customerSelectedList: "",
        requestedBySelectedList: "",
        companySelectedList: "",
        priority: "",
        cus_po_number: "",
        po_number: "",
        control_number: "",
        style: "",
        nos: "",
        qty: "",
        total: "",
        attachments: [],
      },
      priorityOptions: [
        { option: "CRITICAL", index: 1 },
        { option: "HIGH", index: 2 },
        { option: "MEDIUM", index: 3 },
        { option: "LOW", index: 4 },
      ],
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
          text: "ST DATE",
          align: "center",
          sortable: true,
          value: "po_date",
          align: "start",
        },

        {
          text: "PO NUM",
          align: "center",
          sortable: true,
          value: "po_number",
          align: "start",
        },

        {
          text: "CO NUM",
          align: "center",
          sortable: true,
          value: "co_num",
          align: "start",
        },

        {
          text: "CU PO NUM",
          align: "center",
          sortable: true,
          value: "cus_po_number",
          align: "start",
        },
        {
          text: "COMPANY",
          align: "center",
          sortable: true,
          value: "company",
          align: "start",
        },
        {
          text: "STYLE",
          align: "center",
          sortable: true,
          value: "style",
          align: "start",
        },

        {
          text: "NOS",
          align: "center",
          sortable: true,
          value: "number_of_style",
          align: "start",
        },
        {
          text: "QTY",
          align: "center",
          sortable: true,
          value: "qty",
          align: "start",
        },
        {
          text: "TOTAL",
          align: "center",
          sortable: true,
          value: "total_value",
          align: "start",
        },
        {
          text: "PRIORITY",
          align: "center",
          sortable: true,
          value: "priority",
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
    localStorage.setItem("po_pk", 1);
    // console.log("initializing PO");
    // console.log("----------------------------------------------");
    this.onInitialize(localStorage.getItem("po_pk"));
    this.datatableColumnVisibility();
  },
  beforeMount() {
    this.onAccessPermission();
    this.onInitializeExportColumns();
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "NEW PO" : "Edit ";
    },
    submitBtn() {
      return this.editedIndex === -1 ? "SAVE" : "UPDATE";
    },
  },
  watch: {
    getAgentUserList(e) {
      this.$http
        .get(this.url.po + "/auto_search/agent/" + e)
        .then((res) => {
          // console.log(res.data);

          res.data.object.forEach((element) => {
            this.agentUserList.push(element);
          });
        })
        .catch((err) => {
          // console.log("failed agent autocomplete");
        });
    },

    getVendortUserList(e) {
      this.$http
        .get(this.url.po + "/auto_search/vendor/" + e)
        .then((res) => {
          // console.log(res.data);
          res.data.object.forEach((element) => {
            this.vendorUserList.push(element);
          });
        })
        .catch((err) => {
          // console.log("failed vendor autocomplete");
        });
    },
    getCustomertUserList(e) {
      this.$http
        .get(this.url.po + "/auto_search/customer/" + e)
        .then((res) => {
          // console.log(res.data);
          res.data.object.forEach((element) => {
            this.customerUserList.push(element);
          });
        })
        .catch((err) => {
          // console.log("failed customer autocomplete");
        });
    },
    getRequestedtUserList(e) {
      this.$http
        .get(this.url.po + "/auto_search/requestedby/" + e)
        .then((res) => {
          // console.log(res.data);
          res.data.object.forEach((element) => {
            this.requestedUserList.push(element);
          });
        })
        .catch((err) => {
          // console.log("failed customer autocomplete");
        });
    },
    getCompanyUserList(e) {
      this.$http
        .get(this.url.po + "/auto_search/company/" + e)
        .then((res) => {
          // console.log(res.data);
          res.data.object.forEach((element) => {
            this.companyUserList.push(element);
          });
        })
        .catch((err) => {
          // console.log("failed company autocomplete");
        });
    },
  },
  methods: {
    onInitialize(e) {
      this.pos.splice(0);
      this.$http
        .get(this.url.po + "?page=" + e)
        .then((response) => {
          let i = response.data;
          // console.log(i.objects.data[0]);

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
            this.pos.push({
              id: e.id,
              po_date: moment(e.po_date * 1000)
                .add(1, "d")
                .toISOString()
                .substr(0, 10),

              po_number: e.po_number,
              company: e.company,
              cus_po_number: e.cus_po_number,
              style: e.style,
              number_of_style: e.number_of_style,
              qty: e.number_of_style,
              agent: e.agent,
              vendor: e.vendor,
              customer: e.customer,
              total_value: e.total_value,
              status: e.status,
              co_num: e.control_number.toString(),
              attachments: JSON.parse(e.attachment_auto_id),
              priority:
                e.priority == 1
                  ? "CRITICAL"
                  : e.priority == 2
                  ? "HIGH"
                  : e.priority == 3
                  ? "MEDIUM"
                  : e.priority == 4
                  ? "LOW"
                  : null,
            });
          });

          // console.log(this.pos);
        })
        .catch((err) => {
          if (err.response) {
            this.$gl.Unauthorized(err.response.status);
          }
        });
    },
    onNewDialog() {
      this.formAddmModel = true;
      this.formList.splice(0);
      this.companyUserList.splice(0);
      this.requestedUserList.splice(0);
      this.customerUserList.splice(0);
      this.vendorUserList.splice(0);
      this.agentUserList.splice(0);
      this.formList.push({
        AxiosProgressCount: 0,
        AxiosSuccess: false,
        AxiosSuccessMessage: "",
        AxiosSuccessResponse: null,
        stDatePicker: false,
        stDate: "",
        userSelectedList: "",
        vendorSelectedList: "",
        customerSelectedList: "",
        requestedBySelectedList: "",
        companySelectedList: "",
        priority: [],
        cus_po_number: "",
        po_number: "",
        control_number: "",
        style: "",
        nos: "",
        qty: "",
        total: "",
        attachments: [],
      });

      // this.overlay = true;
    },
    closeForm() {
      this.$nextTick(() => {
        this.formAddmModel = false;
        this.editedIndex = -1;
        this.$refs.form.reset();
        this.formList.splice(0);
        this.editedItem = Object.assign({});
        // SELECTED AGENT LIST
        this.agentUserList.splice(0);

        // SELECTED VENDOR LIST
        this.vendorUserList.splice(0);

        // SELECTED CUSTOMER LIST
        this.customerUserList.splice(0);
        // SELECTED REQUESTEDBY LIST
        this.requestedUserList.splice(0);
        // SELECTED COPMANY LIST
        this.companyUserList.splice(0);
      });
    },
    addNewPO(e) {
      this.$refs.form.validate().then((success) => {
        if (!success) {
          return;
        }

        this.formList.push({
          AxiosProgressCount: 0,
          AxiosSuccess: false,
          AxiosSuccessMessage: "",
          AxiosSuccessResponse: null,
          stDatePicker: false,
          stDate: "",
          userSelectedList: "",
          vendorSelectedList: "",
          customerSelectedList: "",
          requestedBySelectedList: "",
          companySelectedList: "",
          priority: "",
          cus_po_number: "",
          po_number: "",
          control_number: "",
          style: "",
          nos: "",
          qty: "",
          total: "",
          attachments: [],
        });
      });
    },
    remomvePOList(e) {
      this.formList.splice(e, 1);
    },
    onAttachmentSelected(e, k) {
      this.formList[k].attachments = Object.assign(e, {});
    },
    removeAttachment(x, y) {
      // console.log(x, y);
      this.formList[x].attachments.splice(y, 1);
    },
    viewEditAttachment(i) {
      console.log(i);
      window.open(
        "http://localhost:8000/storage/PO_attachments/" + i,
        "_blank"
      );
    },
    axiosMultiPost(arr, i, m) {
      var element = arr[i];
      console.log("arr", arr);
      console.log("i", i);
      console.log("element", element);

      const fd = new FormData();
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) =>
          (element.AxiosProgressCount =
            Math.round((progressEvent.loaded / progressEvent.total) * 100) +
            " % Uploaded"),
      };
      // fd.append("agent_code", element.attachments);
      // fd.append("vendor_code", element.attachments);
      // fd.append("company_auto_id", element.attachments);

      fd.append("id", element.id);
      fd.append("po_date", moment(element.stDate).format("X"));
      fd.append("po_request_date", moment().format("X"));
      fd.append("vendor_auto_id", element.vendorSelectedList.id);
      fd.append("vendor_email", element.vendorSelectedList.email);
      fd.append("vendor", element.vendorSelectedList.name);
      fd.append("agent_auto_id", element.userSelectedList.id);
      fd.append("agent", element.userSelectedList.name);
      fd.append("agent_email", element.userSelectedList.email);
      fd.append("customer_auto_id", element.customerSelectedList.id);
      fd.append("customer", element.customerSelectedList.name);
      fd.append("customer_email", element.customerSelectedList.email);
      fd.append("receiver_auto_id", element.requestedBySelectedList.id);
      fd.append("receiver", element.requestedBySelectedList.name);
      fd.append("receiver_email", element.requestedBySelectedList.email);
      fd.append("cus_po_number", element.cus_po_number);
      fd.append("po_number", element.po_number);
      fd.append("qty", element.qty);
      fd.append("number_of_style", element.nos);
      fd.append("total_value", element.total);
      fd.append("company", element.companySelectedList.company);
      fd.append("cus_po_number", element.cus_po_number);
      fd.append("style", element.style);
      fd.append("status", 1);
      fd.append("control_number", element.control_number);
      if (element.priority instanceof Object) {
        fd.append("priority", element.priority.index);
      } else {
        fd.append("priority", element.priority);
      }
      if (!element.attachments.length < 1) {
        element.attachments.forEach((element) => {
          if (element instanceof File) {
            fd.append("attachment_auto_id[]", element, element.name);
          } else {
            fd.append("attachment_auto_id[]", element.name);
          }
        });
      }
      if (m == "store") {
        this.$http
          .post("po", fd, config)
          .then((res) => {
            if (i < arr.length - 1) {
              this.axiosMultiPost(arr, ++i, "store");
            } else {
              this.onInitialize();
              this.closeForm();
              this.overlay = false;
              this.notification("PO are successfully added", "green");
            }
            if (res.data.status == 200) {
              element.AxiosSuccess = true;
              element.AxiosProgressCount = 0;
              element.AxiosSuccessMessage = res.data.message;
              element.AxiosSuccessResponse = res.data.status;
            }
          })
          .catch((err) => {
            this.overlay = false;
            element.AxiosSuccess = true;
            element.AxiosProgressCount = 0;
            element.AxiosSuccessResponse = 500;
            element.AxiosSuccessMessage = "Please try again";
          });
      } else {
        fd.append("_method", "put");
        this.$http
          .post(this.url.po + "/" + element.id, fd, config)
          .then((res) => {
            if (res.data.status == 200) {
              element.AxiosSuccess = true;
              element.AxiosProgressCount = 0;
              element.AxiosSuccessMessage = res.data.message;
              element.AxiosSuccessResponse = res.data.status;
            }

            this.onInitialize();
            this.closeForm();
            this.overlay = false;
            this.notification("PO has been updated successfully", "green");
          })
          .catch((err) => {
            this.overlay = false;

            element.AxiosSuccess = true;
            element.AxiosProgressCount = 0;
            element.AxiosSuccessResponse = 500;
            element.AxiosSuccessMessage = "Please try again";
          });
      }
    },
    save() {
      this.$refs.form.validate().then((success) => {
        if (!success) {
          return;
        }

        this.overlay = true;
        if (this.editedIndex == -1) {
          this.axiosMultiPost(this.formList, 0, "store");
        } else {
          this.axiosMultiPost(this.formList, 0, "update");
        }
      });
    },

    onAttachment(e) {
      this.viewAttachmentList.splice(0);
      this.$http
        .get(this.url.po + "/getAttachments/" + e.id)
        .then((response) => {
          let i = response.data.objects;
          console.log(i);
          JSON.parse(i.attachment_auto_id).forEach((element) => {
            this.viewAttachmentList.push(element.replace(/["']/g, ""));
          });
          this.seperateAttachmentModel = true;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onEditItem(e, type) {
      this.formList.splice(0);
      this.companyUserList.splice(0);
      this.requestedUserList.splice(0);
      this.customerUserList.splice(0);
      this.vendorUserList.splice(0);
      this.agentUserList.splice(0);

      this.editedIndex = this.pos.indexOf(e);

      this.$http.get(this.url.po + "/edit/" + e.id).then((response) => {
        let i = response.data.objects;

        let attachmentArr = [];
        if (i.attachment_auto_id != null) {
          JSON.parse(i.attachment_auto_id).forEach((element) => {
            console.log(
              "attachment removed symbol -> ",
              element.replace(/["']/g, "")
            );
            attachmentArr.push({
              name: element.replace(/["']/g, ""),
            });
          });
        }

        // SELECTED AGENT LIST
        this.agentUserList.push({
          id: i.agent_auto_id,
          name: i.agent,
          email: i.agent_email,
        });

        // SELECTED VENDOR LIST
        this.vendorUserList.push({
          id: i.vendor_auto_id,
          name: i.vendor,
          email: i.vendor_email,
        });

        // SELECTED CUSTOMER LIST
        this.customerUserList.push({
          id: i.customer_auto_id,
          name: i.customer,
          email: i.customer_email,
        });
        // SELECTED REQUESTEDBY LIST
        this.requestedUserList.push({
          id: i.receiver_auto_id,
          name: i.receiver,
          email: i.receiver_email,
        });
        // SELECTED COPMANY LIST
        this.companyUserList.push({
          company: i.company,
        });

        this.formList.push({
          AxiosProgressCount: 0,
          AxiosSuccess: false,
          AxiosSuccessMessage: "",
          AxiosSuccessResponse: null,
          stDatePicker: false,
          stDate: moment(i.po_date * 1000)
            .add(1, "d")
            .toISOString()
            .substr(0, 10),
          userSelectedList: {
            id: i.agent_auto_id,
            name: i.agent,
            email: i.agent_email,
          },
          vendorSelectedList: {
            id: i.vendor_auto_id,
            name: i.vendor,
            email: i.vendor_email,
          },
          customerSelectedList: {
            id: i.customer_auto_id,
            name: i.customer,
            email: i.customer_email,
          },
          requestedBySelectedList: {
            id: i.receiver_auto_id,
            name: i.receiver,
            email: i.receiver_email,
          },
          companySelectedList: {
            company: i.company,
          },
          priority: {
            index: parseInt(i.priority),
          },
          id: i.id,
          cus_po_number: i.cus_po_number,
          po_number: i.po_number,
          control_number: i.control_number,
          style: i.style,
          nos: i.number_of_style,
          qty: i.qty,
          total: i.total_value,
          attachments: attachmentArr,
        });

        if (type == "edit") {
          this.formAddmModel = true;
        } else {
          this.formViewModel = true;
        }
        console.log("on Edit from Response -> ", i);
      });

      console.log("on Edit from Local -> ", e);
    },
    onDeleteItem(e) {
      this.formDeleteModel = true;
      this.editedItem = Object.assign(e);
    },
    onDeleteConfirm() {
      // console.log("delete", this.editedIndex);
      this.$http
        .delete(this.url.po + "/" + this.editedItem.id)
        .then((response) => {
          // console.log(response.data);
          this.notification(response.data.message, "green");

          this.onInitialize();
          this.formDeleteModel = false;
        })
        .catch((response) => {
          // console.log("Error Fround. PO Not Deleted");
          this.notification("Error Fround. PO Not Deleted", "red");
        });
    },
    datatableColumnVisibility() {
      let x = JSON.parse(localStorage.getItem("po_active_columns"));
      let y = this.headersMap.slice(1, -1);

      y.forEach((element) => {
        this.headersList.push(element);
      });

      if (x == null) {
        let obj = this.headersMap;
        let result = obj.map((col) => col.value);
        localStorage.setItem("po_active_columns", JSON.stringify(result));

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

    onChangeColumn(e) {
      this.headers.splice(0);
      localStorage.setItem("po_active_columns", JSON.stringify(e));
      let headersMap = this.headersMap;
      let selected_arr = e;
      let filtered = headersMap.filter(({ value }) =>
        selected_arr.includes(value)
      );

      filtered.forEach((element) => {
        this.headers.push(element);
      });
    },

    onClipboard() {
      let jsonObject = JSON.stringify(this.pos);
      navigator.clipboard.writeText(jsonObject);
    },

    exportToExcel() {
      this.exportExecelLoading = true;
      let objects = [];

      this.pos.forEach((e) => {
        objects.push({
          "PO DATE": e.po_date,
          AGENT: e.agent,
          VENDOR: e.vendor,
          "PO NUMBER": e.po_number,
          CUSTOMER: e.customer,
          "CUSTOMER PO NUMBER": e.cus_po_number,
          "NUMBER OF STYLE": e.number_of_style,
          QTY: e.qty,
          TOTAL: e.total_value,
          STATUS:
            e.status == "1"
              ? "Pending"
              : e.status == "2"
              ? "Checking"
              : e.status == "3"
              ? "Active"
              : null,
          PRIORITY: e.priority,
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
      let fileName = this.moment().unix() + "_po_file";

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
        // console.error("export error", e);
        this.exportExecelLoading = false;
        this.notification(fileName + " Export Failed. Please try again", "red");
      }
    },

    exportToPdf() {
      this.exportPDFLoading = true;
      let fileName = this.moment().unix() + "_file";

      try {
        let user_DecKey = this.$gl.DecKey(localStorage.getItem("user"));
        let user = JSON.parse(user_DecKey);
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
          encryption: {
            userPassword: user.phone,
            ownerPassword: "admin",
            userPermissions: ["print", "modify", "copy", "annot-forms"],
          },
        });

        this.selectedPDFTitle.forEach((element, key) => {
          header.push(element);
        });

        this.pos.forEach((e) => {
          data.push({
            "PO DATE": e.po_date,
            AGENT: e.agent,
            VENDOR: e.vendor,
            "PO NUMBER": e.po_number.toString(),
            CUSTOMER: e.customer,
            "CUSTOMER PO NUMBER": e.cus_po_number.toString(),
            "NUMBER OF STYLE": e.number_of_style.toString(),
            QTY: e.qty.toString(),
            TOTAL: e.total_value.toString(),
            STATUS:
              e.status == "1"
                ? "Pending"
                : e.status == "2"
                ? "Checking"
                : e.status == "3"
                ? "Active"
                : null,
            PRIORITY: e.priority,
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
          width: this.pdfLayout == "l" ? 35 : 24,
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
        // console.error("export error", e);
        this.exportPDFLoading = false;
        this.notification(fileName + " Export Failed. Please try again", "red");
      }
    },
    onInitializeExportColumns() {
      this.excelTitles = [
        "PO DATE",
        "AGENT",
        "VENDOR",
        "PO NUMBER",
        "CUSTOMER",
        "CUSTOMER PO NUMBER",
        "NUMBER OF STYLE",
        "QTY",
        "TOTAL",
        "STATUS",
        "PRIORITY",
      ];

      this.pdfTitles = [
        "PO DATE",
        "AGENT",
        "VENDOR",
        "PO NUMBER",
        "CUSTOMER",
        "CUSTOMER PO NUMBER",
        "NUMBER OF STYLE",
        "QTY",
        "TOTAL",
        "STATUS",
        "PRIORITY",
      ];

      this.selectedExcelTitle = this.excelTitles;
      this.selectedPDFTitle = this.excelTitles;
    },

    onSearch(e) {
      this.dataTableLoading = true;
      if (this.search.length > 0) {
        this.$http.get(this.url.po + "/getPoList/" + e).then((response) => {
          // console.log(response.data);
          let i = response.data.objects;
          this.pos.splice(0);
          i.forEach((e) => {
            this.pos.push({
              id: e.id,
              po_date: moment(e.po_date * 1000)
                .add(1, "d")
                .toISOString()
                .substr(0, 10),
              agent: e.agent,
              vendor: e.vendor,
              po_number: e.po_number,
              customer: e.customer,
              cus_po_number: e.cus_po_number,
              style: e.style,
              number_of_style: e.number_of_style,
              qty: e.number_of_style,
              total_value: e.total_value,
              status: e.status,
              priority:
                e.priority == 1
                  ? "CRITICAL"
                  : e.priority == 2
                  ? "HIGH"
                  : e.priority == 3
                  ? "MEDIUM"
                  : e.priority == 4
                  ? "LOW"
                  : null,
            });
          }, 4000);
          this.dataTableLoading = false;
        });
      } else {
        this.pos.splice(0);
        this.onInitialize(localStorage.getItem("po_pk"));
        this.dataTableLoading = false;
      }
    },

    onRefresh() {
      this.onInitialize();
    },
    focusSearchKey() {
      this.$refs.searchbar_ref.$refs.input.focus();
    },
    onAccessPermission() {
      let DecKey = this.$gl.DecKey(localStorage.getItem("token_access"));
      let user_DecKey = this.$gl.DecKey(localStorage.getItem("user"));
      let access = JSON.parse(DecKey);
      let currentUser = JSON.parse(user_DecKey);
      this.appAccess = access[5];

      this.currentUser = Object.assign(currentUser);
    },

    onExpandTable(e) {
      if (e == "e") {
        let x = this.$gl.onFullscreenDataTable("dt_table_po");
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
  },
};
</script>

<style></style>
