<template>
  <div id="User">
    <!-- DASHBOARD LAYOYT -->
    <DashboardLayout />
    <!-- DB TABLE -->
    <v-card color="pa-0" tile flat>
      <v-data-table
        :headers="showHeaders"
        :items="Users"
        :fixed-header="true"
        :loading="dataTableLoading"
        :items-per-page="5"
        :footer-props="{
          'items-per-page-options': [pagination.total],
          prevIcon: '',
          nextIcon: '',
        }"
        loading-text="Fetching Project Data"
        height="85vh"
        id="dt_table_users"
        class="elevation-0"
        dense
        disable-pagination
      >
        <!-- TABLE TOP -->
        <template v-slot:top>
          <v-toolbar flat id="toolbar">
            <v-toolbar-title class="h6" id="v_table_title">
              <!-- TABLE MAXIMIZE ICON -->
              <v-icon
                small
                left
                @click="onExpandTable"
                v-if="!dataTableFullscreen"
                title="Expand Data Table"
              >
                mdi-image-filter-center-focus-strong
              </v-icon>

              <!-- TABLE MINIMIZE ICON -->
              <v-icon
                v-else
                @click="onExitFullScreenDataTable"
                title="Minimize Data Table"
              >
                mdi-arrow-expand
              </v-icon>

              <!-- TABLE TITLE  -->
              <span v-animate-css="'fadeIn'">
                {{ $t("users.title") }}
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
                >
                  EXPORT
                </v-btn>
              </v-list>
            </v-menu>

            <v-spacer></v-spacer>

            <!-- SEARCH TEXT -->
            <div v-shortkey="['alt', 's']" @shortkey="focusSearchKey">
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                @input="onSearch"
                label="Search"
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
                  v-for="(item, i) in headers"
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
                <!-- ADD PROJECTS -->
                {{ $t("button.addUsers") }}
              </span>
            </v-btn>
          </v-toolbar>
        </template>

        <!--COLUMN ID -->
        <template v-slot:[`item.id`]="{ item, index }">
          <div class="d-flex  index_id_column">
            <div class="chip_bar_on_complete" v-if="item.status == 1"></div>
            <div class="chip_bar_on_progress" v-if="item.status == 0"></div>
            {{ index + 1 }}
          </div>
        </template>

        <!--COLUMN ROLE -->
        <template v-slot:[`item.role`]="{ item }">
          <span v-if="item.role == 0">
            <v-chip small>CLIENT</v-chip>
          </span>
          <span v-if="item.role == 1">
            <v-chip small>SUPER ADMIN</v-chip>
          </span>
          <span v-if="item.role == 2">
            <v-chip small>ADMIN</v-chip>
          </span>
          <span v-if="item.role == 3">
            <v-chip small>MANAGER</v-chip>
          </span>
          <span v-if="item.role == 4">
            <v-chip small>CASHIER</v-chip>
          </span>
          <span v-if="item.role == 5">
            <v-chip small> SALES REP</v-chip>
          </span>
          <span v-if="item.role == 6">
            <v-chip small>EMPLOYEE</v-chip>
          </span>
          <span v-if="item.role == 7">
            <v-chip small> MARKETING TEAM</v-chip>
          </span>
        </template>

        <!-- TABLE ACTIONS -->
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            id="dt-view-action-button"
            x-small
            class="mr-2 blue darken-1  pa-1 shrink   white--text rounded"
            title="View Projects"
            @click="onView(item)"
          >
            mdi-eye
          </v-icon>
          <v-icon
            id="dt-edit-action-button"
            x-small
            title="Edit Projects"
            class="mr-2 orange darken-1 pa-1 white--text rounded"
            @click="onEditItem(item)"
            v-show="appAccess >= 3"
          >
            mdi-pencil
          </v-icon>

          <v-icon
            id="dt-trash-action-button"
            x-small
            title="Delete Projects"
            class="red darken-1 pa-1 white--text rounded"
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
              @input="onPageChange"
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

    <!--PRIVILLAGE MODE FORM -->
    <v-dialog
      v-model="privillageModel"
      max-width="700px"
      persistent
      content-class="user-privilage-dialog"
      scrollable
    >
      <v-card>
        <v-card-title :class="ModelHeaderColor">
          <span class="headline ">
            PRIVILAGES
          </span>
          <v-spacer></v-spacer>
          <v-icon @click="privillageCancel">mdi-close</v-icon>
        </v-card-title>

        <v-card-text style="height: 300px;">
          <v-row class=" mt-3">
            <!-- DASHBOARD PRIVILAGE -->
            <v-col cols="12" sm="6" md="6" class="  d-flex align-center">
              <span>DASHBOARD</span>
            </v-col>
            <v-col cols="12" sm="6" md="6" class="  d-flex align-center">
              <ValidationProvider
                rules="required"
                name="Accessible Operation"
                v-slot="{ errors }"
              >
                <v-select
                  :items="accessOptions"
                  v-model="privillage.dashboard"
                  :label="errors[0] ? errors[0] : 'Access'"
                  :error-messages="errors"
                  hide-details=""
                  prefix="*"
                  clearable
                  dense
                  item-text="option"
                  item-value="val"
                ></v-select>
              </ValidationProvider>
            </v-col>

            <!-- PROJECTS PRIVILAGE -->
            <v-col cols="12" sm="6" md="6" class="  d-flex align-center">
              <span>PROJECTS</span>
            </v-col>
            <v-col cols="12" sm="6" md="6" class="  d-flex align-center">
              <ValidationProvider
                rules="required"
                name="Accessible Operation"
                v-slot="{ errors }"
              >
                <v-select
                  :items="accessOptions"
                  v-model="privillage.project"
                  :label="errors[0] ? errors[0] : 'Access'"
                  :error-messages="errors"
                  hide-details=""
                  prefix="*"
                  clearable
                  dense
                  item-text="option"
                  item-value="val"
                ></v-select>
              </ValidationProvider>
            </v-col>

            <!-- SYSTEM PRIVILAGE -->
            <v-col cols="12" sm="6" md="6" class="  d-flex align-center">
              <span>SYSTEM</span>
            </v-col>
            <v-col cols="12" sm="6" md="6" class="  d-flex align-center">
              <ValidationProvider
                rules="required"
                name="Accessible Operation"
                v-slot="{ errors }"
              >
                <v-select
                  :items="accessOptions"
                  v-model="privillage.system"
                  :label="errors[0] ? errors[0] : 'Access'"
                  :error-messages="errors"
                  hide-details=""
                  prefix="*"
                  clearable
                  dense
                  item-text="option"
                  item-value="val"
                ></v-select>
              </ValidationProvider>
            </v-col>

            <!-- TASK PRIVILAGE -->
            <v-col cols="12" sm="6" md="6" class="  d-flex align-center">
              <span>TASK</span>
            </v-col>
            <v-col cols="12" sm="6" md="6" class="  d-flex align-center">
              <ValidationProvider
                rules="required"
                name="Accessible Operation"
                v-slot="{ errors }"
              >
                <v-select
                  :items="accessOptions"
                  v-model="privillage.task"
                  :label="errors[0] ? errors[0] : 'Access'"
                  :error-messages="errors"
                  hide-details=""
                  prefix="*"
                  clearable
                  dense
                  item-text="option"
                  item-value="val"
                ></v-select>
              </ValidationProvider>
            </v-col>

            <!-- USER PRIVILAGE -->
            <v-col cols="12" sm="6" md="6" class="  d-flex align-center">
              <span>USER</span>
            </v-col>
            <v-col cols="12" sm="6" md="6" class="  d-flex align-center">
              <ValidationProvider
                rules="required"
                name="Accessible Operation"
                v-slot="{ errors }"
              >
                <v-select
                  :items="accessOptions"
                  v-model="privillage.user"
                  :label="errors[0] ? errors[0] : 'Access'"
                  :error-messages="errors"
                  hide-details=""
                  prefix="*"
                  clearable
                  dense
                  item-text="option"
                  item-value="val"
                ></v-select>
              </ValidationProvider>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="fixed-bottom">
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="privillageCancel">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="privillageSubmit">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ADD MODEL FORM -->
    <v-dialog
      v-model="formAddmModel"
      max-width="1200px"
      persistent
      content-class="user-form-dialog"
      scrollable
    >
      <v-card>
        <v-card-title :class="ModelHeaderColor">
          <span class="headline ">
            {{ formTitle }}
            <span v-if="editedIndex != -1">
              {{ editedItem.name }}
            </span>
          </span>
          <v-spacer></v-spacer>
          <v-icon @click="closeForm">mdi-close</v-icon>
        </v-card-title>

        <v-card-text>
          <v-container>
            <ValidationObserver ref="form">
              <v-row>
                <!-- NAME -->
                <v-col cols="12" sm="6" md="3">
                  <ValidationProvider
                    rules="required|min:5"
                    name="User Name"
                    v-slot="{ errors }"
                  >
                    <v-text-field
                      v-model="editedItem.name"
                      :label="errors[0] ? errors[0] : 'User Name'"
                      :error-messages="errors"
                      prefix="*"
                      clearable
                      dense
                      counter="12"
                      hide-details=""
                    >
                    </v-text-field>
                  </ValidationProvider>
                </v-col>

                <!--EMAIL -->
                <v-col cols="12" sm="6" md="3">
                  <ValidationProvider
                    rules="required|email"
                    name="Email"
                    v-slot="{ errors }"
                  >
                    <v-text-field
                      v-model="editedItem.email"
                      :label="errors[0] ? errors[0] : 'Email'"
                      :error-messages="errors"
                      prefix="*"
                      clearable
                      dense
                      counter="12"
                      hide-details=""
                    >
                    </v-text-field>
                  </ValidationProvider>
                </v-col>

                <!--PHONE -->
                <v-col cols="12" sm="6" md="3">
                  <ValidationProvider
                    rules="required|numeric|min:9|max:15"
                    name="Phone"
                    v-slot="{ errors }"
                  >
                    <v-text-field
                      v-model="editedItem.phone"
                      :label="errors[0] ? errors[0] : 'Phone'"
                      :error-messages="errors"
                      prefix="*"
                      clearable
                      dense
                      hide-details=""
                    >
                    </v-text-field>
                  </ValidationProvider>
                </v-col>

                <!--ADDRESS -->
                <v-col cols="12" sm="6" md="3">
                  <ValidationProvider
                    rules="required|max:100"
                    name="Address"
                    v-slot="{ errors }"
                  >
                    <v-text-field
                      v-model="editedItem.address"
                      :label="errors[0] ? errors[0] : 'Address'"
                      :error-messages="errors"
                      prefix="*"
                      clearable
                      dense
                      hide-details=""
                    >
                    </v-text-field>
                  </ValidationProvider>
                </v-col>

                <!--NIC -->
                <v-col cols="12" sm="6" md="3">
                  <ValidationProvider
                    rules="required|max:20|min:8"
                    name="NIC"
                    v-slot="{ errors }"
                  >
                    <v-text-field
                      v-model="editedItem.nic"
                      :label="errors[0] ? errors[0] : 'NIC'"
                      :error-messages="errors"
                      prefix="*"
                      clearable
                      dense
                      hide-details=""
                    >
                    </v-text-field>
                  </ValidationProvider>
                </v-col>

                <!-- GENDER -->
                <v-col cols="12" sm="6" md="3">
                  <ValidationProvider
                    rules="required"
                    name="Gender"
                    v-slot="{ errors }"
                  >
                    <v-select
                      :items="genderOptions"
                      v-model="editedItem.gender"
                      :label="errors[0] ? errors[0] : 'Gender'"
                      :error-messages="errors"
                      hide-details=""
                      prefix="*"
                      clearable
                      dense
                    ></v-select>
                  </ValidationProvider>
                </v-col>

                <!-- COMPANY -->
                <v-col cols="12" sm="6" md="3">
                  <ValidationProvider
                    rules="required"
                    name="Company"
                    v-slot="{ errors }"
                  >
                    <v-text-field
                      v-model="editedItem.company"
                      :label="errors[0] ? errors[0] : 'Company'"
                      :error-messages="errors"
                      prefix="*"
                      clearable
                      dense
                      hide-details=""
                    >
                    </v-text-field>
                  </ValidationProvider>
                </v-col>

                <!-- ATTEMPTS -->
                <v-col cols="12" sm="6" md="3">
                  <ValidationProvider
                    rules="required|numeric|max:1"
                    name="Login attempts "
                    v-slot="{ errors }"
                  >
                    <v-text-field
                      v-model="editedItem.attempts"
                      :label="errors[0] ? errors[0] : 'Login attempts'"
                      :error-messages="errors"
                      prefix="*"
                      clearable
                      dense
                      hide-details=""
                    >
                    </v-text-field>
                  </ValidationProvider>
                </v-col>

                <!-- DOB -->
                <v-col cols="12" sm="6" md="3">
                  <ValidationProvider
                    rules="required"
                    name="Date of birth"
                    v-slot="{ errors }"
                  >
                    <v-menu
                      v-model="dobDatePicker"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <ValidationProvider
                          rules="required"
                          name="Date of birth"
                          v-slot="{ errors }"
                        >
                          <v-text-field
                            v-model="editedItem.dob"
                            :label="errors[0] ? errors[0] : 'Date of birth'"
                            :error-messages="errors"
                            hide-details=""
                            clearable
                            prefix="*"
                            dense
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </ValidationProvider>
                      </template>
                      <v-date-picker
                        v-model="editedItem.dob"
                        dateFormat="mm-YYYY"
                        @input="dobDatePicker = false"
                      ></v-date-picker>
                    </v-menu>
                  </ValidationProvider>
                </v-col>

                <!-- CITY -->
                <v-col cols="12" sm="6" md="3">
                  <ValidationProvider
                    rules="required"
                    name="City"
                    v-slot="{ errors }"
                  >
                    <v-select
                      :items="cityOptions"
                      v-model="editedItem.city"
                      :label="errors[0] ? errors[0] : 'City'"
                      :error-messages="errors"
                      hide-details=""
                      prefix="*"
                      clearable
                      dense
                      item-text="option"
                      item-value="index"
                    ></v-select>
                  </ValidationProvider>
                </v-col>

                <!-- LOCATIONS -->
                <v-col cols="12" sm="6" md="3">
                  <ValidationProvider
                    rules="required"
                    name="Location"
                    v-slot="{ errors }"
                  >
                    <v-select
                      :items="locationOptions"
                      v-model="editedItem.location"
                      :label="errors[0] ? errors[0] : 'Location'"
                      :error-messages="errors"
                      hide-details=""
                      prefix="*"
                      clearable
                      dense
                      item-text="option"
                      item-value="index"
                    ></v-select>
                  </ValidationProvider>
                </v-col>

                <!-- ZIP CODE -->
                <v-col cols="12" sm="6" md="3">
                  <ValidationProvider
                    rules="required|min:3"
                    name="Zip Code"
                    v-slot="{ errors }"
                  >
                    <v-text-field
                      v-model="editedItem.zipCode"
                      :label="errors[0] ? errors[0] : 'Zip Code'"
                      :error-messages="errors"
                      prefix="*"
                      clearable
                      dense
                      hide-details=""
                    >
                    </v-text-field>
                  </ValidationProvider>
                </v-col>

                <!-- ACCOUNT NUMBER -->
                <v-col cols="12" sm="6" md="3">
                  <ValidationProvider
                    rules="required"
                    name="Account Number"
                    v-slot="{ errors }"
                  >
                    <v-text-field
                      v-model="editedItem.accountNumber"
                      :label="errors[0] ? errors[0] : 'Account Number'"
                      :error-messages="errors"
                      prefix="*"
                      clearable
                      dense
                      hide-details=""
                    >
                    </v-text-field>
                  </ValidationProvider>
                </v-col>

                <!-- USER TYPE -->
                <v-col cols="12" sm="6" md="3">
                  <ValidationProvider
                    rules="required"
                    name="User Type"
                    v-slot="{ errors }"
                  >
                    <v-select
                      :items="userTypeOptions"
                      v-model="editedItem.userType"
                      :label="errors[0] ? errors[0] : 'User Type'"
                      :error-messages="errors"
                      hide-details=""
                      prefix="*"
                      clearable
                      dense
                      item-text="option"
                      item-value="index"
                    ></v-select>
                  </ValidationProvider>
                </v-col>

                <!-- OPENING BALANCE AMOUNT -->
                <v-col cols="12" sm="6" md="3">
                  <ValidationProvider
                    rules="required|numeric"
                    name="Opening Balance"
                    v-slot="{ errors }"
                  >
                    <v-text-field
                      v-model="editedItem.openingBalance"
                      :label="errors[0] ? errors[0] : 'Opening Balance'"
                      :error-messages="errors"
                      prefix="*"
                      clearable
                      dense
                      hide-details=""
                    >
                    </v-text-field>
                  </ValidationProvider>
                </v-col>

                <!--   BALANCE AMOUNT -->
                <v-col cols="12" sm="6" md="3">
                  <ValidationProvider
                    rules="required|numeric"
                    name="Balance Amount"
                    v-slot="{ errors }"
                  >
                    <v-text-field
                      v-model="editedItem.Balance"
                      :label="errors[0] ? errors[0] : 'Balance Amount'"
                      :error-messages="errors"
                      prefix="*"
                      clearable
                      dense
                      hide-details=""
                    >
                    </v-text-field>
                  </ValidationProvider>
                </v-col>

                <!-- CREDIT LIMIT -->
                <v-col cols="12" sm="6" md="3">
                  <ValidationProvider
                    rules="required|numeric"
                    name="Credit Limit"
                    v-slot="{ errors }"
                  >
                    <v-text-field
                      v-model="editedItem.CreditLimit"
                      :label="errors[0] ? errors[0] : 'Credit Limit'"
                      :error-messages="errors"
                      prefix="*"
                      clearable
                      dense
                      hide-details=""
                    >
                    </v-text-field>
                  </ValidationProvider>
                </v-col>

                <!-- BASIC SALARY -->
                <v-col cols="12" sm="6" md="3">
                  <ValidationProvider
                    rules="required|numeric"
                    name="Basic Salary"
                    v-slot="{ errors }"
                  >
                    <v-text-field
                      v-model="editedItem.basicSalary"
                      :label="errors[0] ? errors[0] : 'Basic Salary'"
                      :error-messages="errors"
                      prefix="*"
                      clearable
                      dense
                      hide-details=""
                    >
                    </v-text-field>
                  </ValidationProvider>
                </v-col>

                <!-- MONTHLY TARGET AMOUNT -->
                <v-col cols="12" sm="6" md="3">
                  <ValidationProvider
                    rules="required|numeric"
                    name="Monthly Target Amount"
                    v-slot="{ errors }"
                  >
                    <v-text-field
                      v-model="editedItem.mothlyTargetAmount"
                      :label="errors[0] ? errors[0] : 'Monthly Target Amount'"
                      :error-messages="errors"
                      prefix="*"
                      clearable
                      dense
                      hide-details=""
                    >
                    </v-text-field>
                  </ValidationProvider>
                </v-col>

                <!-- MONTHLY TARGET PERCENTAGE -->
                <v-col cols="12" sm="6" md="3">
                  <ValidationProvider
                    :rules="{
                      regex: /^(100(\.00?)?|[1-9]?\d(\.\d\d?)?)$/,
                      required: { allowFalse: false },
                    }"
                    name="Monthly Target Percentage"
                    v-slot="{ errors }"
                  >
                    <v-text-field
                      v-model="editedItem.mothlyTargetPercentage"
                      :label="
                        errors[0] ? errors[0] : 'Monthly Target Percentage'
                      "
                      :error-messages="errors"
                      prefix="*"
                      clearable
                      dense
                      hide-details=""
                    >
                    </v-text-field>
                  </ValidationProvider>
                </v-col>

                <!-- ADD PRIVILLAGE -->
                <v-col
                  cols="12"
                  sm="6"
                  md="3"
                  v-if="editedItem.id !== user.id && editedItem.role != 1"
                >
                  <v-btn block text outlined @click="onPrivillage">
                    ADD PRIVILLAGE
                  </v-btn>
                </v-col>

                <!-- USER ROLE -->
                <v-col cols="12" sm="6" md="3">
                  <ValidationProvider
                    rules="required"
                    name="User Role"
                    v-slot="{ errors }"
                  >
                    <v-select
                      :items="userRoleOptions"
                      v-model="editedItem.role"
                      :label="errors[0] ? errors[0] : 'User Role'"
                      :error-messages="errors"
                      @change="onUserRoleChange"
                      hide-details=""
                      prefix="*"
                      clearable
                      dense
                      item-text="option"
                      item-value="index"
                    ></v-select>
                  </ValidationProvider>
                </v-col>

                <!-- LANGUAGE-->
                <v-col cols="12" sm="6" md="3">
                  <ValidationProvider
                    rules="required"
                    name="Language"
                    v-slot="{ errors }"
                  >
                    <v-select
                      :items="languageOptions"
                      v-model="editedItem.language"
                      :label="errors[0] ? errors[0] : 'Language'"
                      :error-messages="errors"
                      hide-details=""
                      prefix="*"
                      clearable
                      dense
                      item-text="option"
                      item-value="index"
                    ></v-select>
                  </ValidationProvider>
                </v-col>

                <!-- USER STATUS -->
                <v-col cols="12" sm="6" md="3">
                  <ValidationProvider
                    rules="required"
                    name="User Status"
                    v-slot="{ errors }"
                  >
                    <v-select
                      :items="userStatusOptions"
                      v-model="editedItem.status"
                      :label="errors[0] ? errors[0] : 'User Status'"
                      :error-messages="errors"
                      hide-details=""
                      prefix="*"
                      @change="onUserStatus"
                      clearable
                      dense
                      item-text="option"
                      item-value="index"
                    ></v-select>
                  </ValidationProvider>
                </v-col>

                <!-- USER PROFILE -->
                <v-col
                  cols="12"
                  sm="6"
                  md="3"
                  v-if="editedItem.profileUploadShow"
                >
                  <ValidationProvider
                    rules=""
                    name="Profile Pic"
                    v-slot="{ errors }"
                  >
                    <v-file-input
                      :label="errors[0] ? errors[0] : 'Profile Pic'"
                      :error-messages="errors"
                      v-model="editedItem.profileImg"
                      hide-details=""
                      prepend-icon=""
                      truncate-length="10"
                      dense
                      show-size
                      @change="onProfileChange($event)"
                    ></v-file-input>
                  </ValidationProvider>
                </v-col>

                <!-- PROFILE IMAGE VIEW -->
                <v-col
                  cols="12"
                  sm="6"
                  md="3"
                  class="text-center pa-0"
                  v-if="editedItem.profileViewerShow"
                >
                  <v-menu open-on-hover top offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-avatar>
                        <v-img
                          :src="profileImg"
                          width="50"
                          v-bind="attrs"
                          v-on="on"
                        />
                      </v-avatar>
                    </template>

                    <v-card>
                      <v-img :src="profileImg" width="150" height="150" />
                    </v-card>
                  </v-menu>
                </v-col>

                <!-- PROFILE IMAGE FROM EDIT -->
                <v-col
                  cols="12"
                  sm="6"
                  md="3"
                  class="text-center pa-0"
                  v-if="editedItem.profileEditShow"
                >
                  <v-card>
                    <!-- IMG FROM SERVER -->
                    <v-img
                      :src="
                        'http://localhost:8000/storage/' + editedItem.profilePic
                      "
                      width="100%"
                      height="100"
                      v-if="editedItem.profilePic"
                    />
                    <!-- IMG FROM DEFAULT -->
                    <v-img
                      src="../../assets/default_logo.jpeg"
                      width="100%"
                      height="100"
                      v-else
                    ></v-img>
                    <div class="image_edit">
                      <v-icon
                        small
                        color="white"
                        class="blue-grey lighten-2 rounded rounded-circle pa-4"
                        @click="onEditProfilePic"
                      >
                        mdi-pencil
                      </v-icon>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </ValidationObserver>
          </v-container>
        </v-card-text>

        <v-card-actions class="fixed-bottom">
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeForm">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="save">
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
          <strong>{{ editedItem.name }}</strong> ?
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

    <!-- VIEW MODEL -->
    <v-dialog
      v-model="viewModel"
      max-width="700px"
      persistent
      content-class="user-privilage-dialog"
      scrollable
    >
      <v-card>
        <v-card-title :class="ModelHeaderColor">
          <strong class="  ">
            {{ editedItem.name }}
          </strong>
          <v-spacer></v-spacer>
          <v-icon @click="viewModel = false">mdi-close</v-icon>
        </v-card-title>

        <v-card-text style="height: 350px;">
          <v-row class="mt-2">
            <v-col
              md="4"
              sm="4"
              cols="4"
              class=" d-flex justify-center align-center"
            >
              <v-avatar size="175">
                <img
                  :src="
                    'http://localhost:8000/storage/' + editedItem.profilePic
                  "
                  v-if="editedItem.profilePic"
                />
                <v-img src="../../assets/default_logo.jpeg" v-else></v-img>
              </v-avatar>
            </v-col>

            <v-col md="8" sm="8" cols="8" class="">
              <p>{{ editedItem.name }}</p>
              <p>{{ editedItem.email }}</p>
              <p>{{ editedItem.phone }}</p>
              <p>{{ editedItem.email }}</p>
              <p>{{ editedItem.address }}</p>
              <p>{{ editedItem.nic }}</p>
              <p>{{ editedItem.gender }}</p>
              <p>{{ editedItem.company }}</p>
            </v-col>
          </v-row>
        </v-card-text>
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
import { ValidationObserver, ValidationProvider } from "vee-validate";
import moment from "moment";
import { json2excel, excel2json } from "js2excel";

