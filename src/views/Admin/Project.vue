<template>
  <div id="Projects">
    <!-- Layout -->
    <DashboardLayout />

    <v-data-table
      :headers="showHeaders"
      :items="projects"
      :fixed-header="true"
      :itemsPerPage="20"
      :footer-props="{
        'items-per-page-options': [5, 20, 25, 30, 35, 40, 50, -1],
      }"
      :search="search"
      height="755px"
      sort-by="calories"
      class="elevation-0"
      dense
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title class="h6">PROJECTS</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>

          <!-- SEARCH -->
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            hide-details
            dense
            class="shrink mx-4 my-4"
          >
          </v-text-field>

          <!-- REFRESH BUTTONS -->
          <v-btn
            color="white"
            class="indigo lighten-1 ma-1"
            text
            tile
            small
            @click="initialize"
          >
            <v-icon small dark left> mdi-refresh </v-icon> REFRESH
          </v-btn>

          <!-- HIDE COLUMNS -->
          <v-menu top :close-on-content-click="false">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="white"
                class="indigo lighten-1 ma-1"
                text
                tile
                small
                v-bind="attrs"
                v-on="on"
              >
                <v-icon left small dark> mdi-eye </v-icon> DISPLAY COLUMNS
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

          <!-- ADD BUTTONS -->
          <v-btn
            color="white"
            class="indigo lighten-1 ma-1"
            text
            tile
            small
            @click="newDialog"
          >
            <v-icon small dark left> mdi-plus </v-icon> ADD PROJECTS
          </v-btn>

          <!-- form dialog -->
          <v-dialog
            v-model="dialog"
            max-width="1200px"
            persistent
            content-class="form-dialog"
          >
            <v-card>
              <v-card-title class="indigo lighten-4">
                <span class="headline ">{{ formTitle }}</span>
                <v-spacer></v-spacer>
                <v-icon @click="dialog = false">mdi-close</v-icon>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <ValidationObserver ref="form">
                    <v-row>
                      <!-- title -->
                      <v-col cols="12" sm="6" md="4">
                        <ValidationProvider
                          rules="required|min:5"
                          name="Project Name"
                          v-slot="{ errors }"
                        >
                          <v-text-field
                            v-model="editedItem.title"
                            :label="errors[0] ? errors[0] : 'Project Name'"
                            :error-messages="errors"
                            hide-details=""
                            clearable
                            dense
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>

                      <!-- started picker 1 -->
                      <v-col cols="12" sm="6" md="4">
                        <v-menu
                          v-model="picker2"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          transition="scale-transition"
                          offset-y
                          min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <ValidationProvider
                              rules="required"
                              name="started date"
                              v-slot="{ errors }"
                            >
                              <v-text-field
                                v-model="editedItem.startingdate"
                                :label="errors[0] ? errors[0] : 'started date'"
                                :error-messages="errors"
                                hide-details=""
                                clearable
                                dense
                                readonly
                                v-bind="attrs"
                                v-on="on"
                              ></v-text-field>
                            </ValidationProvider>
                          </template>
                          <v-date-picker
                            v-model="editedItem.startingdate"
                            @input="picker2 = false"
                          ></v-date-picker>
                        </v-menu>
                        <!-- ------------------- -->
                        <!-- <v-text-field
                          v-model="editedItem.startingdate"
                          label="started date"
                          hide-details=""
                          clearable
                          dense
                        ></v-text-field> -->
                        <!-- ------------------------ -->
                      </v-col>

                      <!-- dead line picker 1 -->
                      <v-col cols="12" sm="6" md="4">
                        <v-menu
                          v-model="picker1"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          transition="scale-transition"
                          offset-y
                          min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <ValidationProvider
                              rules="required"
                              name="dead line"
                              v-slot="{ errors }"
                            >
                              <v-text-field
                                v-model="editedItem.deadline"
                                :label="errors[0] ? errors[0] : 'dead line'"
                                :error-messages="errors"
                                hide-details=""
                                clearable
                                dense
                                readonly
                                v-bind="attrs"
                                v-on="on"
                              ></v-text-field>
                            </ValidationProvider>
                          </template>
                          <v-date-picker
                            v-model="editedItem.deadline"
                            @input="picker1 = false"
                          ></v-date-picker>
                        </v-menu>
                        <!-- ----------------------------------- -->
                        <!-- <v-text-field
                          v-model="editedItem.deadline"
                          label="dead line"
                          hide-details=""
                          clearable
                          dense
                        ></v-text-field> -->
                        <!-- ----------------------------------- -->
                      </v-col>

                      <!-- status -->
                      <v-col cols="12" sm="6" md="4">
                        <ValidationProvider
                          rules="required"
                          name="Project Status"
                          v-slot="{ errors }"
                        >
                          <v-select
                            :items="statusItems"
                            v-model="editedItem.status"
                            :label="errors[0] ? errors[0] : 'Project Status'"
                            :error-messages="errors"
                            hide-details=""
                            clearable
                            dense
                          ></v-select>
                        </ValidationProvider>
                      </v-col>

                      <!-- Project Version -->
                      <v-col cols="12" sm="6" md="4">
                        <ValidationProvider
                          rules="required|decimal:4"
                          name="Project Version"
                          v-slot="{ errors }"
                        >
                          <v-text-field
                            v-model="editedItem.projectVersion"
                            :label="errors[0] ? errors[0] : 'Project Version'"
                            :error-messages="errors"
                            hide-details=""
                            clearable
                            dense
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>

                      <!-- team member ids -->
                      <v-col cols="12" sm="6" md="4">
                        <ValidationProvider
                          rules="required"
                          name="Team Members"
                          v-slot="{ errors }"
                        >
                          <v-text-field
                            v-model="editedItem.teamMembers_id"
                            :label="errors[0] ? errors[0] : 'Team Members'"
                            :error-messages="errors"
                            hide-details=""
                            clearable
                            dense
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>

                      <!-- project incharage -->
                      <v-col cols="12" sm="6" md="4">
                        <ValidationProvider
                          rules="required"
                          name="Project Incharge"
                          v-slot="{ errors }"
                        >
                          <v-text-field
                            v-model="editedItem.projectIncharge"
                            :label="errors[0] ? errors[0] : 'Project Incharge'"
                            :error-messages="errors"
                            hide-details=""
                            clearable
                            dense
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>

                      <!-- documentation link -->
                      <v-col cols="12" sm="6" md="4">
                        <ValidationProvider
                          rules="required"
                          name="documentation link"
                          v-slot="{ errors }"
                        >
                          <v-text-field
                            v-model="editedItem.documentationLink"
                            :label="
                              errors[0] ? errors[0] : 'documentation link'
                            "
                            :error-messages="errors"
                            hide-details=""
                            clearable
                            dense
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>

                      <!-- cost -->
                      <v-col cols="12" sm="6" md="4">
                        <ValidationProvider
                          rules="required|numeric"
                          name="Cost"
                          v-slot="{ errors }"
                        >
                          <v-text-field
                            v-model="editedItem.cost"
                            :label="errors[0] ? errors[0] : 'Cost'"
                            :error-messages="errors"
                            hide-details=""
                            clearable
                            dense
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>

                      <v-col
                        cols="12"
                        sm="3"
                        md="4"
                        class="pa-0 pl-5 pt-4 text-center"
                      >
                        <!-- upload image -->

                        <image-cropper
                          v-model="avatar"
                          :width="285"
                          :height="250"
                          placeholder="Choose company logo"
                          :show-remove-button="true"
                          @file-choose="FileUpload($event)"
                          @image-remove="removeImage"
                          class="pa-0 ma-0"
                        />
                      </v-col>

                      <v-col cols="12" sm="6" md="4" class="">
                        <v-tooltip top>
                          <template v-slot:activator="{ on, attrs }">
                            <div v-bind="attrs" v-on="on">
                              <vue-editor
                                v-model="editedItem.description"
                                :editorToolbar="editorToolBar"
                              ></vue-editor>
                            </div>
                          </template>
                          <span>Project Description</span>
                        </v-tooltip>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-tooltip top>
                          <template v-slot:activator="{ on, attrs }">
                            <div v-bind="attrs" v-on="on">
                              <vue-editor
                                v-model="editedItem.features"
                                :editorToolbar="editorToolBar"
                              ></vue-editor>
                            </div>
                          </template>
                          <span>Project Features</span>
                        </v-tooltip>
                      </v-col>

                      <v-col cols="12" sm="6" md="4">
                        <v-tooltip top>
                          <template v-slot:activator="{ on, attrs }">
                            <div v-bind="attrs" v-on="on">
                              <vue-editor
                                v-model="editedItem.notes"
                                :editorToolbar="editorToolBar"
                              ></vue-editor>
                            </div>
                          </template>
                          <span>Project Notes</span>
                        </v-tooltip>
                      </v-col>

                      <v-col cols="12" sm="6" md="4">
                        <v-tooltip top>
                          <template v-slot:activator="{ on, attrs }">
                            <div v-bind="attrs" v-on="on">
                              <vue-editor
                                v-model="editedItem.remark"
                                :editorToolbar="editorToolBar"
                              ></vue-editor>
                            </div>
                          </template>
                          <span>Project Remark</span>
                        </v-tooltip>
                      </v-col>

                      <v-col cols="12" sm="6" md="4">
                        <v-tooltip top>
                          <template v-slot:activator="{ on, attrs }">
                            <div v-bind="attrs" v-on="on">
                              <vue-editor
                                title="Enter special note"
                                v-model="editedItem.specialNote"
                                :editorToolbar="editorToolBar"
                              ></vue-editor>
                            </div>
                          </template>
                          <span>Project Special Note</span>
                        </v-tooltip>
                      </v-col>

                      <!-- ---------------------------------------------------- -->

                      <!-- duration -->
                      <!-- <v-col cols="12" sm="6" md="4">
                        <ValidationProvider
                          rules="required"
                          name="Project Duration"
                          v-slot="{ errors }"
                        >
                          <v-text-field
                            v-model="editedItem.duration"
                            :label="errors[0] ? errors[0] : 'Duration'"
                            :error-messages="errors"
                            hide-details=""
                            clearable
                            dense
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col> -->

                      <!-- collanorators count -->
                      <!-- <v-col cols="12" sm="6" md="4">
                        <ValidationProvider
                          rules="required"
                          name="Collaborators Count"
                          v-slot="{ errors }"
                        >
                          <v-text-field
                            v-model="editedItem.collaborators"
                            :label="
                              errors[0] ? errors[0] : 'Collaborators Count'
                            "
                            :error-messages="errors"
                            hide-details=""
                            clearable
                            dense
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col> -->
                    </v-row>
                  </ValidationObserver>
                </v-container>
              </v-card-text>

              <v-card-actions>
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

          <!-- delete dialog -->
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

      <template v-slot:[`item.id`]="{ item, index }">
        <p class="m-1">{{ index + 1 }}</p>
      </template>
      <template v-slot:[`item.duration`]="{ item }">
        <p class="m-1">{{ item.duration + " Days" }}</p>
      </template>

      <!-- Table Action -->
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon
          small
          class="mr-2 blue darken-1  pa-1 shrink   white--text rounded"
          title="asd"
          @click="editItem(item)"
        >
          mdi-eye
        </v-icon>
        <v-icon
          small
          class="mr-2 orange darken-1 pa-1 white--text rounded"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          class="mr-2 red darken-1 pa-1 white--text rounded"
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
      <!-- no data -->
      <template v-slot:no-data>
        <v-progress-linear
          v-if="existData == -1"
          active
          indeterminate
          absolute
          height="4"
          top
          color="blue darken-4"
        ></v-progress-linear>

        <div v-if="existData == 1">
          <p class="pa-2">RECODES NOT FOUND</p>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import DashboardLayout from "../../components/DashboardLayout";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { VueEditor } from "vue2-editor";
