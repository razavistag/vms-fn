<template>
  <div id="Accounts">
    <!-- Layout -->
    <DashboardLayout />

    <!-- DB TABLE -->
    <v-card color="pa-0" tile flat>
      <v-data-table
        :headers="headers"
        :items="itemData"
        :fixed-header="true"
        :loading="dataTableLoading"
        :items-per-page="-1"
        :footer-props="{
          prevIcon: '',
          nextIcon: '',
        }"
        loading-text="Fetching Data"
        height="85vh"
        id="dt_table_item"
        class="elevation-0"
        dense
      >
        <!-- TABLE TOP -->
        <template v-slot:top>
          <v-toolbar flat id="toolbar">
            <v-toolbar-title class="h6" id="v_table_title_size">
              <!-- TABLE MAXIMIZE ICON -->
              <v-icon
                small
                left
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
                {{ $t("item.title") }}
              </span>
            </v-toolbar-title>

            <v-divider class="mx-4" inset vertical></v-divider>

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
            <!-- SEARCH TEXT -->
            <div v-shortkey="['alt', 's']" @shortkey="focusSearchKey">
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search ..."
                ref="searchbar_ref"
                type="input"
                hide-details
                dense
                class="shrink mx-4 my-4  v_toolbar_search_text_field"
              >
                <template v-slot:append>
                  <v-icon
                    :class="DTbtnColor + 'pa-1 rounded-top pointer'"
                    color="white"
                    @click="onSearch(search)"
                  >
                    mdi-magnify
                  </v-icon>
                </template>
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
              <span class="v_toolbar_add_button_text">
                {{ $t("button.addItem") }}
              </span>
            </v-btn>
          </v-toolbar>
        </template>

        <template v-slot:[`item.id`]="{ item, index }">
          <div
            class="d-flex index_id_column"
            :title="item.status == '0' ? 'PENDING' : 'ACTIVE'"
          >
            <v-sheet
              :color="item.status == '0' ? 'orange' : 'green'"
              class="ma-0 pa-0"
              height="30"
              width="3"
            >
            </v-sheet>

            <span class="ma-1">{{ index + 1 }}</span>
          </div>
        </template>
        <template v-slot:[`item.name`]="{ item }">
          <span :title="item.name">
            {{ item.name.substring(0, 28) + "..." }}
          </span>
        </template>

        <template v-slot:[`item.cost`]="{ item }">
          {{ item.cost }} /-
        </template>

        <template v-slot:[`item.fixed_price`]="{ item }">
          {{ item.fixed_price }} /-
        </template>

        <template v-slot:[`item.price`]="{ item }">
          {{ item.price }} /-
        </template>

        <template v-slot:[`item.discount`]="{ item }">
          {{ item.discount }} %
        </template>

        <template v-slot:[`item.special_price`]="{ item }">
          {{ item.special_price }} /-
        </template>

        <template v-slot:[`item.wholesale_price`]="{ item }">
          {{ item.wholesale_price }} /-
        </template>

        <template v-slot:[`item.warranty_days`]="{ item }">
          {{ item.warranty_days }} DAYS
        </template>

        <!-- TABLE ACTIONS -->
        <template v-slot:[`item.actions`]="{ item }">
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
            <p class="pt-5 ml-4">
              Items: {{ dtPagination.from }} - {{ dtPagination.total }}
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

    <!-- ADD MODEL FORM -->
    <v-dialog
      v-model="formAddmModel"
      max-width="1400px"
      persistent
      content-class="add-form-dialog"
      scrollable
    >
      <v-card tile flat>
        <DialogCardLoading />
        <v-card-title :class="ModelHeaderColor">
          <span class="headline blue-grey--text text--darken-3 d-flex">
            <v-icon left color="">mdi-timeline-text</v-icon> {{ formTitle }}
            <span v-if="editedIndex != -1">
              {{ editedItem.name }}
            </span>
          </span>
          <v-spacer></v-spacer>
          <v-icon @click="closeForm">mdi-close</v-icon>
        </v-card-title>

        <!-- MODEL BODY -->
        <v-card-text class="ma-0 pa-3 ">
          <ValidationObserver ref="form">
            <v-row class=" ">
              <!-- NAME -->
              <v-col md="2" sm="2" cols="12" class="ma-2 pa-0">
                <ValidationProvider
                  rules="required"
                  name="NAME"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="editedItem.name"
                    :label="errors[0] ? errors[0] : 'NAME'"
                    :error-messages="errors"
                    dense
                    hide-details=""
                  >
                  </v-text-field>
                </ValidationProvider>
              </v-col>

              <!-- BRAND -->
              <v-col md="2" sm="2" cols="12" class="ma-2 pa-0">
                <ValidationProvider
                  rules="required"
                  name="BRAND"
                  v-slot="{ errors }"
                >
                  <v-combobox
                    v-model="editedItem.brand"
                    :items="brandList"
                    item-text="option"
                    hide-selected
                    :label="errors[0] ? errors[0] : 'BRAND'"
                    dense
                    hide-details=""
                    :error-messages="errors"
                  >
                  </v-combobox>
                </ValidationProvider>
              </v-col>

              <!-- CATEGORY -->
              <v-col md="2" sm="2" cols="12" class="ma-2 pa-0">
                <ValidationProvider
                  rules="required"
                  name="CATEGORY"
                  v-slot="{ errors }"
                >
                  <v-combobox
                    v-model="editedItem.category"
                    :items="categoryList"
                    item-text="option"
                    hide-selected
                    :label="errors[0] ? errors[0] : 'CATEGORY'"
                    dense
                    hide-details=""
                    :error-messages="errors"
                  >
                  </v-combobox>
                </ValidationProvider>
              </v-col>

              <!-- COLOR -->
              <v-col md="2" sm="2" cols="12" class="ma-2 pa-0">
                <ValidationProvider
                  rules="required"
                  name="COLOR"
                  v-slot="{ errors }"
                >
                  <v-combobox
                    v-model="editedItem.color"
                    :items="colorList"
                    item-text="option"
                    hide-selected
                    :label="errors[0] ? errors[0] : 'COLOR'"
                    dense
                    hide-details=""
                    :error-messages="errors"
                  >
                  </v-combobox>
                </ValidationProvider>
              </v-col>

              <!-- MEASUREMENT -->
              <v-col md="2" sm="2" cols="12" class="ma-2 pa-0">
                <ValidationProvider
                  rules="required"
                  name="MEASUREMENT"
                  v-slot="{ errors }"
                >
                  <v-combobox
                    v-model="editedItem.measurements"
                    :items="measurementList"
                    item-text="option"
                    hide-selected
                    :label="errors[0] ? errors[0] : 'MEASUREMENT'"
                    dense
                    :error-messages="errors"
                    hide-details=""
                  >
                  </v-combobox>
                </ValidationProvider>
              </v-col>

              <!-- SIZE -->
              <v-col md="1" sm="2" cols="12" class="ma-2 pa-0">
                <ValidationProvider
                  rules="required"
                  name="SIZE"
                  v-slot="{ errors }"
                >
                  <v-combobox
                    v-model="editedItem.size"
                    :items="sizetList"
                    item-text="option"
                    :error-messages="errors"
                    hide-selected
                    :label="errors[0] ? errors[0] : 'SIZE'"
                    dense
                    hide-details=""
                  >
                  </v-combobox>
                </ValidationProvider>
              </v-col>

              <!-- TYPE -->
              <v-col md="" sm="2" cols="12" class="ma-2 pa-0">
                <ValidationProvider
                  rules="required"
                  name="TYPE"
                  v-slot="{ errors }"
                >
                  <v-combobox
                    v-model="editedItem.type"
                    :items="typetList"
                    item-text="option"
                    item-value="index"
                    hide-selected
                    :label="errors[0] ? errors[0] : 'TYPE'"
                    :error-messages="errors"
                    dense
                    hide-details=""
                  >
                  </v-combobox>
                </ValidationProvider>
              </v-col>

              <!-- TAX METHOD -->
              <v-col md="1" sm="2" cols="12" class="ma-2 pa-0">
                <ValidationProvider
                  rules="required"
                  name="TAX METHOD"
                  v-slot="{ errors }"
                >
                  <v-combobox
                    v-model="editedItem.tax_method"
                    :items="taxList"
                    item-text="option"
                    item-value="index"
                    hide-selected
                    :error-messages="errors"
                    :label="errors[0] ? errors[0] : 'TAX '"
                    dense
                    hide-details=""
                  >
                  </v-combobox>
                </ValidationProvider>
              </v-col>

              <!-- COST -->
              <v-col md="1" sm="2" cols="12" class="ma-2 pa-0">
                <ValidationProvider
                  rules="required"
                  name="COST"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="editedItem.cost"
                    :label="errors[0] ? errors[0] : 'COST'"
                    :error-messages="errors"
                    dense
                    hide-details=""
                  >
                  </v-text-field>
                </ValidationProvider>
              </v-col>

              <!-- WEIGHTED AVERAGE COST -->
              <v-col md="1" sm="2" cols="12" class="ma-2 pa-0">
                <ValidationProvider
                  rules="required"
                  name="WEIGHTED AVERAGE COST"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="editedItem.wac"
                    :label="errors[0] ? errors[0] : 'WAC'"
                    :error-messages="errors"
                    dense
                    hide-details=""
                  >
                  </v-text-field>
                </ValidationProvider>
              </v-col>

              <!-- PRICE -->
              <v-col md="1" sm="2" cols="12" class="ma-2 pa-0">
                <ValidationProvider
                  rules="required"
                  name="PRICE"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="editedItem.price"
                    :label="errors[0] ? errors[0] : 'PRICE'"
                    :error-messages="errors"
                    dense
                    hide-details=""
                  >
                  </v-text-field>
                </ValidationProvider>
              </v-col>

              <!-- WHOLESALE PRICE -->
              <v-col md="1" sm="2" cols="12" class="ma-2 pa-0">
                <ValidationProvider
                  rules="required"
                  name="WHOLESALE PRICE"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="editedItem.wholesale_price"
                    :label="errors[0] ? errors[0] : 'WS PRICE'"
                    :error-messages="errors"
                    dense
                    hide-details=""
                  >
                  </v-text-field>
                </ValidationProvider>
              </v-col>

              <!-- SPECIAL PRICE -->
              <v-col md="1" sm="2" cols="12" class="ma-2 pa-0">
                <ValidationProvider
                  rules="required"
                  name="SPECIAL PRICE"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="editedItem.special_price"
                    :label="errors[0] ? errors[0] : 'SP PRICE'"
                    :error-messages="errors"
                    dense
                    hide-details=""
                  >
                  </v-text-field>
                </ValidationProvider>
              </v-col>

              <!-- FIXED  PRICE -->
              <v-col md="1" sm="2" cols="12" class="ma-2 pa-0">
                <ValidationProvider
                  rules="required"
                  name="FIXED PRICE"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="editedItem.fixed_price"
                    :label="errors[0] ? errors[0] : 'FIXED PRICE'"
                    :error-messages="errors"
                    dense
                    hide-details=""
                  >
                  </v-text-field>
                </ValidationProvider>
              </v-col>
              <!-- WARRANTY DAYS -->
              <v-col md="2" sm="2" cols="12" class="ma-2 pa-0">
                <ValidationProvider
                  rules="required"
                  name="WARRANTY DAYS"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="editedItem.warranty_days"
                    :label="errors[0] ? errors[0] : 'WARRANTY DAYS'"
                    :error-messages="errors"
                    dense
                    hide-details=""
                  >
                  </v-text-field>
                </ValidationProvider>
              </v-col>

              <!-- DISCOUNT -->
              <v-col md="1" sm="2" cols="12" class="ma-2 pa-0">
                <ValidationProvider
                  rules="required"
                  name="DISCOUNT"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="editedItem.discount"
                    :label="errors[0] ? errors[0] : 'DISCOUNT'"
                    :error-messages="errors"
                    dense
                    hide-details=""
                  >
                  </v-text-field>
                </ValidationProvider>
              </v-col>
              <!-- RO LEVEL -->
              <v-col md="2" sm="2" cols="12" class="ma-2 pa-0">
                <ValidationProvider
                  rules="required"
                  name="RO LEVEL"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="editedItem.reorder_level"
                    :label="errors[0] ? errors[0] : 'RO LEVEL'"
                    :error-messages="errors"
                    dense
                    hide-details=""
                  >
                  </v-text-field>
                </ValidationProvider>
              </v-col>

              <!-- STATUS -->
              <v-col md="1" sm="2" cols="12" class="ma-2 pa-0">
                <ValidationProvider
                  rules="required"
                  name="STATUS"
                  v-slot="{ errors }"
                >
                  <v-select
                    :items="statusOption"
                    v-model="editedItem.status"
                    :label="errors[0] ? errors[0] : 'STATUS'"
                    :error-messages="errors"
                    hide-details=""
                    clearable
                    dense
                    item-text="option"
                    item-value="index"
                  ></v-select>
                </ValidationProvider>
              </v-col>

              <!-- OFFERS -->
              <v-col md="4" sm="2" cols="12" class="ma-2 pa-0">
                <ValidationProvider
                  rules="required"
                  name="OFFERS"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="editedItem.offers"
                    :label="errors[0] ? errors[0] : 'OFFERS'"
                    :error-messages="errors"
                    dense
                    hide-details=""
                  >
                  </v-text-field>
                </ValidationProvider>
              </v-col>

              <v-col sm="3" md="3" cols="4" class="ma-2 pa-0 ">
                <ValidationProvider rules="" name="PICTURE" v-slot="{ errors }">
                  <v-file-input
                    v-model="editedItem.itemImage"
                    accept="image/*"
                    class="   "
                    :label="errors[0] ? errors[0] : 'PICTURE'"
                    hide-details=""
                    prepend-icon=""
                    truncate-length="10"
                    dense
                    @change="addImage($event)"
                  ></v-file-input>
                </ValidationProvider>
              </v-col>

              <v-col sm="3" md="" cols="4" class="ma-2 pa-0 ">
                <v-avatar size="40">
                  <v-img :src="itemImage" width="100" height="100" />
                </v-avatar>
              </v-col>

              <v-col sm="3" md="" cols="4" class="ma-2 pa-0 ">
                <v-avatar size="40">
                  <v-img
                    :src="
                      'http://localhost:8000/storage/Items_attachments/' +
                        itemImage
                    "
                    width="100"
                    height="100"
                  />
                </v-avatar>
              </v-col>
            </v-row>
          </ValidationObserver>
        </v-card-text>

        <v-card-actions class="fixed-bottom">
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeForm">
            Cancel
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="save"
            :loading="submitLoading"
          >
            {{ submitBtn }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
            RECURRING VIEW
          </span>
          <v-spacer></v-spacer>
          <v-icon @click="formViewModel = false">mdi-close</v-icon>
        </v-card-title>

        <!-- MODEL BODY -->
        <v-card-text class="ma-0 pa-3 ">
          <v-row class="ma-0 pa-0  mt-5 view_form_style">
            <!-- COL -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-drag</v-icon>
                <strong> NAME </strong>
              </div>
              <div class="ml-7">
                {{ editedItem.name }}
              </div>
            </v-col>
            <!-- COL -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-drag</v-icon>
                <strong> TYPE </strong>
              </div>
              <div class="ml-7">
                {{ editedItem.brand }}
              </div>
            </v-col>
            <!-- COL -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-drag</v-icon>
                <strong> MOBILE </strong>
              </div>
              <div class="ml-7">
                {{ editedItem.category }}
              </div>
            </v-col>
            <!-- COL -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-drag</v-icon>
                <strong> EMAIL </strong>
              </div>
              <div class="ml-7">
                {{ editedItem.barcode }}
              </div>
            </v-col>
            <!-- COL -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-drag</v-icon>
                <strong> ADDRESS </strong>
              </div>
              <div class="ml-7">
                {{ editedItem.color }}
              </div>
            </v-col>

            <!-- COL -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-drag</v-icon>
                <strong> CITY </strong>
              </div>
              <div class="ml-7">{{ editedItem.cost }} /-</div>
            </v-col>

            <!-- COL -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-drag</v-icon>
                <strong> ZIP CODE </strong>
              </div>
              <div class="ml-7">{{ editedItem.discount }} %</div>
            </v-col>

            <!-- COL -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-drag</v-icon>
                <strong> STATE </strong>
              </div>
              <div class="ml-7">
                {{ editedItem.fixed_price }}
              </div>
            </v-col>

            <!-- COL -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-drag</v-icon>
                <strong> COUNTRY </strong>
              </div>
              <div class="ml-7">
                {{ editedItem.measurements }}
              </div>
            </v-col>

            <!-- COL -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-drag</v-icon>
                <strong> PHONE </strong>
              </div>
              <div class="ml-7">
                {{ editedItem.number }}
              </div>
            </v-col>

            <!-- COL -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-drag</v-icon>
                <strong> START DATE </strong>
              </div>
              <div class="ml-7">
                {{ editedItem.price }}
              </div>
            </v-col>

            <!-- COL -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-drag</v-icon>
                <strong> END DATE </strong>
              </div>
              <div class="ml-7">
                {{ editedItem.reorder_level }}
              </div>
            </v-col>
            <!-- COL -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-drag</v-icon>
                <strong> KEY MONEY </strong>
              </div>
              <div class="ml-7">
                {{ editedItem.size }}
              </div>
            </v-col>
            <!-- COL -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-drag</v-icon>
                <strong> MONTHLY AMOUNT </strong>
              </div>
              <div class="ml-7">
                {{ editedItem.special_price }}
              </div>
            </v-col>
            <!-- COL -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-drag</v-icon>
                <strong> MONTHLY AMOUNT </strong>
              </div>
              <div class="ml-7">
                {{ editedItem.wac }}
              </div>
            </v-col>
            <!-- COL -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-drag</v-icon>
                <strong> MONTHLY AMOUNT </strong>
              </div>
              <div class="ml-7">
                {{ editedItem.warranty_days }}
              </div>
            </v-col>
            <!-- COL -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
            >
              <div>
                <v-icon small left>mdi-drag</v-icon>
                <strong> MONTHLY AMOUNT </strong>
              </div>
              <div class="ml-7">
                {{ editedItem.wholesale_price }}
              </div>
            </v-col>
            <!-- COL -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
              v-if="editedItem.tax_method"
            >
              <div>
                <v-icon small left>mdi-drag</v-icon>
                <strong> STATUS </strong>
              </div>
              <div class="ml-7">
                {{ editedItem.tax_method.option }}
              </div>
            </v-col>
            <!-- COL -->
            <v-col
              md="3"
              sm="3"
              cols="12"
              class="view_col_border d-flex flex-column align-start d-flex flex-column align-start"
              v-if="editedItem.type"
            >
              <div>
                <v-icon small left>mdi-drag</v-icon>
                <strong> STATUS </strong>
              </div>
              <div class="ml-7">
                {{ editedItem.type.option }}
              </div>
            </v-col>

            <!-- EMPTY -->
            <v-col md="3" sm="3" cols="12" class=""> </v-col>
            <!-- EMPTY -->
            <v-col md="3" sm="3" cols="12" class=" "> </v-col>
          </v-row>
        </v-card-text>
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
          ARE YOU SURE YOUR WANT TO
          <strong>DELETE </strong> ?
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
export default {
  name: "Accounts",
  components: {
    DashboardLayout,
    DialogCardLoading,
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      url: {
        baseURL: "items",
      },

      dataTableLoading: true,
      dataTableFullscreen: false,
      exportExecelLoading: false,
      exportPDFLoading: false,
      formDeleteModel: false,
      pdfLayout: null,
      submitLoading: false,
      formAddmModel: false,
      formViewModel: false,

      existData: -1,
      appAccess: 0, //ACCESS PERMISSION
      editedIndex: -1,

      moment: moment,
      pageKey: "item_pk",
      activeColumns: "item_active_columns",
      DTbtnColor: "indigo lighten-1 ",
      ModelHeaderColor: "blue-grey lighten-5",
      search: "",
      itemImage: "null",

      itemData: [], // Array for DataTable
      headers: [],
      headersList: [],
      selectedHeaders: [],
      excelTitles: [],
      pdfTitles: [],
      selectedExcelTitle: [],
      selectedPDFTitle: [],

      brandList: [
        { option: "Addidas" },
        { option: "Nike" },
        { option: "Sung" },
        { option: "Linon" },
        { option: "Super dry" },
      ],
      categoryList: [
        { option: "Men Short Leaves" },
        { option: "Men Long Leaves" },
        { option: "Women Frock" },
        { option: "Women Saree" },
      ],
      colorList: [
        { option: "red" },
        { option: "yellow" },
        { option: "blue" },
        { option: "green" },
        { option: "orange" },
        { option: "purple" },
      ],
      measurementList: [
        { option: "PIECE" },
        { option: "UNIT" },
        { option: "BUNDLE" },
      ],
      sizetList: [
        { option: "XS" },
        { option: "S" },
        { option: "M" },
        { option: "L" },
        { option: "XL" },
        { option: "XXL" },
        { option: "XXXL" },
      ],
      typetList: [
        { option: "UNIQUE", index: 0 },
        { option: "COMMON", index: 1 },
      ],
      taxList: [
        { option: "IIT", index: 0 },
        { option: "VAT", index: 1 },
      ],
      statusOption: [
        { option: "ACTIVE", index: 1 },
        { option: "PENDING", index: 0 },
      ],

      currentUser: {},
      editedItem: {},
      snackbar: {
        show: false,
        time: 3000,
        message: "",
        color: "",
      },
      pagination: {
        current: 1,
        localCurrentPage: parseInt(localStorage.getItem("item_pk")),
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
          text: "",
          align: "start",
          sortable: true,
          value: "id",
          width: "50",
          divider: true,
        },
        {
          text: "NAME",
          align: "start",
          sortable: true,
          value: "name",
          width: "250",
          divider: true,
        },
        {
          text: "BRAND",
          align: "start",
          sortable: true,
          value: "brand",
          width: "170",
          divider: true,
        },
        {
          text: "CATEGORY",
          align: "start",
          sortable: true,
          value: "category",
          width: "170",
          divider: true,
        },
        {
          text: "BARCODE",
          align: "start",
          sortable: true,
          value: "barcode",
          width: "140",
          divider: true,
        },
        {
          text: "MEASUREMENT",
          align: "center",
          sortable: true,
          value: "measurements",
          width: "140",
          divider: true,
        },
        {
          text: "SIZE",
          align: "center",
          sortable: true,
          value: "size",
          width: "100",
          divider: true,
        },
        {
          text: "COST",
          align: "end",
          sortable: true,
          value: "cost",
          width: "100",
          divider: true,
        },
        {
          text: "RO LEVEL",
          align: "center",
          sortable: true,
          value: "reorder_level",
          width: "110",
          divider: true,
        },
        {
          text: "FIX RPICE",
          align: "end",
          sortable: true,
          value: "fixed_price",
          width: "110",
          divider: true,
        },
        {
          text: "PRICE",
          align: "end",
          sortable: true,
          value: "price",
          width: "100",
          divider: true,
        },
        {
          text: "DIS %",
          align: "end",
          sortable: true,
          value: "discount",
          width: "100",
          divider: true,
        },
        {
          text: "SPC PRICE",
          align: "end",
          sortable: true,
          value: "special_price",
          width: "120",
          divider: true,
        },
        {
          text: "WS PRICE",
          align: "end",
          sortable: true,
          value: "wholesale_price",
          width: "110",
          divider: true,
        },
        {
          text: "WARRENTY",
          align: "end",
          sortable: true,
          value: "warranty_days",
          width: "120",
          divider: true,
        },

        {
          text: "Actions",
          value: "actions",
          sortable: false,
          align: "center",
          width: "100",
          cellClass: " pa-0 ma-0",
          class: "dark--text",
        },
      ],
    };
  },
  created() {
    // console.log("initializing ");
    // console.log("----------------------------------------------");
    localStorage.setItem(this.pageKey, 1);
    this.onInitialize(this.pageKey);
    this.datatableColumnVisibility(this.activeColumns);
  },
  beforeMount() {
    this.onAccessPermission();
    this.onInitializeExportColumns();
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "NEW ITEMS" : "EDIT ITEMS";
    },
    submitBtn() {
      return this.editedIndex === -1 ? "SAVE" : "UPDATE";
    },
  },

  methods: {
    onInitialize(e) {
      this.itemData.splice(0);
      this.$http
        .get(this.url.baseURL + "?page=" + e)
        .then((response) => {
          let i = response.data;
          console.log("onInitialize", i);
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
            this.itemData.push(e);
          });
        })
        .catch((err) => {
          if (err.response) {
            this.$gl.Unauthorized(err.response.status);
          }
        });
    },

    onNewDialog() {
      this.formAddmModel = true;
      this.$nextTick(() => {
        this.$refs.form.reset();
      });
    },

    closeForm() {
      this.$nextTick(() => {
        this.formAddmModel = false;
        this.editedIndex = -1;
        this.$refs.form.reset();
        this.editedItem = Object.assign({});
        this.itemImage = "";
        this.editedItem.itemImage;
      });
    },

    addImage(e) {
      if (e === null) {
        this.itemImage = "";
        return;
      }
      let reader = new FileReader();
      reader.onload = (fileArray) => {
        // console.log(reader.result);
        this.itemImage = reader.result;
        this.editedItem.itemImage = e;
      };
      reader.readAsDataURL(e);
    },

    save() {
      console.log(this.editedItem);
      this.$refs.form.validate().then((success) => {
        if (!success) {
          return;
        }

        this.submitLoading = true;

        const obj = {
          id: this.editedItem.id,
          //   barcode: this.editedItem.barcode,
          brand: this.editedItem.brand.option,
          category: this.editedItem.category.option,
          color: this.editedItem.color.option,
          cost: this.editedItem.cost,

          discount: this.editedItem.discount,
          fixed_price: this.editedItem.fixed_price,
          measurements: this.editedItem.measurements.option,
          name: this.editedItem.name,
          //   number: this.editedItem.number,
          offers: this.editedItem.offers,
          pic: this.itemImage,
          price: this.editedItem.price,
          reorder_level: this.editedItem.reorder_level,
          size: this.editedItem.size.option,
          special_price: this.editedItem.special_price,
          status: this.editedItem.status,
          tax_method: this.editedItem.tax_method.index,
          type: this.editedItem.type.index,
          //   uom: this.editedItem.uom,
          wac: this.editedItem.wac,
          warranty_days: this.editedItem.warranty_days,
          wholesale_price: this.editedItem.wholesale_price,
        };

        if (this.editedIndex > -1) {
          // UPDATE
          this.$http
            .put(this.url.baseURL + "/" + obj.id, obj)
            .then((response) => {
              this.submitLoading = false;
              this.onInitialize();
              this.closeForm();
              this.notification(
                "Recode has been updated successfully",
                "green"
              );
            })
            .catch((err) => {
              this.submitLoading = false;

              this.notification("FAILED TO UPDATE .", "red");
              this.$gl.Unauthorized(err.response.status);
            });
        } else {
          // STORE
          this.$http
            .post(this.url.baseURL, obj)
            .then((response) => {
              this.onInitialize();
              this.closeForm();
              this.submitLoading = false;
              this.notification("Recode has been added successfully", "green");
            })
            .catch((err) => {
              this.submitLoading = false;

              this.notification("FAILED TO SAVE", "red");
            });
        }
      });
    },

    onEditItem(e, type) {
      this.editedIndex = this.itemData.indexOf(e);

      this.$http
        .get(this.url.baseURL + "/getEditItem/" + e.id)
        .then((response) => {
          let i = response.data.objects;
          this.itemImage = i.pic;
          this.editedItem = Object.assign(i, {
            tax_method:
              i.tax_method == 0
                ? { option: "IIT", index: 0 }
                : { option: "VAT", index: 1 },
            type:
              i.type == 0
                ? { option: "UNIQUE", index: 0 }
                : { option: "COMMON", index: 1 },
          });
        });

      if (type == "edit") {
        this.formAddmModel = true;
      } else {
        this.formViewModel = true;
      }
    },

    onDeleteItem(e) {
      this.formDeleteModel = true;
      this.editedItem = Object.assign(e);
    },

    onDeleteConfirm() {
      /**  server API and Function for delete **/
      this.$http
        .delete(this.url.baseURL + "/" + this.editedItem.id)
        .then((response) => {
          this.notification(response.data.message, "green");
          this.onInitialize();
          this.formDeleteModel = false;
        })
        .catch((response) => {
          this.notification("Error Fround. ITEM NOT DELETED", "red");
        });
    },

    onSearch(e) {
      /** Define page key | objects to array | server API and Function for search **/
      this.dataTableLoading = true;
      if (this.search.length > 0) {
        this.$http
          .get(this.url.baseURL + "/getSearchItem/" + e)
          .then((response) => {
            let i = response.data.objects;
            console.log(i);

            this.itemData.splice(0);
            i.forEach((e) => {
              this.itemData.push(e);
            }, 4000);
            this.dataTableLoading = false;
          });
      } else {
        this.onInitialize(this.pageKey);
        this.itemData.splice(0);
        this.dataTableLoading = false;
      }
    },

    onRefresh() {
      this.onInitialize();
    },

    exportToExcel() {
      this.exportExecelLoading = true;
      let objects = [];
      this.itemData.forEach((element) => {
        objects.push({
          NAME: element.name,
          BRAND: element.brand,
          CATEGORY: element.category,
          BARCODE: element.barcode,
          MEASUREMENT: element.measurements,
          SIZE: element.size,
          PRICE: element.price,
          DISCOUNT: element.discount,
          "SPECIAL PRICE": element.special_price,
          "WHOLESALE PRICE": element.wholesale_price,
          "WARRENTY DAYS": element.warranty_days,
          COST: element.cost,
          "RE ORDER LEVEL": element.reorder_level,
          "FIXED PRICE": element.fixed_price,
        });
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
      let fileName = this.moment().unix() + "_file";
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
      let fileName = this.moment().unix() + "_file";

      try {
        let user_DecKey = this.$gl.DecKey(localStorage.getItem("user"));
        let user = JSON.parse(user_DecKey);
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
          //   encryption: {
          //     userPassword: user.phone,
          //     ownerPassword: "admin",
          //     userPermissions: ["print", "modify", "copy", "annot-forms"],
          //   },
        });

        this.selectedPDFTitle.forEach((element, key) => {
          header.push(element);
        });
        this.itemData.forEach((element) => {
          data.push({
            NAME: element.name,
            BRAND: element.brand,
            CATEGORY: element.category,
            BARCODE: element.barcode == null ? "" : element.barcode,
            MEASUREMENT: element.measurements,
            SIZE: element.size,
            PRICE: element.price.toString(),
            DISCOUNT: element.discount.toString(),
            "SPECIAL PRICE": element.special_price.toString(),
            "WHOLESALE PRICE": element.wholesale_price.toString(),
            "WARRENTY DAYS": element.warranty_days.toString(),
            COST: element.cost.toString(),
            "RE ORDER LEVEL": element.reorder_level,
            "FIXED PRICE": element.fixed_price.toString(),
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
          width: this.pdfLayout == "l" ? 27 : 19,
          align: "center",
          padding: 0,
        }));

        let ColumnConfig = {
          headerBackgroundColor: "#c5cae9",
          fontSize: 10,
          autoSize: false,
        };

        pdf.table(5, 5, filteredData, headerConfig, ColumnConfig);
        // pdf.autoPrint({ variant: "non-conform" });

        pdf.save(fileName + ".pdf");

        this.notification(
          fileName + " has been exported successfully",
          "green"
        );

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
      // DEFINE COLUMNS FOR EXPORT OPTIONS

      this.excelTitles = [
        "NAME",
        "BRAND",
        "CATEGORY",
        "BARCODE",
        "MEASUREMENT",
        "SIZE",
        "PRICE",
        "DISCOUNT",
        "SPECIAL PRICE",
        "WHOLESALE PRICE",
        "WARRENTY DAYS",
        "COST",
        "RE ORDER LEVEL",
        "FIXED PRICE",
      ];

      this.pdfTitles = [
        "NAME",
        "BRAND",
        "CATEGORY",
        "BARCODE",
        "MEASUREMENT",
        "SIZE",
        "PRICE",
        "DISCOUNT",
        "SPECIAL PRICE",
        "WHOLESALE PRICE",
        "WARRENTY DAYS",
        "COST",
        "RE ORDER LEVEL",
        "FIXED PRICE",
      ];

      this.selectedExcelTitle = this.excelTitles;
      this.selectedPDFTitle = this.pdfTitles;
    },
    onChangeColumn(e) {
      this.headers.splice(0);
      localStorage.setItem(this.activeColumns, JSON.stringify(e));
      let headersMap = this.headersMap;
      let selected_arr = e;
      let filtered = headersMap.filter(({ value }) =>
        selected_arr.includes(value)
      );

      filtered.forEach((element) => {
        this.headers.push(element);
      });
    },
    datatableColumnVisibility(e) {
      let x = JSON.parse(localStorage.getItem(e));
      let y = this.headersMap.slice(1, -1);

      y.forEach((element) => {
        this.headersList.push(element);
      });

      if (x == null) {
        let obj = this.headersMap;
        let result = obj.map((col) => col.value);
        localStorage.setItem(e, JSON.stringify(result));

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

    onClipboard() {
      let jsonObject = JSON.stringify(this.itemData);
      navigator.clipboard.writeText(jsonObject);
    },

    onAccessPermission() {
      let DecKey = this.$gl.DecKey(localStorage.getItem("token_access"));
      let user_DecKey = this.$gl.DecKey(localStorage.getItem("user"));
      let access = JSON.parse(DecKey);
      let currentUser = JSON.parse(user_DecKey);
      this.appAccess = access[11];

      this.currentUser = Object.assign(currentUser);
    },

    focusSearchKey() {
      this.$refs.searchbar_ref.$refs.input.focus();
    },

    onExpandTable(e) {
      if (e == "e") {
        let x = this.$gl.onFullscreenDataTable("dt_table_item");
        if (x) this.dataTableFullscreen = true;
      } else {
        let x = this.$gl.onExitFullScreenDataTable();
        if (x) this.dataTableFullscreen = false;
      }
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
