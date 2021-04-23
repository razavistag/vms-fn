<template>
  <div id="Login">
    <!-- App bar Component -->
    <Appbar />
    <div id="wrapLogin">
      <v-container class="lighten-5">
        <v-row class="mb-6" no-gutters>
          <v-col md="4" offset-md="4">
            <v-card class="pa-2" v-if="Activate_Signin" flat outlined tile>
              <v-card-title>
                <v-tabs>
                  <v-tab @click="ActivateSingIn">Sign In</v-tab>
                  <v-tab @click="ActivateRegister">Register</v-tab>
                </v-tabs>

                <!-- <h3>Sign In</h3> -->
              </v-card-title>
              <v-card-text>
                <ValidationObserver ref="form">
                  <v-row>
                    <v-col md="12" cols="12" class="  pa-0 mt-4 pl-4 pr-8">
                      <ValidationProvider
                        rules="required|email"
                        name="Email"
                        v-slot="{ errors }"
                      >
                        <v-text-field
                          outlined
                          dense
                          v-model="email"
                          hide-details=""
                          :label="errors[0] ? errors[0] : 'Email'"
                          :error-messages="errors"
                        >
                          <template v-slot:prepend>
                            <v-icon>mdi-account</v-icon>
                          </template>
                        </v-text-field>
                      </ValidationProvider>
                    </v-col>

                    <v-col md="12" cols="12" class="  pa-0 mt-4 pl-4  pr-8">
                      <ValidationProvider
                        rules="required|min:4"
                        name="Password"
                        v-slot="{ errors }"
                      >
                        <v-text-field
                          outlined
                          dense
                          type="password"
                          v-model="password"
                          :error-messages="errors"
                          :label="errors[0] ? errors[0] : 'Password'"
                          hide-details=""
                        >
                          <template v-slot:prepend>
                            <v-icon>mdi-form-textbox-password</v-icon>
                          </template>
                        </v-text-field>
                      </ValidationProvider>
                    </v-col>

                    <v-col
                      md="12"
                      cols="12"
                      class="pa-0  ma-0  mt-3 pl-12 d-flex flex-row "
                    >
                      <v-checkbox
                        class="d-flex justify-center align-center"
                        v-model="rememberMe"
                      >
                        Remember Me
                      </v-checkbox>

                      <v-btn color="blue" text tile class=" ml-6"
                        >Forget Password</v-btn
                      >
                    </v-col>

                    <v-col
                      md="12"
                      cols="12"
                      class="  pt-0 pb-0  ma-0  mt-3 pl-8 pr-8 "
                    >
                      <P class="red--text"> {{ message }}</P>
                      <v-btn block color="success" @click="Login">Login</v-btn>
                    </v-col>
                  </v-row>

                  <v-row class="pl-8 pt-3" justify="center">
                    <v-col md="2" sm="2" cols="3" class=" ">
                      <v-btn icon>
                        <v-icon>fab fa-google-plus-g</v-icon>
                      </v-btn>
                    </v-col>
                    <v-col md="2" sm="2" cols="3" class=" ">
                      <v-btn icon @click="FacbookApi">
                        <v-icon>fab fa-facebook</v-icon>
                      </v-btn>
                    </v-col>
                    <v-col md="2" sm="2" cols="3" class=" ">
                      <v-btn icon>
                        <v-icon>fab fa-twitter-square</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-row class="justify-center">
                    <v-col><Footer /></v-col>
                  </v-row>
                </ValidationObserver>
              </v-card-text>
            </v-card>
            <v-card class="pa-2" v-else>
              <v-card-title>
                <v-tabs>
                  <v-tab @click="ActivateSingIn">Sign In</v-tab>
                  <v-tab @click="ActivateRegister">Register</v-tab>
                </v-tabs>

                <!-- <h3>Sign In</h3> -->
              </v-card-title>

              <v-card-text>
                <ValidationObserver ref="Registerform">
                  <v-row>
                    <!-- name -->
                    <v-col md="12" cols="12" class="  pa-0 mt-4 pl-4 pr-8">
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
                          <template v-slot:prepend>
                            <v-icon>mdi-account</v-icon>
                          </template>
                        </v-text-field>
                      </ValidationProvider>
                    </v-col>

                    <!-- company -->
                    <v-col md="12" cols="12" class="  pa-0 mt-4 pl-4 pr-8">
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
                          <template v-slot:prepend>
                            <v-icon>mdi-map-marker</v-icon>
                          </template>
                        </v-text-field>
                      </ValidationProvider>
                    </v-col>

                    <!-- Email -->
                    <v-col md="12" cols="12" class="  pa-0 mt-4 pl-4 pr-8">
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
                          <template v-slot:prepend>
                            <v-icon>mdi-email</v-icon>
                          </template>
                        </v-text-field>
                      </ValidationProvider>
                    </v-col>

                    <!-- phone -->
                    <v-col md="12" cols="12" class="  pa-0 mt-4 pl-4 pr-8">
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
                          <template v-slot:prepend>
                            <v-icon>mdi-phone</v-icon>
                          </template>
                        </v-text-field>
                      </ValidationProvider>
                    </v-col>

                    <!-- nic -->
                    <v-col md="12" cols="12" class="  pa-0 mt-4 pl-4 pr-8">
                      <ValidationProvider
                        rules="required|numeric"
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
                          <template v-slot:prepend>
                            <v-icon>mdi-card-account-details</v-icon>
                          </template>
                        </v-text-field>
                      </ValidationProvider>
                    </v-col>
                    <!-- phone -->
                    <v-col md="12" cols="12" class="  pa-0 mt-4 pl-4 pr-8">
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
                          <template v-slot:prepend>
                            <v-icon>mdi-phone</v-icon>
                          </template>
                        </v-text-field>
                      </ValidationProvider>
                    </v-col>

                    <!-- gender -->
                    <v-col md="12" cols="12" class="  pa-0 mt-4 pl-4 pr-8">
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
                          <template v-slot:prepend>
                            <v-icon>mdi-gender-female</v-icon>
                          </template>
                        </v-select>
                      </ValidationProvider>
                    </v-col>

                    <!-- address -->
                    <v-col md="12" cols="12" class="  pa-0 mt-4 pl-4 pr-8">
                      <ValidationProvider
                        rules="required|min:5"
                        name="Address"
                        v-slot="{ errors }"
                      >
                        <!-- <v-text-field
                        outlined
                        dense
                        v-model="RegisterForm.address"
                        hide-details=""
                        :label="errors[0] ? errors[0] : 'Address'"
                        :error-messages="errors"
                      >
                        <template v-slot:prepend>
                          <v-icon>mdi-map-marker</v-icon>
                        </template>
                      </v-text-field> -->

                        <v-textarea
                          name="input-4-1"
                          outlined
                          dense
                          v-model="RegisterForm.address"
                          hide-details=""
                          :label="errors[0] ? errors[0] : 'Address'"
                          :error-messages="errors"
                          rows="2"
                          row-height="5"
                        >
                          <template v-slot:prepend>
                            <v-icon>mdi-map-marker</v-icon>
                          </template>
                        </v-textarea>
                      </ValidationProvider>
                    </v-col>

                    <!-- Password -->
                    <v-col md="12" cols="12" class="  pa-0 mt-4 pl-4 pr-8">
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
                          <template v-slot:prepend>
                            <v-icon>mdi-form-textbox-password</v-icon>
                          </template>
                        </v-text-field>
                      </ValidationProvider>
                    </v-col>

                    <!-- Password Confirm-->
                    <v-col md="12" cols="12" class="  pa-0 mt-4 pl-4 pr-8">
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
                          <template v-slot:prepend>
                            <v-icon>mdi-form-textbox-password</v-icon>
                          </template>
                        </v-text-field>
                      </ValidationProvider>
                    </v-col>

                    <v-col
                      md="12"
                      cols="12"
                      class="  pt-0 pb-0  ma-0  mt-3 pl-12 pr-8 "
                    >
                      <v-btn block color="success" @click="register">
                        Register
                      </v-btn>
                    </v-col>
                  </v-row>
                </ValidationObserver>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
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
      tab_login: false,
      tab_register: false,
      email: "umuller@example.net",
      password: "password",
      rememberMe: false,
      Activate_Signin: true,
      Activate_Register: true,
      RegisterForm: {
        name: "",
        companyName: "",
        email: "",
        phone: "",
        nic: "",
        gender: "",
        address: "",
        password: "",
        passwordConfirm: "",
      },
      genderItems: ["Male", "Female", "Other"],
      message: "",
    };
  },
  methods: {
    tabLogin() {
      // console.log(0);
      this.tab_login = true;
    },
    Login() {
      this.$refs.form.validate().then((success) => {
        if (!success) {
          return;
        }

        let uri = "/login";
        const login = {
          email: this.email,
          password: this.password,
        };
        this.$http
          .post(uri, login)
          .then((response) => {
            console.log(response.data.message);
            this.message = response.data.message;

            if (this.rememberMe == true) {
              console.log("remember true");
              localStorage.setItem("Remember", true);
            }

            if (response.data.message === "Pending Account Registeration") {
              this.message = "Pending Account Registeration";
            } else {
              this.email = "";
              this.password = "";

              this.$nextTick(() => {
                this.$refs.form.reset();
                console.log("cleared");
              });

              localStorage.setItem("token", response.data.access_token);
              localStorage.setItem("token_access", response.data.user_access);
              localStorage.setItem(
                "token_access_url",
                response.data.user_access_url
              );
              this.$router.push({
                name: "AdminDashboard",
              });
            }
          })
          .catch((response) => {
            console.log(response);
            this.message = "ACCOUNT NOT FOUND";

            console.log("access denied");
          });

        this.$nextTick(() => {
          this.$refs.form.reset();
          console.log("cleared");
        });
      });
    },

    ActivateSingIn() {
      this.Activate_Signin = true;
      this.Activate_Register = false;
    },

    ActivateRegister() {
      this.Activate_Signin = false;
      this.Activate_Register = true;
    },

    register() {
      console.log("register triggered");

      this.$refs.Registerform.validate().then((success) => {
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
          this.$refs.Registerform.reset();
          console.log("cleared");
        });

        // this.$router.push({ path: "system_login" });
      });
    },

    FacbookApi() {
      let url = "auth/facebook";
      this.$http
        .get(url)
        .then((response) => {
          console.log(response);
        })
        .catch((response) => {
          console.log("response");
          console.log("response");
        });
    },
  },
};
</script>

<style scoped>
#wrapLogin {
  background-size: cover;
  background-repeat: no-repeat;
  height: 760px;
  width: 100%;
  font-family: "Numans", sans-serif;
  padding-top: 80px;
  background-image: url("../assets/login_bg.jpg");
}
</style>
