<template>
  <div id="User">
    <!-- DASHBOARD LAYOYT -->
    <DashboardLayout />
    <!-- DB TABLE -->
    <v-card color="pa-0" tile flat>
      <v-data-table
        :headers="headersMap"
        :items="Users"
        :fixed-header="true"
        :loading="dataTableLoading"
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
              color="indigo lighten-1"
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

            <!-- ADD BUTTONS -->
            <v-btn
              color="indigo lighten-1"
              class=" ma-1"
              outlined
              small
              v-shortkey="['alt', 'n']"
              @shortkey="onNewDialog()"
              @click="onNewDialog"
              v-show="ap_add"
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
          >
            mdi-eye
          </v-icon>
          <v-icon
            id="dt-edit-action-button"
            x-small
            title="Edit Projects"
            class="mr-2 orange darken-1 pa-1 white--text rounded"
            v-show="ap_edit"
            @click="onEditItem(item)"
          >
            mdi-pencil
          </v-icon>

          <v-icon
            id="dt-trash-action-button"
            x-small
            title="Delete Projects"
            class="red darken-1 pa-1 white--text rounded"
            v-show="ap_delete"
          >
            mdi-delete
          </v-icon>
        </template>

        <!-- FOOTER PAGE TEXT -->
        <template v-slot:[`footer.page-text`]>
          <div class="d-flex align-center dt_footer  ">
            <p class="pt-5">Projects Per Page: {{ dtPagination.per_page }}</p>

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

    <!-- ADD FORM -->
    <v-dialog
      v-model="privillageModel"
      max-width="700px"
      persistent
      content-class="user-privilage-dialog"
      scrollable
    >
      <v-card>
        <v-card-title class="indigo lighten-4">
          <span class="headline ">
            PRIVILAGES
          </span>
          <v-spacer></v-spacer>
          <v-icon @click="privillageModel = false">mdi-close</v-icon>
        </v-card-title>

        <v-card-text style="height: 300px;">
          <v-row class=" mt-3">
            <!-- DASHBOARD -->
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
                  v-model="editedItem.access"
                  :label="errors[0] ? errors[0] : 'Access'"
                  :error-messages="errors"
                  hide-details=""
                  @change="onAccessOptionChange"
                  prefix="*"
                  clearable
                  dense
                  item-text="option"
                  item-value="index"
                ></v-select>
              </ValidationProvider>
            </v-col>

            <!-- PROJECTS -->
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
                  @change="onAccessOptionChange"
                  prefix="*"
                  clearable
                  dense
                  item-text="option"
                  item-value="index"
                ></v-select>
              </ValidationProvider>
            </v-col>

            <!-- SYSTEM -->
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
                  @change="onAccessOptionChange"
                  prefix="*"
                  clearable
                  dense
                  item-text="option"
                  item-value="index"
                ></v-select>
              </ValidationProvider>
            </v-col>

            <!-- TASK -->
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
                  v-model="privillage.task"
                  :label="errors[0] ? errors[0] : 'Access'"
                  :error-messages="errors"
                  hide-details=""
                  @change="onAccessOptionChange"
                  prefix="*"
                  clearable
                  dense
                  item-text="option"
                  item-value="index"
                ></v-select>
              </ValidationProvider>
            </v-col>

            <!-- USER -->
            <v-col cols="12" sm="6" md="6" class="  d-flex align-center">
              <span>USER</span>
            </v-col>
            <v-col cols="12" sm="6" md="6" class="  d-flex align-center">
              <ValidationProvider
                rules="required"
                name="Accessible Operation"
                v-slot="{ errors }"
              >
                {{ privillage.user }}
                <v-select
                  :items="accessOptions"
                  v-model="privillage.user"
                  :label="errors[0] ? errors[0] : 'Access'"
                  :error-messages="errors"
                  hide-details=""
                  @change="onAccessOptionChange('users', accessOptions)"
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
          <v-btn color="blue darken-1" text @click="privillageModel = false">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="onPrivillageSubnit">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ADD FORM -->
    <v-dialog
      v-model="formAdd"
      max-width="1200px"
      persistent
      content-class="user-form-dialog"
      scrollable
    >
      <v-card>
        <v-card-title class="indigo lighten-4">
          <span class="headline ">
            {{ formTitle }}
            <span v-if="editedIndex != -1">
              {{ editedItem.name }}
            </span>
          </span>
          <v-spacer></v-spacer>
          <v-icon @click="closeForm">mdi-close</v-icon>
        </v-card-title>

        <v-card-text style="height: 300px;">
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

                <!-- ACCESS OPERATIONS -->
                <!-- <v-col cols="12" sm="6" md="3">
                  <ValidationProvider
                    rules="required"
                    name="Accessible Operation"
                    v-slot="{ errors }"
                  >
                    <v-select
                      :items="accessOptions"
                      v-model="editedItem.access"
                      :label="errors[0] ? errors[0] : 'Access'"
                      :error-messages="errors"
                      hide-details=""
                      @change="onAccessOptionChange"
                      prefix="*"
                      clearable
                      dense
                      item-text="option"
                      item-value="index"
                    ></v-select>
                  </ValidationProvider>
                </v-col> -->

                <!-- ACCESS URLS -->
                <!-- <v-col cols="12" sm="6" md="3">
                  <ValidationProvider
                    rules="required"
                    name="Accessible Modules"
                    v-slot="{ errors }"
                  >
                    <v-select
                      :items="accessUrlOptions"
                      multiple
                      prefix="*"
                      clearable
                      dense
                      v-model="test"
                      :label="
                        errors[0] ? errors[0] : 'Accessible Modules v-select'
                      "
                      :error-messages="errors"
                      allow-overflow
                      hide-details=""
                      @change="onAccessModuleChange"
                      item-text="option"
                      item-value="index"
                    ></v-select>
                  </ValidationProvider>
                </v-col> -->

                <!-- ADD PRIVILLAGE -->
                <v-col cols="12" sm="6" md="3">
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
                      :label="errors[0] ? errors[0] : 'User Role v-select'"
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
                <v-col cols="12" sm="6" md="3" v-if="!editedItem.profilePic">
                  {{ editedItem.profilePic }}
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
                  v-if="!editedItem.profilePic"
                  class="text-center pa-0"
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

                <v-col
                  cols="12"
                  sm="6"
                  md="3"
                  class="text-center pa-0"
                  v-if="editedItem.profilePic"
                >
                  <v-card>
                    <v-img
                      :src="
                        'http://localhost:8000/storage/' + editedItem.profilePic
                      "
                      width="100%"
                      height="100"
                    />
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
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import DashboardLayout from "../../components/DashboardLayout";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import moment from "moment";

