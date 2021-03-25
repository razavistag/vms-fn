<template>
  <div id="Login">
    <!-- App bar Component -->
    <Appbar />
    <div id="wrapLogin">
      <v-row align-content="center" class="h-100">
        <v-col
          md="12"
          sm="12"
          cols="12"
          class="d-flex justify-content-center h-100 mx-auto"
        >
          <v-card width="400" height="370" v-if="Activate_Signin" flat tile>
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
                    <b-form-checkbox class="d-flex justify-center align-center">
                      Remember Me
                    </b-form-checkbox>
                    <v-btn color="blue" text tile class=" ml-6"
                      >Forget Password</v-btn
                    >
                  </v-col>

                  <v-col
                    md="12"
                    cols="12"
                    class="  pt-0 pb-0  ma-0  mt-3 pl-8 pr-8 "
                  >
                    <v-btn block color="success" @click="Login">Login</v-btn>
                  </v-col>
                </v-row>

                <v-row class="pl-8 pt-3" justify="center">
                  <v-col md="2" sm="2" cols="3" class=" ">
                    <v-btn icon la>
                      <v-icon>fab fa-google-plus-g</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col md="2" sm="2" cols="3" class=" ">
                    <v-btn icon la>
                      <v-icon>fab fa-facebook</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col md="2" sm="2" cols="3" class=" ">
                    <v-btn icon la>
                      <v-icon>fab fa-twitter-square</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </ValidationObserver>
            </v-card-text>
          </v-card>

          <v-card width="400" height="500" v-else>
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

                  <v-col md="12" cols="12" class="  pa-0 mt-4 pl-4 pr-8">
                    <ValidationProvider
                      rules="required|min:5"
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
                          <v-icon>mdi-email</v-icon>
                        </template>
                      </v-text-field>
                    </ValidationProvider>
                  </v-col>

                  <v-col md="12" cols="12" class="  pa-0 mt-4 pl-4 pr-8">
                    <ValidationProvider
                      rules="required|min:5"
                      name="Address"
                      v-slot="{ errors }"
                    >
                      <v-text-field
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
                      </v-text-field>
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
                        v-model="RegisterForm.Password"
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

                  <!-- <v-col md="12" cols="12" class="  pa-0 mt-4 pl-4 pr-8">
                    <ValidationProvider
                      rules="required"
                      name="Employee Position"
                      v-slot="{ errors }"
                    >
                      <v-select
                        :items="RoleAccess"
                        v-model="RegisterForm.role"
                        dense
                        outlined
                        hide-details=""
                        :label="errors[0] ? errors[0] : 'Employee Position'"
                        :error-messages="errors"
                      >
                        <template v-slot:prepend>
                          <v-icon>mdi-access-point-check</v-icon>
                        </template></v-select
                      >
                    </ValidationProvider>
                  </v-col> -->

                  <v-col
                    md="12"
                    cols="12"
                    class="  pt-0 pb-0  ma-0  mt-3 pl-12 pr-8 "
                  >
                    <v-btn block color="success" @click="register"
                      >Register</v-btn
                    >
                  </v-col>
                </v-row>
              </ValidationObserver>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <Footer />
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
      email: "",
      password: "",
      Activate_Signin: true,
      Activate_Register: true,
      RegisterForm: {
        name: "",
        companyName: "",
        email: "",
        phone: "",
        address: "",
        role: "",
      },
      RoleAccess: ["Manager", "Supervisor", "Employee"],
    };
  },
  methods: {
    tabLogin() {
      console.log(0);
      this.tab_login = true;
    },
    Login() {
      this.$refs.form.validate().then((success) => {
        if (!success) {
          return;
        }

        console.log("sucess");

        localStorage.setItem("Key", "access_token");

        // this.$router.push({ path: "dashboard" });

        this.email = "";
        this.password = "";

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

        console.log("register");

        localStorage.setItem("Key", "access_token");

        let store = this.RegisterForm;
        console.log(store);

        this.$nextTick(() => {
          this.$refs.Registerform.reset();
          console.log("cleared");
        });

        this.$router.push({ path: "dashboard" });
      });
    },
  },
};
</script>

<style scoped>
#wrapLogin {
  background-size: cover;
  background-repeat: no-repeat;
  height: 720px;
  width: 100%;
  font-family: "Numans", sans-serif;
  padding-top: 100px;
  background-image: url("../assets/login_bg.jpg");
}
</style>
