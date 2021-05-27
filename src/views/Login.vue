<template>
  <div id="Login" class=" ">
    <!-- App bar Component class="red d-flex flex-row align-center"-->
    <Appbar />

    <v-row align="center" justify="center">
      <v-col md="6" cols="12" class=" ">
        <v-row align="center" justify="center">
          <v-container>
            <v-row justify="center" class="  ma-0 pa-0 pb-0">
              <v-col md="6" class="ma-0 pa-0  ">
                <v-col md="12" cols="12" class="pa-0  ">
                  <h3>LOGIN TO <strong>VMS</strong></h3>
                </v-col>
                <v-col md="12" cols="12" class="  ma-0 pa-0 ">
                  <p class="blue-grey--text">
                    Lorem ipsum dolor sit amet elit. Sapiente sit aut eos
                    consectetur adipisicing.Lorem ipsum dolor sit amet elit.
                    Sapiente sit aut eos consectetur adipisicing.
                  </p>
                </v-col>
              </v-col>
            </v-row>
            <ValidationObserver ref="form">
              <v-row justify="center" class="  ma-0 pa-0 pb-0">
                <v-col md="6">
                  <v-col md="12" sm="12" cols="12" class="  ">
                    <ValidationProvider
                      rules="required|email"
                      name="Email"
                      v-slot="{ errors }"
                    >
                      <v-text-field
                        outlined
                        dense
                        id="loginEmail"
                        v-model="email"
                        hide-details=""
                        :label="errors[0] ? errors[0] : 'Email'"
                        :error-messages="errors"
                      >
                        <template v-slot:prepend-inner>
                          <v-icon>mdi-account</v-icon>
                        </template>
                      </v-text-field>
                    </ValidationProvider>
                  </v-col>

                  <v-col md="12" sm="12" cols="12" class="  ">
                    <ValidationProvider
                      rules="required|min:4"
                      name="Password"
                      v-slot="{ errors }"
                    >
                      <v-text-field
                        outlined
                        dense
                        id="loginPassword"
                        type="password"
                        v-model="password"
                        :error-messages="errors"
                        :label="errors[0] ? errors[0] : 'Password'"
                        hide-details=""
                      >
                        <template v-slot:prepend-inner>
                          <v-icon>mdi-form-textbox-password</v-icon>
                        </template>
                      </v-text-field>
                    </ValidationProvider>
                  </v-col>

                  <v-col
                    md="12"
                    sm="6"
                    cols="12"
                    class=" d-flex flex-row justify-space-between pa-0"
                  >
                    <v-checkbox
                      id="loginRememberCheckBox"
                      class=" ml-3 mt-1  ma-0"
                      v-model="rememberMe"
                      label="Remember Me"
                    >
                    </v-checkbox>

                    <v-btn plain color="blue" class="ma-0 ml-0">
                      Forget Password
                    </v-btn>
                  </v-col>

                  <v-col md="12" sm="12" cols="12" class="   ma-0 pa-0 pl-4 ">
                    <v-btn
                      to="/register"
                      color="blue"
                      plain
                      class="ma-0   pa-0"
                      height="10"
                    >
                      create a new account
                    </v-btn>
                  </v-col>
                  <v-col
                    md="12"
                    sm="12"
                    cols="12"
                    class=" pa-0  ma-0 pl-4 pr-2 "
                  >
                    <v-btn
                      block
                      color="success"
                      @click="LoginSubmit"
                      id="loginSubmitBtn"
                    >
                      Login
                    </v-btn>
                  </v-col>
                </v-col>
              </v-row>
            </ValidationObserver>
          </v-container>
        </v-row>
      </v-col>
      <v-col md="6" cols="12" class="sideSection">
        <div class="bgImage"></div>
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
      email: "admin@gmail.com",
      password: "password",

      // email: "althaf@gmail.com",
      // password: "saasdd",
      rememberMe: false,

      snackbar: {
        show: false,
        time: 3000,
        message: "",
        color: "",
      },
    };
  },
  methods: {
    mockAxiosGetFunction() {
      this.$http.get("/projects?page=1").then((res) => {
        // console.log("test_get_projects", res);
      });
    },
    mockAxiosPostFunction() {
      const post_arr = {
        email: this.email,
        password: this.password,
      };
      this.$http.post("/login", post_arr).then((res) => {
        // console.log("test_post_login ", res);
      });
    },
    LoginSubmit() {
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
            this.message = response.data.message;

            if (this.rememberMe == true) {
              localStorage.setItem("Remember", true);
            }

            if (response.data.message === "Pending Account Registeration") {
              this.message = "Pending Account Registeration";
            } else {
              this.email = "";
              this.password = "";

              localStorage.setItem("token", response.data.access_token);
              localStorage.setItem("token_access", response.data.user_access);
              localStorage.setItem(
                "user",
                JSON.stringify(response.data.user_information)
              );

              this.$router
                .push({
                  path: "dashboard",
                })
                .catch((e) => {
                  console.log("catch on admin dashboard error", e);
                });
            }

            let pendingError = "Pending Account Registeration";
            if (response.data.message == pendingError) {
              this.notification(pendingError, "red");
            }
          })
          .catch((err) => {
            console.log(err);
            this.message = "ACCOUNT NOT FOUND";
            if (err.response) {
              console.log(err.response.data.message);
              this.notification(err.response.data.message, "red");
            }
          });

        this.$nextTick(() => {
          this.$refs.form.reset();
        });
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
