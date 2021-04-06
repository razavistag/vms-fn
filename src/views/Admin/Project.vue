<template>
  <div id="Projects">
    <!-- Layout -->
    <DashboardLayout />

    <v-data-table
      :headers="showHeaders"
      :items="projects"
      :fixed-header="true"
      :itemsPerPage="1"
      :footer-props="{
        'items-per-page-options': [1, 2, 5, 20, 25, 30, 35, 40, 50, -1],
        'items-per-page-text': 'projects per page',
      }"
      height="470px"
      class="elevation-0"
      dense
      :loading="dataTableLoading"
      loading-text="Fetching Project Data"
   
    >
        <!-- :server-items-length="parseInt(testPagination.total)" -->
      <!-- :footer-props="{
        'items-per-page-options': [pagination.total, -1],
          pagination:{
          page:1
        }
      }" -->
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title class="h6">PROJECTS</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>

          <!-- SEARCH -->
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            @input="onSearch"
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
            @click="refresh"
          >
            <v-icon small dark left> mdi-refresh </v-icon> REFRESH
          </v-btn>
          <!-- -------------------------------- -->

          <!-- Display coulmns -->
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
                <span>{{ item.text }}</span>
              </v-chip>
              <span v-if="index === 2" class="grey--text caption">
                (+{{ selectedHeaders.length - 2 }} others) Display Columns
              </span>
            </template>
          </v-select> -->
          <!-- -------------------------------- -->

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
            scrollable
          >
            <v-card>
              <v-card-title class="indigo lighten-4">
                <span class="headline "
                  >{{ formTitle }}
                  <span v-if="editedIndex != -1">{{
                    editedItem.title
                  }}</span></span
                >
                <v-spacer></v-spacer>
                <v-icon @click="dialog = false">mdi-close</v-icon>
              </v-card-title>

              <v-card-text style="height: 800px;">
                <v-container>
                  <ValidationObserver ref="form">
                    <v-row>
                      <!-- {{editedItem.id}} -->
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
                      <!-- {{editedItem.deadline}} -->
                      <!-- {{moment(editedItem.deadline).format("X")}} -->
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
                          <!-- <div
                            v-for="i in selectedTeam"
                            :key="i.member_id"
                            class="d-flex flex flex-row"
                          >
                            <v-chip x-small>{{ i }}</v-chip>
                          </div> -->

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
                            hide-details=""
                            small-chips
                            clearable
                          >
                            <template v-slot:no-data>
                              <v-list-item>
                                <v-list-item-content>
                                  <!-- <v-list-item-title>
                                    No results matching "<strong>{{
                                      search
                                    }}</strong
                                    >". Press <kbd>enter</kbd> to create a new
                                    one
                                  </v-list-item-title> -->
                                  <!-- <v-list-item>No Recodes Found</v-list-item> -->
                                </v-list-item-content>
                              </v-list-item>
                            </template>
                          </v-combobox>
                        </ValidationProvider>
                        <!-- <ValidationProvider
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
                        </ValidationProvider> -->
                      </v-col>

                      <!-- project incharage -->
                      <v-col cols="12" sm="6" md="4">
                        <ValidationProvider
                          rules="required"
                          name="Project Incharge"
                          v-slot="{ errors }"
                        >
                          <v-combobox
                            v-model="selectedIncharge"
                            :items="teamMembers"
                            item-text="members_name"
                            hide-selected
                            :label="errors[0] ? errors[0] : 'Project Incharge'"
                            :error-messages="errors"
                            multiple
                            persistent-hint
                            hide-details=""
                            small-chips
                            clearable
                            dense
                          >
                            <template v-slot:no-data>
                              <v-list-item>
                                <v-list-item-content>
                                  <!-- <v-list-item-title>
                                    No results matching "<strong>{{
                                      search
                                    }}</strong
                                    >". Press <kbd>enter</kbd> to create a new
                                    one
                                  </v-list-item-title> -->
                                  <!-- <v-list-item>No Recodes Found</v-list-item> -->
                                </v-list-item-content>
                              </v-list-item>
                            </template>
                          </v-combobox>
                          <!-- <v-text-field
                            v-model="editedItem.projectIncharge"
                            :label="errors[0] ? errors[0] : 'Project Incharge'"
                            :error-messages="errors"
                            hide-details=""
                            clearable
                            dense
                          ></v-text-field> -->
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

                      <!-- image -->
                      <v-col
                        cols="12"
                        sm="3"
                        md="4"
                        class="pa-0 pl-5 pt-4 text-center"
                      >
                        <!-- {{editedItem.logo}} -->
                        <v-icon
                          v-if="editedItem.logo"
                          class="upload_on_edit"
                          @click="editedItem.logo = !editedItem.logo"
                          >mdi-pencil</v-icon
                        >
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
                          :width="285"
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

                      <!-- <v-col cols="12" sm="6" md="4">
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
                      </v-col> -->

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
              <v-card-title class="headline"
                >Are you sure you want to delete this project
                <span class="font-weight-bold pl-3">
                  {{ editedItem.title }}</span
                >
                ?</v-card-title
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

      <!--Start Date -->
      <template v-slot:[`item.startingdate`]="{ item }">
        {{ item.startingdate.substring(0, 10) }}
        <!-- {{new Date(item.startingdate * 1000)}} -->
        <!-- {{
          moment(item.startingdate * 1000).calendar(
            "dddd, MMMM Do YYYY, h:mm:ss a"
          )
        }} -->

        <!-- {{
          moment(item.startingdate * 1000)
            .format("DD/MM/YYYY")
            .substring(0, 10)
        }} -->
      </template>
      <!--end Date -->
      <template v-slot:[`item.deadline`]="{ item }">
        {{ item.deadline.substring(0, 10) }}
        <!-- {{
          moment(item.deadline * 1000).calendar("dddd, MMMM Do YYYY, h:mm:ss a")
        }} -->

        <!-- {{
          moment(item.deadline * 1000)
            .format("DD/MM/YYYY") 
        }} -->
      </template>

      <!-- Avatar -->
      <template v-slot:[`item.logo`]="{ item }">
        <v-menu
          bottom
          min-width="150px"
          rounded
          offset-x
          open-on-hover
          transition="slide-x-transition"
        >
          <template v-slot:activator="{ on }">
            <v-avatar size="25" v-on="on" v-if="item.logo">
              <img
                :src="'http://localhost:8000/storage/' + item.logo"
                alt="alt"
                width="50"
              />
            </v-avatar>
            <v-avatar size="25" v-on="on" v-else>
              <img src="../../assets/default_logo.jpeg" alt="alt" width="50" />
            </v-avatar>
          </template>
          <v-card class="" v-if="item.logo">
            <img
              :src="'http://localhost:8000/storage/' + item.logo"
              alt="alt"
              width="150"
              height="150"
            />
          </v-card>
        </v-menu>
      </template>

      <!-- duration date -->
      <template v-slot:[`item.id`]="{ item, index }">
        <p class="m-1">{{ index + 1 }}</p>
      </template>

      <!-- project status -->
      <template v-slot:[`item.status`]="{ item, index }">
        <!-- {{ item.status }} -->
        <v-chip
          color="orange"
          small
          class="white--text"
          v-if="item.status == 'on progress'"
        >
          {{ item.status }}
        </v-chip>
        <v-chip
          color="green"
          small
          class="white--text"
          v-if="item.status == 'completed'"
        >
          {{ item.status }}
        </v-chip>
        <v-chip
          color="#039BE5"
          small
          class="white--text"
          v-if="item.status == 'on testing stage'"
        >
          {{ item.status }}
        </v-chip>
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
          @click="viewForm(item)"
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

      <template v-slot:footer>
        <v-row justify="end" class="mr-3  ma-0 pa-0 m-0 ">
          <pre>
            {{ testPagination }}
          </pre>
          <!-- <v-pagination
            class="text-right"
            v-model="pagination.localCurrentPage"
            :length="pagination.total"
            @input="onPageChange"
            total-visible="0"
          ></v-pagination> -->
        </v-row>
      </template>
      <!-- <template v-slot:[`footer.page-text`]>
        <v-pagination
          class="text-right"
          v-model="pagination.localCurrentPage"
          :length="pagination.total"
          @input="onPageChange"
          total-visible="0"
          
        ></v-pagination>
      </template> -->

     

      <template
        v-slot:footer.page-text="{
          pageStart,
          pageStop,
          page,
          itemsPerPage,
          pageCount,
          itemsLength,
        }"
      >
        <div class="d-flex align-center justify-center">
          <p class="pt-5">Items: {{ testPagination.from }} - {{ testPagination.total }}</p>

          <v-pagination
            class="text-right"
            v-model="pagination.localCurrentPage"
            :length="pagination.total"
            @input="onPageChange"
            total-visible="0"
          ></v-pagination>
        </div>
      </template>

      <template slot="actions-prepend">
        <div style="width:100%"><v-btn>action</v-btn>sdfsf</div>
        sdfsdf
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
          color="red darken-1"
        ></v-progress-linear>

        <div v-if="existData == 1">
          <p class="pa-2">RECODES NOT FOUND</p>
        </div>
      </template>
    </v-data-table>

    <!-- view data -->
    <v-dialog
      v-model="viewDialog"
      max-width="1200px"
      persistent
      content-class="form-dialog"
      scrollable
    >
      <v-card>
        <v-card-title class="indigo lighten-4">
          <span class="headline ">{{ viewData.title }}</span>
          <v-spacer></v-spacer>
          <v-icon @click="viewDialog = false">mdi-close</v-icon>
        </v-card-title>

        <v-card-text style="height: 800px;">
          <v-container>
            <v-row class="m-0">
              <!-- image -->
              <v-col md="3" sm="3" cols="12" class="  ma-0 pa-0 mt-4 ">
                <v-img
                  v-if="viewData.logo"
                  :src="'http://localhost:8000/storage/' + viewData.logo"
                  width="250"
                  height="250"
                  class="pa-0 ma-0"
                />
                <v-img
                  v-else
                  src="../../assets/default_logo.jpeg"
                  width="250"
                  height="250"
                  class=" ma-0"
                />
              </v-col>

              <!-- title & description -->
              <v-col md="9" sm="9" cols="12" class=" ma-0 pa-0 mt-4">
                <small>PROJECT TITLE :</small>
                <h2>{{ viewData.title }}</h2>
                <small>PROJECT DESCRIPTION :</small>
                <p class="text-justify" v-html="viewData.description"></p>
              </v-col>

              <!-- project , version, start date, deadline -->
              <!-- <v-col md="3" sm="12" cols="12" class=" mt-5 "> </v-col> -->
              <v-col
                md="2"
                sm="3"
                cols="12"
                class="ma-0 pb-0 pt-0 pl-0 d-flex align-center "
              >
                <p class="ml-5 pt-2">
                  <small>PROJECT VERSION: </small>
                  <span class="font-weight-bold">
                    {{ viewData.projectVersion }}
                  </span>
                </p>
              </v-col>
              <v-col
                md="3"
                sm="12"
                cols="12"
                class=" ma-0 pb-0 pt-0 pl-0 d-flex align-center  "
              >
                <p class="ml-5 pt-2">
                  <small>PROJECT STARTED: </small>
                  <span class="font-weight-bold">
                    {{ viewData.startingdate }}
                  </span>
                </p>
              </v-col>
              <v-col
                md="3"
                sm="12"
                cols="12"
                class="ma-0 pb-0 pt-0 pl-0 d-flex align-center"
              >
                <p class="ml-5 pt-2">
                  <small>PROJECT DEADLINE: </small>
                  <span class="font-weight-bold">{{ viewData.deadline }} </span>
                </p>
              </v-col>
              <v-col
                md="3"
                sm="3"
                cols="12"
                class="pa-0 ma-0 d-flex align-center  "
              >
                <p class="pt-2 ml-5">
                  <small>PROJECT STATUS: </small>
                  <v-chip
                    color="orange"
                    small
                    class="white--text"
                    v-if="viewData.status == 'on progress'"
                  >
                    {{ viewData.status }}
                  </v-chip>
                  <v-chip
                    color="green"
                    small
                    class="white--text"
                    v-if="viewData.status == 'completed'"
                  >
                    {{ viewData.status }}
                  </v-chip>

                  <v-chip
                    color="blue"
                    small
                    class="white--text"
                    v-if="viewData.status == 'on testing stage'"
                  >
                    {{ viewData.status }}
                  </v-chip>
                </p>
              </v-col>
            </v-row>

            <v-row class="m-0 ml-5">
              <!-- project status -->
              <!-- <v-col md="3" sm="12" cols="12" class=" mt-5 "> </v-col> -->

              <v-col
                md="2"
                sm="3"
                cols="12"
                class="pa-0 ma-0 d-flex align-center "
              >
                <p class="pt-2">
                  <small>PROJECT PRICE: </small>

                  <span class="font-weight-bold">
                    Rs. {{ viewData.cost }}
                  </span>
                </p>
              </v-col>

              <v-col
                md="9"
                sm="9"
                cols="12"
                class="pa-0 ma-0 d-flex align-center "
              >
                <p class="pt-2">
                  <small>DOCUMENTATION URL: </small>
                  <span class="font-weight-bold">
                    <a
                      :href="'https://' + viewData.documentationLink"
                      target="blank"
                    >
                      {{ viewData.documentationLink }}
                    </a>
                  </span>
                </p>
              </v-col>
            </v-row>

            <v-row class="m-0 ml-1">
              <v-col md="4" sm="4" cols="12" class=" ">
                <small class="">PROJECT INCHARGE</small>
                <v-card class="mt-1" max-width="400" tile flat>
                  <v-list-item class=" " dense two-line>
                    <v-list-item-content class="text-uppercase  p-1  ma-0">
                      <v-list-item-title>
                        name :
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ viewData.ic_name }}
                      </v-list-item-subtitle>
                      <v-list-item-title>
                        company :
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ viewData.ic_company }}
                      </v-list-item-subtitle>
                      <v-list-item-title>
                        address :
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ viewData.ic_address }}
                      </v-list-item-subtitle>
                      <v-list-item-title>
                        nic:
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ viewData.ic_nic }}
                      </v-list-item-subtitle>
                      <v-list-item-title>
                        email:
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ viewData.ic_email }}
                      </v-list-item-subtitle>
                      <v-list-item-title>
                        phone :
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ viewData.ic_phone }}
                      </v-list-item-subtitle>
                      <v-list-item-title>
                        position :
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ viewData.ic_role }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
                <!-- <v-simple-table>
                  <tr>
                    <td class="text-uppercase text-start ">name:</td>
                    <td class="text-uppercase text-start">
                      {{ viewData.ic_name }}
                    </td>
                  </tr>
                  <tr>
                    <td class="text-uppercase text-start ">company:</td>
                    <td class="text-uppercase text-start">
                      {{ viewData.ic_company }}
                    </td>
                  </tr>
                  <tr>
                    <td class="text-uppercase text-start ">address:</td>
                    <td class="text-uppercase text-start">
                      {{ viewData.ic_address }}
                    </td>
                  </tr>
                  <tr>
                    <td class="text-uppercase text-start">nic:</td>
                    <td class="text-uppercase text-start">
                      {{ viewData.ic_nic }}
                    </td>
                  </tr>
                  <tr>
                    <td class="text-uppercase text-start">email:</td>
                    <td class="text-uppercase text-start">
                      {{ viewData.ic_email }}
                    </td>
                  </tr>
                  <tr>
                    <td class="text-uppercase text-start">phone:</td>
                    <td class="text-uppercase text-start">
                      {{ viewData.ic_phone }}
                    </td>
                  </tr>
                  <tr>
                    <td class="text-uppercase text-start">position:</td>
                    <td class="text-uppercase text-start">
                      <span>{{ viewData.ic_role }}</span>
                    </td>
                  </tr>
                </v-simple-table> -->

                <div
                  class="mt-3"
                  v-if="
                    viewData.specialNote ||
                      viewData.remark ||
                      viewData.specialNote
                  "
                >
                  <small>TEAM MEMBERS - {{ viewData.TeamMemberCount }}</small>
                  <v-card class="mt-1" max-width="400" tile flat>
                    <v-list-item
                      two-line
                      v-for="(i, k) in viewData.TeamMembers"
                      :key="k"
                    >
                      <v-list-item-content class="text-uppercase ">
                        <v-list-item-title>
                          {{ k + 1 + "." }} {{ i.members_name }}
                        </v-list-item-title>
                        <v-list-item-subtitle class="pl-4">
                          {{ i.member_role }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-card>
                </div>
              </v-col>
              <v-col md="8" sm="8" cols="12" class="  ">
                <div v-if="viewData.features">
                  <h6>FEATURES :</h6>
                  <p class="text-justify" v-html="viewData.features"></p>
                </div>

                <div v-if="viewData.remark">
                  <h6>REMARK :</h6>
                  <p class="text-justify" v-html="viewData.remark"></p>
                </div>
                <div v-if="viewData.specialNote">
                  <h6>SPECIAL NOTES :</h6>
                  <p class="text-justify" v-html="viewData.specialNote"></p>
                </div>

                <div
                  v-if="
                    !viewData.specialNote &&
                      !viewData.remark &&
                      !viewData.specialNote
                  "
                >
                  <small>TEAM MEMBERS - {{ viewData.TeamMemberCount }}</small>
                  <v-card class="mt-1" max-width="400" tile flat>
                    <v-list-item
                      two-line
                      v-for="(i, k) in viewData.TeamMembers"
                      :key="k"
                    >
                      <v-list-item-content class="text-uppercase ">
                        <v-list-item-title>
                          {{ k + 1 + "." }} {{ i.members_name }}
                        </v-list-item-title>
                        <v-list-item-subtitle class="pl-4">
                          {{ i.member_role }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-card>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import DashboardLayout from "../../components/DashboardLayout";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { VueEditor } from "vue2-editor";
import moment from "moment";
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
    page: {},
    dataTableLoading: true,
    viewDialog: false,
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
        class: "grey--text ",
      },
      {
        text: "logo",
        align: "center",
        sortable: false,
        value: "logo",
        width: "5%",
        class: "grey--text ",
      },
      {
        text: "project",
        align: "start",
        sortable: true,
        value: "title",
        class: "grey--text ",
      },
      {
        text: "starting date",
        value: "startingdate",
        width: "8%",
        align: "center",
        class: "grey--text ",
      },
      {
        text: "deadline",
        value: "deadline",
        width: "7%",
        align: "center",
        class: "grey--text ",
      },

      {
        text: "duration",
        value: "duration",
        width: "6%",
        align: "center",
        class: "grey--text ",
      },

      {
        text: "Incharge",
        value: "incharge_name",
        width: "10%",
        align: "center",
        class: "grey--text ",
      },
      // {
      //   text: "Team Members",
      //   value: "memberCount",
      //   width: "8%",
      //   align: "center",
      // },

      {
        text: "status",
        value: "status",
        width: "10%",
        align: "center",
        class: "grey--text ",
      },
      {
        text: "version",
        value: "projectVersion",
        width: "7%",
        align: "end",
        class: "grey--text ",
      },

      {
        text: "cost",
        value: "cost",
        width: "10%",
        align: "end",
        class: "grey--text ",
      },

      {
        text: "Actions",
        value: "actions",
        sortable: false,
        width: "8%",
        align: "center",
        class: "grey--text ",
      },
    ],
    projects: [],
    editedIndex: -1,
    editedItem: {
      id: "",
      title: "",
      status: "",
      deadline: "",
      startingdate: "",
      projectVersion: "",
      teamMembers_id: [],
      projectIncharge: [],
      incharge_name: "",
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
      status: "",
      deadline: "",
      startingdate: "",
      projectVersion: "",
      teamMembers_id: [],
      projectIncharge: [],
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
    teamMembers: [],
    selectedTeam: [],
    selectedIncharge: [],
    moment: moment,
    pagination: {
      current: 1,
      localCurrentPage: parseInt(localStorage.getItem("paginateKey")),
      total: 1,
    },
    viewData: {},
    testPagination: {
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
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Project" : "Edit ";
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
    // this.initialize();
    this.paginateData();
    this.headers = Object.values(this.headersMap);
    this.selectedHeaders = this.headers;
  },
  mounted() {
    // this.viewForm();
    localStorage.setItem("paginateKey", 1);
  },

  methods: {
    viewForm(item) {
      console.log("aaa", item);
      let url = "url_projects/view/" + item.id;
      // let url = "url_projects/view/" + 21;
      this.$http
        .get(url)
        .then((response) => {
          console.log("viewForm", response);

          response.data.viewData.forEach((element) => {
            console.log("view data", element);

            this.viewData = {
              TeamMemberCount: response.data.TeamMemberCount,
              TeamMembers: response.data.TeamMembers,
              logo: element.logo,
              title: element.title,
              description: element.description,
              projectVersion: element.projectVersion,
              status: element.status,
              cost: element.cost,
              documentationLink: element.documentationLink,
              startingdate: moment(element.startingdate * 1000)
                .format("YYYY/MM/DD")
                .substr(0, 10),
              deadline: moment(element.deadline * 1000)
                .format("YYYY/MM/DD")
                .substr(0, 10),

              ic_name: element.ic_name,
              ic_company: element.ic_company,
              ic_nic: element.ic_nic,
              ic_address: element.ic_address,
              ic_email: element.ic_email,
              ic_phone: element.ic_phone,
              ic_role: element.ic_role,

              specialNote: element.specialNote,
              remark: element.remark,
              features: element.features,
            };
            this.viewDialog = true;
          });
        })
        .catch((response) => {
          console.log("Error Fround. data cant get", response);
        });
    },
    refresh() {
      // this.initialize();
      this.paginateData();
    },
    onPageChange(e) {
      // console.log(e)
      localStorage.setItem("paginateKey", e);
      this.paginateData();
    },
    paginateData() {
      this.dataTableLoading = true;
      this.projects.splice(0);
      this.$http
        .get("url_projects?page=" + localStorage.getItem("paginateKey"))
        .then((res) => {
          console.log("ppp", res.data);

          this.testPagination = {
            first_page_url: res.data.projects.first_page_url,
            from: res.data.projects.from,
            last_page: res.data.projects.last_page,
            last_page_url: res.data.projects.last_page_url,
            next_page_url: res.data.projects.next_page_url,
            path: res.data.projects.path,
            per_page: res.data.projects.per_page,
            prev_page_url: res.data.projects.prev_page_url,
            to: res.data.projects.to,
            total: res.data.projects.total,
            links: res.data.projects.links.forEach((element) => {
              element;
            }),
          };
          this.pagination.total = res.data.projects.last_page;

          //----------------------

          res.data.members.forEach((element) => {
            this.teamMembers.push(element);
          });

          res.data.projects.data.forEach((element) => {
            this.projects.push({
              id: element.project_id,
              memberCount: element.user_count,
              title: element.title,
              status: element.status,
              // deadline: element.deadline,
              // startingdate: element.startingdate,
              startingdate: moment(element.startingdate * 1000).format(
                "DD/MM/YYYY"
              ),
              deadline: moment(element.deadline * 1000).format("YYYY/MM/DD"),
              projectVersion: element.projectVersion,
              teamMembers_id: element.teamMembers_id,
              projectIncharge: element.projectIncharge,
              incharge_name: element.incharge_name,
              documentationLink: element.documentationLink,
              cost: element.cost,
              description: element.description,
              features: element.features,
              notes: element.notes,
              specialNote: element.specialNote,
              remark: element.remark,
              notes: element.notes,
              logo: element.logo,
              // duration: this.dateDiffInDays(
              //   new Date(Date()),
              //   new Date(element.deadline)
              // ),
              duration: this.momementDaateDiff(
                element.startingdate,
                moment(new Date()).format("DD-MM-YYYY"),
                moment(element.deadline * 1000).format("DD/MM/YYYY")
              ),
            });
          });
          this.dataTableLoading = false;
        });
    },
    onSearch(e) {
      // console.log(e)
      let url = "url_projects/find/" + e;

      if (this.search.length > 0) {
        console.log("find");
        this.$http.get(url).then((res) => {
          if (res.data.projects.data.length > 0) {
            console.log("have data");
            res.data.projects.data.forEach((element) => {
              this.projects.splice(0);
              this.projects.push({
                id: element.project_id,
                memberCount: element.user_count,
                title: element.title,
                status: element.status,
                // deadline: element.deadline,
                // startingdate: element.startingdate,
                startingdate: moment(element.startingdate * 1000).format(
                  "DD/MM/YYYY"
                ),
                deadline: moment(element.deadline * 1000).format("YYYY/MM/DD"),
                projectVersion: element.projectVersion,
                teamMembers_id: element.teamMembers_id,
                projectIncharge: element.projectIncharge,
                incharge_name: element.incharge_name,
                documentationLink: element.documentationLink,
                cost: element.cost,
                description: element.description,
                features: element.features,
                notes: element.notes,
                specialNote: element.specialNote,
                remark: element.remark,
                notes: element.notes,
                logo: element.logo,
                // duration: this.dateDiffInDays(
                //   new Date(Date()),
                //   new Date(element.deadline)
                // ),
                duration: this.momementDaateDiff(
                  element.startingdate,
                  moment(new Date()).format("DD-MM-YYYY"),
                  moment(element.deadline * 1000).format("DD/MM/YYYY")
                ),
              });
            }, 4000);
          } else {
            console.log("no data");
            this.projects.splice(0);
            this.existData = 1;
          }
        }, 4000);
      } else {
        console.log("dont");
        this.paginateData();
      }
    },
    dateDiffInDays(date1, date2) {
      return Math.round((date2 - date1) / (1000 * 60 * 60 * 24));
    },
    momementDaateDiff(s_date, c_date, d_line) {
      let startDate = moment(d_line, "DD/MM/YYYY");
      let currenDate = moment(new Date()).format("DD/MM/YYYY");
      let endDate = moment(currenDate, "DD/MM/YYYY");

      return startDate.diff(endDate, "days");
    },
    initialize() {
      this.projects.splice(0);
      let url = "url_projects";
      this.$http
        .get(url)
        .then((response) => {
          console.log(response);
          response.data.members.forEach((element) => {
            // console.log(element);
            this.teamMembers.push(element);
          });
          response.data.projects.forEach((element) => {
            // console.log(element);
            // this.projects.push(element);
            this.projects.push({
              id: element.project_id,
              memberCount: element.user_count,
              title: element.title,
              status: element.status,
              // deadline: element.deadline,
              // startingdate: element.startingdate,
              startingdate: moment(element.startingdate * 1000).format(
                "DD/MM/YYYY"
              ),
              deadline: moment(element.deadline * 1000).format("YYYY/MM/DD"),
              projectVersion: element.projectVersion,
              teamMembers_id: element.teamMembers_id,
              projectIncharge: element.projectIncharge,
              incharge_name: element.incharge_name,
              documentationLink: element.documentationLink,
              cost: element.cost,
              description: element.description,
              features: element.features,
              notes: element.notes,
              specialNote: element.specialNote,
              remark: element.remark,
              notes: element.notes,
              logo: element.logo,
              // duration: this.dateDiffInDays(
              //   new Date(Date()),
              //   new Date(element.deadline)
              // ),
              duration: this.momementDaateDiff(
                element.startingdate,
                moment(new Date()).format("DD-MM-YYYY"),
                moment(element.deadline * 1000).format("DD/MM/YYYY")
              ),
            });
          });

          console.log("data count", this.projects.length);
          if (this.projects.length <= 0) {
            // console.log("no data");
            this.existData = 1;
          } else {
            // console.log("have data");
            this.existData = -1;
          }
        })
        .catch((response) => {
          // console.log("response");
        });
    },

    newDialog() {
      this.dialog = true;
      this.profileLogo.splice(0);
      this.selectedIncharge.splice(0);
      this.selectedTeam.splice(0);
      this.avatar = {};
      this.$nextTick(() => {
        this.$refs.form.reset();
        console.log("cleared");
      });
    },

    editItem(item) {
      console.log(item);
      this.editedIndex = this.projects.indexOf(item);
      this.selectedTeam.splice(0);
      this.selectedIncharge.splice(0);

      let url = "url_projects/" + item.id;
      this.$http
        .get(url)
        .then((response) => {
          console.log(response.data);
          this.selectedIncharge.push({
            member_id: response.data.data[0].incharge_id,
            members_name: response.data.data[0].incharge_name,
          });
          response.data.data.forEach((element) => {
            console.log(element);
            this.selectedTeam.push(element);
            // this.selectedIncharge.push(element.incharge_name);
            this.editedItem = {
              id: element.project_id,
              title: element.title,
              // deadline: element.deadline,
              // startingdate: element.startingdate,

              startingdate: moment(element.startingdate * 1000)
                .add(1, "d")
                .toISOString()
                .substr(0, 10),
              deadline: moment(element.deadline * 1000)
                .add(1, "d")

                .toISOString()
                .substr(0, 10),
              // moment(element.deadline * 1000).format("YYYY/MM/DD")
              status: element.status,

              projectVersion: element.projectVersion,
              documentationLink: element.documentationLink,
              cost: element.cost,
              description: element.description,
              features: element.features,
              specialNote: element.specialNote,
              remark: element.remark,
              logo: element.logo,
            };

            this.dialog = true;
          });
        })
        .catch((response) => {
          console.log("Error Fround. data cant get", response);
        });

      // this.editedIndex = this.projects.indexOf(item);
      // this.editedItem = Object.assign({}, item);
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
          // this.initialize();
          this.paginateData();
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

          const tes_arr = [];
          this.selectedTeam.forEach((element) => {
            tes_arr.push(element.member_id);
          });

          console.log(tes_arr);

          Object.assign(this.projects[this.editedIndex], this.editedItem);
          const update = {
            title: this.editedItem.title,
            status: this.editedItem.status,
            // deadline: this.editedItem.deadline,
            // startingdate: this.editedItem.startingdate,
            startingdate: moment(this.editedItem.startingdate).format("X"),
            deadline: moment(this.editedItem.deadline).format("X"),
            projectVersion: this.editedItem.projectVersion,
            // teamMembers_id: this.selectedTeam,
            teamMembers_id: tes_arr,
            member_count: this.selectedTeam.length,
            projectIncharge: this.selectedIncharge[0]["member_id"],
            documentationLink: this.editedItem.documentationLink,
            cost: this.editedItem.cost,
            description: this.editedItem.description,
            features: this.editedItem.features,
            notes: this.editedItem.notes,
            remark: this.editedItem.remark,
            logo: this.profileLogo[0],
            specialNote: this.editedItem.specialNote,
          };

          let url = "url_projects/" + this.editedItem.id;
          console.log(url);
          this.$http
            .put(url, update)
            .then((response) => {
              console.log(response.data);
              // this.initialize();
              this.paginateData();
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
            // deadline: this.editedItem.deadline,
            // startingdate: this.editedItem.startingdate,
            startingdate: moment(this.editedItem.startingdate).format("X"),
            deadline: moment(this.editedItem.deadline).format("X"),

            projectVersion: this.editedItem.projectVersion,
            teamMembers_id: this.selectedTeam,
            member_count: this.editedItem.teamMembers_id.length,
            projectIncharge: this.selectedIncharge,
            documentationLink: this.editedItem.documentationLink,
            cost: this.editedItem.cost,
            description: this.editedItem.description,
            features: this.editedItem.features,
            notes: this.editedItem.notes,
            remark: this.editedItem.remark,
            logo: this.profileLogo[0],
            specialNote: this.editedItem.specialNote,
          };

          console.log(save);

          let url = "url_projects";
          this.$http
            .post(url, save)
            .then((response) => {
              console.log(response.data);
              // this.initialize();
              this.paginateData();
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

<style lang="scss">
.table-header {
  thead {
    background-color: red;
  }
}
</style>
