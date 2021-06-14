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
        :items-per-page="-1"
        :footer-props="{
          prevIcon: '',
          nextIcon: '',
        }"
        loading-text="Fetching Data"
        height="85vh"
        id="dt_table_order"
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
                {{ $t("order.title") }}
              </span>
            </v-toolbar-title>

            <v-divider class="mx-4" inset vertical></v-divider>

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
                {{ $t("button.addOrder") }}
              </span>
            </v-btn>
          </v-toolbar>
        </template>

        <template v-slot:[`item.id`]="{ item, index }">
          <div
            class="d-flex index_id_column"
            :title="item.status == '0' ? 'PENDING' : 'ACTIVE'"
          >
            <v-sheet
              :color="item.status == '0' ? 'orange' : 'green'"
              class="ma-0 pa-0"
              height="30"
              width="3"
            >
            </v-sheet>

            <span class="ma-1">{{ index + 1 }}</span>
          </div>
        </template>

        <!-- TABLE ACTIONS -->
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            class="pa-2 teal darken-1"
            id="dt-attchment-action-button"
            x-small
            dark
            title="Attachments"
            @click="onAttachment(item)"
            v-if="item.attachments.length > 1"
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
      content-class="order-form-dialog"
      scrollable
    >
      <v-card tile flat>
        <DialogCardLoading />
        <v-card-title :class="ModelHeaderColor">
          <span class="headline blue-grey--text text--darken-3 d-flex">
            <v-icon left color="">mdi-timeline-text</v-icon> {{ formTitle }}
          </span>
          <v-spacer></v-spacer>
          <v-icon @click="closeForm">mdi-close</v-icon>
        </v-card-title>

        <!-- MODEL BODY -->
        <v-card-text class="ma-0 pa-3 ">
          <ValidationObserver ref="form">
            <v-row
              class="ma-0 pa-0  mt-5 poFormStyle "
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

              <!-- ORDER DATE-->
              <v-col sm="3" md="1" cols="6">
                <ValidationProvider
                  rules="required"
                  name="St Date"
                  v-slot="{ errors }"
                >
                  <v-menu
                    v-model="i.orderDatePicker"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <ValidationProvider
                        rules="required"
                        name="Order Date"
                        v-slot="{ errors }"
                      >
                        <v-text-field
                          v-model="i.orderDate"
                          :label="errors[0] ? errors[0] : 'Order Date'"
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
                      v-model="i.orderDate"
                      dateFormat="mm-YYYY"
                      :color="DTbtnColor"
                      @input="i.orderDatePicker = false"
                    ></v-date-picker>
                  </v-menu>
                </ValidationProvider>
              </v-col>

              <!-- CANCEL DATE -->
              <v-col sm="3" md="1" cols="6">
                <ValidationProvider
                  rules="required"
                  name="St Date"
                  v-slot="{ errors }"
                >
                  <v-menu
                    v-model="i.cancelDatePicker"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <ValidationProvider
                        rules="required"
                        name="Cancel Date"
                        v-slot="{ errors }"
                      >
                        <v-text-field
                          v-model="i.cancelDate"
                          :label="errors[0] ? errors[0] : 'Cancel Date'"
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
                      v-model="i.cancelDate"
                      dateFormat="mm-YYYY"
                      :color="DTbtnColor"
                      @input="i.cancelDatePicker = false"
                    ></v-date-picker>
                  </v-menu>
                </ValidationProvider>
              </v-col>

              <!-- TYPE -->
              <v-col sm="3" md="1" cols="6">
                <ValidationProvider
                  rules="required"
                  name="TYPE"
                  v-slot="{ errors }"
                >
                  <v-select
                    :items="typeOptions"
                    v-model="i.type"
                    :label="errors[0] ? errors[0] : 'TYPE'"
                    :error-messages="errors"
                    class="pa-0 ma-0"
                    hide-details=""
                    dense
                    item-text="option"
                    item-value="value"
                  ></v-select>
                </ValidationProvider>
              </v-col>

              <!-- EDI -->
              <v-col sm="3" md="1" cols="6">
                <ValidationProvider
                  rules="required"
                  name="EDI"
                  v-slot="{ errors }"
                >
                  <v-select
                    :items="boolOptions"
                    v-model="i.edi"
                    :label="errors[0] ? errors[0] : 'EDI'"
                    :error-messages="errors"
                    class="pa-0 ma-0"
                    hide-details=""
                    dense
                    item-text="option"
                    item-value="value"
                  ></v-select>
                </ValidationProvider>
              </v-col>

              <!-- UPC -->
              <v-col sm="3" md="1" cols="6">
                <ValidationProvider
                  rules="required"
                  name="UPC"
                  v-slot="{ errors }"
                >
                  <v-select
                    :items="boolOptions"
                    v-model="i.upc"
                    :label="errors[0] ? errors[0] : 'UPC'"
                    :error-messages="errors"
                    class="pa-0 ma-0"
                    hide-details=""
                    dense
                    item-text="option"
                    item-value="value"
                  ></v-select>
                </ValidationProvider>
              </v-col>

              <!-- PT -->
              <v-col sm="3" md="1" cols="6">
                <ValidationProvider
                  rules="required"
                  name="PT"
                  v-slot="{ errors }"
                >
                  <v-select
                    :items="boolOptions"
                    v-model="i.pt"
                    :label="errors[0] ? errors[0] : 'PT'"
                    :error-messages="errors"
                    class="pa-0 ma-0"
                    hide-details=""
                    dense
                    item-text="option"
                    item-value="value"
                  ></v-select>
                </ValidationProvider>
              </v-col>

              <!--  PO NUMBER -->
              <v-col md="2" sm="3" cols="12" class="">
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

              <!--  OR STYLE -->
              <v-col md="1" sm="3" cols="12" class="">
                <ValidationProvider
                  rules="required"
                  name="OR STYLE"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="i.or_style"
                    :label="errors[0] ? errors[0] : 'OR STYLE'"
                    :error-messages="errors"
                    dense
                    hide-details=""
                  >
                  </v-text-field>
                </ValidationProvider>
              </v-col>

              <!--  RE STYLE -->
              <v-col md="1" sm="3" cols="12" class="">
                <ValidationProvider
                  rules="required"
                  name="RE STYLE"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="i.re_style"
                    :label="errors[0] ? errors[0] : 'RE STYLE'"
                    :error-messages="errors"
                    dense
                    hide-details=""
                  >
                  </v-text-field>
                </ValidationProvider>
              </v-col>

              <!-- ADD / REMOVE TAB -->
              <v-col
                md="1"
                sm="3"
                cols="12"
                class="white d-flex justify-center pa-0 ma-0 pt-2"
              >
                <!-- REMOVE ROW BUTTON -->
                <v-btn
                  depressed
                  plain
                  icon
                  color="red"
                  v-if="formList.length > 1"
                  @click="remomveOrderList(k)"
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
                  @click="addNewOrder(k)"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-col>

              <!-- CANCEL DATE -->
              <v-col sm="3" md="1" cols="6">
                <ValidationProvider
                  rules="required"
                  name="St Date"
                  v-slot="{ errors }"
                >
                  <v-menu
                    v-model="i.etaDatePicker"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <ValidationProvider
                        rules="required"
                        name="ETA"
                        v-slot="{ errors }"
                      >
                        <v-text-field
                          v-model="i.eta"
                          :label="errors[0] ? errors[0] : 'ETA'"
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
                      v-model="i.eta"
                      dateFormat="mm-YYYY"
                      :color="DTbtnColor"
                      @input="i.etaDatePicker = false"
                    ></v-date-picker>
                  </v-menu>
                </ValidationProvider>
              </v-col>

              <!--  NOP -->
              <v-col md="1" sm="3" cols="12" class="">
                <ValidationProvider
                  rules="required"
                  name="NOP"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="i.nop"
                    :label="errors[0] ? errors[0] : 'NOP'"
                    :error-messages="errors"
                    dense
                    hide-details=""
                  >
                  </v-text-field>
                </ValidationProvider>
              </v-col>

              <!-- CUSTOMER -->
              <v-col md="2" sm="3" cols="12" class="">
                <ValidationProvider
                  rules="required"
                  name="CUSTOMER"
                  v-slot="{ errors }"
                >
                  <v-autocomplete
                    v-model="i.customer"
                    :items="customerList"
                    :search-input.sync="getUserList"
                    :label="errors[0] ? errors[0] : 'CUSTOMER'"
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

              <!-- SALES REP -->
              <v-col md="2" sm="3" cols="12" class="">
                <ValidationProvider
                  rules="required"
                  name="SALES REP"
                  v-slot="{ errors }"
                >
                  <v-autocomplete
                    v-model="i.salesRep"
                    :items="salesRepList"
                    :search-input.sync="getSalesRepList"
                    :label="errors[0] ? errors[0] : 'SALES REP'"
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

              <!-- PRODUCTION-->
              <v-col md="2" sm="3" cols="12" class="">
                <ValidationProvider
                  rules="required"
                  name="PRODUCTION"
                  v-slot="{ errors }"
                >
                  <v-autocomplete
                    v-model="i.production"
                    :items="productionList"
                    :search-input.sync="getProductionList"
                    :label="errors[0] ? errors[0] : 'PRODUCTION'"
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

              <!-- COMPANY-->
              <v-col md="2" sm="3" cols="12" class="">
                <ValidationProvider
                  rules="required"
                  name="COMPANY"
                  v-slot="{ errors }"
                >
                  <v-autocomplete
                    v-model="i.company"
                    :items="companyList"
                    :search-input.sync="getCompanyList"
                    :label="errors[0] ? errors[0] : 'COMPANY'"
                    :error-messages="errors"
                    item-text="company"
                    item-value="company"
                    return-object
                    dense
                    hide-no-data
                    hide-details=""
                    hide-selected
                    single-line
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
                    @click:close="removeAttachment(i, k, index)"
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

    <!--SEPERATE ATTACHMENT MODEL -->
    <v-dialog
      v-model="seperateAttachmentModel"
      max-width="550"
      persistent
      content-class="TaskAttachmentFormDialog"
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

    <!-- VIEWMODEL -->
    <v-dialog
      v-model="formViewModel"
      max-width="1400px"
      persistent
      content-class="task-form-dialog"
      scrollable
    >
      <v-card tile flat>
        <DialogCardLoading />
        <v-card-title :class="ModelHeaderColor">
          <span class="headline blue-grey--text text--darken-3 d-flex">
            <v-icon left color="">mdi-timeline-text</v-icon>
            ORDERS VIEW
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
            <!-- ORDERED DATE -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-calendar</v-icon>
                <strong> ORDER DATE </strong>
              </div>
              <div class="ml-7">
                {{ i.orderDate }}
              </div>
            </v-col>

            <!-- CANCEL DATE -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-calendar</v-icon>
                <strong> CANCEL DATE </strong>
              </div>
              <div class="ml-7">
                {{ i.cancelDate }}
              </div>
            </v-col>

            <!-- TYPE -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-calendar</v-icon>
                <strong> TYPE </strong>
              </div>
              <div class="ml-7">
                {{
                  i.type == 1
                    ? "SPO"
                    : i.type == 2
                    ? "BPA"
                    : i.type == 3
                    ? "BR"
                    : i.type == 4
                    ? "CPA"
                    : i.type == 5
                    ? "PPO"
                    : i.type == 6
                    ? "SR"
                    : null
                }}
              </div>
            </v-col>

            <!-- EDI -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-calendar</v-icon>
                <strong> EDI </strong>
              </div>
              <div class="ml-7">
                {{ i.edi }}
              </div>
            </v-col>

            <!-- upc -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-calendar</v-icon>
                <strong> UPC </strong>
              </div>
              <div class="ml-7">
                {{ i.upc }}
              </div>
            </v-col>

            <!-- nop -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-calendar</v-icon>
                <strong> NOP </strong>
              </div>
              <div class="ml-7">
                {{ i.nop }}
              </div>
            </v-col>

            <!-- pt -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-calendar</v-icon>
                <strong> PT </strong>
              </div>
              <div class="ml-7">
                {{ i.pt }}
              </div>
            </v-col>

            <!-- po_number -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-calendar</v-icon>
                <strong> PO NUMBER </strong>
              </div>
              <div class="ml-7">
                {{ i.po_number }}
              </div>
            </v-col>

            <!-- control_number -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-calendar</v-icon>
                <strong> CO NUMBER </strong>
              </div>
              <div class="ml-7">
                {{ i.control_number }}
              </div>
            </v-col>

            <!-- customer -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-calendar</v-icon>
                <strong> CUSTOMER </strong>
              </div>
              <div class="ml-7">
                {{ i.customer.name }}
              </div>
            </v-col>

            <!-- salesRep -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-calendar</v-icon>
                <strong> SALES REP </strong>
              </div>
              <div class="ml-7">
                {{ i.salesRep.name }}
              </div>
            </v-col>

            <!-- production -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-calendar</v-icon>
                <strong> PRODUCTION BY </strong>
              </div>
              <div class="ml-7">
                {{ i.production.name }}
              </div>
            </v-col>

            <!-- company -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-calendar</v-icon>
                <strong> COMPANY </strong>
              </div>
              <div class="ml-7">
                {{ i.company.company }}
              </div>
            </v-col>

            <!-- re_style -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-calendar</v-icon>
                <strong> RE STYLE </strong>
              </div>
              <div class="ml-7">
                {{ i.re_style }}
              </div>
            </v-col>

            <!-- or_style -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-calendar</v-icon>
                <strong> OR STYLE </strong>
              </div>
              <div class="ml-7">
                {{ i.or_style }}
              </div>
            </v-col>

            <!-- EMPTY -->
            <v-col md="3" sm="3" cols="12" class=""> </v-col>

            <!-- comment -->
            <v-col
              md="6"
              sm="6"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
              v-if="i.comment"
            >
              <div>
                <v-icon small left>mdi-calendar</v-icon>
                <strong> COMMENT</strong>
              </div>
              <div class="ml-7">
                {{ i.comment }}
              </div>
            </v-col>

            <!-- remark -->
            <v-col
              md="6"
              sm="6"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
              v-if="i.remark"
            >
              <div>
                <v-icon small left>mdi-calendar</v-icon>
                <strong> REMARK </strong>
              </div>
              <div class="ml-7">
                {{ i.remark }}
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
              <v-icon small left @click="viewEditAttachment(i.name)">
                mdi-table-eye
              </v-icon>
              <strong>{{ i.name }}</strong>
            </v-col>
          </v-row>
        </v-card-text>
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
          <strong> DELETE </strong> THIS ORDER ?
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
      formDeleteModel: false,
      formAddmModel: false,
      submitLoading: false,
      seperateAttachmentModel: false,
      formViewModel: false,

      existData: -1,
      appAccess: 0, //ACCESS PERMISSION FOR po
      editedIndex: -1,

      DTbtnColor: "indigo lighten-1 ",
      ModelHeaderColor: "blue-grey lighten-5",
      search: "",
      moment: moment,
      getUserList: "",
      getSalesRepList: "",
      getProductionList: "",
      getCompanyList: "",

      headers: [],
      orders: [],
      headersList: [],
      selectedHeaders: [],
      customerList: [],
      salesRepList: [],
      productionList: [],
      companyList: [],
      viewAttachmentList: [],
      formList: [
        {
          AxiosProgressCount: 0,
          AxiosSuccess: false,
          AxiosSuccessMessage: "",
          AxiosSuccessResponse: null,
          orderDatePicker: false,
          cancelDatePicker: false,
          etaDatePicker: false,

          orderDate: "",
          cancelDate: "",
          eta: "",
          type: "",
          edi: "",
          upc: "",
          nop: "",
          pt: "",
          po_number: "",
          control_number: "",
          customer: "",
          salesRep: "",
          production: "",
          company: "",
          re_style: "",
          or_style: "",
          attachments: [],
        },
      ],

      editedItem: {},
      typeOptions: [
        { option: "SPO", value: 1 },
        { option: "BPA", value: 2 },
        { option: "BR", value: 3 },
        { option: "CPA", value: 4 },
        { option: "PPO", value: 5 },
        { option: "SR", value: 6 },
      ],
      boolOptions: [
        { option: "YES", value: 1 },
        { option: "NO", value: 2 },
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
          sortable: true,
          value: "id",
          align: "start",
          width: "40",
        },
        {
          text: "ORDER DATE",
          sortable: true,
          value: "order_date",
          align: "start",
          width: "122",
        },
        {
          text: "CANCEL DATE",
          sortable: true,
          value: "cancel_date",
          align: "start",
          width: "128",
        },
        {
          text: "TYPE",
          sortable: true,
          value: "order_type",
          align: "center",
          width: "80",
        },
        {
          text: "ETA",
          sortable: true,
          value: "eta",
          align: "start",
          width: "115",
        },
        {
          text: "CUSTOMER",
          sortable: true,
          value: "customer",
          align: "start",
          width: "190",
        },
        {
          text: "PO NUM",
          sortable: true,
          value: "po_number",
          align: "start",
          width: "100",
        },
        {
          text: "CO NUM",
          sortable: true,
          value: "control_number",
          align: "start",
          width: "100",
        },

        {
          text: "RECEIVED BY",
          sortable: true,
          value: "receiver",
          align: "start",
          width: "190",
        },
        {
          text: "COMPLETED BY",
          sortable: true,
          value: "completed_by",
          align: "start",
          width: "190",
        },
        {
          text: "APPROVED BY",
          sortable: true,
          value: "approved_by",
          align: "start",
          width: "190",
        },
        {
          text: "Actions",
          value: "actions",
          sortable: false,
          width: "14%",
          align: "end",
          class: "dark--text",
        },
      ],
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "NEW ORDER" : "Edit ORDER ";
    },
    submitBtn() {
      return this.editedIndex === -1 ? "SAVE" : "UPDATE";
    },
  },
  created() {
    localStorage.setItem("order_pk", 1);
    this.onInitialize(localStorage.getItem("order_pk"));
    this.datatableColumnVisibility();
    // console.log("return 1", this.dtPagination);
  },
  beforeMount() {
    this.onAccessPermission();
    // this.onInitializeExportColumns();
  },
  watch: {
    getUserList(e) {
      this.$http
        .get(this.url.order + "/auto_search/customer/" + e)
        .then((res) => {
          res.data.object.forEach((element) => {
            // console.log(element);
            this.customerList.push(element);
          });
        })
        .catch((err) => {
          console.log("failed autocomplete");
        });
    },

    getSalesRepList(e) {
      this.$http
        .get(this.url.order + "/auto_search/salesrep/" + e)
        .then((res) => {
          res.data.object.forEach((element) => {
            // console.log(element);
            this.salesRepList.push(element);
          });
        })
        .catch((err) => {
          console.log("failed autocomplete");
        });
    },

    getProductionList(e) {
      this.$http
        .get(this.url.order + "/auto_search/production/" + e)
        .then((res) => {
          res.data.object.forEach((element) => {
            // console.log(element);
            this.productionList.push(element);
          });
        })
        .catch((err) => {
          console.log("failed autocomplete");
        });
    },

    getCompanyList(e) {
      this.$http
        .get(this.url.order + "/auto_search/company/" + e)
        .then((res) => {
          res.data.object.forEach((element) => {
            // console.log(element);
            this.companyList.push(element);
          });
        })
        .catch((err) => {
          console.log("failed autocomplete");
        });
    },
  },
  methods: {
    onInitialize(e) {
      this.$http
        .get(this.url.order + "?page=" + e)
        .then((response) => {
          this.orders.splice(0);
          let i = response.data;
          console.log(i.objects);

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
            this.orders.push({
              id: e.id,
              order_date: moment(e.order_date * 1000)
                .add(1, "d")
                .toISOString()
                .substr(0, 10),
              cancel_date: moment(e.cancel_date * 1000)
                .add(1, "d")
                .toISOString()
                .substr(0, 10),
              order_type: e.order_type,
              customer: e.customer,
              po_number: e.po_number,
              control_number: e.control_number,
              receiver: e.receiver,
              completed_by: e.completed_by,
              approved_by: e.approved_by,
              attachments: e.attachment,
              eta: e.eta,
              status: e.status,
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
      this.formList.splice(0);
      this.formList.push({
        AxiosProgressCount: 0,
        AxiosSuccess: false,
        AxiosSuccessMessage: "",
        AxiosSuccessResponse: null,
        orderDatePicker: false,
        cancelDatePicker: false,

        orderDate: "",
        cancelDate: "",
        eta: "",
        type: "",
        edi: "",
        upc: "",
        nop: "",
        pt: "",
        po_number: "",
        control_number: "",
        customer: "",
        salesRep: "",
        production: "",
        company: "",
        re_style: "",
        or_style: "",
        attachments: [],
      });
    },
    onSearch(e) {
      this.dataTableLoading = true;
      if (this.search.length > 0) {
        this.$http
          .get(this.url.order + "/getOrderList/" + e)
          .then((response) => {
            // console.log(response.data);
            let i = response.data.objects;
            this.orders.splice(0);
            i.forEach((e) => {
              this.orders.push({
                id: e.id,
                order_date: moment(e.order_date * 1000)
                  .add(1, "d")
                  .toISOString()
                  .substr(0, 10),
                cancel_date: moment(e.cancel_date * 1000)
                  .add(1, "d")
                  .toISOString()
                  .substr(0, 10),
                order_type: e.order_type,
                customer: e.customer,
                po_number: e.po_number,
                control_number: e.control_number,
                receiver: e.receiver,
                completed_by: e.completed_by,
                approved_by: e.approved_by,
                attachments: e.attachment,
                eta: e.eta,
              });
            }, 4000);
            this.dataTableLoading = false;
          });
      } else {
        this.orders.splice(0);
        this.onInitialize(localStorage.getItem("order_pk"));
        this.dataTableLoading = false;
      }
    },
    onEditItem(e, type) {
      this.customerList.splice(0);
      this.salesRepList.splice(0);
      this.productionList.splice(0);
      this.companyList.splice(0);

      this.$http.get(this.url.order + "/edit/" + e.id).then((response) => {
        let i = response.data.objects;
        console.log(i);
        this.formList.splice(0);
        let attechment = [];
        i.attachment.forEach((element) => {
          attechment.push({
            id: element.id,
            name: element.file_name,
          });
          // console.log(element);
        });

        this.customerList.push({
          id: i.customer.id,
          name: i.customer.name,
        });

        this.salesRepList.push({
          id: i.salesrap.id,
          name: i.salesrap.name,
        });

        this.productionList.push({
          id: i.production.id,
          name: i.production.name,
        });

        this.companyList.push({
          company: i.company_auto_id,
        });

        this.formList.push({
          AxiosProgressCount: 0,
          AxiosSuccess: false,
          AxiosSuccessMessage: "",
          AxiosSuccessResponse: null,

          id: i.id,
          orderDate: moment(i.order_date * 1000)
            .add(1, "d")
            .toISOString()
            .substr(0, 10),
          cancelDate: moment(i.cancel_date * 1000)
            .add(1, "d")
            .toISOString()
            .substr(0, 10),
          type: i.order_type,
          edi: i.edi_status,
          upc: i.upc_status,
          nop: i.id,
          pt: i.price_ticket,
          eta: i.eta,
          po_number: i.po_number,
          control_number: i.control_number,
          customer: {
            id: i.customer.id,
            name: i.customer.name,
          },
          salesRep: {
            id: i.salesrap.id,
            name: i.salesrap.name,
          },
          production: {
            id: i.production.id,
            name: i.production.name,
          },
          company: {
            company: i.company_auto_id,
          },
          re_style: i.re_style,
          or_style: i.or_style,
          comment: i.comment,
          remark: i.remark,
          attachments: attechment,
        });
      });

      this.editedIndex = this.orders.indexOf(e);
      if (type == "edit") {
        this.formAddmModel = true;
      } else {
        this.formViewModel = true;
      }
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

      fd.append("id", element.id);
      fd.append("order_date", moment(element.orderDate).format("X"));
      fd.append("cancel_date", moment(element.cancelDate).format("X"));
      fd.append("order_type", element.type);
      fd.append("edi_status", element.edi);
      fd.append("upc_status", element.upc);
      fd.append("price_ticket", element.pt);
      fd.append("po_number", element.po_number);
      fd.append("control_number", element.control_number);
      fd.append("customer_auto_id", element.customer.id);
      fd.append("customer", element.customer.name);
      fd.append("customer_email", element.customer.email);
      fd.append("sales_rep_auto_id", element.salesRep.id);
      fd.append("sales_rep", element.salesRep.name);
      fd.append("sales_rep_email", element.salesRep.email);
      fd.append("production_by", element.production.name);
      fd.append("production_auto_id", element.production.id);
      fd.append("production_email", element.production.email);
      fd.append("company_auto_id", element.company.company);
      fd.append("or_style", element.re_style);
      fd.append("re_style", element.or_style);
      fd.append("total_value", element.nop);
      fd.append("eta", element.eta);
      fd.append("status", 0);

      if (!element.attachments.length < 1) {
        element.attachments.forEach((element) => {
          if (element instanceof File) {
            console.log("NEW FILE");
            fd.append("attachment[]", element, element.name);
          } else {
            console.log("EXSISTING FILE");

            fd.append("attachment[]", element.name);
          }
        });
      }

      if (m == "store") {
        this.$refs.form.validate().then((success) => {
          if (!success) {
            return;
          }
          this.$http
            .post(this.url.order, fd, config)
            .then((res) => {
              if (i < arr.length - 1) {
                this.axiosMultiPost(arr, ++i, "store");
              } else {
                this.onInitialize();
                // this.closeForm();
                this.overlay = false;
                this.notification("Order are successfully added", "green");
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
        });
      } else {
        fd.append("_method", "put");

        console.log("update", element);

        this.$http
          .post(this.url.order + "/" + element.id, fd, config)
          .then((res) => {
            if (res.data.status == 200) {
              element.AxiosSuccess = true;
              element.AxiosProgressCount = 0;
              element.AxiosSuccessMessage = res.data.message;
              element.AxiosSuccessResponse = res.data.status;
            }

            this.onInitialize();
            // this.closeForm();
            this.overlay = false;
            this.notification("Task has been updated successfully", "green");
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
      // this.$refs.form.validate().then((success) => {
      //   if (!success) {
      //     return;
      //   }

      this.overlay = true;
      if (this.editedIndex == -1) {
        this.axiosMultiPost(this.formList, 0, "store");
      } else {
        this.axiosMultiPost(this.formList, 0, "update");
      }
      // });
    },
    closeForm() {
      this.$nextTick(() => {
        this.formAddmModel = false;
        this.editedIndex = -1;
        this.$refs.form.reset();
        this.editedItem = Object.assign({});
      });
    },
    onDeleteConfirm() {
      this.$http
        .delete(this.url.order + "/" + this.editedItem.id)
        .then((response) => {
          this.orders.splice(0);
          this.notification(response.data.message, "green");
          this.onInitialize();
          this.formDeleteModel = false;
        })
        .catch((response) => {
          this.notification("Error Fround. ORDER Not Deleted", "red");
        });
    },
    onDeleteItem(e) {
      this.formDeleteModel = true;
      this.editedItem = Object.assign(e);
      console.log(e);
    },
    addNewOrder(e) {
      //   this.$refs.form.validate().then((success) => {
      //     if (!success) {
      //       return;
      //     }

      this.formList.push({
        AxiosProgressCount: 0,
        AxiosSuccess: false,
        AxiosSuccessMessage: "",
        AxiosSuccessResponse: null,
        orderDatePicker: false,
        cancelDatePicker: false,

        orderDate: "",
        cancelDate: "",
        type: "",
        edi: "",
        upc: "",
        pt: "",
        po_number: "",
        control_number: "",
        customer: "",
        salesRep: "",
        production: "",
        company: "",
        attachments: [],
      });
      //   });
    },
    remomveOrderList(e) {
      this.formList.splice(e, 1);
    },
    onRefresh() {
      this.onInitialize();
    },
    removeAttachment(i, x, y) {
      console.log(x, y);
      console.log("removed", i);

      this.$http
        .delete(this.url.order + "/attachment/" + i.id)
        .then((response) => {
          this.notification(response.data.message, "green");
          this.onInitialize();
        })
        .catch((response) => {
          // console.log("Error Fround. Attachment Not Deleted");
          this.notification("Error Fround. PO Not Deleted", "red");
        });

      this.formList[x].attachments.splice(y, 1);
    },
    onAttachmentSelected(e, k) {
      this.formList[k].attachments = Object.assign(e, {});
    },
    viewEditAttachment(i) {
      console.log(i);
      window.open(
        "http://localhost:8000/storage/Order_attachments/" + i,
        "_blank"
      );
    },
    onAttachment(e) {
      console.log(e);
      this.viewAttachmentList.splice(0);
      this.$http
        .get(this.url.order + "/getAttachments/" + e.id)
        .then((response) => {
          let i = response.data.objects;
          console.log(i);
          i.forEach((element) => {
            this.viewAttachmentList.push(element.file_name);
          });
          this.seperateAttachmentModel = true;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onChangeColumn(e) {
      this.headers.splice(0);
      localStorage.setItem("order_active_columns", JSON.stringify(e));
      let headersMap = this.headersMap;
      let selected_arr = e;
      let filtered = headersMap.filter(({ value }) =>
        selected_arr.includes(value)
      );

      filtered.forEach((element) => {
        this.headers.push(element);
      });
    },
    datatableColumnVisibility() {
      let x = JSON.parse(localStorage.getItem("order_active_columns"));
      let y = this.headersMap.slice(1, -1);

      y.forEach((element) => {
        this.headersList.push(element);
      });

      if (x == null) {
        let obj = this.headersMap;
        let result = obj.map((col) => col.value);
        localStorage.setItem("order_active_columns", JSON.stringify(result));

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
    onExpandTable(e) {
      if (e == "e") {
        let x = this.$gl.onFullscreenDataTable("dt_table_order");
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
      let DecKey = this.$gl.DecKey(localStorage.getItem("token_access"));
      let user_DecKey = this.$gl.DecKey(localStorage.getItem("user"));
      let access = JSON.parse(DecKey);
      let currentUser = JSON.parse(user_DecKey);
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
