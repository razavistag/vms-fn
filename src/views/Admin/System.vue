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
              {{ $t("system.title") }}
            </span>
          </v-toolbar-title>

          <v-divider class="mx-4" inset vertical></v-divider>

          <!-- status chip -->
          <v-chip
            dark
            small
            class="ma-1   d-none  d-sm-none d-md-flex"
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

          <!-- -------------------------------- -->

          <!-- HIDE COLUMNS without button -->

          <!-- <v-select
                            style="maxWidth: 280px;"
                            v-model="selectedHeaders"
                            :items="headers"
                            multiple
                            return-object
                            class=""
                            hide-details=""
                            dense    
                            :menu-props="{ maxHeight: '400', top: true, offsetY: true }"
                          >
                            <template v-slot:selection="{ item, index }">
                              <v-chip v-if="index < 2" x-small>
                                <span>{{ item.text }}</span> </v-chip>  <span v-if="index === 2" class="grey--text caption">  (+{{ selectedHeaders.length - 2 }} others) Display Columns
             </span>
</template>
          </v-select> -->
          <!-- -------------------------------- -->

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
                  <!-- DISPLAY COLUMNS -->
                  {{ $t("button.displayColumns") }}
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

          <!-- ADD BUTTONS -->

          <v-btn
            color="indigo lighten-1"
            class=" ma-1"
            outlined
            small
            v-shortkey="['alt', 'n']"
            @shortkey="newDialog()"
            @click="newDialog"
            v-show="ap_add"
          >
            <!-- v-if="access_role != 1 && access_role != 0" -->
            <v-icon left dark class=""> mdi-plus </v-icon>

            <span class="v_toolbar_add_project_text">
              <!-- ADD PROJECTS -->
              {{ $t("button.addProjects") }}
            </span>
          </v-btn>

          <!-- FORM DIALOG -->
          <v-dialog
            v-model="dialog"
            max-width="1200px"
            persistent
            content-class="form-dialog"
            scrollable
          >
            <v-card>
              <v-card-title class="indigo lighten-4">
                <span class="headline ">
                  {{ formTitle }}
                  <span v-if="editedIndex != -1">
                    {{ editedItem.title }}
                  </span>
                </span>
                <v-spacer></v-spacer>
                <v-icon @click="dialog = false">mdi-close</v-icon>
              </v-card-title>

              <v-card-text style="height: 800px;">
                <v-container>
                  <ValidationObserver ref="form">
                    <v-row>
                      <!-- title -->
                      <v-col cols="12" sm="6" md="4" v-if="editedIndex != -1">
                        <ValidationProvider
                          rules="required|min:5"
                          name="Project Name"
                          v-slot="{ errors }"
                        >
                          <v-text-field
                            v-model="editedItem.title"
                            disabled
                            prefix="*"
                            :label="errors[0] ? errors[0] : 'Project Name'"
                            :error-messages="errors"
                            hide-details=""
                            clearable
                            dense
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>

                      <v-col cols="12" sm="6" md="4" v-else>
                        <ValidationProvider
                          rules="required|min:5"
                          name="Project Name"
                          v-slot="{ errors }"
                        >
                          <v-text-field
                            v-model="editedItem.title"
                            :label="errors[0] ? errors[0] : 'Project Name'"
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
                                prefix="*"
                                dense
                                readonly
                                v-bind="attrs"
                                v-on="on"
                              ></v-text-field>
                            </ValidationProvider>
                          </template>
                          <v-date-picker
                            v-model="editedItem.startingdate"
                            dateFormat="mm-YYYY"
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
                                prefix="*"
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
                            prefix="*"
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
                            prefix="*"
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
                          <v-combobox
                            v-model="selectedTeam"
                            :items="teamMembers"
                            item-text="members_name"
                            hide-selected
                            :label="errors[0] ? errors[0] : 'Team Members'"
                            :error-messages="errors"
                            multiple
                            dense
                            persistent-hint
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

                      <!-- project incharage -->
                      <v-col cols="12" sm="6" md="4">
                        <ValidationProvider
                          rules="required"
                          name="Project Incharge"
                          v-slot="{ errors }"
                        >
                          <!-- <pre>{{selectedIncharge}}</pre> -->
                          <v-combobox
                            v-model="selectedIncharge[0]"
                            :items="teamMembers"
                            item-text="members_name"
                            hide-selected
                            :label="errors[0] ? errors[0] : 'Project Incharge'"
                            :error-messages="errors"
                            prefix="*"
                            persistent-hint
                            hide-details=""
                            small-chips
                            clearable
                            dense
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
                            prefix="*"
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
                            prefix="*"
                            clearable
                            dense
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>

                      <!-- image -->
                      <v-col
                        cols="12"
                        sm="3"
                        md="4"
                        class="pa-0 pl-5 pt-4 text-center"
                      >
                        <v-icon
                          v-if="editedItem.logo"
                          class="upload_on_edit"
                          @click="editedItem.logo = !editedItem.logo"
                        >
                          mdi-pencil
                        </v-icon>
                        <v-img
                          v-if="editedItem.logo"
                          :src="
                            'http://localhost:8000/storage/' + editedItem.logo
                          "
                          width="285"
                          height="250"
                          class="editImage"
                        />

                        <!-- upload image -->
                        <image-cropper
                          v-if="!editedItem.logo"
                          v-model="avatar"
                          :width="265"
                          :height="250"
                          placeholder="Choose company logo"
                          :show-remove-button="true"
                          @file-choose="FileUpload($event)"
                          @image-remove="removeImage"
                          class="pa-0 ma-0"
                        />
                      </v-col>

                      <!-- description -->
                      <v-col cols="12" sm="6" md="8" class="">
                        <v-tooltip top>
                          <template v-slot:activator="{ on, attrs }">
                            <div v-bind="attrs" v-on="on">
                              <ValidationProvider
                                rules="required"
                                name="description"
                                v-slot="{ errors }"
                              >
                                <p class="errorDes" v-if="errors[0]">
                                  {{ errors[0] }}
                                </p>
                                <p
                                  class="mendatory"
                                  v-show="!editedItem.description"
                                >
                                  *
                                </p>
                                <vue-editor
                                  v-model="editedItem.description"
                                  :editorToolbar="editorToolBar"
                                ></vue-editor>
                              </ValidationProvider>
                            </div>
                          </template>
                          <span>Project Description</span>
                        </v-tooltip>
                      </v-col>

                      <!-- features -->
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
                                v-model="editedItem.remark"
                                :editorToolbar="editorToolBar"
                              ></vue-editor>
                            </div>
                          </template>
                          <span>Project Remark</span>
                        </v-tooltip>
                      </v-col>

                      <!-- special note -->
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
                    </v-row>
                  </ValidationObserver>
                </v-container>
              </v-card-text>

              <v-card-actions class="blue-grey lighten-4">
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
          <v-dialog v-model="dialogDelete" max-width="800px">
            <v-card>
              <v-card-title class="headline">
                Are you sure you want to delete this project
                <span class="font-weight-bold pl-3">
                  {{ editedItem.title }}
                </span>
                ?
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">
                  Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">
                  OK
                </v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
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
        <!-- <div class="pa-0 ma-0"  > -->
        <v-icon
          id="dt-trash-action-button"
          small
          title="Delete Projects"
          class="red darken-1 pa-1 white--text rounded"
          @click="deleteSystem(item)"
        >
          mdi-delete
        </v-icon>
        <!-- </div> -->
      </template>
      <template v-slot:expanded-item="{ item }" class="w-50">
        <td colspan="6">{{ item }}</td>
      </template>
    </v-data-table>
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
    dataTableFullscreen: false,
    dataTableLoading: true,
    expanded: [],
  }),
  computed: {
    headers() {
      return [
        // {
        //   text: "",
        //   value: "data-table-expand",
        //   align: "start",
        //   sortable: false,
        //   width: "10px",
        // },
        {
          text: "#",
          value: "id",
          align: "start",
          sortable: false,
          width: "50px",
        },
        { text: "Project name", value: "title" },
        { text: "Client name", value: "user_name" },
        { text: "Client email", value: "user_email" },
        { text: "Client mobile", value: "user_mobile" },
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
  created() {
    this.fetch_data_table();
  },
  methods: {
    expandTable() {
      var elem = document.getElementById("dt_table");
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
    fetch_data_table() {
      let count = 5;
      console.log(count);
      this.$http
        .get(this.controller + "?p=" + count)
        .then((response) => {
          this.data_arr = response.data.systems.data;
          (this.dataTableLoading = false), console.log(response);
        })
        .catch((response) => {
          // console.log(response);
        });
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
        .then((response) => {})
        .catch((response) => {
          // console.log(response);
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
