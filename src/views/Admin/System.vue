<template>
  <div id="Systems">
    <DashboardLayout />

    <v-data-table
      :items="data_arr"
      :headers="headers"
      :fixed-header="true"
      :loading="dataTableLoading"
      show-expand
      single-expand
      expanded.sync="expanded"
      item-key="id"
      id="systems_table"
      dense
    >
      <template v-slot:top>
        <v-toolbar flat id="toolbar">
          <v-toolbar-title class="h6" id="v_table_title">
            <v-icon
              small
              left
              @click="expandTable"
              v-if="!dataTableFullscreen"
              title="Expand Data Table"
            >
              mdi-image-filter-center-focus-strong
            </v-icon>
            <v-icon
              v-else
              @click="exitFullScreenDataTable"
              title="Minimize Data Table"
            >
              mdi-arrow-expand
            </v-icon>
            <span v-animate-css="'fadeIn'">
              <!-- PROJECTS  -->
              {{ $t("systems.title") }}
            </span>
          </v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <!-- status chip -->
          <v-chip
            dark
            small
            class="ma-1 d-none d-sm-none d-md-flex"
            color="orange"
          >
            <!-- on progress -->
            {{ $t("status.onProgress") }}
          </v-chip>
          <v-chip
            dark
            small
            class="ma-1  d-none  d-sm-none d-md-flex"
            color="#039be5"
          >
            <!-- on testing -->
            {{ $t("status.onTesting") }}
          </v-chip>
          <v-chip
            dark
            small
            class="ma-1  d-none  d-sm-none d-md-flex"
            color="green"
          >
            <!-- on complete -->
            {{ $t("status.onComplete") }}
          </v-chip>

          <v-spacer></v-spacer>
          <!-- REFRESH BUTTONS -->
          <v-btn
            color="indigo lighten-1"
            class=" ma-1 text-center"
            id="v_toolbar_refresh_btn"
            outlined
            v-shortkey="['alt', 'r']"
            @shortkey="refresh()"
            small
            @click="refresh"
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
            @shortkey="system_modal()"
            @click="system_modal"
          >
            <!-- v-if="access_role != 1 && access_role != 0" -->
            <v-icon left dark class=""> mdi-plus </v-icon>

            <span class="v_toolbar_add_button_text">
              <!-- ADD PROJECTS -->
              {{ $t("button.addSystems") }}
            </span>
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:[`item.id`]="{ index }">{{ index + 1 }}.</template>
      <!-- Table Action -->
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon
          id="dt-view-action-button"
          small
          class="mr-2 blue darken-1  pa-1 shrink   white--text rounded"
          title="View Projects"
          @click="viewSystem(item)"
        >
          mdi-eye
        </v-icon>

        <v-icon
          id="dt-edit-action-button"
          small
          title="Edit Projects"
          class="mr-2 orange darken-1 pa-1 white--text rounded"
          @click="editSystem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          id="dt-trash-action-button"
          small
          title="Delete Projects"
          class="red darken-1 pa-1 white--text rounded"
          @click="deleteSystem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:expanded-item="{ item }" class="w-50">
        <td colspan="6">{{ item }}</td>
      </template>
    </v-data-table>

    <!-- view data -->
    <v-dialog
      v-model="system_modal_show"
      max-width="1200px"
      persistent
      content-class="form-dialog"
      scrollable
    >
      <v-card>
        <v-card-title class="indigo lighten-4">
          <span class="headline ">{{ systemTitle }}</span>
          <v-spacer></v-spacer>
          <v-icon @click="system_modal_close">mdi-close</v-icon>
        </v-card-title>
        <ValidationObserver ref="system_form">
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="3">
                  <ValidationProvider
                    rules="required"
                    name="User"
                    v-slot="{ errors }"
                  >
                    <!-- USER AUTOCOMPLETE-->
                    <v-autocomplete
                      v-model="system_field_arr.userSelectedList"
                      :items="userList"
                      :search-input.sync="fetchUserList"
                      :label="errors[0] ? errors[0] : 'User'"
                      :error-messages="errors"
                      item-text="userName"
                      item-value="userId"
                      prefix="*"
                      clearable
                      return-object
                      dense
                      hide-no-data
                      hide-details=""
                      hide-selected
                      single-line
                    >
                      <template v-slot:selection="data">
                        {{ data.item.userName }}
                      </template>
                      <template v-slot:item="{ item }">
                        {{ item.userName }}
                      </template>
                    </v-autocomplete>
                  </ValidationProvider>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <v-menu
                    v-model="picker_dep"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <ValidationProvider
                        rules="required"
                        name="Deployed date"
                        v-slot="{ errors }"
                      >
                        <v-text-field
                          v-model="system_field_arr.deployedDate"
                          :label="errors[0] ? errors[0] : 'Deployed date'"
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
                      v-model="system_field_arr.deployedDate"
                      dateFormat="mm-YYYY"
                      @input="picker_dep = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <ValidationProvider
                    rules="required|min:3"
                    name="Domain"
                    v-slot="{ errors }"
                  >
                    <v-text-field
                      v-model="system_field_arr.domain"
                      :label="errors[0] ? errors[0] : 'Domain'"
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
                <v-col cols="12" sm="6" md="3">
                  <v-menu
                    v-model="picker"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <ValidationProvider
                        rules="required"
                        name="Expiry date"
                        v-slot="{ errors }"
                      >
                        <v-text-field
                          v-model="system_field_arr.domainExpiryDate"
                          :label="errors[0] ? errors[0] : 'Expiry date'"
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
                      v-model="system_field_arr.domainExpiryDate"
                      dateFormat="mm-YYYY"
                      @input="picker = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>

                <!-- INCHARGE AUTOCOMPLETE-->
                <v-col cols="12" sm="6" md="3">
                  <ValidationProvider
                    rules="required"
                    name="Inchare"
                    v-slot="{ errors }"
                  >
                    <v-autocomplete
                      v-model="system_field_arr.inchareSelectedList"
                      :items="inchareList"
                      :search-input.sync="fetchInchareList"
                      :label="errors[0] ? errors[0] : 'Inchare'"
                      :error-messages="errors"
                      item-text="userName"
                      item-value="userId"
                      prefix="*"
                      clearable
                      dense
                      hide-no-data
                      hide-selected
                      return-object
                      hide-details=""
                      single-line
                    >
                    </v-autocomplete>
                  </ValidationProvider>
                </v-col>

                <!-- PROJECT AUTOCOMPLETE-->
                <v-col cols="12" sm="6" md="3">
                  <ValidationProvider
                    rules="required|min:3"
                    name="Project"
                    v-slot="{ errors }"
                  >
                    <v-autocomplete
                      v-model="system_field_arr.projectSelectedList"
                      :search-input.sync="fetchProjectList"
                      :items="projectList"
                      :label="errors[0] ? errors[0] : 'Project'"
                      :error-messages="errors"
                      item-text="projectTitle"
                      item-value="projectId"
                      prefix="*"
                      clearable
                      dense
                      hide-no-data
                      hide-selected
                      return-object
                      hide-details=""
                    >
                      <template v-slot:selection="data">
                        {{ data.item.projectTitle.substring(0, 17) + "..." }}
                      </template>
                      <template v-slot:item="{ item }">
                        {{ item.projectTitle }}
                      </template>
                    </v-autocomplete>
                  </ValidationProvider>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <ValidationProvider
                    rules="required|min:3"
                    name="DB Username"
                    v-slot="{ errors }"
                  >
                    <v-text-field
                      v-model="system_field_arr.dbUsername"
                      :label="errors[0] ? errors[0] : 'DB Username'"
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
                <v-col cols="12" sm="6" md="3">
                  <ValidationProvider
                    rules="required|min:3"
                    name="DB Password"
                    v-slot="{ errors }"
                  >
                    <v-text-field
                      v-model="system_field_arr.dbPassword"
                      :label="errors[0] ? errors[0] : 'DB Password'"
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

                <v-col cols="12" sm="6" md="6">
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <div v-bind="attrs" v-on="on">
                        <ValidationProvider
                          rules="required"
                          name="Domain note"
                          v-slot="{ errors }"
                        >
                          <p class="errorDes" v-if="errors[0]">
                            {{ errors[0] }}
                          </p>
                          <p
                            class="mendatory"
                            v-show="!system_field_arr.domainNote"
                          >
                            *
                          </p>
                          <vue-editor
                            v-model="system_field_arr.domainNote"
                            :editorToolbar="editorToolBar"
                          ></vue-editor>
                        </ValidationProvider>
                      </div>
                    </template>
                    <span>Domain note</span>
                  </v-tooltip>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <div v-bind="attrs" v-on="on">
                        <ValidationProvider
                          rules="required"
                          name="System note"
                          v-slot="{ errors }"
                        >
                          <p class="errorDes" v-if="errors[0]">
                            {{ errors[0] }}
                          </p>
                          <p
                            class="mendatory"
                            v-show="!system_field_arr.systemNote"
                          >
                            *
                          </p>
                          <vue-editor
                            v-model="system_field_arr.systemNote"
                            :editorToolbar="editorToolBar"
                          ></vue-editor>
                        </ValidationProvider>
                      </div>
                    </template>
                    <span>System note</span>
                  </v-tooltip>
                </v-col>
                <v-col cols="12" sm="6" md="3"> </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions class="blue-grey lighten-4">
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="system_modal_close">
              Cancel
            </v-btn>
            <v-btn color="blue darken-1" text @click="system_data_save">
              Save
            </v-btn>
          </v-card-actions>
        </ValidationObserver>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import DashboardLayout from "../../components/DashboardLayout";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { VueEditor } from "vue2-editor";
