<template>
  <div id="System">
    <!-- Layout -->
    <DashboardLayout />
    {{$t('projects.dtHeader.project')}}
    <v-data-table
      :headers="showHeaders"
      :items="systems"
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
          <v-toolbar-title class="h6">SYSTEMS</v-toolbar-title>
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
          <v-btn color="white" class="indigo lighten-1 ma-1" text tile small>
            <v-icon small dark left> mdi-plus </v-icon> ADD PROJECTS
          </v-btn>
        </v-toolbar>
      </template>

      <!-- Table Action -->
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon
          small
          class="mr-2 blue darken-1  pa-1 shrink   white--text rounded"
          title="asd"
        >
          mdi-eye
        </v-icon>
        <v-icon small class="mr-2 orange darken-1 pa-1 white--text rounded">
          mdi-pencil
        </v-icon>
        <v-icon small class="mr-2 red darken-1 pa-1 white--text rounded">
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
          top
          height="5px"
          class="p-1"
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
export default {
  name: "System",
  components: {
    DashboardLayout,
    ValidationObserver,
    ValidationProvider,
  },
  data: () => ({
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
        // text: this.$t('projects.dtHeader.project'),
        // text: "systems",
        align: "start",
        sortable: true,
        value: "title",
        width: "15%",
      },
      {
        text: "Re-new Duration",
        value: "renewDuration",
        width: "10%",
        align: "center",
      },
      {
        text: "Activated Date",
        value: "ActivatedDate",
        width: "7%",
        align: "center",
      },
      {
        text: "Expired Date",
        value: "ExpiredDate",
        width: "7%",
        align: "center",
      },
      {
        text: "Project Name",
        value: "projectTitle.name",
        width: "15%",
        align: "center",
      },
      { text: "Status", value: "status", width: "10%", align: "center" },

      {
        text: "Actions",
        value: "actions",
        sortable: false,
        width: "8%",
        align: "center",
      },
    ],
    systems: [],
    editedIndex: -1,
    // editedItem: {
    //   id: "",
    //   title: "",
    //   duration: "",
    //   collaborators: "",
    //   status: "",
    //   deadline: "",
    //   startingdate: "",
    // },
    // defaultItem: {
    //   id: "",
    //   title: "",
    //   duration: "",
    //   collaborators: "",
    //   status: "",
    //   deadline: "",
    //   startingdate: "",
    // },
    selectedHeaders: [],
    search: "",
    existData: -1,
    // statusItems: ["on progress", "on testing stage", "completed"],
    // picker1: false,
    // picker2: false,
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
      this.systems = [
        {
          id: 1,
          title: "RMS SYSTEM",
          projectTitle: {
            id: 1,
            name: "Rental Managment Systen",
          },
          status: "Live",
          ActivatedDate: "Live",
          ExpiredDate: "Live",
          renewDuration: "3 months",
        },
      ];

      if (this.systems.length <= 0) {
        // console.log(0);
        console.log("no data");
        this.existData = 1;
      } else {
        console.log("have data");
        this.existData = -1;
        console.log(1);
      }
    },
  },
};
</script>

<style></style>
