<template>
  <v-app>
    <v-main>
      <router-view></router-view>

      <!-- BugCapture Button -->
      <v-btn
        icon
        color="red"
        rounded
        id="fixed_button"
        class="fixed_button"
        v-shortkey="['alt', 'b']"
        @shortkey="bugCapture()"
        @click="bugCapture"
      >
        <v-icon>mdi-bug</v-icon>
      </v-btn>

      <!-- BugCapture Model -->
      <v-dialog
        v-model="BugCaptureDialog"
        max-width="690"
        content-class="Bug_CaptureDialog"
        persistent
      >
        <v-card>
          <v-card-title class="blue-grey lighten-4">
            <h4 class="ma-0">Bug Capture</h4>
            <v-spacer></v-spacer>
            <v-icon @click="bugCaptureClose">mdi-close</v-icon>
          </v-card-title>

          <v-card-text class="">
            <v-container>
              <ValidationObserver ref="form">
                <v-row class="m-0">
                  <v-col md="6" sm="6" cols="12" class=" pa-2 ma-0">
                    <ValidationProvider
                      rules="required"
                      name="Priority Type"
                      v-slot="{ errors }"
                    >
                      <v-select
                        v-model="form.PriorityType"
                        prefix="*"
                        :items="priorityTypes"
                        :label="errors[0] ? errors[0] : 'Priority Type'"
                        hide-details=""
                        :error-messages="errors"
                        dense
                      ></v-select>
                    </ValidationProvider>
                  </v-col>
                  <v-col md="6" sm="6" cols="12" class=" pa-2 ma-0">
                    <ValidationProvider
                      rules="required"
                      name="Bug Type"
                      v-slot="{ errors }"
                    >
                      <v-select
                        prefix="*"
                        v-model="form.BugType"
                        :items="BugType"
                        :label="errors[0] ? errors[0] : 'Bug Type'"
                        hide-details=""
                        :error-messages="errors"
                        dense
                      ></v-select>
                    </ValidationProvider>
                  </v-col>
                  <v-col md="12" sm="12" cols="12" class=" pt-0 pl-2 pr-2 ma-0">
                    <ValidationProvider
                      rules="required"
                      name="Message"
                      v-slot="{ errors }"
                    >
                      <v-textarea
                        v-model="form.Message"
                        :items="BugType"
                        :label="errors[0] ? errors[0] : 'Message'"
                        hide-details=""
                        :error-messages="errors"
                        prefix="*"
                        auto-grow
                        rows="1"
                        row-height="15"
                        counter
                      ></v-textarea>
                    </ValidationProvider>
                  </v-col>
                  <v-col
                    md="6"
                    sm="6"
                    cols="12"
                    class="d-flex align-center justify-center flex-column"
                  >
                    <v-img
                      :src="screenShot_dataURL"
                      max-width="350"
                      max-height="350"
                      @click="zoomImage"
                      class="pointer"
                    >
                    </v-img>

                    <div class="v_icon_zoom_img" @click="zoomImage">
                      <v-icon size="40" class="v_icon_zoom">
                        mdi-magnify-scan
                      </v-icon>
                    </div>
                  </v-col>

                  <v-col md="6" sm="6" cols="12" class="pl-6">
                    <ImageFileUploader
                      ref="imageUploader"
                      @upload-success="uploadImageSuccess"
                    />
                  </v-col>
                </v-row>
              </ValidationObserver>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="bugCaptureClose">
              cancel
            </v-btn>

            <v-btn color="green darken-1" text @click="submitBugCapture">
              submit
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Zoom Image -->
      <v-dialog
        v-model="ZoomImageDialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card flat tile>
          <v-toolbar color="blue-grey lighten-5" elevation="0">
            <v-toolbar-title>Image View</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn icon @click="ZoomImageDialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>

          <v-card-text class=" pa-5">
            <v-container class=" ">
              <v-img
                :src="screenShot_dataURL"
                max-width="100%"
                max-height="100%"
              >
              </v-img>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script>
import html2canvas from "html2canvas";
import ImageFileUploader from "./components/ImageFileUploader";
import { ValidationObserver, ValidationProvider } from "vee-validate";