import moment from "moment";
export default {
  name: "Systems",
  components: {
    DashboardLayout,
    ValidationObserver,
    ValidationProvider,
    VueEditor,
  },
  data: () => ({
    moment: moment,
    controller: "systems",
    data_arr: [],
    system_data: {},
    system_modal_show: false,
    dataTableFullscreen: false,
    dataTableLoading: true,
    picker: false,
    picker_dep: false,
    expanded: [],
    fetchProjectList: "",
    projectList: [],
    fetchUserList: "",
    userList: [],
    fetchInchareList: "",
    inchareList: [],
    blank_field_arr: {},
    system_field_arr: {
      systemId: 0,
      userSelectedList: "",
      deployedDate: "",
      domain: "",
      domainExpiryDate: "",
      domainNote: "",
      systemNote: "",
      inchareSelectedList: "",
      dbUsername: "",
      dbPassword: "",
      projectSelectedList: "",
      status: "",
    },
    editorToolBar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      [
        { align: "" },
        { align: "center" },
        { align: "right" },
        { align: "justify" },
      ],
      [{ color: [] }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ header: [false, 1, 2, 3, 4, 5, 6] }],
    ],
  }),
  computed: {
    systemTitle() {
      return this.system_field_arr.systemId === 0 ? "New System" : "Edit ";
    },
    // showHeaders() {
    //   return this.headers.filter((s) => this.selectedHeaders.includes(s));
    // },
    // isMobile() {
    //   return this.$vuetify.breakpoint.name === "xs";
    // },
    headers() {
      return [
        {
          text: "#",
          value: "id",
          align: "start",
          sortable: false,
          width: "30px",
        },
        {
          text: "System id",
          value: "systemCode",
          width: "100px",
          sortable: false,
        },
        {
          text: "Domain",
          value: "domain",
          width: "200px",
          sortable: false,
        },
        {
          text: "Start date",
          value: "deployedDate",
          width: "100px",
          sortable: false,
        },
        {
          text: "Expiry day",
          value: "domainExpiryDate",
          width: "100px",
          sortable: false,
        },
        { text: "Project name", value: "title" },
        { text: "Client name", value: "userName" },
        { text: "Client email", value: "userEmail" },
        { text: "Client mobile", value: "userMobile" },
        {
          text: "Status",
          value: "actions",
          align: "center",
          sortable: false,
          width: "120px",
        },
      ];
    },
  },
  beforeCreate() {
    //console.log("beforeCreate");
  },
  created() {
    //console.log("created");
    this.fetch_data_table();
  },
  beforeMount() {
    //console.log("beforeMount");
  },
  mounted() {
    //console.log("mount");
  },
  watch: {
    fetchProjectList(e) {
      this.$http
        .get(this.controller + "/fetchProjectList/" + e)
        .then((res) => {
          console.log(res.data.data);
          res.data.data.forEach((element) => {
            this.projectList.push(element);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fetchUserList(e) {
      this.$http
        .get(this.controller + "/fetchUserList/" + e)
        .then((res) => {
          console.log(res.data.data);
          res.data.data.forEach((element) => {
            this.userList.push(element);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fetchInchareList(e) {
      this.$http
        .get(this.controller + "/fetchUserList/" + e)
        .then((res) => {
          console.log(res.data.data);
          res.data.data.forEach((element) => {
            this.inchareList.push(element);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  methods: {
    expandTable() {
      var elem = document.getElementById("systems_table");
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
        this.dataTableFullscreen = true;
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen(); /* Safari */
        this.dataTableFullscreen = true;
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen(); /* IE11 */
        this.dataTableFullscreen = true;
      }
    },
    exitFullScreenDataTable() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        this.dataTableFullscreen = false;
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen(); /* Safari */
        this.dataTableFullscreen = false;
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen(); /* IE11 */
        this.dataTableFullscreen = false;
      }
    },
    fetch_data_table() {
      let count = 5;
      //console.log(count);
      this.$http
        .get(this.controller + "?p=" + count)
        .then((response) => {
          this.data_arr = response.data.systems.data;
          this.dataTableLoading = false;
        })
        .catch((response) => {
          // console.log(response);
        });
    },
    refresh() {
      this.fetch_data_table();
    },
    system_modal() {
      this.reset_system_form();
      this.system_modal_show = true;
      this.$nextTick(() => {
        this.$refs.system_form.reset();
      });
    },
    reset_system_form() {
      this.system_field_arr.systemId = 0;
      this.system_field_arr.userSelectedList = "";
      this.system_field_arr.deployedDate = "";
      this.system_field_arr.domain = "";
      this.system_field_arr.domainExpiryDate = "";
      this.system_field_arr.domainNote = "";
      this.system_field_arr.systemNote = "";
      this.system_field_arr.inchareSelectedList = "";
      this.system_field_arr.dbUsername = "";
      this.system_field_arr.dbPassword = "";
      this.system_field_arr.projectSelectedList = "";
      this.system_field_arr.status = "";
    },
    system_data_save() {
      console.log("Save");
      this.$refs.system_form.validate().then((success) => {
        if (!success) {
          return;
        }
        const system_data_arr = {
          userId: this.system_field_arr.userSelectedList.id,
          userName: this.system_field_arr.userSelectedList.name,
          deployedDate: moment(this.system_field_arr.deployedDate).format("X"),
          domain: this.system_field_arr.domain,
          domainExpiryDate: moment(
            this.system_field_arr.domainExpiryDate
          ).format("X"),
          domainNote: this.system_field_arr.domainNote,
          systemNote: this.system_field_arr.systemNote,
          incharedId: this.system_field_arr.inchareSelectedList.id,
          incharedName: this.system_field_arr.inchareSelectedList.name,
          dbUsername: this.system_field_arr.dbUsername,
          dbPassword: this.system_field_arr.dbPassword,
          projectId: this.system_field_arr.projectSelectedList.id,
          projectTitle: this.system_field_arr.projectSelectedList.title,
          status: 1,
        };

        if (this.system_field_arr.systemId == 0) {
          console.log("Save");
          this.$http
            .post(this.controller, system_data_arr)
            .then((response) => {
              this.$refs.system_form.reset();
              this.$nextTick(() => {
                this.fetch_data_table();
                this.system_modal_show = false;
              });
            })
            .catch((response) => {
              console.log(response);
            });
        } else {
          console.log("Update");
          this.$http
            .put(this.controller, system_data_arr)
            .then((response) => {
              this.$refs.system_form.reset();
              this.$nextTick(() => {
                this.fetch_data_table();
                this.system_modal_show = false;
              });
            })
            .catch((response) => {
              console.log(response);
            });
        }
      });
    },
    system_modal_close() {
      this.system_modal_show = false;
    },
    viewSystem(item) {
      console.log("View", item.id);
      this.$http
        .get(this.controller + "/" + item.id)
        .then((response) => {})
        .catch((response) => {
          // console.log(response);
        });
    },
    editSystem(item) {
      console.log("Edit", item.id);

      this.$http
        .get(this.controller + "/" + item.id)
        .then((response) => {
          console.log("edited Info", response.data.data);

          this.system_modal();
          let i = response.data.data;

          // SELECTED USER LIST
          this.userList.push({
            userId: i.userId,
            userName: i.userName,
          });

          // SELECTED INCHARGE LIST
          this.inchareList.push({
            userId: i.incharedId,
            userName: i.incharedName,
          });
          // SELECTED PROJECT LIST
          this.projectList.push({
            projectId: i.projectId,
            projectTitle: i.projectTitle,
          });

          // ASSIGNING FECTED OBJECT TO SYSTEM FIELD ARRAY
          this.system_field_arr = Object.assign({
            userSelectedList: {
              userId: i.userId,
            },
            inchareSelectedList: {
              userId: i.incharedId,
            },
            projectSelectedList: {
              projectId: i.projectId,
            },
            domainNote: i.domainNote,
            systemNote: i.systemNote,
            deployedDate: moment(i.deployedDate * 1000)
              .add(1, "d")
              .toISOString()
              .substr(0, 10),
            domainExpiryDate: moment(i.domainExpiryDate * 1000)
              .add(1, "d")
              .toISOString()
              .substr(0, 10),
            domain: i.domain,
            dbUsername: i.dbUsername,
            dbPassword: i.dbPassword,
          });
        })
        .catch((error) => {
          console.log("found on edit information", error);
        });
    },
    deleteSystem(item) {
      console.log("Delete", item.id);
      this.$http
        .delete(this.controller + "/" + item.id)
        .then((response) => {
          this.fetch_data_table();
        })
        .catch((response) => {
          // console.log(response);
        });
    },
  },
};
</script>
<style></style>
