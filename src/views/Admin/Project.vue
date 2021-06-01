<template>
  <div id="Projects">
    <!-- Layout -->
    <DashboardLayout />
    <v-card color="pa-0" tile flat>
      <v-data-table
        :headers="headers"
        :items="projects"
        :fixed-header="true"
        :loading="dataTableLoading"
        :footer-props="{
          'items-per-page-options': [pagination.total],
          prevIcon: '',
          nextIcon: '',
        }"
        id="dt_table"
        height="85vh"
        class="elevation-0"
        dense
        loading-text="Fetching Data"
        disable-pagination
        style="z-index:1000;"
      >
        <!-- DataTable Header -->

        <template v-slot:top>
          <v-toolbar flat id="toolbar">
            <v-toolbar-title class="h6" id="v_table_title_size">
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
                {{ $t("projects.title") }}
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
                  :loading="exportExecelLoading"
                >
                  EXPORT EXCEL
                </v-btn>
              </v-list>
            </v-menu>

            <!-- SELECT OPTION FOR EXPORT TO PDF -->
            <v-menu bottom right :close-on-content-click="false">
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon small v-bind="attrs" v-on="on">
                  <v-icon small>mdi-file-pdf</v-icon>
                </v-btn>
              </template>

              <v-list>
                <v-list-item-content
                  v-for="(item, i) in pdfTitles"
                  :key="i"
                  dense
                  class="pl-4 pr-4 pt-0 pb-0 ma-0"
                >
                  <v-checkbox
                    class="pa-0 ma-0  "
                    hide-details=""
                    v-model="selectedPDFTitle"
                    :label="item"
                    :value="item"
                  ></v-checkbox>
                </v-list-item-content>

                <v-list dense>
                  <v-subheader>Choose Layout</v-subheader>
                  <v-radio-group
                    v-model="pdfLayout"
                    mandatory
                    class="ma-0 ml-1 mr-1"
                  >
                    <v-radio label="landscape" value="l"></v-radio>
                    <v-radio label="portrait" value="p"></v-radio>
                  </v-radio-group>
                </v-list>

                <v-btn
                  small
                  @click="exportToPdf"
                  :color="DTbtnColor"
                  :loading="exportPDFLoading"
                  dark
                  class="mb-4 ml-4 mr-4"
                >
                  EXPORT PDF
                </v-btn>
              </v-list>
            </v-menu>

            <!-- COPY TO Clipboard -->
            <v-btn icon small @click="onClipboard">
              <v-icon small>mdi-clipboard-edit-outline</v-icon>
            </v-btn>
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
              :color="DTbtnColor"
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
              @shortkey="newDialog()"
              @click="newDialog"
              v-show="appAccess >= 2"
            >
              <!-- v-if="access_role != 1 && access_role != 0" -->
              <v-icon left dark class=""> mdi-plus </v-icon>

              <span class="v_toolbar_add_button_text">
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
                                  :label="
                                    errors[0] ? errors[0] : 'started date'
                                  "
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
                              :label="
                                errors[0] ? errors[0] : 'Project Incharge'
                              "
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
                  <strong>{{ editedItem.title }}</strong> ?
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="formDeleteModel = false"
                  >
                    CANCEL
                  </v-btn>

                  <v-btn color="red darken-1" text @click="onDeleteConfirm">
                    DELETE
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>

        <!-- index id -->
        <template v-slot:[`item.id`]="{ item, index }">
          <div class="d-flex  index_id_column">
            <div
              class="chip_bar_on_progress"
              v-if="item.status == 'on progress'"
              :title="'project ' + item.status"
            ></div>

            <div
              class="chip_bar_on_complete"
              v-if="item.status == 'completed'"
              :title="'project ' + item.status"
            ></div>

            <div
              class="chip_bar_on_test"
              v-if="item.status == 'on testing stage'"
              :title="'project ' + item.status"
            ></div>

            <span class="ma-0 pa-0 mt-2">{{ index + 1 }}</span>
          </div>
        </template>

        <!--Start Date -->
        <template v-slot:[`item.startingdate`]="{ item }">
          {{ item.startingdate.substring(0, 10) }}
        </template>

        <!--end Date -->
        <template v-slot:[`item.deadline`]="{ item }">
          {{ item.deadline.substring(0, 10) }}
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
                <img
                  src="../../assets/default_logo.jpeg"
                  alt="alt"
                  width="50"
                />
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

        <!-- project status -->
        <!--<template v-slot:[`item.status`]="{ item, index }">
               <v-chip color="orange" small class="white--text" v-if="item.status == 'on progress'">
               {{ item.status }}
              </v-chip>
              <v-chip color="green" small class="white--text" v-if="item.status == 'completed'">
              {{ item.status }}
              </v-chip>
             <v-chip color="#039BE5" small class="white--text" v-if="item.status == 'on testing stage'">
            {{ item.status }}
            </v-chip>
            </template>-->

        <!-- duration -->
        <template v-slot:[`item.duration`]="{ item }">
          <p
            class="ma-0  red--text"
            v-if="item.duration.toString().substring(0, 1) == '-'"
          >
            {{
              item.duration.toString().substring(0, 1) == "-"
                ? "(" + item.duration + ")"
                : null
            }}
            Days
          </p>

          <p class="ma-0" v-else>
            {{
              item.duration.toString().substring(0, 1) == "-"
                ? null
                : item.duration
            }}
            Days
          </p>
        </template>

        <!-- Table Action -->
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            id="dt-view-action-button"
            small
            dark
            class="mr-1 blue darken-1  pa-1"
            title="View Projects"
            @click="viewForm(item)"
          >
            mdi-eye
          </v-icon>

          <v-icon
            id="dt-edit-action-button"
            small
            dark
            title="Edit Projects"
            class="mr-1 orange darken-1 pa-1"
            @click="editItem(item)"
            v-show="appAccess >= 3"
          >
            mdi-pencil
          </v-icon>
          <!-- <div class="pa-0 ma-0"  > -->

          <v-icon
            id="dt-trash-action-button"
            small
            title="Delete Projects"
            dark
            class="red darken-1 pa-1"
            @click="deleteItem(item)"
            v-show="appAccess >= 4"
          >
            mdi-delete
          </v-icon>
          <!-- </div> -->
        </template>

        <!-- body append -->
        <!-- <template slot="body.append">
          <tr
            class="pink--text text-end"
            :class="{ 'v-data-table__mobile-table-row': isMobile }"
          >
            <th
              id="th_sum-1"
              class=""
              :colspan="`${isMobile ? 6 : 1}`"
              :class="{ 'v-data-table__mobile-row': isMobile }"
              v-if="!isMobile"
            ></th>

            <th
              id="th_sum-2"
              class=""
              :colspan="`${isMobile ? 6 : 1}`"
              :class="{ 'v-data-table__mobile-row': isMobile }"
              v-if="!isMobile"
            ></th>

            <th
              id="th_sum-3"
              class=""
              :colspan="`${isMobile ? 6 : 1}`"
              :class="{ 'v-data-table__mobile-row': isMobile }"
              v-if="!isMobile"
            ></th>

            <th
              id="th_sum-4"
              class=""
              :colspan="`${isMobile ? 6 : 1}`"
              :class="{ 'v-data-table__mobile-row': isMobile }"
              v-if="!isMobile"
            ></th>

            <th
              id="th_sum-5"
              class=""
              :colspan="`${isMobile ? 6 : 1}`"
              :class="{ 'v-data-table__mobile-row': isMobile }"
              v-if="!isMobile"
            ></th>

            <th
              id="th_sum-6"
              class=""
              :colspan="`${isMobile ? 6 : 1}`"
              :class="{ 'v-data-table__mobile-row': isMobile }"
              v-if="!isMobile"
            ></th>

            <th
              id="th_sum-8"
              class=""
              :colspan="`${isMobile ? 6 : 1}`"
              :class="{ 'v-data-table__mobile-row': isMobile }"
              v-if="!isMobile"
            ></th>

            <th
              id="th_sum-9"
              class="text-end"
              :colspan="`${isMobile ? 6 : 1}`"
              :class="{ 'v-data-table__mobile-row': isMobile }"
            >
              TOTAL
            </th>

            <th
              id="th_sum-10"
              class="text-end total"
              :colspan="`${isMobile ? 6 : 1}`"
              :class="{ 'v-data-table__mobile-row': isMobile }"
            >
              Rs. {{ sumField("cost") }}
            </th>

            <th
              id="th_sum-7"
              class=""
              :colspan="`${isMobile ? 6 : 1}`"
              :class="{ 'v-data-table__mobile-row': isMobile }"
              v-if="!isMobile"
            ></th>
          </tr>
        </template> -->

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
          >
          </v-progress-linear>

          <div v-if="existData == 1">
            <p class="pa-2">RECODES NOT FOUND</p>
          </div>
        </template>
      </v-data-table>
    </v-card>

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

              <!-- project version -->
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

              <!-- project started  -->
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

              <!-- project deadline -->
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

              <!-- project status  -->
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
              <!-- project price -->
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

              <!-- documentation url -->
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
              <!-- incharge info -->
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

                <!-- Display Team members below the incharge details if project remark and note are exsist -->
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
                        <!-- <v-list-item-subtitle class="pl-4">
                          {{ i.member_role }}
                        </v-list-item-subtitle> -->
                      </v-list-item-content>
                    </v-list-item>
                  </v-card>
                </div>
              </v-col>

              <v-col md="8" sm="8" cols="12" class="  ">
                <!-- project features -->
                <div v-if="viewData.features">
                  <h6>FEATURES :</h6>
                  <p class="text-justify" v-html="viewData.features"></p>
                </div>

                <!-- remark -->
                <div v-if="viewData.remark">
                  <h6>REMARK :</h6>
                  <p class="text-justify" v-html="viewData.remark"></p>
                </div>

                <!-- special note -->
                <div v-if="viewData.specialNote">
                  <h6>SPECIAL NOTES :</h6>
                  <p class="text-justify" v-html="viewData.specialNote"></p>
                </div>

                <!-- display team member if remark and note are doesn't exsist -->
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
import { json2excel, excel2json } from "js2excel";
import { VueEditor } from "vue2-editor";
import moment from "moment";
import { jsPDF } from "jspdf";
export default {
  name: "Projects",
  components: {
    DashboardLayout,
    ValidationObserver,
    ValidationProvider,
    VueEditor,
  },
  data: () => ({
    headersList: [],
    DTbtnColor: "indigo lighten-1 ",
    ModelHeaderColor: "indigo lighten-4",

    moment: moment,
    search: "",
    permissions: [],
    excelTitles: [],
    selectedExcelTitle: [],

    page: {},
    avatar: {},
    viewData: {},

    headers: [],
    projects: [],
    selectedHeaders: [],
    profileLogo: [],
    teamMembers: [],
    selectedTeam: [],
    selectedIncharge: [],
    statusItems: ["on progress", "on testing stage", "completed"],

    dataTableFullscreen: false,
    dataTableLoading: true,
    exportExecelLoading: false,
    exportPDFLoading: false,
    viewDialog: false,
    dialog: false,
    formDeleteModel: false,
    picker1: false,
    picker2: false,
    superAdmin: false,
    pdfLayout: null,

    appAccess: 0, //ACCESS PERMISSION FOR Users

    editedIndex: -1,
    existData: -1,
    snackbar: {
      show: false,
      time: 3000,
      message: "",
      color: "",
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
      ["clean"],
    ],
    headersMap: [
      {
        text: "#",
        align: "center",
        sortable: true,
        value: "id",
        align: "center",
        // width: "4",
        // class: "bg-danger",
      },
      {
        text: "logo",
        align: "center",
        sortable: false,
        value: "logo",
        // width: "5",
        // class: "bg-info",
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
        // width: "8%",
        align: "center",
      },
      {
        text: "deadline",
        value: "deadline",
        // width: "7%",
        align: "center",
      },

      {
        text: "duration",
        value: "duration",
        // width: "6%",
        align: "center",
      },

      {
        text: "Incharge",
        value: "incharge_name",
        // width: "10%",
        align: "center",
      },
      {
        text: "version",
        value: "projectVersion",
        // width: "7%",
        align: "end",
      },

      {
        text: "cost",
        value: "cost",
        // width: "10%",
        align: "end",
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
    pagination: {
      current: 1,
      localCurrentPage: parseInt(localStorage.getItem("project_pk")),
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
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Project" : "Edit ";
    },
    showHeaders() {
      return this.headers.filter((s) => this.selectedHeaders.includes(s));
    },
    isMobile() {
      return this.$vuetify.breakpoint.name === "xs";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    formDeleteModel(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.onInitialize();
    this.datatableColumnVisibility();
  },
  beforeMount() {
    this.onAccessPermission();
    this.onInitializeExportColumns();
  },
  mounted() {
    localStorage.setItem("project_pk", 1);
  },

  methods: {
    datatableColumnVisibility() {
      let x = JSON.parse(localStorage.getItem("project_active_columns"));
      let y = this.headersMap.slice(1, -1);

      y.forEach((element) => {
        this.headersList.push(element);
      });

      if (x == null) {
        let obj = this.headersMap;
        let result = obj.map((col) => col.value);
        localStorage.setItem("project_active_columns", JSON.stringify(result));

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
    onChangeColumn(e) {
      this.headers.splice(0);
      localStorage.setItem("project_active_columns", JSON.stringify(e));
      let headersMap = this.headersMap;
      let selected_arr = e;
      let filtered = headersMap.filter(({ value }) =>
        selected_arr.includes(value)
      );

      filtered.forEach((element) => {
        this.headers.push(element);
      });

      console.log("onChangeColumn", e);
    },
    onClipboard() {
      let jsonObject = JSON.stringify(this.projects);
      navigator.clipboard.writeText(jsonObject);
    },
    exportToExcel() {
      this.exportExecelLoading = true;
      let objects = [];
      this.projects.forEach((element) => {
        objects.push(element);
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
      let fileName = this.moment().unix() + "_projects_file";
      try {
        json2excel({
          data,
          name: fileName,
          formateDate: "yyyy/mm/dd",
        });
        this.notification(
          fileName + " has been exported successfully",
          "green"
        );

        setTimeout(() => {
          this.exportExecelLoading = false;
        }, 4000);
      } catch (e) {
        console.error("export error");
        this.exportExecelLoading = false;
        this.notification(fileName + " Export Failed. Please try again", "red");
      }
    },
    exportToPdf() {
      this.exportPDFLoading = true;
      let fileName = this.moment().unix() + "_projetcs_file";

      try {
        let user = JSON.parse(localStorage.getItem("user"));
        let header = [];
        let data = [];
        let jsonObject = data;
        let selectedArray = this.selectedPDFTitle;

        const pdf = new jsPDF({
          orientation: this.pdfLayout,
          unit: "mm",
          format: "a4",
          putOnlyUsedFonts: true,
          compress: true,
          // encryption: {
          //   userPassword: user.phone,
          //   ownerPassword: "admin",
          //   userPermissions: ["print", "modify", "copy", "annot-forms"],
          // },
        });

        this.selectedPDFTitle.forEach((element, key) => {
          header.push(element);
        });
        this.projects.forEach((element) => {
          data.push({
            id: element.id,
            cost: element.cost.toString(),
            projectVersion: element.projectVersion,
            incharge_name: element.incharge_name,
            duration: element.duration.toString(),
            deadline: element.deadline,
            logo: element.logo,
            title: element.title,
            startingdate: element.startingdate,
          });
        });

        let filteredData = jsonObject.map(function(entry) {
          return selectedArray.reduce(function(res, key) {
            res[key] = entry[key];
            return res;
          }, {});
        });

        let headerConfig = header.map((key) => ({
          name: key,
          prompt: key,
          width: 47,
          align: "center",
          padding: 0,
        }));

        let ColumnConfig = {
          headerBackgroundColor: "#c5cae9",
          fontSize: 10,
          autoSize: false,
        };

        pdf.table(5, 5, filteredData, headerConfig, ColumnConfig);
        pdf.autoPrint({ variant: "non-conform" });
        pdf.save(fileName + ".pdf");

        this.notification(" has been exported successfully", "green");

        setTimeout(() => {
          this.exportPDFLoading = false;
        }, 4000);
      } catch (e) {
        console.error("export error", e);
        this.exportPDFLoading = false;
        this.notification(fileName + " Export Failed. Please try again", "red");
      }
    },
    onInitializeExportColumns() {
      this.excelTitles = [
        "id",
        "cost",
        "projectVersion",
        "incharge_name",
        "duration",
        "deadline",
        "logo",
        "title",
        "startingdate",
      ];
      this.pdfTitles = [
        "id",
        "cost",
        "projectVersion",
        "incharge_name",
        "duration",
        "deadline",
        "logo",
        "title",
        "startingdate",
      ];

      // let columns = [];
      this.selectedExcelTitle = this.excelTitles;
      this.selectedPDFTitle = this.pdfTitles;
    },
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
    focusSearchKey() {
      console.log("a");
      this.$refs.searchbar_ref.$refs.input.focus();
      console.log("b");
    },
    sumField(key) {
      // sum data in give key (property)
      return this.projects.reduce((a, b) => a + (b[key] || 0), 0);
    },
    viewForm(item) {
      console.log("aaa", item);
      let url = "projects/view/" + item.id;
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
      this.onInitialize();
    },
    onPageChange(e) {
      // console.log(e)
      localStorage.setItem("project_pk", e);
      this.onInitialize();
    },
    onInitialize() {
      this.dataTableLoading = true;
      this.$http
        .get("projects?page=" + localStorage.getItem("project_pk"))
        .then((res) => {
          console.log("ppp", res.data.projects.data);
          // if ( res.data.projects.data.length < 1) {
          //   this.existData = 1;
          // } else {

          // }
          this.projects.splice(0);
          this.dtPagination = {
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
          res.data.members.forEach((element) => {
            this.teamMembers.push(element);
          });

          res.data.projects.data.forEach((element) => {
            this.projects.push({
              id: element.project_id,
              memberCount: element.user_count,
              title: element.title,
              status: element.status,
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
              duration: this.momementDaateDiff(
                element.startingdate,
                moment(new Date()).format("DD-MM-YYYY"),
                moment(element.deadline * 1000).format("DD/MM/YYYY")
              ),
            });
          });
          this.dataTableLoading = false;
        })
        .catch((err) => {
          console.log("catch ");
          this.dataTableLoading = false;
          this.existData = 1;
          if (err.response) {
            this.$gl.Unauthorized(err.response.status);
          }
        });
    },
    onSearch(e) {
      // console.log(e)
      let url = "projects/find/" + e;

      if (this.search.length > 0) {
        console.log("find");
        this.$http.get(url).then((res) => {
          if (res.data.projects.data.length > 0) {
            console.log("have data");
            this.projects.splice(0);
            res.data.projects.data.forEach((element) => {
              this.projects.push({
                id: element.project_id,
                memberCount: element.user_count,
                title: element.title,
                status: element.status,
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
            this.onInitialize();
            this.dataTableLoading = false;
            this.existData = 1;
          }
        }, 4000);
      } else {
        console.log("dont");
        this.projects.splice(0);
        this.onInitialize();
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
      let url = "projects";
      this.$http
        .get(url)
        .then((response) => {
          console.log(response);
          response.data.members.forEach((element) => {
            this.teamMembers.push(element);
          });
          response.data.projects.forEach((element) => {
            this.projects.push({
              id: element.project_id,
              memberCount: element.user_count,
              title: element.title,
              status: element.status,
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
              duration: this.momementDaateDiff(
                element.startingdate,
                moment(new Date()).format("DD-MM-YYYY"),
                moment(element.deadline * 1000).format("DD/MM/YYYY")
              ),
            });
          });

          console.log("data count", this.projects.length);
          if (this.projects.length <= 0) {
            this.existData = 1;
          } else {
            this.existData = -1;
          }
        })
        .catch((response) => {
          // console.log(response);
        });
    },

    newDialog() {
      // this.close();
      this.dialog = true;
      // this.profileLogo.splice(0);
      // this.selectedIncharge.splice(0);
      // this.selectedTeam.splice(0);
      // this.avatar = {};
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
      let url = "projects/" + item.id;
      this.$http
        .get(url)
        .then((response) => {
          console.log("getzxc", response.data);
          this.selectedIncharge.push({
            member_id: response.data.data[0].incharge_id,
            members_name: response.data.data[0].incharge_name,
          });
          response.data.data.forEach((element) => {
            // console.log(element);
            this.selectedTeam.push(element);
            this.editedItem = {
              id: element.project_id,
              title: element.title,
              startingdate: moment(element.startingdate * 1000)
                .add(1, "d")
                .toISOString()
                .substr(0, 10),
              deadline: moment(element.deadline * 1000)
                .add(1, "d")

                .toISOString()
                .substr(0, 10),
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
    },

    deleteItem(item) {
      this.editedIndex = this.projects.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.formDeleteModel = true;
      console.log(this.editedItem);
    },

    onDeleteConfirm() {
      this.projects.splice(this.editedIndex, 1);
      let url = "projects/" + this.editedItem.id;
      this.$http
        .delete(url)
        .then((response) => {
          console.log(response.data);
          this.notification(response.data.message, "green");
          // this.initialize();
          this.onInitialize();
        })
        .catch((response) => {
          console.log("Error Fround. Project Not Saved");
        });
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.removeImage();
      this.selectedIncharge.splice(0);
      this.selectedTeam.splice(0);
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    removeImage() {
      console.log(101010101);
    },

    closeDelete() {
      this.formDeleteModel = false;
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
            startingdate: moment(this.editedItem.startingdate).format("X"),
            deadline: moment(this.editedItem.deadline).format("X"),
            projectVersion: this.editedItem.projectVersion,
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

          let url = "projects/" + this.editedItem.id;
          console.log("update", update);
          this.$http
            .put(url, update)
            .then((response) => {
              console.log("aaaa", response.data);
              this.notification(response.data.message, "green");

              this.onInitialize();
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

          // this.projects.push(this.editedItem);

          const save = {
            title: this.editedItem.title,
            status: this.editedItem.status,
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

          let url = "projects";
          this.$http
            .post(url, save)
            .then((response) => {
              console.log(response.data);
              this.notification(response.data.message, "green");

              this.onInitialize();
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
    onAccessPermission() {
      let access = JSON.parse(localStorage.getItem("token_access"));
      this.appAccess = access[1];
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
<style>
.total {
  /* padding-top: 15px; */
  border-top: 2px solid red;
  border-bottom: double red;
}
</style>