export default {
  name: "User",
  data() {
    return {
      url: {
        register: "register",
        users: "users/",

        fetch: "users",
        show: "users/",
        delete: "users/",
      },
      dataTableLoading: true,
      dataTableFullscreen: false,
      formAddmModel: false,
      formDeleteModel: false,
      privillageModel: false,
      viewModel: false,
      dobDatePicker: false,
      superAdmin: false,

      DTbtnColor: "indigo lighten-1 ",
      ModelHeaderColor: "indigo lighten-4",

      appAccess: 0, //ACCESS PERMISSION FOR Users
      existData: -1,
      editedIndex: -1,
      accessClearIndex: 0,

      search: "",
      moment: moment,
      profileImg: "",

      defaultItem: {},
      user: {},

      headers: [],
      selectedHeaders: [],
      Users: [],
      selectedExcelTitle: [],
      excelTitles: [],

      snackbar: {
        show: false,
        time: 3000,
        message: "",
        color: "",
      },
      privillage: {
        // 0: 0,
        // 1: 0,
        // 2: 0,
        // 3: 0,
        // 4: 0,
      },
      editedItem: {
        id: "",
        name: "",
        email: "",
        phone: "",
        address: "",
        nic: "",
        gender: "",
        company: "",
        attempts: "5",
        access: "",
        accessUrl: "",
        role: "",
        status: "",
        profilePic: [],
        profileImg: [],
        dob: "",
        city: "",
        location: "",
        zipCode: "",
        accountNumber: "",
        userType: "",
        openingBalance: "",
        Balance: "",
        CreditLimit: "",
        basicSalary: "",
        language: "",
        mothlyTargetAmount: "",
        mothlyTargetPercentage: "",
        profileUploadShow: true,
        profileViewerShow: false,
        profileEditShow: false,
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
      pagination: {
        current: 1,
        localCurrentPage: parseInt(localStorage.getItem("user_pk")),
        total: 1,
      },
      languageOptions: [
        { option: "ENGLISH", index: 1 },
        { option: "SPANISH", index: 2 },
      ],
      userTypeOptions: [
        { option: "CUSTOMER", index: 1 },
        { option: "VENDOR", index: 2 },
        { option: "SUPPLIER", index: 3 },
      ],
      locationOptions: [
        { option: "AKURANA", index: 1 },
        { option: "ALAWATHUGODA", index: 2 },
        { option: "BULUGIHATENNA", index: 3 },
        { option: "MADAWALA", index: 4 },
      ],
      cityOptions: [
        { option: "COLOMBO", index: 1 },
        { option: "KANDY", index: 2 },
        { option: "JAFFNA", index: 3 },
        { option: "MATALE", index: 4 },
      ],
      userRoleOptions: [
        { option: "SUPER ADMIN", index: 1 },
        { option: "ADMIN", index: 2 },
        { option: "MANAGER", index: 3 },
        { option: "CASHIER", index: 4 },
        { option: "SALES REP", index: 5 },
        { option: "EMPLOYEE", index: 6 },
        { option: "MARKETING TEAM", index: 7 },
      ],

      userStatusOptions: [
        { option: "INACTIVE", index: 0 },
        { option: "ACTIVE", index: 1 },
      ],
      accessOptions: [
        { option: "NO ACCESS", val: 0 },
        { option: "READ ONLY ACCESS", val: 1 },
        { option: "ADD ONLY ACCESS", val: 2 },
        { option: "ADD & EDIT ONLY ACCESS", val: 3 },
        { option: "FULL ACCESS", val: 4 },
      ],
      genderOptions: ["MALE", "FEMALE", "OTHERS"],
      headersMap: [
        {
          text: "#",
          align: "center",
          sortable: true,
          value: "id",
          align: "start",
          width: "1%",
        },
        {
          text: "Name",
          align: "center",
          sortable: true,
          value: "name",
          align: "start",
        },
        {
          text: "Company",
          align: "center",
          sortable: true,
          value: "company",
          align: "start",
        },
        {
          text: "Phone",
          align: "center",
          sortable: true,
          value: "phone",
          align: "start",
        },
        {
          text: "Address",
          align: "center",
          sortable: true,
          value: "address",
          align: "start",
        },
        {
          text: "Gender",
          align: "center",
          sortable: true,
          value: "gender",
          align: "start",
        },
        {
          text: "Role",
          align: "center",
          sortable: true,
          value: "role",
          align: "start",
          //   width: "5%",
        },
        {
          text: "Actions",
          value: "actions",
          sortable: false,
          width: "10%",
          align: "end",
          class: "dark--text",
        },
      ],
    };
  },
  components: {
    DashboardLayout,
    ValidationObserver,
    ValidationProvider,
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New User" : "Edit ";
    },
    submitBtn() {
      return this.editedIndex === -1 ? "SAVE" : "UPDATE";
    },
    showHeaders() {
      return this.headers.filter((f) => this.selectedHeaders.includes(f.value));
    },
  },
  created() {
    localStorage.setItem("user_pk", 1);
    this.onInitialize();
    this.datatableColumnVisibility();
  },
  beforeMount() {
    this.onAccessPermission();
  },
  mounted() {
    this.dataTableLoadingIndicator();
  },

  methods: {
    datatableColumnVisibility() {
      this.headersMap.forEach((element) => {
        this.headers.push(element);
        this.selectedHeaders.push(element.value);
      });
    },
    exportToExcel() {
      let objects = [];
      this.Users.forEach((element) => {
        objects.push({
          id: element.id,
          name: element.name,
          email: element.email,
          company: element.company,
          phone: element.phone,
          address: element.address,
          gender: element.gender,
          role:
            element.role == 0
              ? "CLIENT"
              : element.role == 1
              ? "SUPER ADMIN"
              : element.role == 2
              ? "ADMIN"
              : element.role == 3
              ? "MANAGER"
              : element.role == 4
              ? "CASHIER"
              : element.role == 5
              ? "SALES REP"
              : element.role == 6
              ? "EMPLOYEE"
              : element.role == 7
              ? "MARKETING TEAM"
              : null,
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
      try {
        json2excel({
          data,
          name: this.moment().unix()+ '_file',
          formateDate: "yyyy/mm/dd",
        });
      } catch (e) {
        console.error("export error");
      }
    },
    dataTableLoadingIndicator() {
      console.log("USER COUNT - MOUNTED", this.Users.length);
      if (this.Users.length >= 0) {
        this.existData = 1;
      }
      setTimeout(() => {
        this.dataTableLoading = false;
      }, 1000);
    },
    onPrivillage() {
      this.privillageModel = true;
    },
    save() {
      this.$refs.form.validate().then((success) => {
        if (!success) {
          return;
        }
        let access = this.privillageSubmit();

        const obj = {
          id: this.editedItem.id,
          name: this.editedItem.name,
          email: this.editedItem.email,
          password: "password",
          address: this.editedItem.address,
          phone: this.editedItem.phone,
          company: this.editedItem.company,
          nic: this.editedItem.nic,
          gender: this.editedItem.gender,
          access: access,
          attempts: this.editedItem.attempts,
          role: this.editedItem.role,
          status: this.editedItem.status,
          profilePic: this.profileImg,
          access: this.privillageSubmit(),
          dob: moment(this.editedItem.dob).format("X"),
          city: this.editedItem.city,
          location: this.editedItem.location,
          zip: this.editedItem.zipCode,
          account_number: this.editedItem.accountNumber,
          user_type: this.editedItem.userType,
          opening_balance: this.editedItem.openingBalance,
          balance: this.editedItem.Balance,
          credit_limit: this.editedItem.CreditLimit,
          basic_salary: this.editedItem.basicSalary,
          monthly_target: this.editedItem.mothlyTargetAmount,
          target_percentage: this.editedItem.mothlyTargetPercentage,
          language: this.editedItem.language,
          payment_terms: 0,
          sales_rep_id: 0,
        };
        if (this.editedIndex > -1) {
          // UPDATE USER
          this.$http
            .put(this.url.users + obj.id, obj)
            .then((result) => {
              console.log("update console", result);
              this.onClear();
              this.snackbar = {
                show: true,
                message: "User has been updated successfully",
                color: "green",
              };
            })
            .catch((err) => {
              this.snackbar = {
                show: true,
                message: "Something went wrong on update... please try again",
                color: "red",
              };
              this.$gl.Unauthorized(err.response.status);
            });
        } else {
          // STORE USER
          this.$http
            .post(this.url.register, obj)
            .then((result) => {
              console.log(result);
              this.onInitialize();
              this.onClear();
              this.snackbar = {
                show: true,
                message: "User has been added successfully",
                color: "green",
              };
            })
            .catch((err) => {
              this.snackbar = {
                show: true,
                message: "Something went wrong on save... please try again",
                color: "red",
              };
            });
        }
      });
    },
    onInitializeExportColumns() {
      this.excelTitles = [
        "id",
        "name",
        "email",
        "company",
        "phone",
        "address",
        "gender",
        "role",
      ];
      this.selectedExcelTitle = this.excelTitles;
    },
    onInitialize() {
      this.Users.splice(0);
      this.$http
        .get("users?page=" + localStorage.getItem("user_pk"))
        .then((response) => {
          console.log(response.data.users);

          this.dtPagination = {
            first_page_url: response.data.users.first_page_url,
            from: response.data.users.from,
            last_page: response.data.users.last_page,
            last_page_url: response.data.users.last_page_url,
            next_page_url: response.data.users.next_page_url,
            path: response.data.users.path,
            per_page: response.data.users.per_page,
            prev_page_url: response.data.users.prev_page_url,
            to: response.data.users.to,
            total: response.data.users.total,
            links: response.data.users.links.forEach((element) => {
              element;
            }),
          };
          this.pagination.total = response.data.users.last_page;
          response.data.users.data.forEach((element) => {
            this.Users.push(element);
          });
          this.onInitializeExportColumns();
        })
        .catch((err) => {
          if (err.response) {
            this.$gl.Unauthorized(err.response.status);
          }
        });
    },
    onPaginateChange(e) {
      this.Users.splice(0);
      this.$http
        .get("users/paginate/" + e)
        .then((response) => {
          console.log(response.data);
          this.dtPagination = {
            first_page_url: response.data.users.first_page_url,
            from: response.data.users.from,
            last_page: response.data.users.last_page,
            last_page_url: response.data.users.last_page_url,
            next_page_url: response.data.users.next_page_url,
            path: response.data.users.path,
            per_page: response.data.users.per_page,
            prev_page_url: response.data.users.prev_page_url,
            to: response.data.users.to,
            total: response.data.users.total,
            links: response.data.users.links.forEach((element) => {
              element;
            }),
          };
          this.pagination.total = response.data.users.last_page;

          response.data.users.data.forEach((element) => {
            this.Users.push(element);
          });
        })
        .catch((err) => {
          if (err.response) {
            this.$gl.Unauthorized(err.response.status);
          }
        });
    },
    privillageCancel() {
      this.privillageModel = false;

      console.log(this.accessClearIndex);

      if (this.accessClearIndex == 1) {
        this.privillage = {
          dashboard: 0,
          project: 0,
          system: 0,
          task: 0,
          user: 0,
        };
      }
      if (this.accessClearIndex == 0) {
        this.privillage = {
          0: 0,
          1: 0,
          2: 0,
          3: 0,
          4: 0,
        };
      }
    },
    privillageSubmit() {
      // modules               ||  access  are indexed
      // 0 - dashboard         ||  0 - No access
      // 1 - project           ||  1 - read only
      // 2 - system            ||  2 - add only
      // 3 - task              ||  3 - add & edit
      // 4 - user              ||  4 - full access
      this.privillageModel = false;
      const AccessStore = {
        0: this.privillage.dashboard ? this.privillage.dashboard : 0,
        1: this.privillage.project ? this.privillage.project : 0,
        2: this.privillage.system ? this.privillage.system : 0,
        3: this.privillage.task ? this.privillage.task : 0,
        4: this.privillage.user ? this.privillage.user : 0,
      };
      console.log("access submit", AccessStore);
      return AccessStore;
    },
    onProfileChange(e) {
      console.log(e);
      let reader = new FileReader();
      reader.onload = (fileArray) => {
        console.log(reader.result);
        this.profileImg = reader.result;
      };
      reader.readAsDataURL(e);
      this.editedItem.profileViewerShow = true;
    },
    onAccessModuleChange(i) {
      console.log("onAccessModuleChange", i);
    },
    onUserRoleChange(i) {
      console.log("onUserRoleChange", i);
    },
    onUserStatus(i) {
      console.log(i);
    },
    onEditProfilePic() {
      console.log("asdasd");
      this.editedItem.profilePic = "";
      this.editedItem.profileEditShow = false;
      this.editedItem.profileViewerShow = true;
      this.editedItem.profileUploadShow = true;
    },
    onDeleteItem(e) {
      this.formDeleteModel = true;
      this.editedItem = Object.assign(e); 
    },
    onDeleteConfirm() {
      console.log("delete", this.editedIndex);
      this.$http
        .delete(this.url.delete + this.editedItem.id)
        .then((response) => {
          console.log(response.data);
          this.onInitialize();
          this.formDeleteModel = false;
        })
        .catch((response) => {
          console.log("Error Fround. User Not Deleted");
        });
    },
    onView(e) {
      console.log(e);
      this.viewModel = true;
      this.editedItem = Object.assign(e);
    },
    onEditItem(e) {
      console.log("edited item ->", e);

      this.$http.get(this.url.show + e.id).then((response) => {
        console.log(response.data.selected_user);

        let i = response.data.selected_user;
        let access = JSON.parse(i.access);
        console.log(i.access);

        this.accessClearIndex = 1;
        this.privillage.dashboard = access[0];
        this.privillage.project = access[1];
        this.privillage.system = access[2];
        this.privillage.task = access[3];
        this.privillage.user = access[4];

        this.editedIndex = this.Users.indexOf(e);
        this.editedItem = Object.assign({
          id: i.id,
          name: i.name,
          email: i.email,
          phone: i.phone,
          address: i.address,
          nic: i.nic,
          gender: i.gender,
          company: i.company,
          attempts: i.attempts,
          access: i.access,
          role: i.role,
          status: i.status,
          profilePic: i.profilePic,
          profileImg: [],

          dob: moment(i.dob * 1000)
            .add(1, "d")
            .toISOString()
            .substr(0, 10),

          city: i.city,
          location: i.location,
          zipCode: i.zip,
          accountNumber: i.account_number,
          userType: i.user_type,
          openingBalance: i.opening_balance,
          Balance: i.balance,
          CreditLimit: i.credit_limit,
          basicSalary: i.basic_salary,
          language: i.language,
          mothlyTargetAmount: i.monthly_target,
          mothlyTargetPercentage: i.target_percentage,
        });
        this.formAddmModel = true;
        this.editedItem.profileEditShow = true;
        this.editedItem.profileViewerShow = false;
        this.editedItem.profileUploadShow = false;
      });
    },
    closeForm() {
      this.formAddmModel = false;
    },
    onClear() {
      this.$nextTick(() => {
        this.formAddmModel = false;
        this.$refs.form.reset();
        this.editedItem = Object.assign({
          id: "",
          name: "",
          email: "",
          phone: "",
          address: "",
          nic: "",
          gender: "",
          company: "",
          attempts: "5",
          access: "",
          accessUrl: "",
          role: "",
          status: "",
          profilePic: [],
          profileImg: [],
          dob: "",
          city: "",
          location: "",
          zipCode: "",
          accountNumber: "",
          userType: "",
          openingBalance: "",
          Balance: "",
          CreditLimit: "",
          basicSalary: "",
          language: "",
          mothlyTargetAmount: "",
          mothlyTargetPercentage: "",
          profileUploadShow: true,
          profileViewerShow: false,
          profileEditShow: false,
        });
        this.editedIndex = -1;
      });
    },
    onNewDialog() {
      this.formAddmModel = true;
      this.accessClearIndex = 0;

      this.editedItem.profileUploadShow = true;
      this.editedItem.profileViewerShow = false;
      this.editedItem.profileEditShow = false;
    },
    onRefresh() {
      console.log("onRefresh Triggred");
      this.onInitialize();
    },
    onSearch(e) {
      console.log("onSearch function", e);
      this.dataTableLoading = true;
      if (this.search.length > 0) {
        this.$http.get(this.url.users + "search/" + e).then((response) => {
          console.log(response.data);
          this.Users.splice(0);
          response.data.users.forEach((element) => {
            this.Users.push(element);
          }, 4000);
          this.dataTableLoading = false;
        });
      } else {
        this.Users.splice(0);
        this.onInitialize();
        this.dataTableLoading = false;
        this.existData = 1;
      }
    },
    onPageChange(e) {
      localStorage.setItem("user_pk", e);
      this.onInitialize();
    },
    focusSearchKey() {
      console.log("a");
      this.$refs.searchbar_ref.$refs.input.focus();
      console.log("b");
    },
    onExpandTable() {
      var elem = document.getElementById("dt_table_users");
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
        this.dataTableFullscreen = true;
      } else if (elem.webkitRequestFullscreen) {
        /* Safari */
        elem.webkitRequestFullscreen();
        this.dataTableFullscreen = true;
      } else if (elem.msRequestFullscreen) {
        /* IE11 */
        elem.msRequestFullscreen();
        this.dataTableFullscreen = true;
      }
    },
    onExitFullScreenDataTable() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        this.dataTableFullscreen = false;
      } else if (document.webkitExitFullscreen) {
        /* Safari */
        document.webkitExitFullscreen();
        this.dataTableFullscreen = false;
      } else if (document.msExitFullscreen) {
        /* IE11 */
        document.msExitFullscreen();
        this.dataTableFullscreen = false;
      }
    },
    onAccessPermission() {
      let access = JSON.parse(localStorage.getItem("token_access"));
      let user = JSON.parse(localStorage.getItem("user"));
      this.appAccess = access[4];

      this.user = Object.assign(user);
    },
  },
};
</script>

<style>
.image_edit {
  position: absolute;
  margin-top: -75px;
  padding: 0px 120px;
  display: block;
  cursor: pointer;
}
</style>
