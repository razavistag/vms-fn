<template>
  <div id="Tasks">
    <DashboardLayout />
    <v-card color="pa-0" tile flat>
      <v-data-table
        :headers="showHeaders"
        :items="Tasks"
        :fixed-header="true"
        :footer-props="{
          'items-per-page-options': [pagination.total],
          prevIcon: '',
          nextIcon: '',
        }"
        disable-pagination
        id="dt_table_task"
        class="elevation-0"
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
                mdi-arrow-expand</v-icon
              >

              TASKS
            </v-toolbar-title>

            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>

            <!-- SEARCH -->
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

            <!-- REFRESH BUTTON -->
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

              <span class="v_toolbar_refresh_text">REFRESH</span>
            </v-btn>

            <!-- HIDE COLUMNS with button-->
            <v-menu top :close-on-content-click="false">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="indigo lighten-1"
                  class=" ma-1"
                  outlined
                  small
                  v-bind="attrs"
                  v-on="on"
                  v-shortkey="['alt', 'd']"
                >
                  <v-icon left dark> mdi-eye </v-icon>

                  <span class="v_toolbar_display_column_text">
                    DISPLAY COLUMNS
                  </span>
                </v-btn>
              </template>

              <v-list flat>
                <v-list-item class="fixed">
                  <v-select
                    v-model="selectedHeaders"
                    :items="headers"
                    label="Display Columns"
                    multiple
                    return-object
                    class=""
                    hide-details=""
                    dense
                    :menu-props="{ maxHeight: '400', top: true, offsetY: true }"
                  >
                    <template v-slot:selection="{ item, index }">
                      <v-chip v-if="index < 2" x-small>
                        <span>{{ item.text }}</span>
                      </v-chip>

                      <span v-if="index === 2" class="grey--text caption">
                        (+{{ selectedHeaders.length - 2 }} others)
                      </span>
                    </template>
                  </v-select>
                </v-list-item>
              </v-list>
            </v-menu>

            <!-- ADD BUTTON -->
            <v-btn
              color="indigo lighten-1"
              class=" ma-1"
              outlined
              small
              v-shortkey="['alt', 'n']"
              @shortkey="newDialog()"
              @click="newDialog"
            >
              <v-icon left dark class=""> mdi-plus </v-icon>

              <span class="v_toolbar_add_project_text">ADD TASKS</span>
            </v-btn>

            <!-- Form Dialog -->
            <v-dialog
              v-model="dialog"
              max-width="1200px"
              content-class="task-dialog"
              persistent
              scrollable
            >
              <v-card>
                <v-card-title class="indigo lighten-4">
                  <span class="headline">{{ formTitle }}</span>
                  <v-spacer></v-spacer>
                  <v-icon @click="dialog = !dialog">mdi-close</v-icon>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <ValidationObserver ref="form">
                      <v-row v-for="(i, k) in FormTask" :key="k" class="pt-3">
                        <!-- FORM TAB TITLE -->
                        <v-col
                          md="12"
                          sm="12"
                          cols="12"
                          class="blue-grey lighten-4 mb-2 d-flex"
                        >
                          TASK {{ k + 1 }}

                          <v-spacer></v-spacer>
                          <!-- <div v-show="AxiosProgressCount != 0">
                            {{ AxiosProgressCount }}
                          </div> -->

                          <v-progress-linear v-model="AxiosProgressCount" height="15" class="w-50" v-show="AxiosProgressCount != 0">
                            <span>{{ AxiosProgressCount }}</span>
                          </v-progress-linear>
                          <!-- REMOVE ROW BUTTON -->
                          <v-btn
                            v-if="FormTask.length > 1"
                            depressed
                            x-small
                            icon
                            class="red ml-4 mt-2"
                            @click="removeTask(k)"
                          >
                            <v-icon color="white" small class="">
                              mdi-delete
                            </v-icon>
                          </v-btn>

                          <!-- ADD ROW BUTTON -->
                          <v-btn
                            depressed
                            x-small
                            icon
                            class="blue ml-4 mt-2"
                            @click="addTask(k)"
                            v-if="k == FormTask.length - 1"
                          >
                            <v-icon color="white" dense class="">
                              mdi-plus
                            </v-icon>
                          </v-btn>
                        </v-col>

                        <!-- TASKS -->
                        <v-col cols="12" sm="6" md="3">
                          <ValidationProvider
                            rules="required|min:5"
                            name="TASK"
                            v-slot="{ errors }"
                          >
                            <v-text-field
                              v-model="i.task"
                              :label="errors[0] ? errors[0] : 'Task'"
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

                        <!-- AVAILABLE PROJECTS -->
                        <v-col cols="12" sm="6" md="3">
                          <ValidationProvider
                            rules="required"
                            name="Project"
                            v-slot="{ errors }"
                          >
                            <v-combobox
                              :items="AvailbaleProjects"
                              :label="errors[0] ? errors[0] : 'Project'"
                              :error-messages="errors"
                              v-model="i.project"
                              hide-selected
                              dense
                              single-line
                              prefix="*"
                              hide-details=""
                              small-chips
                              clearable
                            >
                              <template v-slot:no-data>
                                <v-list-item>
                                  <v-list-item-content>
                                    <v-list-item-title>
                                      No results matching
                                    </v-list-item-title>
                                  </v-list-item-content>
                                </v-list-item>
                              </template>
                            </v-combobox>
                          </ValidationProvider>
                        </v-col>

                        <!-- AVAILABLE SYSTEMS -->
                        <v-col cols="12" sm="6" md="3">
                          <ValidationProvider
                            rules="required"
                            name="System"
                            v-slot="{ errors }"
                          >
                            <v-combobox
                              :items="AvailbaleSystems"
                              :label="errors[0] ? errors[0] : 'System'"
                              :error-messages="errors"
                              hide-selected
                              v-model="i.system"
                              dense
                              single-line
                              prefix="*"
                              hide-details=""
                              small-chips
                              clearable
                            >
                              <template v-slot:no-data>
                                <v-list-item>
                                  <v-list-item-content>
                                    <v-list-item-title>
                                      No results matching
                                    </v-list-item-title>
                                  </v-list-item-content>
                                </v-list-item>
                              </template>
                            </v-combobox>
                          </ValidationProvider>
                        </v-col>

                        <!-- TESTERS SYSTEMS -->
                        <v-col cols="12" sm="6" md="3" class="d-flex">
                          <ValidationProvider
                            rules="required"
                            name="Tester"
                            v-slot="{ errors }"
                          >
                            <v-combobox
                              :items="AvailableTesters"
                              :label="errors[0] ? errors[0] : 'Tester'"
                              :error-messages="errors"
                              hide-selected
                              v-model="i.tester"
                              dense
                              single-line
                              prefix="*"
                              hide-details=""
                              small-chips
                              clearable
                            >
                              <template v-slot:selection="{ item }">
                                <v-chip small>
                                  <span>{{ item }}</span>
                                </v-chip>
                              </template>
                              <template v-slot:no-data>
                                <v-list-item>
                                  <v-list-item-content>
                                    <v-list-item-title>
                                      No results matching
                                    </v-list-item-title>
                                  </v-list-item-content>
                                </v-list-item>
                              </template>
                            </v-combobox>
                          </ValidationProvider>
                        </v-col>

                        <!-- PRIORITY -->
                        <v-col cols="12" sm="6" md="3" class="d-flex">
                          <ValidationProvider
                            rules="required"
                            name="Priority"
                            v-slot="{ errors }"
                          >
                            <v-combobox
                              :items="AvailablePriority"
                              :label="errors[0] ? errors[0] : 'Priority'"
                              :error-messages="errors"
                              hide-selected
                              v-model="i.priority"
                              dense
                              single-line
                              prefix="*"
                              hide-details=""
                              small-chips
                              clearable
                            >
                              <template v-slot:selection="{ item }">
                                <v-chip small>
                                  <span>{{ item }}</span>
                                </v-chip>
                              </template>
                              <template v-slot:no-data>
                                <v-list-item>
                                  <v-list-item-content>
                                    <v-list-item-title>
                                      No results matching
                                    </v-list-item-title>
                                  </v-list-item-content>
                                </v-list-item>
                              </template>
                            </v-combobox>
                          </ValidationProvider>
                        </v-col>

                        <!-- ASSIGNED TO -->
                        <v-col cols="12" sm="6" md="3" class="d-flex">
                          <ValidationProvider
                            rules="required"
                            name="Assigned to"
                            v-slot="{ errors }"
                          >
                            <v-combobox
                              :items="AvailableMembers"
                              :label="errors[0] ? errors[0] : 'Assigned to'"
                              :error-messages="errors"
                              hide-selected
                              v-model="i.Assigned_to"
                              dense
                              single-line
                              prefix="*"
                              hide-details=""
                              small-chips
                              clearable
                            >
                              <template v-slot:selection="{ item }">
                                <v-chip small>
                                  <span>{{ item }}</span>
                                </v-chip>
                              </template>
                              <template v-slot:no-data>
                                <v-list-item>
                                  <v-list-item-content>
                                    <v-list-item-title>
                                      No results matching
                                    </v-list-item-title>
                                  </v-list-item-content>
                                </v-list-item>
                              </template>
                            </v-combobox>
                          </ValidationProvider>
                        </v-col>

                        <!-- ATTACHMENT -->
                        <v-col cols="12" sm="6" md="4" class="">
                          <ValidationProvider
                            rules=""
                            name="Attechments"
                            v-slot="{ errors }"
                          >
                            <v-file-input
                              :label="errors[0] ? errors[0] : 'Attechments'"
                              @change="fileOnchage($event, k)"
                              :error-messages="errors"
                              dense
                              hide-details=""
                              prepend-icon=""
                              small-chips
                              truncate-length="10"
                              multiple
                              show-size=""
                              counter
                              v-model="i.files"
                            >
                              <template v-slot:selection="{ index, text }">
                                <v-chip
                                  v-if="index < 2"
                                  color="deep-purple accent-4"
                                  dark
                                  label
                                  x-small
                                >
                                  {{ text }}
                                </v-chip>

                                <span
                                  v-else-if="index === 2"
                                  class="overline grey--text text--darken-3 ml-2"
                                >
                                  +{{ i.files.length - 2 }} more
                                </span>
                              </template>
                            </v-file-input>
                          </ValidationProvider>
                        </v-col>

                        <v-col
                          cols="12"
                          sm="6"
                          md="2"
                          class=""
                          v-show="i.files.length > 1"
                        >
                          <v-btn
                            color="blue gray"
                            dark
                            depressed
                            class="ma-0 pa-2"
                            small
                            >VIEW ATTACHMENTS</v-btn
                          >
                        </v-col>

                        <!-- DESCRIPTION -->
                        <v-col sm="12" md="12" cols="12" class="">
                          <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                              <div v-bind="attrs" v-on="on">
                                <ValidationProvider
                                  rules="required"
                                  name="Task Description"
                                  v-slot="{ errors }"
                                >
                                  <p class="errorDes" v-if="errors[0]">
                                    {{ errors[0] }}
                                  </p>
                                  <p
                                    class="mendatory_task_description"
                                    v-show="!i.description"
                                  >
                                    *
                                  </p>
                                  <vue-editor
                                    :editorToolbar="editorToolBar"
                                    v-model="i.description"
                                    data-vv-name="rules: { required: true, min: 2 }"
                                    class="vue_edeitor_height"
                                  ></vue-editor>
                                </ValidationProvider>
                              </div>
                            </template>
                            <span>Task Description</span>
                          </v-tooltip>
                        </v-col>
                      </v-row>
                    </ValidationObserver>

                    <v-row>
                      <pre>{{ FormTask }}</pre>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions class="fixed-bottom">
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Cancel
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="save">
                    Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="headline"
                  >Are you sure you want to delete this item?</v-card-title
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete"
                    >Cancel</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                    >OK</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>

        <!-- TABLE ACTIONS -->
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            id="dt-view-action-button"
            small
            class="mr-2 blue darken-1  pa-1 shrink   white--text rounded"
            title="View Projects"
          >
            mdi-eye
          </v-icon>
          <v-icon
            id="dt-edit-action-button"
            small
            title="Edit Projects"
            class="mr-2 orange darken-1 pa-1 white--text rounded"
          >
            mdi-pencil
          </v-icon>

          <v-icon
            id="dt-trash-action-button"
            small
            title="Delete Projects"
            class="red darken-1 pa-1 white--text rounded"
          >
            mdi-delete
          </v-icon>
        </template>

        <!-- Footer Page Text -->
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

        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize">
            Reset
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import DashboardLayout from "../../components/DashboardLayout";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { VueEditor } from "vue2-editor";
export default {
  name: "System",
  components: {
    DashboardLayout,
    ValidationObserver,
    ValidationProvider,
    VueEditor,
  },
  data: () => ({
    dialog: false,
    dialogDelete: false,
    dataTableFullscreen: false,

    search: "",
    AxiosProgressCount: 0,
    uploaded: 0,

    selectedHeaders: [],
    headers: [],
    Tasks: [],
    filesUpload: [],

    AvailbaleProjects: ["Clark Rice", "Andrew Oconnor"],
    AvailbaleSystems: [
      "Eos pariatur Volupt",
      "Aut error culpa dolo",
      "Quasi sit ut sint re",
    ],
    AvailableTesters: [
      "Abigail",
      "Alexandra",
      "Alison",
      "Amanda",
      "Amelia",
      "Amy",
      "Andrea",
      "Angela",
    ],
    AvailablePriority: ["Critical", "High", "Medium", "Low"],
    AvailableMembers: [
      "Abigail",
      "Alexandra",
      "Alison",
      "Amanda",
      "Amelia",
      "Amy",
      "Andrea",
      "Angela",
    ],
    FormTask: [
      {
        task: "",
        project: "",
        system: "",
        tester: "",
        description: "",
        priority: "",
        Assigned_to: "",
        files: [],
      },
    ],
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
      ["clean"],
    ],
    pagination: {
      current: 1,
      localCurrentPage: parseInt(localStorage.getItem("paginateKey")),
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
        text: "#",
        align: "center",
        sortable: true,
        value: "id",
        align: "start",
      },
      {
        text: "TASK",
        align: "center",
        sortable: true,
        value: "task",
        align: "start",
      },
      {
        text: "PROJECT",
        align: "center",
        sortable: true,
        value: "project",
        align: "start",
      },
      {
        text: "SYSTEM",
        align: "center",
        sortable: true,
        value: "system",
        align: "start",
      },
      {
        text: "TESTED BY",
        align: "center",
        sortable: true,
        value: "tested_by",
        align: "start",
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
    editedIndex: -1,
    editedItem: {
      description: "",
    },
    defaultItem: {
      description: "",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Task" : "Edit Task";
    },
    showHeaders() {
      return this.headers.filter((s) => this.selectedHeaders.includes(s));
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  created() {
    this.initialize();
    this.headers = Object.values(this.headersMap);
    this.selectedHeaders = this.headers;
  },
  methods: {
    onPageChange(e) {
      // console.log(e)
      localStorage.setItem("paginateKey", e);
      this.paginateData();
    },
    expandTable() {
      var elem = document.getElementById("dt_table_task");
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
    exitFullScreenDataTable() {
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
    newDialog() {
      this.dialog = true;
      this.$nextTick(() => {
        this.$refs.form.reset();
      });
    },
    refresh() {
      console.log("refresh triggered");
      this.initialize();
    },
    onSearch(e) {
      console.log("onserach triggered");
    },
    focusSearchKey() {
      console.log("alt, s triggered");
      this.$refs.searchbar_ref.$refs.input.focus();
    },
    addTask(i) {
      this.$refs.form.validate().then((success) => {
        if (!success) {
          return;
        }
        console.log("new selecter");
        this.FormTask.push({
          task: "",
          project: "",
          system: "",
          tester: "",
          description: "",
          priority: "",
          Assigned_to: "",
          files: [],
        });
        console.log(this.FormTask);
      });
    },
    removeTask(i) {
      this.FormTask.splice(i, 1);
    },
    fileOnchage(e, k) {
      console.log(e);
      this.filesUpload.splice(0);

      this.filesUpload.push(e);
      this.FormTask.files[k].push(e);

      console.log("file On change >>" + this.filesUpload);

      // MULTI UPLOAD
      // const fd = new FormData();
      // e.forEach((element) => {
      //   fd.append("file[]", element, element.name);
      // });

      // this.$http.post("task", fd).then((res) => {
      //   console.log(res);
      // });

      // SINGLE UPLOAD
      // const fd = new FormData();
      // fd.append("file", e[0], e[0].name);
      // this.$http.post("task", fd).then((res) => {
      //   console.log(res);
      // });
    },
    initialize() {
      this.Tasks = [
        {
          id: 1,
          task: "Store Function Not working",
          project: "Rent a car project",
          system: "Evil Corp",
          error_count: 1,
          tested_by: "Mohamed Anfas",
        },
        {
          id: 2,
          task: "Data not showing",
          project: "Andrew Oconnor",
          system: "ALL SAFE",
          error_count: 5,
          tested_by: "Mohamed Ikram",
        },
        {
          id: 3,
          task: "Update not working",
          project: "Clark Rice",
          system: "Wiki",
          error_count: 3,
          tested_by: "Mohamed Ashfak",
        },
      ];

      this.$http.get("task").then((response) => {
        // console.log(response.data);
        response.data.obj_tasks_members.forEach((element) => {
          console.log(element);
        });
      });
    },
    editItem(item) {
      this.editedIndex = this.Tasks.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedIndex = this.Tasks.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.Tasks.splice(this.editedIndex, 1);
      this.closeDelete();
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    save() {
      this.AxiosProgressCount = null;
      if (this.editedIndex > -1) {
        // update
        Object.assign(this.Tasks[this.editedIndex], this.FormTask);
      } else {
        console.log("save"); // save

        this.FormTask.forEach((element) => {
          console.log("FormTask on save", element);

          const fd = new FormData();

          // if (!this.filesUpload.length < 1) {
          //   this.filesUpload[0].forEach((element) => {
          //     fd.append("file[]", element, element.name);
          //   });
          // }

          if (!element.files.length < 1) {
            element.files.forEach((element) => {
              fd.append("file[]", element, element.name);
            });
          }
          fd.append("FormTask", element.task);
          fd.append("FormProject", element.project);
          fd.append("FormSystem", element.system);
          fd.append("FormTester", element.tester);
          fd.append("FormDescription", element.description);
          fd.append("FormPriority", element.priority);
          fd.append("FormAssigned_to", element.Assigned_to);

          console.log("append >> ", fd);
          this.$http
            .post("task", fd, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              onUploadProgress: (progressEvent) =>
                (this.AxiosProgressCount =
                  Math.round(
                    (progressEvent.loaded / progressEvent.total) * 100
                  ) + " % Uploaded"),
            })
            .then((res) => {
              console.log(res);
            });
        });

        this.Tasks.push(this.editedItem);
      }
      // this.close();
    },
  },
};
</script>

<style></style>
