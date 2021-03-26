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

          <!-- ADD BUTTONS -->
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
            @click="dialog = true"
          >
            <v-icon small dark left> mdi-plus </v-icon> ADD PROJECTS
          </v-btn>

          <!-- form dialog -->
          <v-dialog
            v-model="dialog"
            max-width="1100px"
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
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.title"
                        label="name"
                        hide-details=""
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.duration"
                        label="duration"
                        hide-details=""
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.collaborators"
                        label="collaborators"
                        hide-details=""
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.status"
                        label="status"
                        hide-details=""
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.deadline"
                        label="deadline"
                        hide-details=""
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.startingdate"
                        label="startedDate"
                        hide-details=""
                      ></v-text-field>
                    </v-col>
                  </v-row>
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
          active
          indeterminate
          absolute
          top
          height="5px"
          class="p-1"
          color="blue darken-4"
        ></v-progress-linear>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import DashboardLayout from "../../components/DashboardLayout";

export default {
  name: "Projects",
  components: {
    DashboardLayout,
  },
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [],
    headersMap: [
      {
        text: "#",
        align: "start",
        sortable: true,
        value: "id",
      },
      {
        text: "project",
        align: "start",
        sortable: true,
        value: "title",
      },
      { text: "Duration", value: "duration" },
      { text: "Collaborators", value: "collaborators" },
      { text: "Started Date", value: "startingdate" },
      { text: "Deadline", value: "deadline" },
      { text: "Status", value: "status" },

      { text: "Actions", value: "actions", sortable: false },
    ],
    projects: [],
    editedIndex: -1,
    editedItem: {
      id: "",
      title: "",
      duration: "",
      collaborators: "",
      status: "",
      deadline: "",
      startingdate: "",
    },
    defaultItem: {
      id: "",
      title: "",
      duration: "",
      collaborators: "",
      status: "",
      deadline: "",
      startingdate: "",
    },
    selectedHeaders: [],
    search: "",
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

  methods: {
    initialize() {
      //   this.projects = [
      //     {
      //       id: 1,
      //       name: "Rent System",
      //       duration: "4 months",
      //       collaborators: 3,
      //       status: "completed",
      //       deadline: "March 26, 8:37 pm",
      //       startedDate: "March 26, 8:37 pm",
      //     },
      //     {
      //       id: 2,
      //       name: "Inventory Managment System",
      //       duration: "6 months",
      //       collaborators: 5,
      //       status: "on progress",
      //       deadline: "March 26, 8:37 pm",
      //       startedDate: "March 26, 8:37 pm",
      //     },
      //   ];

      this.projects.splice(0);
      let url = "url_projects";
      this.$http
        .get(url)
        .then((response) => {
          console.log(response);
          response.data.projects.forEach((element) => {
            console.log(element);
            this.projects.push(element);
          });
        })
        .catch((response) => {
          console.log("response");
          console.log("response");
        });
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
      if (this.editedIndex > -1) {
        Object.assign(this.projects[this.editedIndex], this.editedItem);
      } else {
        this.projects.push(this.editedItem);
      }
      this.close();
    },
  },
};
</script>

<style></style>
