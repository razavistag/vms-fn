<template>
  <div id="Login" class=" ">
    <!-- App bar Component class="red d-flex flex-row align-center"-->
    <Appbar />

    <v-row align="center" class="m-0">
      <v-col md="4" cols="12" class="sideSection d-none d-md-flex d-sm-none">
        <div class="bgImage"></div>
      </v-col>

      <v-col md="8" cols="12" class=" ">
        <v-row align="center" justify="center" class="m-0">
          <v-container>
            <v-row justify="center" class="   ma-0 pa-0 pb-0">
              <v-col md="6" class="ma-0 pa-0  ">
                <v-col md="12" cols="12" class="pa-0  ">
                  <h3>REGISTER WITH <strong>VMS</strong></h3>
                </v-col>
                <v-col md="12" cols="12" class="  ma-0 pa-0 ">
                  <p class="blue-grey--text ma-0 pa-0">
                    Lorem ipsum dolor sit amet elit. Sapiente sit aut eos
                    consectetur adipisicing.Lorem ipsum dolor sit amet elit.
                    Sapiente sit aut eos consectetur adipisicing.
                  </p>
                </v-col>
              </v-col>
            </v-row>
            <ValidationObserver ref="form">
              <v-row justify="center" class="m-0   ma-0 pa-0 pb-0">
                <!-- name -->
                <v-col md="5" cols="12" class="  pa-0 ml-4 mt-2 ">
                  <ValidationProvider
                    rules="required|min:4"
                    name="User Name"
                    v-slot="{ errors }"
                  >
                    <v-text-field
                      outlined
                      dense
                      v-model="RegisterForm.name"
                      hide-details=""
                      :label="errors[0] ? errors[0] : 'User Name'"
                      :error-messages="errors"
                    >
                      <template v-slot:prepend-inner>
                        <v-icon>mdi-account</v-icon>
                      </template>
                    </v-text-field>
                  </ValidationProvider>
                </v-col>

                <!-- company -->
                <v-col md="5" cols="12" class="  pa-0 ml-4 mt-2">
                  <ValidationProvider
                    rules="required|min:2"
                    name="Company Name"
                    v-slot="{ errors }"
                  >
                    <v-text-field
                      outlined
                      dense
                      v-model="RegisterForm.companyName"
                      hide-details=""
                      :label="errors[0] ? errors[0] : 'Company Name'"
                      :error-messages="errors"
                    >
                      <template v-slot:prepend-inner>
                        <v-icon>mdi-map-marker</v-icon>
                      </template>
                    </v-text-field>
                  </ValidationProvider>
                </v-col>

                <!-- Email -->
                <v-col md="5" cols="12" class="  pa-0 ml-4 mt-2">
                  <ValidationProvider
                    rules="required|email"
                    name="Email"
                    v-slot="{ errors }"
                  >
                    <v-text-field
                      outlined
                      dense
                      v-model="RegisterForm.email"
                      hide-details=""
                      :label="errors[0] ? errors[0] : 'Email'"
                      :error-messages="errors"
                    >
                      <template v-slot:prepend-inner>
                        <v-icon>mdi-email</v-icon>
                      </template>
                    </v-text-field>
                  </ValidationProvider>
                </v-col>

                <!-- phone -->
                <v-col md="5" cols="12" class="  pa-0 ml-4 mt-2">
                  <ValidationProvider
                    rules="required|numeric|min:9|max:9"
                    name="Phone"
                    v-slot="{ errors }"
                  >
                    <v-text-field
                      outlined
                      dense
                      prefix="+94"
                      v-model="RegisterForm.phone"
                      hide-details=""
                      :label="errors[0] ? errors[0] : 'Phone'"
                      :error-messages="errors"
                    >
                      <template v-slot:prepend-inner>
                        <v-icon>mdi-phone</v-icon>
                      </template>
                    </v-text-field>
                  </ValidationProvider>
                </v-col>

                <!-- nic -->
                <v-col md="5" cols="12" class="  pa-0 ml-4 mt-2">
                  <ValidationProvider
                    rules="required"
                    name="NIC"
                    v-slot="{ errors }"
                  >
                    <v-text-field
                      outlined
                      dense
                      v-model="RegisterForm.nic"
                      hide-details=""
                      :label="errors[0] ? errors[0] : 'NIC Number'"
                      :error-messages="errors"
                    >
                      <template v-slot:prepend-inner>
                        <v-icon>mdi-card-account-details</v-icon>
                      </template>
                    </v-text-field>
                  </ValidationProvider>
                </v-col>
                <!-- phone -->
                <v-col md="5" cols="12" class="  pa-0 ml-4 mt-2">
                  <ValidationProvider
                    rules="required|numeric|min:9|max:9"
                    name="Phone"
                    v-slot="{ errors }"
                  >
                    <v-text-field
                      outlined
                      dense
                      prefix="+94"
                      v-model="RegisterForm.phone"
                      hide-details=""
                      :label="errors[0] ? errors[0] : 'Phone'"
                      :error-messages="errors"
                    >
                      <template v-slot:prepend-inner>
                        <v-icon>mdi-phone</v-icon>
                      </template>
                    </v-text-field>
                  </ValidationProvider>
                </v-col>

                <!-- gender -->
                <v-col md="5" cols="12" class="  pa-0 ml-4 mt-2 ">
                  <ValidationProvider
                    rules="required"
                    name="Gender"
                    v-slot="{ errors }"
                  >
                    <v-select
                      :items="genderItems"
                      v-model="RegisterForm.gender"
                      outlined
                      dense
                      hide-details=""
                      :label="errors[0] ? errors[0] : 'Gender'"
                      :error-messages="errors"
                    >
                      <template v-slot:prepend-inner>
                        <v-icon>mdi-gender-female</v-icon>
                      </template>
                    </v-select>
                  </ValidationProvider>
                </v-col>

                <!-- address -->
                <v-col md="5" cols="12" class="  pa-0 ml-4 mt-2">
                  <ValidationProvider
                    rules="required|min:5"
                    name="Address"
                    v-slot="{ errors }"
                  >
                    <v-textarea
                      name="input-4-1"
                      outlined
                      dense
                      v-model="RegisterForm.address"
                      hide-details=""
                      :label="errors[0] ? errors[0] : 'Address'"
                      :error-messages="errors"
                      rows="1"
                      row-height="5"
                    >
                      <template v-slot:prepend-inner>
                        <v-icon>mdi-map-marker</v-icon>
                      </template>
                    </v-textarea>
                  </ValidationProvider>
                </v-col>

                <!-- Password -->
                <v-col md="5" cols="12" class="  pa-0 ml-4 mt-2">
                  <ValidationProvider
                    rules="required|min:5"
                    name="Password"
                    v-slot="{ errors }"
                  >
                    <v-text-field
                      outlined
                      type="password"
                      dense
                      v-model="RegisterForm.password"
                      hide-details=""
                      :label="errors[0] ? errors[0] : 'Password'"
                      :error-messages="errors"
                    >
                      <template v-slot:prepend-inner>
                        <v-icon>mdi-form-textbox-password</v-icon>
                      </template>
                    </v-text-field>
                  </ValidationProvider>
                </v-col>

                <!-- Password Confirm-->
                <v-col md="5" cols="12" class="  pa-0 ml-4 mt-2">
                  <ValidationProvider
                    rules="required|min:5"
                    name="confirm"
                    v-slot="{ errors }"
                  >
                    <v-text-field
                      outlined
                      type="password"
                      dense
                      v-model="RegisterForm.passwordConfirm"
                      hide-details=""
                      :label="errors[0] ? errors[0] : 'Confirm Password'"
                      :error-messages="errors"
                    >
                      <template v-slot:prepend-inner>
                        <v-icon>mdi-form-textbox-password</v-icon>
                      </template>
                    </v-text-field>
                  </ValidationProvider>
                </v-col>

                <v-col
                  md="11"
                  cols="12"
                  class="  pt-0 pb-0  ma-0  mt-3  pr-7 pl-11 "
                >
                  <v-btn block color="success" @click="register">
                    Register
                  </v-btn>
                  <!-- <v-btn block color="success" @click="register">
                      Register
                    </v-btn> -->
                </v-col>
              </v-row>
            </ValidationObserver>
          </v-container>
        </v-row>
      </v-col>
    </v-row>
    <!-- NOTIFICATION -->
    <v-snackbar
      v-model="snackbar.show"
      :timeout="snackbar.time"
      :color="snackbar.color"
      top
      outlined
      left
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
import Footer from "../components/Footer";
import Appbar from "../components/Appbar";
import { ValidationObserver, ValidationProvider } from "vee-validate";