export default {
  name: "App",

  components: {
    ImageFileUploader,
    ValidationObserver,
    ValidationProvider,
  },

  data: () => ({
    //
    BugCaptureDialog: false,
    displayBug: false,
    ZoomImageDialog: false,
    screenShot_dataURL: "",
    addedImages: [],
    priorityTypes: ["Critical", "High", "Medium", "Low"],
    BugType: [
      "Rendering Error",
      "Functional Error",
      "Duplicate Error",
      "Invalid Data Error",
      "Suggestion",
      "Enhancement",
    ],
    form: {
      PriorityType: "",
      BugType: "",
      Message: "",
    },
  }),
  methods: {
    uploadImageSuccess(ImageURL, index) {
      // console.log("data 1 ", ImageURL);
      // console.log("data 2 ", index);

      this.addedImages.push(ImageURL);
      console.log("ADD_IMAGE", this.addedImages);
    },
    bugCapture() {
      localStorage.removeItem("screenshot");
      this.screenShot_dataURL = "";

      this.form.PriorityType = "";
      this.form.BugType = "";
      this.form.Message = "";

      console.log("BugCapture Triggered");
      html2canvas(document.getElementById("app"), {
        logging: true,
        letterRendering: true,
        allowTaint: false,
        useCORS: true,
        backgroundColor: null,
      })
        .then((canvas) => {
          // console.log(canvas.toDataURL("image/jpg"));
          localStorage.setItem("screenshot", canvas.toDataURL("image/jpg"));
          this.BugCaptureDialog = true;
          this.screenShot_dataURL = localStorage.getItem("screenshot");
        })

        .catch((error) => {
          console.log("ERROR SAVING BUG CAPTURE IMAGE", error);
        });
    },
    bugCaptureClose() {
      this.BugCaptureDialog = false;
      localStorage.removeItem("screenshot");
      this.screenShot_dataURL = "";
    },
    zoomImage() {
      console.log("zoom image");
      this.ZoomImageDialog = true;
    },

    submitBugCapture() {
      this.$refs.form.validate().then((success) => {
        if (!success) {
          return;
        }

        // let img_arr = [];
        // this.addedImages[0].forEach((element) => {
        //   img_arr.push(element);
        // });

        console.log("store", this.addedImages[0]);

        let store = {
          priority: this.form.PriorityType,
          type: this.form.BugType,
          message: this.form.Message,
          images: [
            {
              screenShot: this.screenShot_dataURL,
              addedImages: this.addedImages[0],
            },
          ],
        };
        // console.log(store);
        let url = "bug_capture";
        this.$http
          .post(url, store)
          .then((response) => {
            console.log(response);
            this.BugCaptureDialog = false;
            // clearing state
            localStorage.removeItem("screenshot");
            this.screenShot_dataURL = "";

            this.$nextTick(function() {
              this.$refs.imageUploader.removeAll();
            });
          })
          .catch((response) => {
            console.log("Error Fround. Bug Not Saved");
          });

        this.$nextTick(() => {
          this.$refs.form.reset();
          console.log("cleared");
        });
      });
      // console.log("submit Triggered");
      // this.BugCaptureDialog = false;
      // // clearing state
      // localStorage.removeItem("screenshot");
      // this.screenShot_dataURL = "";

      // this.addedImages.forEach((element) => {
      //   console.log(element);
      // });

      // this.$nextTick(function() {
      //   this.$refs.imageUploader.removeAll();
      // });
    },
  },
};
</script>
<style lang="css">
#fixed_button {
  width: 50px;
  height: 50px;
  color: #fff;
  text-align: center;
  background-color: #b0bec5;
  border-radius: 50px;
  position: fixed;
  bottom: 30px;
  right: 30px;
  cursor: pointer;
  font-size: 18px;
  line-height: 50px;
  z-index: 999;
  transition: 0.5s;
}
.pointer {
  cursor: pointer;
}
.Bug_CaptureDialog {
  align-self: flex-start;
  position: relative;
  top: 150px;
}
.v_icon_zoom_img {
  /* background-color: red !important; */
  font-size: 20px;
  position: absolute;
}
.v_icon_zoom:hover {
  /* background-color: green  !important; */
  /* color: green !important; */
  font-size: 50px !important;
  cursor: pointer;
}
</style>
