<template>
  <div id="Task">
    <!-- Layout -->
    <DashboardLayout />

    <!-- DB TABLE -->
    <v-card color="pa-0" tile flat>
      <v-data-table
        :headers="headers"
        :items="task"
        :fixed-header="true"
        :loading="dataTableLoading"
        :items-per-page="5"
        :footer-props="{
          'items-per-page-options': [pagination.total],
          prevIcon: '',
          nextIcon: '',
        }"
        loading-text="Fetching Data"
        height="85vh"
        id="dt_table_task"
        class="elevation-0"
        dense
        disable-pagination
      >
        <!-- TABLE TOP -->
        <template v-slot:top>
          <v-toolbar flat id="toolbar">
            <v-toolbar-title class="h6" id="v_table_title_size">
              <!-- TABLE MAXIMIZE ICON -->
              <v-icon
                small
                left
                @click="onExpandTable('e')"
                v-if="!dataTableFullscreen"
                title="Expand Data Table"
              >
                mdi-image-filter-center-focus-strong
              </v-icon>

              <!-- TABLE MINIMIZE ICON -->
              <v-icon
                v-else
                @click="onExpandTable('m')"
                title="Minimize Data Table"
              >
                mdi-arrow-expand
              </v-icon>

              <!-- TABLE TITLE  -->
              <span v-animate-css="'fadeIn'">
                {{ $t("task.title") }}
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
                label="Search ..."
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
              @shortkey="onNewDialog()"
              @click="onNewDialog"
              v-show="appAccess >= 2"
            >
              <v-icon left dark class=""> mdi-plus </v-icon>
              <span class="v_toolbar_add_project_text">
                {{ $t("button.addTask") }}
              </span>
            </v-btn>

            <v-divider class="mx-4" inset vertical></v-divider>
          </v-toolbar>
        </template>
        <!--COLUMN ID -->
        <template v-slot:[`item.id`]="{ item, index }">
          <div
            class="d-flex index_id_column"
            :title="
              item.status == '0'
                ? 'PENDING'
                : item.status == '1'
                ? 'ACTIVE'
                : null
            "
          >
            <v-sheet
              :color="
                item.status == '0'
                  ? 'orange'
                  : item.status == '1'
                  ? 'green'
                  : null
              "
              class="ma-0 pa-0"
              height="30"
              width="3"
            ></v-sheet>
            <span class="ma-1">{{ index + 1 }}</span>
          </div>
        </template>

        <!-- COLUMN PRIORITY -->
        <template v-slot:[`item.priority`]="{ item }">
          <v-chip
            x-small
            :color="
              item.priority == 'CRITICAL'
                ? '#C62828'
                : item.priority == 'HIGH'
                ? '#F57C00'
                : item.priority == 'MEDIUM'
                ? '#0091EA'
                : item.priority == 'LOW'
                ? '#4527A0'
                : null
            "
            dark
          >
            {{ item.priority }}
          </v-chip>
        </template>

        <!-- TABLE ACTIONS -->
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            class="pa-2 teal darken-1"
            id="dt-attchment-action-button"
            x-small
            dark
            title="Attachments"
            v-if="item.attachments.length > 1"
            @click="onAttachment(item)"
          >
            mdi-attachment mdi-rotate-90
          </v-icon>

          <v-icon
            class="pa-2 teal darken-1"
            id="dt-attchment-action-button"
            x-small
            dark
            title="No Attachments found"
            v-else
          >
            mdi-attachment mdi-rotate-90 mdi-dark
          </v-icon>

          <v-icon
            class="pa-2  ml-1 blue darken-1"
            id="dt-view-action-button"
            x-small
            dark
            title="View Projects"
            @click="onEditItem(item, 'view')"
          >
            mdi-eye
          </v-icon>

          <v-icon
            id="dt-edit-action-button"
            class="pa-2 ml-1 orange darken-1"
            x-small
            dark
            title="Edit Projects"
            @click="onEditItem(item, 'edit')"
            v-show="appAccess >= 3"
          >
            mdi-pencil
          </v-icon>

          <v-icon
            id="dt-trash-action-button"
            x-small
            dark
            class="pa-2 ml-1 red darken-1"
            title="Delete Projects"
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
              @input="onInitialize"
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

    <!-- VIEWMODEL -->
    <v-dialog
      v-model="formViewModel"
      max-width="1400px"
      persistent
      content-class="task-form-dialog"
      scrollable
    >
      <v-card tile flat>
        <DialogCardLoading />
        <v-card-title :class="ModelHeaderColor">
          <span class="headline blue-grey--text text--darken-3 d-flex">
            <v-icon left color="">mdi-timeline-text</v-icon>
            TASK VIEW
          </span>
          <v-spacer></v-spacer>
          <v-icon @click="formViewModel = false">mdi-close</v-icon>
        </v-card-title>

        <!-- MODEL BODY -->
        <v-card-text class="ma-0 pa-3 d-flex">
          <v-row
            class="ma-0 pa-0  mt-5 poViewFormStyle"
            v-for="(i, k) in formList"
            :key="k"
          >
            <!-- TITLE -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="task_user_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-calendar</v-icon>
                <strong> TITLE </strong>
              </div>
              <div class="ml-7">
                {{ i.title }}
              </div>
            </v-col>

            <!-- PROJECTS -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="task_user_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-calendar</v-icon>
                <strong> PROJECT </strong>
              </div>
              <div class="ml-7">
                {{ i.project_id.title }}
              </div>
            </v-col>

            <!-- SYSTEMS -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="task_user_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-calendar</v-icon>
                <strong> SYSTEMS </strong>
              </div>
              <div class="ml-7">
                {{ i.system_id.domain }}
              </div>
            </v-col>

            <!-- TESTERS -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="task_user_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-calendar</v-icon>
                <strong> TESTER </strong>
              </div>
              <div class="ml-7">
                {{ i.tester_id.name }}
              </div>
            </v-col>

            <!-- PRIORITY -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="task_user_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-calendar</v-icon>
                <strong> PRIORITY </strong>
              </div>
              <div class="ml-7">
                {{ i.priority }}
              </div>
            </v-col>

            <!-- ASSIGNED TO -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="task_user_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-calendar</v-icon>
                <strong> ASSIGNED TO </strong>
              </div>
              <div class="ml-7">
                {{ i.assigned_id.name }}
              </div>
            </v-col>

            <!-- EMPTY -->
            <v-col md="3" sm="3" cols="12" class=""> </v-col>
            <!-- EMPTY -->
            <v-col md="3" sm="3" cols="12" class=" "> </v-col>

            <!-- DESCRIPTION -->
            <v-col
              md="12"
              sm="12"
              cols="12"
              class="task_user_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-calendar</v-icon>
                <strong> DESCRIPTION </strong>
              </div>
              <div class="ml-7">
                <p v-html="i.description"></p>
              </div>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-text class="ma-0 pa-3 d-flex">
          <v-row
            class="ma-0 pa-0  mt-5 poViewFormStyle"
            v-for="(i, k) in formList"
            :key="k"
          >
            <!--  ATTCHMENTS -->
            <v-col md="3" sm="3" cols="12" class="po_user_col_border d-flex  ">
              <v-icon small left>mdi-drag</v-icon>
              <strong>ATTCHMENTS</strong>
            </v-col>

            <!--  ATTCHMENTS -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="po_user_col_border d-flex "
              v-for="(i, k) in i.attachments"
              :key="k"
            >
              <v-icon small left @click="viewEditAttachment(i.name)">
                mdi-table-eye
              </v-icon>
              <strong>{{ i.name }}</strong>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- ADD MODEL FORM -->
    <v-dialog
      v-model="formAddmModel"
      max-width="1400px"
      persistent
      content-class="task-form-dialog"
      scrollable
    >
      <v-card tile flat>
        <DialogCardLoading />
        <v-card-title :class="ModelHeaderColor">
          <span class="headline blue-grey--text text--darken-3 d-flex">
            <v-icon left color="">mdi-timeline-text</v-icon> {{ formTitle }}
          </span>
          <v-spacer></v-spacer>
          <v-icon @click="closeForm">mdi-close</v-icon>
        </v-card-title>

        <!-- MODEL BODY -->
        <v-card-text class="ma-0 pa-3 ">
          <ValidationObserver ref="form">
            <v-row
              class="ma-0 pa-0  mt-5 poFormStyle "
              v-for="(i, k) in formList"
              :key="k"
            >
              <!-- AXIOS PROGRESS -->
              <v-col
                md="12"
                sm="3"
                cols="12"
                class="ma-0 pa-0 "
                v-if="i.AxiosProgressCount != 0"
              >
                <v-progress-linear
                  v-model="i.AxiosProgressCount"
                  height="15"
                  class="w-50"
                  buffer-value="0"
                  stream
                >
                  <span class="blue-grey--text text--lighten-1">{{
                    i.AxiosProgressCount
                  }}</span>
                </v-progress-linear>
              </v-col>

              <v-col
                md="12"
                sm="3"
                cols="12"
                class="ma-0 pa-0 "
                v-if="i.AxiosSuccess == true"
                buffer-value="0"
                stream
              >
                <v-progress-linear
                  :color="i.AxiosSuccessResponse == 200 ? 'teal' : 'red'"
                  value="100"
                  height="15"
                  class="w-50"
                >
                  <span class="white--text">{{ i.AxiosSuccessMessage }}</span>
                </v-progress-linear>
              </v-col>

              <!-- TASKS TITLE-->
              <v-col sm="3" md="3" cols="6">
                <ValidationProvider
                  rules="required|min:5"
                  name="Task"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="i.title"
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
              <v-col md="3" sm="3" cols="12" class="">
                <ValidationProvider
                  rules="required"
                  name="Project"
                  v-slot="{ errors }"
                >
                  <v-autocomplete
                    v-model="i.project_id"
                    :items="projectList"
                    :search-input.sync="getProjectList"
                    :label="errors[0] ? errors[0] : 'Project'"
                    :error-messages="errors"
                    item-text="title"
                    item-value="id"
                    return-object
                    dense
                    hide-no-data
                    hide-details=""
                    hide-selected
                    single-line
                  >
                    <template v-slot:selection="data">
                      {{ data.item.title }}
                    </template>
                    <template v-slot:item="{ item }">
                      {{ item.title }}
                    </template>
                  </v-autocomplete>
                </ValidationProvider>
              </v-col>

              <!-- AVAILABLE SYSTEMS -->
              <v-col md="3" sm="3" cols="12" class="">
                <ValidationProvider
                  rules="required"
                  name="System"
                  v-slot="{ errors }"
                >
                  <v-autocomplete
                    v-model="i.system_id"
                    :items="systemList"
                    :search-input.sync="getSystemList"
                    :label="errors[0] ? errors[0] : 'System'"
                    :error-messages="errors"
                    item-text="domain"
                    item-value="id"
                    return-object
                    dense
                    hide-no-data
                    hide-details=""
                    hide-selected
                    single-line
                  >
                    <template v-slot:selection="data">
                      {{ data.item.domain }}
                    </template>
                    <template v-slot:item="{ item }">
                      {{ item.domain }}
                    </template>
                  </v-autocomplete>
                </ValidationProvider>
              </v-col>

              <!-- AVAILABLE TESTERS -->
              <v-col md="2" sm="3" cols="12" class="">
                <ValidationProvider
                  rules="required"
                  name="Tester"
                  v-slot="{ errors }"
                >
                  <v-autocomplete
                    v-model="i.tester_id"
                    :items="TesterList"
                    :search-input.sync="getTesterList"
                    :label="errors[0] ? errors[0] : 'Tester'"
                    :error-messages="errors"
                    item-text="name"
                    item-value="id"
                    return-object
                    dense
                    hide-no-data
                    hide-details=""
                    hide-selected
                    single-line
                  >
                    <template v-slot:selection="data">
                      {{ data.item.name }}
                    </template>
                    <template v-slot:item="{ item }">
                      {{ item.name }}
                    </template>
                  </v-autocomplete>
                </ValidationProvider>
              </v-col>

              <!-- ADD / REMOVE TAB -->
              <v-col
                md="1"
                sm="3"
                cols="12"
                class="white d-flex justify-center"
              >
                <!-- REMOVE ROW BUTTON -->
                <v-btn
                  depressed
                  plain
                  icon
                  color="red"
                  v-if="formList.length > 1"
                  @click="remomveTaskList(k)"
                >
                  <v-icon>
                    mdi-delete
                  </v-icon>
                </v-btn>
                <!-- ADD ROW BUTTON -->
                <v-btn
                  depressed
                  plain
                  icon
                  :color="DTbtnColor"
                  v-if="k == formList.length - 1"
                  @click="addNewTask(k)"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-col>

              <!-- PRIORITY -->
              <v-col md="2" sm="3" cols="12" class="">
                <ValidationProvider
                  rules="required"
                  name="Priority"
                  v-slot="{ errors }"
                >
                  <v-select
                    :items="priorityOptions"
                    v-model="i.priority"
                    :label="errors[0] ? errors[0] : 'Priority'"
                    :error-messages="errors"
                    class="pa-0 ma-0"
                    hide-details=""
                    dense
                    item-text="option"
                    item-value="option"
                  ></v-select>
                </ValidationProvider>
              </v-col>

              <!-- AVAILABLE Assigned -->
              <v-col md="2" sm="3" cols="12" class="">
                <ValidationProvider
                  rules="required"
                  name="Assigned to"
                  v-slot="{ errors }"
                >
                  <v-autocomplete
                    v-model="i.assigned_id"
                    :items="assigneeList"
                    :search-input.sync="getAssigneeList"
                    :label="errors[0] ? errors[0] : 'Assigned to'"
                    :error-messages="errors"
                    item-text="name"
                    item-value="id"
                    return-object
                    dense
                    hide-no-data
                    hide-details=""
                    hide-selected
                    single-line
                  >
                    <template v-slot:selection="data">
                      {{ data.item.name }}
                    </template>
                    <template v-slot:item="{ item }">
                      {{ item.name }}
                    </template>
                  </v-autocomplete>
                </ValidationProvider>
              </v-col>

              <!--  ATTACHMENTS -->
              <v-col md="2" sm="3" cols="12" class="">
                <ValidationProvider
                  rules=""
                  name="ATTACHMENTS"
                  v-slot="{ errors }"
                >
                  <v-file-input
                    v-model="i.attachments"
                    multiple
                    prepend-icon=""
                    :label="errors[0] ? errors[0] : 'ATTACHMENTS'"
                    dense
                    hide-details=""
                    @change="onAttachmentSelected($event, k)"
                  >
                    <template v-slot:selection="{ index, text }">
                      <span
                        v-if="index < 1"
                        class="overline grey--text text--darken-3 ml-2"
                      >
                        {{ i.attachments.length }} Files Attched
                      </span>
                    </template>
                  </v-file-input>
                </ValidationProvider>
              </v-col>

              <!-- ATTACHMENT LISTS -->
              <v-col
                md="12"
                sm="12"
                cols="12"
                class="  d-flex align-center blue-grey lighten-4 pa-0 pl-2"
                v-if="i.attachments.length > 0"
              >
                <p class="ma-1">ATTACHMENTS:</p>
                <div v-for="(i, index) in i.attachments" :key="index">
                  <v-chip
                    small
                    class="ma-1 white--text"
                    close
                    color="blue-grey"
                    @click:close="removeAttachment(i, k, index)"
                  >
                    <v-icon
                      left
                      small
                      v-if="editedIndex != -1"
                      @click="viewEditAttachment(i.name)"
                    >
                      mdi-table-eye
                    </v-icon>
                    {{ i.name }}
                  </v-chip>
                </div>
              </v-col>

              <!-- DESCRIPTION -->
              <v-col sm="12" md="12" cols="12" class="">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <div v-bind="attrs" v-on="on">
                      <ValidationProvider
                        rules=""
                        name="Task Description"
                        v-slot="{ errors }"
                      >
                        <vue-editor
                          :editorToolbar="editorToolBar"
                          v-model="i.description"
                          class="h-25"
                        ></vue-editor>
                      </ValidationProvider>
                    </div>
                  </template>
                  <span>Task Description</span>
                </v-tooltip>
              </v-col>

              <!-- OVERLAY -->
              <v-overlay :value="overlay">
                <v-progress-circular
                  indeterminate
                  size="64"
                ></v-progress-circular>
              </v-overlay>
            </v-row>
          </ValidationObserver>
        </v-card-text>
        <v-card-actions class="fixed-bottom">
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeForm" plain>
            Cancel
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="save"
            :loading="submitLoading"
            plain
          >
            {{ submitBtn }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--SEPERATE ATTACHMENT MODEL -->
    <v-dialog
      v-model="seperateAttachmentModel"
      max-width="550"
      persistent
      content-class="TaskAttachmentFormDialog"
      scrollable
    >
      <v-card tile flat>
        <DialogCardLoading />
        <v-card-title :class="ModelHeaderColor">
          <span class="headline blue-grey--text text--darken-3 d-flex">
            <v-icon left color="">mdi-attachment mdi-rotate-90 </v-icon>
            ATTACHMENTS
          </span>
          <v-spacer></v-spacer>
          <v-icon @click="seperateAttachmentModel = false">mdi-close</v-icon>
        </v-card-title>

        <!-- MODEL BODY -->
        <v-card-text class="ma-0 pa-3">
          <v-list subheader two-line>
            <v-list-item v-for="(i, key) in viewAttachmentList" :key="key">
              <v-list-item-avatar size="40">
                <v-icon class="grey lighten-1" dark small>
                  mdi-file-tree
                </v-icon>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title v-text="i"></v-list-item-title>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn icon>
                  <v-icon
                    color="grey lighten-1"
                    small
                    @click="viewEditAttachment(i)"
                  >
                    mdi-format-horizontal-align-right
                  </v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-card-actions class="fixed-bottom"> </v-card-actions>
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
          <strong> TASK - {{ editedItem.task }}</strong> ?
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
import DialogCardLoading from "../../components/DialogCardLoading";
import moment from "moment";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { json2excel, excel2json } from "js2excel";
import { jsPDF } from "jspdf";
import { VueEditor } from "vue2-editor";
export default {
  name: "Task",
  components: {
    DashboardLayout,
    ValidationObserver,
    ValidationProvider,
    VueEditor,
    DialogCardLoading,
  },
  data: () => ({
    url: {
      task: "task",
    },

    dataTableLoading: true,
    dataTableFullscreen: false,
    formDeleteModel: false,
    formAddmModel: false,
    overlay: false,
    submitLoading: false,
    seperateAttachmentModel: false,
    formViewModel: false,

    existData: -1,
    appAccess: 0, //ACCESS PERMISSION FOR TASK
    editedIndex: -1,

    DTbtnColor: "indigo lighten-1 ",
    ModelHeaderColor: "blue-grey lighten-5",
    search: "",
    moment: moment,
    getProjectList: "",
    getSystemList: "",
    getTesterList: "",
    getAssigneeList: "",

    headers: [],
    task: [],
    headersList: [],
    selectedHeaders: [],
    formList: [
      {
        AxiosProgressCount: 0,
        AxiosSuccess: false,
        AxiosSuccessMessage: "",
        AxiosSuccessResponse: null,

        assigned_id: "",
        priority: "",
        project_id: "",
        status: "",
        system_id: "",
        tester_id: "",
        title: "",
        description: "",
        attachments: [],
      },
    ],
    projectList: [],
    systemList: [],
    TesterList: [],
    assigneeList: [],
    viewAttachmentList: [],

    editedItem: {},

    priorityOptions: [
      { option: "CRITICAL", index: 1 },
      { option: "HIGH", index: 2 },
      { option: "MEDIUM", index: 3 },
      { option: "LOW", index: 4 },
    ],
    editorToolBar: [
      ["bold", "italic", "underline", "code"],
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
    snackbar: {
      show: false,
      time: 3000,
      message: "",
      color: "",
    },
    pagination: {
      current: 1,
      localCurrentPage: parseInt(localStorage.getItem("task_pk")),
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
        text: "PRIORITY",
        align: "center",
        sortable: true,
        value: "priority",
        align: "start",
      },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
        width: "14%",
        align: "end",
        class: "dark--text",
      },
    ],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "NEW TASK" : "Edit TASK ";
    },
    submitBtn() {
      return this.editedIndex === -1 ? "SAVE" : "UPDATE";
    },
  },

  created() {
    localStorage.setItem("task_pk", 1);
    this.onInitialize(localStorage.getItem("task_pk"));
    this.datatableColumnVisibility();
  },

  beforeMount() {
    this.onAccessPermission();
    this.onInitializeExportColumns();
  },

  watch: {
    getProjectList(e) {
      this.$http
        .get("task" + "/auto_search/project/" + e)
        .then((res) => {
          res.data.object.forEach((element) => {
            this.projectList.push(element);
          });
        })
        .catch((err) => {
          console.log("failed project autocomplete");
        });
    },

    getSystemList(e) {
      this.$http
        .get("task" + "/auto_search/system/" + e)
        .then((res) => {
          res.data.object.forEach((element) => {
            this.systemList.push(element);
          });
        })
        .catch((err) => {
          console.log("failed project autocomplete");
        });
    },

    getTesterList(e) {
      this.$http
        .get("task" + "/auto_search/tester/" + e)
        .then((res) => {
          res.data.object.forEach((element) => {
            this.TesterList.push(element);
          });
        })
        .catch((err) => {
          console.log("failed project autocomplete");
        });
    },
    getAssigneeList(e) {
      this.$http
        .get("task" + "/auto_search/assignee/" + e)
        .then((res) => {
          res.data.object.forEach((element) => {
            this.assigneeList.push(element);
          });
        })
        .catch((err) => {
          console.log("failed project autocomplete");
        });
    },
  },

  methods: {
    onInitialize(e) {
      this.$http
        .get(this.url.task + "?page=" + e)
        .then((response) => {
          this.task.splice(0);
          let i = response.data;
          console.log(i.objects);

          this.dataTableLoading = false;
          this.dtPagination = {
            first_page_url: i.objects.first_page_url,
            from: i.objects.from,
            last_page: i.objects.last_page,
            last_page_url: i.objects.last_page_url,
            next_page_url: i.objects.next_page_url,
            path: i.objects.path,
            per_page: i.objects.per_page,
            prev_page_url: i.objects.prev_page_url,
            to: i.objects.to,
            total: i.objects.total,
            links: i.objects.links.forEach((element) => {
              element;
            }),
          };
          this.pagination.total = i.objects.last_page;
          i.objects.data.forEach((e) => {
            this.task.push({
              id: e.id,
              task: e.title,
              project: e.project.title,
              system: e.system.domain,
              tested_by: e.tester_to.name,
              priority: e.priority,
              status: e.status,
              attachments: e.attachment,
            });
            // console.log(e.attachment.length);
          });
        })
        .catch((err) => {
          if (err.response) {
            this.$gl.Unauthorized(err.response.status);
          }
        });
    },
    remomveTaskList(e) {
      this.formList.splice(e, 1);
    },
    addNewTask(e) {
      //   this.$refs.form.validate().then((success) => {
      //     if (!success) {
      //       return;
      //     }

      this.formList.push({
        AxiosProgressCount: 0,
        AxiosSuccess: false,
        AxiosSuccessMessage: "",
        AxiosSuccessResponse: null,

        assigned_id: "",
        priority: "",
        project_id: "",
        status: "",
        system_id: "",
        tester_id: "",
        title: "",
        attachments: [],
      });
      //   });
    },
    axiosMultiPost(arr, i, m) {
      var element = arr[i];
      console.log("arr", arr);
      console.log("i", i);
      console.log("element", element);

      const fd = new FormData();
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) =>
          (element.AxiosProgressCount =
            Math.round((progressEvent.loaded / progressEvent.total) * 100) +
            " % Uploaded"),
      };

      fd.append("id", element.id);
      fd.append("title", element.title);
      fd.append("priority", element.priority);
      fd.append("project_id", element.project_id.id);
      fd.append("system_id", element.system_id.id);
      fd.append("tester_id", element.tester_id.id);
      fd.append("assigned_id", element.assigned_id.id);
      fd.append("description", element.description);
      fd.append("status", 0);
      if (!element.attachments.length < 1) {
        element.attachments.forEach((element) => {
          if (element instanceof File) {
            console.log("true true");
            fd.append("attachment[]", element, element.name);
          } else {
            console.log("false false");

            fd.append("attachment[]", element.name);
          }
        });
      }
      if (m == "store") {
        this.$http
          .post(this.url.task, fd, config)
          .then((res) => {
            if (i < arr.length - 1) {
              this.axiosMultiPost(arr, ++i, "store");
            } else {
              this.onInitialize();
              this.closeForm();
              this.overlay = false;
              this.notification("Tasks are successfully added", "green");
            }
            if (res.data.status == 200) {
              element.AxiosSuccess = true;
              element.AxiosProgressCount = 0;
              element.AxiosSuccessMessage = res.data.message;
              element.AxiosSuccessResponse = res.data.status;
            }
          })
          .catch((err) => {
            this.overlay = false;
            element.AxiosSuccess = true;
            element.AxiosProgressCount = 0;
            element.AxiosSuccessResponse = 500;
            element.AxiosSuccessMessage = "Please try again";
          });
      } else {
        fd.append("_method", "put");

        console.log("update", element);
        this.$http
          .post(this.url.task + "/" + element.id, fd, config)
          .then((res) => {
            if (res.data.status == 200) {
              element.AxiosSuccess = true;
              element.AxiosProgressCount = 0;
              element.AxiosSuccessMessage = res.data.message;
              element.AxiosSuccessResponse = res.data.status;
            }

            this.onInitialize();
            // this.closeForm();
            this.overlay = false;
            this.notification("Task has been updated successfully", "green");
          })
          .catch((err) => {
            this.overlay = false;

            element.AxiosSuccess = true;
            element.AxiosProgressCount = 0;
            element.AxiosSuccessResponse = 500;
            element.AxiosSuccessMessage = "Please try again";
          });
      }
    },
    save() {
      this.$refs.form.validate().then((success) => {
        if (!success) {
          return;
        }

        this.overlay = true;
        if (this.editedIndex == -1) {
          this.axiosMultiPost(this.formList, 0, "store");
        } else {
          this.axiosMultiPost(this.formList, 0, "update");
        }
      });
    },
    onAttachment(e) {
      this.viewAttachmentList.splice(0);
      this.$http
        .get(this.url.task + "/getAttachments/" + e.id)
        .then((response) => {
          let i = response.data.objects;
          console.log(i);
          i.forEach((element) => {
            this.viewAttachmentList.push(element.file_name);
          });
          this.seperateAttachmentModel = true;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onEditItem(e, type) {
      this.formList.splice(0);
      this.projectList.splice(0);
      this.systemList.splice(0);
      this.TesterList.splice(0);
      this.assigneeList.splice(0);

      console.log(e);

      this.$http.get(this.url.task + "/edit/" + e.id).then((response) => {
        let i = response.data.objects;
        console.log(i);
        let attechment = [];
        i.attachment.forEach((element) => {
          attechment.push({
            id: element.id,
            name: element.file_name,
          });
          console.log(element);
        });
        this.projectList.push({
          id: i.project.id,
          title: i.project.title,
        });

        this.systemList.push({
          id: i.system.id,
          domain: i.system.domain,
        });

        this.TesterList.push({
          id: i.tester_to.id,
          name: i.tester_to.name,
        });

        this.assigneeList.push({
          id: i.assigned_to.id,
          name: i.assigned_to.name,
        });

        this.formList.push({
          AxiosProgressCount: 0,
          AxiosSuccess: false,
          AxiosSuccessMessage: "",
          AxiosSuccessResponse: null,

          id: i.id,
          priority: i.priority,
          assigned_id: {
            id: i.assigned_to.id,
            name: i.assigned_to.name,
          },
          project_id: {
            id: i.project.id,
            title: i.project.title,
          },
          status: "",
          system_id: {
            id: i.system.id,
            domain: i.system.domain,
          },
          tester_id: {
            id: i.tester_to.id,
            name: i.tester_to.name,
          },
          title: i.title,
          description: i.description,
          attachments: attechment,
        });
      });

      this.editedIndex = this.task.indexOf(e);
      if (type == "edit") {
        this.formAddmModel = true;
      } else {
        this.formViewModel = true;
      }
    },
    viewEditAttachment(i) {
      console.log(i);
      window.open(
        "http://localhost:8000/storage/Task_attachments/" + i,
        "_blank"
      );
    },
    onAttachmentSelected(e, k) {
      this.formList[k].attachments = Object.assign(e, {});
    },
    removeAttachment(i, x, y) {
      console.log(x, y);
      console.log("removed", i);

      this.$http
        .delete(this.url.task + "/attachment/" + i.id)
        .then((response) => {
          this.notification(response.data.message, "green");
          this.onInitialize();
        })
        .catch((response) => {
          // console.log("Error Fround. Attachment Not Deleted");
          this.notification("Error Fround.   Not Deleted", "red");
        });

      this.formList[x].attachments.splice(y, 1);
    },

    onNewDialog() {
      this.formAddmModel = true;
      this.formList.splice(0);

      this.formList.push({
        AxiosProgressCount: 0,
        AxiosSuccess: false,
        AxiosSuccessMessage: "",
        AxiosSuccessResponse: null,

        assigned_id: "",
        priority: "",
        project_id: "",
        status: "",
        system_id: "",
        tester_id: "",
        title: "",
        attachments: [],
      });
    },
    closeForm() {
      this.$nextTick(() => {
        this.formAddmModel = false;
        this.editedIndex = -1;
        this.$refs.form.reset();
        this.editedItem = Object.assign({});

        // this.getProjectList.splice(0);
        // this.getSystemList.splice(0);
        // this.getTesterList.splice(0);
        // this.getAssigneeList.splice(0);
      });
    },
    onSearch(e) {
      this.dataTableLoading = true;
      if (this.search.length > 0) {
        this.$http.get(this.url.task + "/getTaskList/" + e).then((response) => {
          // console.log(response.data);
          let i = response.data.objects;
          this.task.splice(0);
          i.forEach((e) => {
            this.task.push({
              id: e.id,
              task: e.title,
              project: e.project.title,
              system: e.system.domain,
              tested_by: e.tester_to.name,
              priority: e.priority,
              status: e.status,
              attachments: e.attachment,
            });
          }, 4000);
          this.dataTableLoading = false;
        });
      } else {
        this.task.splice(0);
        this.onInitialize(localStorage.getItem("task_pk"));
        this.dataTableLoading = false;
      }
    },
    onDeleteItem(e) {
      this.formDeleteModel = true;
      this.editedItem = Object.assign(e);
      console.log(e);
    },
    onDeleteConfirm() {
      this.$http
        .delete(this.url.task + "/" + this.editedItem.id)
        .then((response) => {
          this.notification(response.data.message, "green");
          this.onInitialize();
          this.formDeleteModel = false;
        })
        .catch((response) => {
          // console.log("Error Fround.   Not Deleted");
          this.notification("Error Fround.   Not Deleted", "red");
        });
    },
    onChangeColumn(e) {
      this.headers.splice(0);
      localStorage.setItem("task_active_columns", JSON.stringify(e));
      let headersMap = this.headersMap;
      let selected_arr = e;
      let filtered = headersMap.filter(({ value }) =>
        selected_arr.includes(value)
      );

      filtered.forEach((element) => {
        this.headers.push(element);
      });
    },
    onInitializeExportColumns() {
      this.excelTitles = [];

      this.pdfTitles = [];

      this.selectedExcelTitle = this.excelTitles;
      this.selectedPDFTitle = this.excelTitles;
    },
    onRefresh() {
      this.onInitialize();
    },
    datatableColumnVisibility() {
      let x = JSON.parse(localStorage.getItem("task_active_columns"));
      let y = this.headersMap.slice(1, -1);

      y.forEach((element) => {
        this.headersList.push(element);
      });

      if (x == null) {
        let obj = this.headersMap;
        let result = obj.map((col) => col.value);
        localStorage.setItem("task_active_columns", JSON.stringify(result));

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
    onExpandTable(e) {
      if (e == "e") {
        let x = this.$gl.onFullscreenDataTable("dt_table_task");
        if (x) this.dataTableFullscreen = true;
      } else {
        let x = this.$gl.onExitFullScreenDataTable();
        if (x) this.dataTableFullscreen = false;
      }
    },
    focusSearchKey() {
      this.$refs.searchbar_ref.$refs.input.focus();
    },
    onAccessPermission() {
      let access = JSON.parse(localStorage.getItem("token_access"));
      let currentUser = JSON.parse(localStorage.getItem("user"));
      this.appAccess = access[5];

      this.currentUser = Object.assign(currentUser);
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

<style></style>