// import Croppa from "vue-croppa";
export default {
  name: "Projects",
  components: {
    DashboardLayout,
    ValidationObserver,
    ValidationProvider,
    VueEditor,
    // 'croppa':Croppa,
  },
  data: () => ({
    avatar: {},
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
    dialog: false,
    dialogDelete: false,
    headers: [],
    headersMap: [
      {
        text: "#",
        align: "start",
        sortable: true,
        value: "id",
        width: "4%",
      },
      {
        text: "project",
        align: "start",
        sortable: true,
        value: "title",
      },
      {
        text: "starting date",
        value: "startingdate",
        width: "10%",
        align: "center",
      },
      {
        text: "deadline",
        value: "deadline",
        width: "10%",
        align: "center",
      },
      {
        text: "duration",
        value: "duration",
        width: "6%",
        align: "center",
      },
      { text: "status", value: "status", width: "10%", align: "center" },
      {
        text: "version",
        value: "projectVersion",
        width: "6%",
        align: "center",
      },
      {
        text: "incharge",
        value: "projectIncharge",
        width: "10%",
        align: "center",
      },
      { text: "cost", value: "cost", width: "10%", align: "center" },

      {
        text: "Actions",
        value: "actions",
        sortable: false,
        width: "8%",
        align: "center",
      },
    ],
    projects: [],
    editedIndex: -1,
    editedItem: {
      id: "",
      title: "",
      // duration: "",
      // collaborators: "",
      status: "",
      deadline: "",
      startingdate: "",
      // --------------------------
      projectVersion: "",
      teamMembers_id: [],
      projectIncharge: "",
      documentationLink: "",
      cost: "",
      description: "",
      features: "",
      notes: "",
      remark: "",
      duration: 0,
      logo: "",
      specialNote: "",
    },
    defaultItem: {
      id: "",
      title: "",
      // duration: "",
      // collaborators: "",
      status: "",
      deadline: "",
      startingdate: "",
      // --------------------------
      projectVersion: "",
      teamMembers_id: [],
      projectIncharge: "",
      documentationLink: "",
      cost: "",
      description: "",
      features: "",
      notes: "",
      remark: "",
      logo: "",
      specialNote: "",
    },
    selectedHeaders: [],
    search: "",
    existData: -1,
    statusItems: ["on progress", "on testing stage", "completed"],
    picker1: false,
    picker2: false,
    profileLogo: [],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
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
  mounted() {},

  methods: {
    dateDiffInDays(date1, date2) {
      return Math.round((date2 - date1) / (1000 * 60 * 60 * 24));
    },
    initialize() {
      this.projects.splice(0);
      let url = "url_projects";
      this.$http
        .get(url)
        .then((response) => {
          // console.log(response);
          response.data.projects.forEach((element) => {
            // console.log(element);
            // this.projects.push(element);
            this.projects.push({
              id: element.id,
              title: element.title,
              status: element.status,
              deadline: element.deadline,
              startingdate: element.startingdate,
              projectVersion: element.projectVersion,
              teamMembers_id: element.teamMembers_id,
              projectIncharge: element.projectIncharge,
              documentationLink: element.documentationLink,
              cost: element.cost,
              description: element.description,
              features: element.features,
              notes: element.notes,
              remark: element.remark,
              logo: element.logo,
              duration: this.dateDiffInDays(
                new Date(Date()),
                new Date(element.deadline)
              ),
            });

            // : "",
            // : [],
            // : "",
            // : "",
            // : "",
            // : "",
            // : "",
            // : "",
            // : "",

            var daysDuration = this.dateDiffInDays(
              new Date(Date()),
              new Date(element.deadline)
            );
            console.log("days", daysDuration);
          });
          console.log("data count", this.projects.length);
          if (this.projects.length <= 0) {
            // console.log(0);
            // console.log("no data");
            this.existData = 1;
          } else {
            // console.log("have data");
            this.existData = -1;
            // console.log(1);
          }
        })
        .catch((response) => {
          // console.log("response");
        });
    },

    newDialog() {
      this.dialog = true;
      this.profileLogo.splice(0);
      this.avatar = {};
    },

    editItem(item) {
      this.editedIndex = this.projects.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.projects.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.projects.splice(this.editedIndex, 1);
      let url = "url_projects/" + this.editedItem.id;
      this.$http
        .delete(url)
        .then((response) => {
          console.log(response.data);
          this.initialize();
        })
        .catch((response) => {
          console.log("Error Fround. Project Not Saved");
        });
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.removeImage();
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    removeImage() {
      console.log(101010101);
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        this.$refs.form.validate().then((success) => {
          if (!success) {
            return;
          }

          Object.assign(this.projects[this.editedIndex], this.editedItem);
          const update = {
            // title: this.editedItem.title,
            // duration: this.editedItem.duration,
            // startingdate: this.editedItem.startingdate,
            // deadline: this.editedItem.deadline,
            // status: this.editedItem.status,
            // collaborators: this.editedItem.collaborators,

            title: this.editedItem.title,
            status: this.editedItem.status,
            deadline: this.editedItem.deadline,
            startingdate: this.editedItem.startingdate,
            projectVersion: this.editedItem.projectVersion,
            teamMembers_id: this.editedItem.teamMembers_id,
            projectIncharge: this.editedItem.projectIncharge,
            documentationLink: this.editedItem.documentationLink,
            cost: this.editedItem.cost,
            description: this.editedItem.description,
            features: this.editedItem.features,
            notes: this.editedItem.notes,
            remark: this.editedItem.remark,
            logo: this.editedItem.logo,
          };
          let url = "url_projects/" + this.editedItem.id;
          this.$http
            .put(url, update)
            .then((response) => {
              console.log(response.data);
              this.initialize();
            })
            .catch((response) => {
              console.log("Error Fround. Project Not Saved");
            });
          this.close();

          this.$nextTick(() => {
            this.$refs.form.reset();
            console.log("cleared");
          });
        });
      } else {
        this.$refs.form.validate().then((success) => {
          if (!success) {
            return;
          }

          this.projects.push(this.editedItem);

          const save = {
            // title: this.editedItem.title,
            // duration: this.editedItem.duration,
            // startingdate: this.editedItem.startingdate,
            // deadline: this.editedItem.deadline,
            // status: this.editedItem.status,
            // collaborators: this.editedItem.collaborators,
            title: this.editedItem.title,
            status: this.editedItem.status,
            deadline: this.editedItem.deadline,
            startingdate: this.editedItem.startingdate,
            projectVersion: this.editedItem.projectVersion,
            teamMembers_id: this.editedItem.teamMembers_id,
            projectIncharge: this.editedItem.projectIncharge,
            documentationLink: this.editedItem.documentationLink,
            cost: this.editedItem.cost,
            description: this.editedItem.description,
            features: this.editedItem.features,
            notes: this.editedItem.notes,
            remark: this.editedItem.remark,
            logo: this.profileLogo[0],
            specialNote: this.editedItem.specialNote,
          };

          let url = "url_projects";
          this.$http
            .post(url, save)
            .then((response) => {
              console.log(response.data);
              this.initialize();
            })
            .catch((response) => {
              console.log("Error Fround. Project Not Saved");
            });

          this.close();

          this.$nextTick(() => {
            this.$refs.form.reset();
            console.log("cleared");
          });
        });
      }
    },
    FileUpload(e) {
      console.log("triggered");
      console.log(e);
      let reader = new FileReader();
      reader.onload = (fileArray) => {
        // console.log(reader.result);
        this.profileLogo.push(reader.result);
      };
      reader.readAsDataURL(e);

      console.log(this.profileLogo);
    },
  },
};
</script>

<style></style>