export default {
  name: "User",
  data() {
    return {
      url: {
        store: "register",
        fetch: "users",
        show: "users",
      },
      dataTableLoading: true,
      dataTableFullscreen: false,
      formAdd: false,
      privillageModel: true,
      ap_add: false, //ACCESS PERMISSION FOR ADD
      ap_edit: false, //ACCESS PERMISSION FOR EDIT
      ap_delete: false, //ACCESS PERMISSION FOR DELETE

      existData: -1,
      editedIndex: -1,
      search: "",
      moment: moment,
      profileImg: "",

      privillage: {},
      editedItem: {
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
      },
      defaultItem: {},

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
        localCurrentPage: parseInt(localStorage.getItem("paginateKey")),
        total: 1,
      },
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
      accessUrlOptions: [
        { option: "Dashboard", index: 0 },
        { option: "PROJECTS", index: 1 },
      ],

      // ---------------------------
      userAccessOption: {},
      // ---------------------------

      accessOptions: [
        { option: "NO ACCESS", val: 0 },
        { option: "READ ONLY ACCESS", val: 1 },
        { option: "ADD ONLY ACCESS", val: 2 },
        { option: "ADD & EDIT ONLY ACCESS", val: 3 },
        { option: "FULL ACCESS", val: 4 },
      ],
      genderOptions: ["MALE", "FEMALE", "OTHERS"],
      Users: [],
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
  },
  beforeMount() {
    this.onAccessPermission();
    this.onInitialize();
    // this.ddTest();
  },
  mounted() {
    console.log("USER COUNT - MOUNTED", this.Users.length);
    if (this.Users.length >= 0) {
      this.existData = 1;
    }
    setTimeout(() => {
      this.dataTableLoading = false;
    }, 1000);
  },

  methods: {
    ddTest(e) {
      console.log("%cDD LOG", "color:red", this.Users[0]);
      this.formAdd = true;
      console.log("selected Role", e);
    },
    onPrivillage() {
      this.privillageModel = true;
    },
    save() {
      if (this.editedIndex > -1) {
        console.log("triggered update function");
      } else {
        // this.$refs.form.validate().then((success) => {
        //   if (!success) {
        //     return;
        //   }
        console.log("triggered store function");
        // const store = {
        //   name: this.editedItem.name,
        //   email: this.editedItem.email,
        //   password: "password",
        //   address: this.editedItem.address,
        //   phone: this.editedItem.phone,
        //   company: this.editedItem.company,
        //   nic: this.editedItem.nic,
        //   gender: this.editedItem.gender,
        //   access: this.editedItem.access,
        //   attempts: this.editedItem.attempts,
        //   access_url: this.editedItem.accessUrl,
        //   role: this.editedItem.role,
        //   status: this.editedItem.status,
        //   profilePic: this.editedItem.profileImg,
        // };

        const store = {
          name: "Ikram",
          email: "ikram@gmail.com",
          password: "password",
          address: "12, Norhtshore Street, Francisco",
          phone: "10236547778",
          company: "Vistag",
          nic: "15416886V",
          gender: "MALE",
          access: 3,
          attempts: 7,
          access_url: [0, 1, 2],
          role: 6,
          status: 1,
          profilePic: this.profileImg,
        };

        console.log("STORING DATA >>", store);

        this.$http
          .post(this.url.store, store)
          .then((result) => {
            console.log(result);
          })
          .catch((err) => {});
        // });
      }
    },
    onInitialize() {
      this.Users.splice(0);

      this.$http
        .get(this.url.fetch)
        .then((response) => {
          response.data.users.forEach((element) => {
            // console.log(element);
            this.Users.push(element);
          });
        })
        .catch((err) => {});
    },
    onAccessOptionChange(i) {
      console.log("onAccessOptionChange", i);
    },
    onProfileChange(e) {
      console.log(e);
      let reader = new FileReader();
      reader.onload = (fileArray) => {
        console.log(reader.result);
        this.profileImg = reader.result;
      };
      reader.readAsDataURL(e);
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
    },
    onEditItem(i) {
      console.log("edited item ->", i);
      this.editedIndex = this.Users.indexOf(i);
      // this.editedItem = Object.assign({}, i);
      this.editedItem = Object.assign({
        name: i.name,
        email: i.email,
        phone: i.phone,
        address: i.address,
        nic: i.nic,
        gender: i.gender,
        company: i.company,
        attempts: i.attempts,
        access: i.access,
        accessUrl: JSON.parse(i.access_url),
        role: i.role,
        status: i.status,
        profilePic: i.profilePic,
        profileImg: [],
      });
      this.formAdd = true;
    },
    closeForm() {
      this.formAdd = false;

      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    },
    onNewDialog() {
      console.log("Add New Form");
      this.formAdd = true;
    },
    onRefresh() {
      console.log("onRefresh Triggred");
      this.onInitialize();
    },
    onSearch(e) {
      console.log("onSearch function", e);
    },
    onPageChange(e) {
      // console.log(e)
      localStorage.setItem("paginateKey", e);
      this.paginateData();
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
      console.log(
        "access role from user page >>",
        localStorage.getItem("token_access")
      );
      let access = localStorage.getItem("token_access");
      if (access == 2) {
        this.ap_add = true;
      }
      if (access == 3) {
        this.ap_add = true;
        this.ap_edit = true;
      }
      if (access == 4) {
        this.ap_add = true;
        this.ap_edit = true;
        this.ap_delete = true;
      }
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