export default {
  name: "Login",
  components: {
    Appbar,
    Footer,
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      RegisterForm: {
        name: "althaf",
        companyName: "vista",
        email: "althaf@gmail.com",
        phone: "777123456",
        nic: "5897486521V",
        gender: "MALE",
        address: "200, Akurana, Kandy",
        password: "password",
        passwordConfirm: "password",
      },
      snackbar: {
        show: false,
        time: 3000,
        message: "",
        color: "",
      },
      genderItems: ["MALE", "FEMALE", "OTHERS"],
    };
  },
  methods: {
    register() {
      console.log("register triggered");

      this.$refs.form.validate().then((success) => {
        if (!success) {
          return;
        }

        const register = {
          name: this.RegisterForm.name,
          company: this.RegisterForm.companyName,
          email: this.RegisterForm.email,
          phone: this.RegisterForm.phone,
          nic: this.RegisterForm.nic,
          gender: this.RegisterForm.gender,
          address: this.RegisterForm.address,
          password: this.RegisterForm.password,
          passwordConfirm: this.RegisterForm.passwordConfirm,

          // fill by form
        //   profilePic: 0,
          dob: 0,
          city: 0,
          location: 0,
          zip: 0,
          account_number: 0,
          //   fill by form end

          access: { 0: 1, 1: 1, 2: 1, 3: 1, 4: 1 },
          attempts: 5,
          role: 0,
          status: 0,
          user_type: 1,
          opening_balance: 0,
          balance: 0,
          credit_limit: 0,
          basic_salary: 0,
          monthly_target: 0,
          target_percentage: 0,
          language: 1,
          payment_terms: 0,
          sales_rep_id: 0,
        };
        let url = "/register";

        this.$http
          .post(url, register)
          .then((response) => {
            console.log(response);
            this.ActivateSingIn();
          })
          .catch((response) => {
            console.log(response);
          });

        this.$nextTick(() => {
          this.$refs.form.reset();
          console.log("cleared");
        });

        // this.$router.push({ path: "system_login" });
      });
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

<style scoped>
.bgImage {
  background-size: cover;
  background-position-x: -10em;
  background-repeat: no-repeat;
  height: 89vh;
  width: 100%;
  background-image: url("../assets/login_bg.jpg");
}
</style>
