<template>
  <div id="DashboardLayout">
    <v-app-bar :color="headerColor" dark app height="37" dense flat>
      <v-btn
        small
        icon
        class="v_menu_icon_btn"
        @click="mobileDrawer = !mobileDrawer"
      >
        <v-icon small>mdi-menu</v-icon>
      </v-btn>
      <!-- Dashboard -->
      <!-- {{ $t("dashboard.title") }} --  -->

      <v-icon small left class="ml-4">mdi-calendar-month</v-icon>

      {{ date }}

      <v-spacer></v-spacer>

      <v-btn
        small
        icon
        color="white"
        dark
        title="COMPANY SETTINGS "
        v-if="companyIcon"
        @click="companySettings"
      >
        <v-icon small>mdi-office-building-outline</v-icon>
      </v-btn>

      <v-menu top close-on-click>
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="white" dark v-bind="attrs" small v-on="on" icon>
            <v-icon small>mdi-translate</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item v-for="(item, index) in Languages" :key="index">
            <v-btn text @click="languageChange(item.lan)">{{ item.lan }}</v-btn>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn
        small
        icon
        @click="getFullScreen"
        v-if="!fullscreen"
        v-shortkey="['alt', '+']"
        @shortkey="getFullScreen()"
      >
        <v-icon small>mdi-arrow-expand-all</v-icon>
      </v-btn>
      <v-btn
        small
        icon
        color="white"
        dark
        @click="exitFullScreen"
        v-shortkey="['alt', '-']"
        @shortkey="exitFullScreen()"
        v-else
      >
        <v-icon>mdi-arrow-expand</v-icon>
      </v-btn>

      <v-btn
        id="logoutBtn"
        small
        icon
        @click="logout"
        v-shortkey="['alt', 'q']"
        @shortkey="logout()"
      >
        <v-icon small>mdi-logout</v-icon>
      </v-btn>

      <v-avatar size="22" color="white" class="pa-1 ma-1">
        <div v-if="showOnProfile == false">
          <v-img
            :src="'http://localhost:8000/storage/' + user.profile"
            width="30"
            height="30"
            v-if="user.profile"
          ></v-img>

          <v-img
            src="../assets/default_logo.jpeg"
            width="30"
            height="30"
            v-else
          ></v-img>
        </div>
        <div v-else>
          <v-img :src="croppa.generateDataUrl()" width="30" height="30"></v-img>
        </div>
      </v-avatar>
    </v-app-bar>

    <!-- desktop navigation on hover -->
    <v-navigation-drawer
      elevation
      app
      :color="sideBar"
      permanent
      mini-variant-width="40"
      class="navigation_drawer_desktop"
      :expand-on-hover="expandonhover"
      dark
    >
      <!-- User Information -->

      <v-list-item class="px-2">
        <v-list-item-avatar size="30">
          <div v-if="showOnProfile == false">
            <v-avatar size="22" color="white" class="">
              <v-img
                :src="'http://localhost:8000/storage/' + user.profile"
                width="30"
                height="30"
                v-if="user.profile"
              ></v-img>

              <v-img
                src="../assets/default_logo.jpeg"
                width="30"
                height="30"
                v-else
              ></v-img>
            </v-avatar>
          </div>
          <div v-else>
            <v-img
              :src="croppa.generateDataUrl()"
              width="30"
              height="30"
            ></v-img>
          </div>
        </v-list-item-avatar>

        <v-list-item-title>
          {{ user.name }}
        </v-list-item-title>

        <v-btn icon @click="profileEdit">
          <v-icon small>mdi-pencil</v-icon>
        </v-btn>
      </v-list-item>

      <v-divider></v-divider>
      <!-- expand-on-hover -->
      <v-list dense nav class="pa-0">
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          :to="item.to"
          class="text-decoration-none"
        >
          <v-list-item-icon>
            <v-icon class="gray--text pa-1" small>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="gray--text">
              {{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- mobile Navigation on menu button click -->
    <v-navigation-drawer
      data-html2canvas-ignore="true"
      elevation
      app
      :color="sideBar"
      temporary
      v-model="mobileDrawer"
    >
      <v-list dense nav class="pa-0">
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          :to="item.to"
          class="text-decoration-none"
        >
          <v-list-item-icon>
            <v-icon class="gray--text" small>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="gray--text">
              {{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- PROFILR INFO MODEL -->
    <v-dialog
      v-model="profileInfoModel"
      max-width="1450px"
      content-class="form-dialog"
      scrollable
    >
      <v-card tile flat>
        <DialogCardLoading />
        <v-card-title :class="ModelHeaderColor">
          <span class="headline blue-grey--text text--darken-3 d-flex">
            <v-icon left color="">mdi-timeline-text</v-icon> PROFILE
          </span>
          <v-spacer></v-spacer>
          <v-icon @click="profileInfoModel = false">mdi-close</v-icon>
        </v-card-title>

        <v-card-text class="ma-0">
          <v-row class="ma-0   rowStyle ">
            <!-- PROFILE PIC -->

            <v-col md="3" sm="3" cols="12" class="   ">
              <div v-if="editedItem.profilePic" class="upload_container">
                <v-img
                  :src="
                    'http://localhost:8000/storage/' + editedItem.profilePic
                  "
                  width="100%"
                  height="100%"
                />

                <v-icon
                  class="upload_default_icon"
                  size="60"
                  @click="editedItem.profilePic = null"
                >
                  mdi-pencil
                </v-icon>
              </div>
              <div v-else class=" ">
                <image-cropper
                  v-model="croppa"
                  :width="250"
                  :height="250"
                  placeholder="UPLOAD PROFILE"
                  :show-remove-button="true"
                  class="croppa"
                  @change="FileUpload($event)"
                />
              </div>
            </v-col>

            <v-col md="8" sm="12" cols="8" class=" pa-4 mt-4   formStyle">
              <ValidationObserver ref="form">
                <div class=" rowStyle ">
                  <!-- NAME   -->
                  <v-col md="3" sm="3" cols="3" class=" ma-0 pa-0 ">
                    <ValidationProvider
                      rules="required|min:5"
                      name="User Name"
                      v-slot="{ errors }"
                    >
                      <v-text-field
                        v-model="editedItem.name"
                        :label="errors[0] ? errors[0] : 'User Name'"
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

                  <!--EMAIL -->
                  <v-col cols="12" sm="6" md="3" class=" ma-0 pa-0 inputStyle ">
                    <ValidationProvider
                      rules="required|email"
                      name="Email"
                      v-slot="{ errors }"
                    >
                      <v-text-field
                        v-model="editedItem.email"
                        :label="errors[0] ? errors[0] : 'Email'"
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

                  <!--PHONE -->
                  <v-col cols="12" sm="6" md="3" class=" ma-0 pa-0 inputStyle ">
                    <ValidationProvider
                      rules="required|numeric|min:9|max:15"
                      name="Phone"
                      v-slot="{ errors }"
                    >
                      <v-text-field
                        v-model="editedItem.phone"
                        :label="errors[0] ? errors[0] : 'Phone'"
                        :error-messages="errors"
                        prefix="*"
                        clearable
                        dense
                        hide-details=""
                      >
                      </v-text-field>
                    </ValidationProvider>
                  </v-col>

                  <!-- ACCOUNT NUMBER -->
                  <v-col cols="12" sm="6" md="3" class=" ma-0 pa-0 inputStyle ">
                    <ValidationProvider
                      rules="required"
                      name="Account Number"
                      v-slot="{ errors }"
                    >
                      <v-text-field
                        v-model="editedItem.account_number"
                        :label="errors[0] ? errors[0] : 'Account Number'"
                        :error-messages="errors"
                        prefix="*"
                        clearable
                        dense
                        hide-details=""
                      >
                      </v-text-field>
                    </ValidationProvider>
                  </v-col>
                </div>

                <div class=" rowStyle mt-5 ">
                  <!--ADDRESS -->
                  <v-col cols="12" sm="6" md="3" class=" ma-0 pa-0 ">
                    <ValidationProvider
                      rules="required|max:100"
                      name="Address"
                      v-slot="{ errors }"
                    >
                      <v-text-field
                        v-model="editedItem.address"
                        :label="errors[0] ? errors[0] : 'Address'"
                        :error-messages="errors"
                        prefix="*"
                        clearable
                        dense
                        hide-details=""
                      >
                      </v-text-field>
                    </ValidationProvider>
                  </v-col>

                  <!--NIC -->
                  <v-col cols="12" sm="6" md="3" class=" ma-0 pa-0 inputStyle">
                    <ValidationProvider
                      rules="required|max:20|min:8"
                      name="NIC"
                      v-slot="{ errors }"
                    >
                      <v-text-field
                        v-model="editedItem.nic"
                        :label="errors[0] ? errors[0] : 'NIC'"
                        :error-messages="errors"
                        prefix="*"
                        clearable
                        dense
                        hide-details=""
                      >
                      </v-text-field>
                    </ValidationProvider>
                  </v-col>

                  <!-- GENDER -->
                  <v-col cols="12" sm="6" md="3" class=" ma-0 pa-0 inputStyle">
                    <ValidationProvider
                      rules="required"
                      name="Gender"
                      v-slot="{ errors }"
                    >
                      <v-select
                        :items="genderOptions"
                        v-model="editedItem.gender"
                        :label="errors[0] ? errors[0] : 'Gender'"
                        :error-messages="errors"
                        hide-details=""
                        prefix="*"
                        clearable
                        dense
                      ></v-select>
                    </ValidationProvider>
                  </v-col>

                  <!-- DOB -->
                  <v-col cols="12" sm="6" md="3" class=" ma-0 pa-0 inputStyle">
                    <ValidationProvider
                      rules="required"
                      name="Date of birth"
                      v-slot="{ errors }"
                    >
                      <v-menu
                        v-model="dobDatePicker"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <ValidationProvider
                            rules="required"
                            name="Date of birth"
                            v-slot="{ errors }"
                          >
                            <v-text-field
                              v-model="editedItem.dob"
                              :label="errors[0] ? errors[0] : 'Date of birth'"
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
                          v-model="editedItem.dob"
                          dateFormat="mm-YYYY"
                          @input="dobDatePicker = false"
                        ></v-date-picker>
                      </v-menu>
                    </ValidationProvider>
                  </v-col>
                </div>

                <div class=" rowStyle mt-5 ">
                  <!-- ZIP CODE -->
                  <v-col cols="12" sm="6" md="3" class=" ma-0 pa-0  ">
                    <ValidationProvider
                      rules="required|min:3"
                      name="Zip Code"
                      v-slot="{ errors }"
                    >
                      <v-text-field
                        v-model="editedItem.zip"
                        :label="errors[0] ? errors[0] : 'Zip Code'"
                        :error-messages="errors"
                        prefix="*"
                        clearable
                        dense
                        hide-details=""
                      >
                      </v-text-field>
                    </ValidationProvider>
                  </v-col>

                  <!-- LOCATIONS -->
                  <v-col cols="12" sm="6" md="3" class=" ma-0 pa-0 inputStyle ">
                    <ValidationProvider
                      rules="required"
                      name="Location"
                      v-slot="{ errors }"
                    >
                      <v-select
                        :items="locationOptions"
                        v-model="editedItem.location"
                        :label="errors[0] ? errors[0] : 'Location'"
                        :error-messages="errors"
                        hide-details=""
                        prefix="*"
                        clearable
                        dense
                        item-text="option"
                        item-value="index"
                      ></v-select>
                    </ValidationProvider>
                  </v-col>

                  <!-- LANGUAGE-->
                  <v-col cols="12" sm="6" md="3" class=" ma-0 pa-0 inputStyle ">
                    <ValidationProvider
                      rules="required"
                      name="Language"
                      v-slot="{ errors }"
                    >
                      <v-select
                        :items="languageOptions"
                        v-model="editedItem.language"
                        :label="errors[0] ? errors[0] : 'Language'"
                        :error-messages="errors"
                        hide-details=""
                        prefix="*"
                        clearable
                        dense
                        item-text="option"
                        item-value="index"
                      ></v-select>
                    </ValidationProvider>
                  </v-col>
                </div>
              </ValidationObserver>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :color="DTbtnColor" text @click="profileInfoModel = false">
            CANCEL
          </v-btn>
          <v-btn :color="DTbtnColor" text @click="update">
            UPDATE
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- COMPANY MODEL -->
    <v-dialog
      v-model="companySettingsModel"
      max-width="1200px"
      content-class="form-dialog"
      scrollable
    >
      <v-card tile flat>
        <DialogCardLoading />
        <v-card-title :class="ModelHeaderColor">
          <span class="headline blue-grey--text text--darken-3 d-flex">
            <v-icon left color="">mdi-timeline-text</v-icon> COMPANY SETTINGS
          </span>
          <v-spacer></v-spacer>
          <v-icon @click="companySettingsModel = false">mdi-close</v-icon>
        </v-card-title>

        <v-card-text class="ma-0">
          <ValidationObserver ref="companySettingsForm">
            <v-row class="ma-0 mt-4  ">
              <!-- COPMANY NAME   -->
              <v-col md="3" sm="12" cols="12" class="   ">
                <ValidationProvider
                  rules="required"
                  name="COPMANY NAME"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="editedCompany.copmany_name"
                    :label="errors[0] ? errors[0] : 'COPMANY NAME'"
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

              <!-- COPMANY EMAIL   -->
              <v-col md="3" sm="12" cols="12" class=" ">
                <ValidationProvider
                  rules="required"
                  name="COPMANY EMAIL"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="editedCompany.email"
                    :label="errors[0] ? errors[0] : 'COPMANY EMAIL'"
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

              <!-- COPMANY PHONE   -->
              <v-col md="3" sm="12" cols="12" class="  ">
                <ValidationProvider
                  rules="required"
                  name="COPMANY PHONE"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="editedCompany.phone"
                    :label="errors[0] ? errors[0] : 'COPMANY PHONE'"
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

              <!-- WEBSITE LINK   -->
              <v-col md="3" sm="12" cols="12" class="  ">
                <ValidationProvider
                  rules=""
                  name="WEBSITE LINK"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="editedCompany.web_link"
                    :label="errors[0] ? errors[0] : 'WEBSITE LINK'"
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

              <!-- FABENOOK LINK   -->
              <v-col md="3" sm="12" cols="12" class="  ">
                <ValidationProvider
                  rules=""
                  name="FABENOOK LINK"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="editedCompany.fb_link"
                    :label="errors[0] ? errors[0] : 'FABENOOK LINK'"
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

              <!-- TWITTER LINK   -->
              <v-col md="3" sm="12" cols="12" class="  ">
                <ValidationProvider
                  rules=""
                  name="TWITTER LINK"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="editedCompany.twitter_link"
                    :label="errors[0] ? errors[0] : 'TWITTER LINK'"
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

              <!-- INSTAGRAM LINK   -->
              <v-col md="3" sm="12" cols="12" class="  ">
                <ValidationProvider
                  rules=""
                  name="INSTAGRAM LINK"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="editedCompany.insta_link"
                    :label="errors[0] ? errors[0] : 'INSTAGRAM LINK'"
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

              <!-- IS DELIVERY -->
              <v-col md="2" sm="12" cols="12" class="  ">
                <ValidationProvider
                  rules=""
                  name="DELIVERY"
                  v-slot="{ errors }"
                >
                  <v-select
                    :items="isDelivery"
                    v-model="editedCompany.is_delivery"
                    :label="errors[0] ? errors[0] : 'DELIVERY'"
                    :error-messages="errors"
                    hide-details=""
                    prefix="*"
                    clearable
                    dense
                    item-text="option"
                    item-value="index"
                  ></v-select>
                </ValidationProvider>
              </v-col>

              <!-- IS REGISTERED -->
              <v-col md="2" sm="12" cols="12" class="  ">
                <ValidationProvider
                  rules=""
                  name="REGISTERED"
                  v-slot="{ errors }"
                >
                  <v-select
                    :items="isRegister"
                    v-model="editedCompany.is_registered"
                    :label="errors[0] ? errors[0] : 'REGISTERED'"
                    :error-messages="errors"
                    hide-details=""
                    prefix="*"
                    clearable
                    dense
                    item-text="option"
                    item-value="index"
                  ></v-select>
                </ValidationProvider>
              </v-col>

              <!-- WORKING DAY -->
              <v-col md="3" sm="12" cols="12" class=" d-flex ">
                <ValidationProvider rules="" name="DAYS" v-slot="{ errors }">
                  <v-select
                    :items="daysList"
                    v-model="editedCompany.dayFrom"
                    :label="errors[0] ? errors[0] : 'WORKING  FROM'"
                    :error-messages="errors"
                    hide-details=""
                    prefix="*"
                    dense
                    item-text="option"
                    item-value="option"
                  ></v-select>
                </ValidationProvider>
                <ValidationProvider rules="" name="DAYS" v-slot="{ errors }">
                  <v-select
                    :items="daysList"
                    v-model="editedCompany.dayTo"
                    :label="errors[0] ? errors[0] : 'WORKING TO'"
                    :error-messages="errors"
                    hide-details=""
                    prefix="*"
                    dense
                    item-text="option"
                    item-value="option"
                  ></v-select>
                </ValidationProvider>
              </v-col>

              <!-- WORKING TIME -->
              <v-col md="3" sm="12" cols="12" class=" d-flex ">
                <ValidationProvider
                  rules=""
                  name="WORKING TIME FROM"
                  v-slot="{ errors }"
                >
                  <v-menu
                    ref="timeFrom"
                    v-model="timeFromPicker"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="time"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="editedCompany.timeFrom"
                        :label="errors[0] ? errors[0] : 'TIME FROM'"
                        :error-messages="errors"
                        readonly
                        hide-details=""
                        prefix="*"
                        dense
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-if="timeFromPicker"
                      v-model="editedCompany.timeFrom"
                      full-width
                      @click:minute="$refs.timeFrom.save(time)"
                    ></v-time-picker>
                  </v-menu>
                </ValidationProvider>

                <ValidationProvider
                  rules=""
                  name="WORKING TIME TO"
                  v-slot="{ errors }"
                >
                  <v-menu
                    ref="timeTo"
                    v-model="timeToPicker"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="time"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="editedCompany.timeTo"
                        :label="errors[0] ? errors[0] : 'TIME TO'"
                        :error-messages="errors"
                        readonly
                        hide-details=""
                        prefix="*"
                        dense
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-if="timeToPicker"
                      v-model="editedCompany.timeTo"
                      full-width
                      @click:minute="$refs.timeTo.save(time)"
                    ></v-time-picker>
                  </v-menu>
                </ValidationProvider>
              </v-col>

              <!-- CURRENCY SYMBOL -->
              <v-col md="3" sm="12" cols="12" class="  ">
                <ValidationProvider
                  rules=""
                  name="CURRENCY SYMBOL"
                  v-slot="{ errors }"
                >
                  <v-select
                    :items="currencySymbols"
                    v-model="editedCompany.currency_symbol"
                    :label="errors[0] ? errors[0] : 'CS'"
                    :error-messages="errors"
                    hide-details=""
                    prefix="*"
                    clearable
                    dense
                    item-text="option"
                    item-value="index"
                  ></v-select>
                </ValidationProvider>
              </v-col>

              <!-- CURRENCY DECIMAL PLACE   -->
              <v-col md="1" sm="12" cols="12" class="  ">
                <ValidationProvider rules="" name="CDP" v-slot="{ errors }">
                  <v-text-field
                    v-model="editedCompany.currency_decimal_place"
                    :label="errors[0] ? errors[0] : 'CDP'"
                    :error-messages="errors"
                    clearable
                    dense
                    counter="12"
                    hide-details=""
                  >
                  </v-text-field>
                </ValidationProvider>
              </v-col>
              
              <!-- MESSAGE-->
              <v-col md="3" sm="12" cols="12" class="  ">
                <ValidationProvider rules="" name="MESSAGE" v-slot="{ errors }">
                  <v-textarea
                    v-model="editedCompany.message"
                    :label="errors[0] ? errors[0] : 'MESSAGE'"
                    :error-messages="errors"
                    prefix="*"
                    clearable
                    dense
                    counter="12"
                    hide-details=""
                  ></v-textarea>
                </ValidationProvider>
              </v-col>
            </v-row>
          </ValidationObserver>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :color="DTbtnColor" text @click="profileInfoModel = false">
            CANCEL
          </v-btn>
          <v-btn :color="DTbtnColor" text @click="update">
            SAVE
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import html2canvas from "html2canvas";
import DialogCardLoading from "./DialogCardLoading.vue";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import moment from "moment";

export default {
  name: "DashboardLayout",
  components: {
    DialogCardLoading,
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      url: {
        user: "users",
      },
      headerColor: "blue-grey darken-1",
      sideBar: "blue-grey darken-3",
      DTbtnColor: "indigo lighten-1 ",
      ModelHeaderColor: "blue-grey lighten-5",

      expandonhover: true,
      mobileDrawer: false,
      access_permission: false,
      dobDatePicker: false,
      companyIcon: false,
      companySettingsModel: false,
      showOnProfile: false,
      fullscreen: false,
      interval: null,
      time: null,
      date: null,
      profileInfoModel: false,
      timeFromPicker: false,
      timeToPicker: false,

      moment: moment,
      dataUrl: "",
      croppa: {},

      Languages: [{ lan: "English" }, { lan: "spanish" }],
      genderOptions: ["MALE", "FEMALE", "OTHERS"],
      locationOptions: [
        { option: "AKURANA", index: 1 },
        { option: "ALAWATHUGODA", index: 2 },
        { option: "BULUGIHATENNA", index: 3 },
        { option: "MADAWALA", index: 4 },
      ],
      languageOptions: [
        { option: "ENGLISH", index: 1 },
        { option: "SPANISH", index: 2 },
      ],
      isDelivery: [
        { option: "NO", index: 0 },
        { option: "YES", index: 1 },
      ],
      isRegister: [
        { option: "NO", index: 0 },
        { option: "YES", index: 1 },
      ],
      currencySymbols: [
        { option: "EUR", index: 1 },
        { option: "GBP", index: 2 },
        { option: "USD", index: 3 },
        { option: "JPY", index: 4 },
        { option: "HUF", index: 5 },
      ],
      daysList: [
        { option: "MON" },
        { option: "TUE" },
        { option: "WED" },
        { option: "THU" },
        { option: "FRI" },
        { option: "SAT" },
        { option: "SUN" },
      ],

      user: {},
      editedItem: {},
      editedCompany: {},

      items: [],
    };
  },
  beforeMount() {
    this.checkingRoutes();
  },
  mounted() {
    this.checkFullScreen();
    this.userInfomration();
  },
  created() {
    let current = new Date();

    this.date =
      current.getDate() +
      "/" +
      current.getMonth() +
      "/" +
      current.getFullYear();
  },

  methods: {
    userInfomration() {
      try {
        let DecKey = this.$gl.DecKey(localStorage.getItem("user"));
        let i = JSON.parse(DecKey);
        this.user = Object.assign(i);
        console.log(i);
      } catch (e) {
        console.log(0);
      }
    },
    companySettings() {
      this.companySettingsModel = true;
    },
    checkingRoutes() {
      // modules   are indexed
      // 0 - dashboard
      // 1 - project
      // 2 - system
      // 3 - task
      // 4 - user
      // 5 - po
      // 6 - order
      // 7 - accounts
      // 8 - holiday
      // 9 - location
      // 10 - recurring
      // 11 - item
      // 12 - company
      try {
        let DecKey = this.$gl.DecKey(localStorage.getItem("token_access"));
        let token_access = JSON.parse(DecKey);
        // console.log("dashboard layout ->", token_access);
        if (token_access[0] != 0) {
          // console.log("dashboard");
          this.items.push({
            id: 0,
            title: this.$t("menu.dashboard"),
            icon: "mdi-home",
            to: "/dashboard",
          });
        }
        if (token_access[1] != 0) {
          // console.log("project");
          this.items.push({
            id: 1,
            title: this.$t("menu.projects"),
            icon: "mdi-image-filter-center-focus-strong",
            to: "/projects",
          });
        }
        if (token_access[2] != 0) {
          // console.log("system");
          this.items.push({
            id: 2,
            title: this.$t("menu.systems"),
            icon: "mdi-server",
            to: "systems",
          });
        }
        if (token_access[3] != 0) {
          // console.log("task");
          this.items.push({
            id: 3,
            title: this.$t("menu.tasks"),
            icon: "mdi-clipboard-list",
            to: "tasks",
          });
        }
        if (token_access[4] != 0) {
          // console.log("user");
          this.items.push({
            id: 4,
            title: this.$t("menu.users"),
            icon: "mdi-account-cog",
            to: "users",
          });
        }
        if (token_access[5] != 0) {
          // console.log("po");
          this.items.push({
            id: 5,
            title: this.$t("menu.po"),
            icon: "mdi-alpha-p-circle",
            to: "/po",
          });
        }
        if (token_access[6] != 0) {
          this.items.push({
            id: 6,
            title: this.$t("menu.order"),
            icon: "mdi-checkbox-multiple-blank-circle-outline",
            to: "/order",
          });
        }
        if (token_access[7] != 0) {
          this.items.push({
            id: 7,
            title: this.$t("menu.account"),
            icon: "mdi-table-account",
            to: "/account",
          });
        }
        if (token_access[8] != 0) {
          this.items.push({
            id: 8,
            title: this.$t("menu.holiday"),
            icon: "mdi-calendar-check-outline",
            to: "/holiday",
          });
        }
        if (token_access[9] != 0) {
          this.items.push({
            id: 9,
            title: this.$t("menu.location"),
            icon: "mdi-map-marker",
            to: "/location",
          });
        }
        if (token_access[10] != 0) {
          this.items.push({
            id: 10,
            title: this.$t("menu.recurring"),
            icon: "mdi-repeat",
            to: "/recurring",
          });
        }
        if (token_access[11] != 0) {
          this.items.push({
            id: 11,
            title: this.$t("menu.item"),
            icon: "mdi-form-select",
            to: "/item",
          });
        }
        if (token_access[12] != 0) {
          this.companyIcon = true;
        }

        // ordering menu
        let order = [0, 5, 6, 11, 1, 2, 3, 8, 9, 10, 7, 4];
        this.items.sort(function(x, y) {
          return order.indexOf(x.id) - order.indexOf(y.id);
        });
      } catch (e) {
        // console.log(0);
      }
    },

    languageChange(e) {
      console.log(e);
      localStorage.setItem("Lang", e);
      window.location.reload();
    },
    update() {
      console.log("  croppa.generateDataUrl() ", this.croppa.generateDataUrl());
      this.showOnProfile = true;
      this.$refs.form.validate().then((success) => {
        if (!success) {
          return;
        }

        console.log(this.editedItem);

        const obj = {
          id: this.editedItem.id,
          name: this.editedItem.name,
          email: this.editedItem.email,

          address: this.editedItem.address,
          phone: this.editedItem.phone,
          nic: this.editedItem.nic,
          gender: this.editedItem.gender,
          profilePic: this.croppa.generateDataUrl(),
          dob: moment(this.editedItem.dob).format("X"),
          location: this.editedItem.location,
          zip: this.editedItem.zip,
          account_number: this.editedItem.accountNumber,
          language: this.editedItem.language,
        };

        this.$http
          .put(this.url.user + "/profileUpdate/" + obj.id, obj)
          .then((result) => {
            console.log("update console", result);
            this.profileInfoModel = false;

            let user_EncKey = this.$gl.EncKey(
              JSON.stringify({
                id: obj.id,
                name: obj.name,
                phone: obj.phone,
              })
            );

            localStorage.removeItem("user");
            localStorage.setItem("user", user_EncKey);
            this.userInfomration();

            // this.notification("User has been updated successfully", "green");
          })
          .catch((err) => {
            // this.notification(
            //   "Something went wrong on update... please try again",
            //   "red"
            // );

            this.$gl.Unauthorized(err.response.status);
          });
      });
    },
    FileUpload(e) {
      console.log("triggered");
      console.log(e);
      let reader = new FileReader();
      reader.onload = (fileArray) => {
        console.log(reader.result);
        // this.profileLogo.push(reader.result);
      };
      reader.readAsDataURL(e);

      // console.log(this.profileLogo);
    },
    getImageUrl() {
      // croppa.generateDataUrl()
      console.log("  croppa.generateDataUrl() ", this.croppa.generateDataUrl());
    },
    profileEdit() {
      let DecKey = this.$gl.DecKey(localStorage.getItem("user"));
      let i = JSON.parse(DecKey);
      console.log(i);
      this.$http
        .get(this.url.user + "/" + i.id)
        .then((response) => {
          let i = response.data.selected_user;
          this.editedItem = Object.assign(i, {
            dob: moment(i.dob * 1000)
              .add(1, "d")
              .toISOString()
              .substr(0, 10),
          });
          this.profileInfoModel = true;
          console.log("this.editedItem ", this.editedItem);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    removeStorage() {
      localStorage.clear();
    },
    logout() {
      console.log("loggedout");
      let url = "/logout";
      this.$http
        .get(url)
        .then((response) => {
          this.removeStorage();
          this.$router.go({
            path: "login",
          });
        })
        .catch((response) => {
          console.log("Error Fround. logout issue");
        });
    },
    checkFullScreen() {
      if (localStorage.getItem("fullScreen") == 1) {
        this.fullscreen = true;
        // console.log("full screen");
      } else {
        // console.log("normal screen");
        this.fullscreen = false;
      }
    },
    getFullScreen() {
      document.documentElement
        .requestFullscreen()
        .then(() => {
          this.fullscreen = true;
          localStorage.setItem("fullScreen", 1);
          console.log("fullscreen activated");
        })
        .catch((e) => {
          console.log(e);
        });
    },
    exitFullScreen() {
      document
        .exitFullscreen()
        .then(() => {
          this.fullscreen = false;
          localStorage.setItem("fullScreen", 0);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    bugCapture() {
      console.log("capture bug");
      html2canvas(document.getElementById("app"), {
        // html2canvas(document.getElementsByClassName(".v-main__wrap"), {
        logging: true,
        letterRendering: true,
        allowTaint: false,
        useCORS: true,
        // scale: (1920 * 2) / window.innerWidth,
        //   scale: globalThis.screen.availWidth,
        backgroundColor: null,
      })
        .then((canvas) => {
          console.log(canvas.toDataURL("image/jpg"));
          localStorage.setItem("screenshot", canvas.toDataURL("image/jpg"));
          // this.saveAs(canvas.toDataURL("image/jpg"), "FastFest.jpg");
        })

        .catch((error) => {
          console.log("ERROR SAVING BUG CAPTURE IMAGE", error);
        });
    },
  },
};
</script>
<style scoped>
.formStyle {
  /* background-color: blueviolet !important; */
  min-width: 770px !important;
}

.inputStyle {
  margin-left: 8px !important;
}
.rowStyle {
  display: flex !important;
  flex-wrap: nowrap !important;
  flex-basis: auto;
  flex-shrink: 1;
}
.upload_container {
  position: relative;
  /* flex-direction: row; */
  /* justify-items: center;
  display: flex;
  align-content: center; */
}
.upload_container .defalt_img {
  position: block;
}
.upload_container .upload_default_icon {
  position: absolute;
  top: 30%;
  left: 35%;
  background-color: #fff;
  color: gray;
  border-radius: 50px;
  padding: 10px;
  opacity: 0.4;
}
.upload_default_icon:hover {
  background-color: gray;
  color: white;
  opacity: 0.9;
  cursor: pointer;
}
.croppa {
  padding: 0px !important;
  border: 1px blue dotted;
}
</style>
