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
        id="dt_table_recurring"
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
                {{ $t("recurring.title") }}
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
              <span class="v_toolbar_add_button_text">
                {{ $t("button.addAccounts") }}
              </span>
            </v-btn>
          </v-toolbar>
        </template>

        <template v-slot:[`item.id`]="{ item, index }">
          <div
            class="d-flex index_id_column"
            :title="item.recurring_status == '0' ? 'PENDING' : 'ACTIVE'"
          >
            <v-sheet
              :color="item.recurring_status == '0' ? 'orange' : 'green'"
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
        <v-card-text class="pt-3">
          <ValidationObserver ref="form">
            <v-row class=" ">
              <!-- NAME -->
              <v-col md="2" sm="2" cols="12" class="ma-2 pa-0">
                <!-- <ValidationProvider
                  rules="required"
                  name="NAME"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="editedItem.recurring_name"
                    :label="errors[0] ? errors[0] : 'oldNAME'"
                    :error-messages="errors"
                    dense
                    hide-details=""
                  >
                  </v-text-field>
                </ValidationProvider> -->

                <ValidationProvider
                  rules="required"
                  name="NAME"
                  v-slot="{ errors }"
                >
                  <v-combobox
                    v-model="editedItem.recurring_name"
                    :items="userList"
                    item-text="name"
                    :search-input.sync="getUserList"
                    hide-selected
                    :label="errors[0] ? errors[0] : 'NAME'"
                    dense
                    hide-details=""
                  >
                  </v-combobox>
                </ValidationProvider>
              </v-col>

              <!-- TYPE -->
              <v-col md="2" sm="2" cols="12" class="ma-2 pa-0">
                <ValidationProvider
                  rules="required"
                  name="TYPE"
                  v-slot="{ errors }"
                >
                  <v-select
                    :items="typeOption"
                    v-model="editedItem.recurring_type"
                    :label="errors[0] ? errors[0] : 'TYPE'"
                    :error-messages="errors"
                    hide-details=""
                    clearable
                    dense
                    item-text="option"
                    item-value="index"
                  ></v-select>
                </ValidationProvider>
              </v-col>

              <!-- MOBILE -->
              <v-col md="2" sm="2" cols="12" class="ma-2 pa-0">
                <ValidationProvider
                  rules="required"
                  name="MOBILE"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="editedItem.recurring_user_mobile"
                    :label="errors[0] ? errors[0] : 'MOBILE'"
                    :error-messages="errors"
                    dense
                    hide-details=""
                  >
                  </v-text-field>
                </ValidationProvider>
              </v-col>

              <!-- EMAIL -->
              <v-col md="2" sm="2" cols="12" class="ma-2 pa-0">
                <ValidationProvider
                  rules="required"
                  name="EMAIL"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="editedItem.recurring_user_email"
                    :label="errors[0] ? errors[0] : 'EMAIL'"
                    :error-messages="errors"
                    dense
                    hide-details=""
                  >
                  </v-text-field>
                </ValidationProvider>
              </v-col>

              <!-- ADDRESS -->
              <v-col md="3" sm="2" cols="12" class="ma-2 pa-0">
                <ValidationProvider
                  rules="required"
                  name="ADDRESS"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="editedItem.recurring_address"
                    :label="errors[0] ? errors[0] : 'ADDRESS'"
                    :error-messages="errors"
                    dense
                    hide-details=""
                  >
                  </v-text-field>
                </ValidationProvider>
              </v-col>

              <!-- ZIP CODE -->
              <v-col md="2" sm="2" cols="12" class="ma-2 pa-0">
                <ValidationProvider
                  rules="required"
                  name="ZIP CODE"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="editedItem.recurring_zip_code"
                    :label="errors[0] ? errors[0] : 'ZIP CODE'"
                    :error-messages="errors"
                    dense
                    hide-details=""
                  >
                  </v-text-field>
                </ValidationProvider>
              </v-col>

              <!-- PHONE -->
              <v-col md="2" sm="2" cols="12" class="ma-2 pa-0">
                <ValidationProvider
                  rules="required"
                  name="PHONE"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="editedItem.recurring_phone"
                    :label="errors[0] ? errors[0] : 'PHONE'"
                    :error-messages="errors"
                    dense
                    hide-details=""
                  >
                  </v-text-field>
                </ValidationProvider>
              </v-col>

              <!-- KEY MONEY -->
              <v-col md="2" sm="2" cols="12" class="ma-2 pa-0">
                <ValidationProvider
                  rules="required"
                  name="KEY MONEY"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="editedItem.recurring_key_money"
                    :label="errors[0] ? errors[0] : 'KEY MONEY'"
                    :error-messages="errors"
                    dense
                    hide-details=""
                  >
                  </v-text-field>
                </ValidationProvider>
              </v-col>

              <!-- MONTHLY AMOUNT -->
              <v-col md="2" sm="2" cols="12" class="ma-2 pa-0">
                <ValidationProvider
                  rules="required"
                  name="MONTHLY AMOUNT"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="editedItem.recurring_montly_amount"
                    :label="errors[0] ? errors[0] : 'MONTHLY AMOUNT'"
                    :error-messages="errors"
                    dense
                    hide-details=""
                  >
                  </v-text-field>
                </ValidationProvider>
              </v-col>

              <!-- COUNTRY -->
              <v-col md="3" sm="2" cols="12" class="ma-2 pa-0">
                <ValidationProvider
                  rules="required"
                  name="COUNTRY"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="editedItem.recurring_country"
                    :label="errors[0] ? errors[0] : 'COUNTRY'"
                    :error-messages="errors"
                    dense
                    hide-details=""
                  >
                  </v-text-field>
                </ValidationProvider>
              </v-col>

              <!-- CITY -->
              <v-col md="2" sm="2" cols="12" class="ma-2 pa-0">
                <ValidationProvider
                  rules="required"
                  name="CITY"
                  v-slot="{ errors }"
                >
                  <v-autocomplete
                    v-model="editedItem.recurring_city"
                    :items="cityList"
                    :search-input.sync="getCityList"
                    :label="errors[0] ? errors[0] : 'CITY'"
                    :error-messages="errors"
                    item-text="location_city"
                    item-value="id"
                    return-object
                    dense
                    hide-no-data
                    hide-details=""
                    hide-selected
                    single-line
                  >
                    <template v-slot:selection="data">
                      {{ data.item.location_city }}
                    </template>
                    <template v-slot:item="{ item }">
                      <!-- {{ item.location_country }}- -->
                      {{ item.location_city }} - {{ item.location_zip_code }}
                    </template>
                  </v-autocomplete>
                </ValidationProvider>
              </v-col>

              <!-- STATE -->
              <v-col md="2" sm="2" cols="12" class="ma-2 pa-0">
                <ValidationProvider
                  rules="required"
                  name="STATE"
                  v-slot="{ errors }"
                >
                  <v-autocomplete
                    v-model="editedItem.recurring_state"
                    :items="stateList"
                    :search-input.sync="getStateList"
                    :label="errors[0] ? errors[0] : 'STATE'"
                    :error-messages="errors"
                    item-text="location_name"
                    item-value="id"
                    return-object
                    dense
                    hide-no-data
                    hide-details=""
                    hide-selected
                    single-line
                  >
                    <template v-slot:selection="data">
                      {{ data.item.location_city }}
                    </template>
                    <template v-slot:item="{ item }">
                      {{ item.location_name }} - {{ item.location_zip_code }}
                    </template>
                  </v-autocomplete>
                </ValidationProvider>
              </v-col>

              <!-- START DATEST DATE -->
              <v-col md="2" sm="2" cols="12" class="ma-2 pa-0">
                <v-menu
                  v-model="startDatePicker"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <ValidationProvider
                      rules="required"
                      name="START DATE"
                      v-slot="{ errors }"
                    >
                      <v-text-field
                        v-model="editedItem.recurring_start_date"
                        :label="errors[0] ? errors[0] : 'START DATE'"
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
                    v-model="editedItem.recurring_start_date"
                    dateFormat="mm-YYYY"
                    :color="DTbtnColor"
                    @input="startDatePicker = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <!-- END DATE-->
              <v-col md="2" sm="2" cols="12" class="ma-2 pa-0">
                <v-menu
                  v-model="endDatePicker"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <ValidationProvider
                      rules="required"
                      name="END DATE"
                      v-slot="{ errors }"
                    >
                      <v-text-field
                        v-model="editedItem.recurring_end_date"
                        :label="errors[0] ? errors[0] : 'END DATE'"
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
                    v-model="editedItem.recurring_end_date"
                    dateFormat="mm-YYYY"
                    :color="DTbtnColor"
                    @input="endDatePicker = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <!-- STATUS -->
              <v-col md="3" sm="6" cols="12" class="ma-2 pa-0">
                <ValidationProvider
                  rules="required"
                  name="STATUS"
                  v-slot="{ errors }"
                >
                  <v-select
                    :items="statusOption"
                    v-model="editedItem.recurring_status"
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
            RECURRING VIEW
          </span>
          <v-spacer></v-spacer>
          <v-icon @click="formViewModel = false">mdi-close</v-icon>
        </v-card-title>

        <!-- MODEL BODY -->
        <v-card-text class="ma-0 pa-3 ">
          <v-row class="ma-0 pa-0  mt-5 view_form_style">
            <!-- COL -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-drag</v-icon>
                <strong> NAME </strong>
              </div>
              <div class="ml-7">
                {{ editedItem.recurring_name }}
              </div>
            </v-col>
            <!-- COL -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-drag</v-icon>
                <strong> TYPE </strong>
              </div>
              <div class="ml-7">
                {{
                  editedItem.recurring_type == 0 ? "PERMANENT" : "TEMPRORARY"
                }}
              </div>
            </v-col>
            <!-- COL -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-drag</v-icon>
                <strong> MOBILE </strong>
              </div>
              <div class="ml-7">
                {{ editedItem.recurring_user_mobile }}
              </div>
            </v-col>
            <!-- COL -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-drag</v-icon>
                <strong> EMAIL </strong>
              </div>
              <div class="ml-7">
                {{ editedItem.recurring_user_email }}
              </div>
            </v-col>
            <!-- COL -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-drag</v-icon>
                <strong> ADDRESS </strong>
              </div>
              <div class="ml-7">
                {{ editedItem.recurring_address }}
              </div>
            </v-col>

            <!-- COL -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
              v-if="editedItem.recurring_state"
            >
              <div>
                <v-icon small left>mdi-drag</v-icon>
                <strong> CITY </strong>
              </div>
              <div class="ml-7">
                {{ editedItem.recurring_city.location_city }}
              </div>
            </v-col>

            <!-- COL -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-drag</v-icon>
                <strong> ZIP CODE </strong>
              </div>
              <div class="ml-7">
                {{ editedItem.recurring_zip_code }}
              </div>
            </v-col>

            <!-- COL -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
              v-if="editedItem.recurring_state"
            >
              <div>
                <v-icon small left>mdi-drag</v-icon>
                <strong> STATE </strong>
              </div>
              <div class="ml-7">
                {{ editedItem.recurring_state.location_city }}
              </div>
            </v-col>

            <!-- COL -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-drag</v-icon>
                <strong> COUNTRY </strong>
              </div>
              <div class="ml-7">
                {{ editedItem.recurring_country }}
              </div>
            </v-col>

            <!-- COL -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-drag</v-icon>
                <strong> PHONE </strong>
              </div>
              <div class="ml-7">
                {{ editedItem.recurring_phone }}
              </div>
            </v-col>

            <!-- COL -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-drag</v-icon>
                <strong> START DATE </strong>
              </div>
              <div class="ml-7">
                {{ editedItem.recurring_start_date }}
              </div>
            </v-col>

            <!-- COL -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-drag</v-icon>
                <strong> END DATE </strong>
              </div>
              <div class="ml-7">
                {{ editedItem.recurring_end_date }}
              </div>
            </v-col>
            <!-- COL -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-drag</v-icon>
                <strong> KEY MONEY </strong>
              </div>
              <div class="ml-7">
                {{ editedItem.recurring_key_money }}
              </div>
            </v-col>
            <!-- COL -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-drag</v-icon>
                <strong> MONTHLY AMOUNT </strong>
              </div>
              <div class="ml-7">
                {{ editedItem.recurring_montly_amount }}
              </div>
            </v-col>
            <!-- COL -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-drag</v-icon>
                <strong> STATUS </strong>
              </div>
              <div class="ml-7">
                {{ editedItem.recurring_status == 0 ? "PENDING" : "ACTIVE" }}
              </div>
            </v-col>

            <!-- EMPTY -->
            <v-col md="3" sm="3" cols="12" class=""> </v-col>
            <!-- EMPTY -->
            <v-col md="3" sm="3" cols="12" class=" "> </v-col>
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
        baseURL: "recurring",
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
      startDatePicker: false,
      endDatePicker: false,

      existData: -1,
      appAccess: 0, //ACCESS PERMISSION
      editedIndex: -1,

      moment: moment,
      pageKey: "recurring_pk",
      activeColumns: "recurring_active_columns",
      DTbtnColor: "indigo lighten-1 ",
      ModelHeaderColor: "blue-grey lighten-5",
      search: "",

      getCityList: "",
      getStateList: "",
      getUserList: "",

      cityList: [],
      stateList: [],
      userList: [],

      itemData: [], // Array for DataTable
      headers: [],
      headersList: [],
      selectedHeaders: [],
      excelTitles: [],
      pdfTitles: [],
      selectedExcelTitle: [],
      selectedPDFTitle: [],

      typeOption: [
        { option: "PERMANENT", index: 0 },
        { option: "TEMPRORARY", index: 1 },
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
        localCurrentPage: parseInt(localStorage.getItem("recurring_pk")),
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
          align: "start",
          sortable: true,
          value: "id",
          width: "50",
          divider: true,
        },
        {
          text: "NAME",
          align: "start",
          sortable: true,
          value: "recurring_name",
          width: "170",
          divider: true,
        },
        {
          text: "TYPE",
          align: "start",
          sortable: true,
          value: "recurring_type",
          width: "100",
          divider: true,
        },
        {
          text: "MOBILE",
          align: "start",
          sortable: true,
          value: "recurring_user_mobile",
          width: "100",
          divider: true,
        },
        {
          text: "PHONE",
          align: "start",
          sortable: true,
          value: "recurring_phone",
          width: "100",
          divider: true,
        },
        {
          text: "ST DATE",
          align: "start",
          sortable: true,
          value: "recurring_start_date",
          width: "105",
          divider: true,
        },
        {
          text: "END DATE",
          align: "start",
          sortable: true,
          value: "recurring_end_date",
          width: "105",
          divider: true,
        },
        {
          text: "KEY MONEY",
          align: "center",
          sortable: true,
          value: "recurring_key_money",
          width: "120",
          divider: true,
        },
        {
          text: "MONTHLY AMOUNT",
          align: "center",
          sortable: true,
          value: "recurring_montly_amount",
          width: "160",
          divider: true,
        },
        {
          text: "EMAIL",
          align: "center",
          sortable: true,
          value: "recurring_user_email",
          divider: true,
        },
        {
          text: "ADDRESS",
          align: "start",
          sortable: true,
          value: "recurring_address",
          width: "300",
          divider: true,
        },
        {
          text: "CITY",
          align: "start",
          sortable: true,
          value: "recurring_city",

          divider: true,
        },
        {
          text: "ZIP CODE",
          align: "center",
          sortable: true,
          value: "recurring_zip_code",
          width: "110",
          cellClass: " pa-0 ma-0",
          divider: true,
        },
        {
          text: "COUNTRY",
          align: "center",
          sortable: true,
          value: "recurring_country",
          width: "110",
          cellClass: " pa-0 ma-0",
          divider: true,
        },

        {
          text: "Actions",
          value: "actions",
          sortable: false,
          align: "center",
          width: "100",
          cellClass: " pa-0 ma-0",
          class: "dark--text",
        },
      ],
    };
  },
  created() {
    // console.log("initializing ");
    // console.log("----------------------------------------------");
    localStorage.setItem(this.pageKey, 1);
    this.onInitialize(this.pageKey);
    this.datatableColumnVisibility(this.activeColumns);
  },
  beforeMount() {
    this.onAccessPermission();
    this.onInitializeExportColumns();
  },

  watch: {
    getCityList(e) {
      this.$http
        .get(this.url.baseURL + "/auto_search/zipcode/" + e)
        .then((response) => {
          let i = response.data;
          i.objects.forEach((element) => {
            this.cityList.push(element);
          });
          console.log("onAutoComplete", i);
        })
        .catch((err) => {
          console.log("failed  autocomplete");
        });
    },
    getStateList(e) {
      this.$http
        .get(this.url.baseURL + "/auto_search/state/" + e)
        .then((response) => {
          let i = response.data;
          i.objects.forEach((element) => {
            this.stateList.push(element);
          });
          console.log("onAutoComplete", i);
        })
        .catch((err) => {
          console.log("failed  autocomplete");
        });
    },

    getUserList(e) {
      this.$http
        .get(this.url.baseURL + "/auto_search/user/" + e)
        .then((response) => {
          let i = response.data;
          i.objects.forEach((element) => {
            this.userList.push(element);
          });
          console.log("onAutoComplete", i);
        })
        .catch((err) => {
          console.log("failed  autocomplete");
        });
    },
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "NEW RECURRING" : "EDIT RECURRING";
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
          console.log("onInitialize", i);
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

        let recurring_name = "";
        let recurring_ID = "";
        if (typeof this.editedItem.recurring_name === "object") {
          recurring_name = this.editedItem.recurring_name.name;
          recurring_ID = this.editedItem.recurring_name.id;
        } else {
          recurring_name = this.editedItem.recurring_name;
        }

        const obj = {
          id: this.editedItem.id,
          recurring_type: this.editedItem.recurring_type,
          recurring_name: recurring_name,
          recurring_user_mobile: this.editedItem.recurring_user_mobile,
          recurring_user_email: this.editedItem.recurring_user_email,
          recurring_address: this.editedItem.recurring_address,
          recurring_city: this.editedItem.recurring_city.location_city,
          recurring_zip_code: this.editedItem.recurring_zip_code,
          recurring_state: this.editedItem.recurring_state.location_name,
          recurring_country: this.editedItem.recurring_country,
          recurring_phone: this.editedItem.recurring_phone,
          recurring_start_date: this.editedItem.recurring_start_date,
          recurring_end_date: this.editedItem.recurring_end_date,
          recurring_key_money: this.editedItem.recurring_key_money,
          recurring_montly_amount: this.editedItem.recurring_montly_amount,
          recurring_status: this.editedItem.recurring_status,
          location_auto_id: this.editedItem.recurring_state.id,
          recurring_user_id: recurring_ID,
        };

        console.log("store", obj);

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
      this.editedIndex = this.itemData.indexOf(e);
      this.editedItem = Object.assign({});
      this.cityList.splice(0);
      this.stateList.splice(0);

      this.$http
        .get(this.url.baseURL + "/getEditItem/" + e.id)
        .then((response) => {
          let i = response.data.objects;

          this.cityList.push({
            id: i.location_state.id,
            location_city: i.location_state.location_city,
          });

          this.stateList.push({
            id: i.location_state.id,
            location_city: i.location_state.location_name,
          });

          this.editedItem = Object.assign({
            id: i.id,
            recurring_type: i.recurring_type,
            recurring_name: i.recurring_name,
            recurring_user_mobile: i.recurring_user_mobile,
            recurring_user_email: i.recurring_user_email,
            recurring_address: i.recurring_address,
            recurring_city: {
              id: i.location_state.id,
              location_city: i.location_state.location_city,
            },
            recurring_zip_code: i.recurring_zip_code,
            recurring_state: {
              id: i.location_state.id,
              location_city: i.location_state.location_name,
            },
            recurring_country: i.recurring_country,
            recurring_phone: i.recurring_phone,
            recurring_start_date: i.recurring_start_date,
            recurring_end_date: i.recurring_end_date,
            recurring_key_money: i.recurring_key_money,
            recurring_montly_amount: i.recurring_montly_amount,
            recurring_status: i.recurring_status,
            location_auto_id: i.recurring_state.id,
          });
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

    onExpandTable(e) {
      if (e == "e") {
        let x = this.$gl.onFullscreenDataTable("dt_table_recurring");
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
