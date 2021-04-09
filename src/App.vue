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
              <v-row class="m-0">
                <v-col md="6" sm="6" cols="12" class=" pa-2 ma-0">
                  <v-select
                    :items="priorityTypes"
                    label="priority"
                    dense
                  ></v-select>
                </v-col>
                <v-col md="6" sm="6" cols="12" class=" pa-2 ma-0">
                  <v-select :items="BugType" label="Bug Type" dense></v-select>
                </v-col>
                <v-col md="12" sm="12" cols="12" class=" pt-0 pl-2 pr-2 ma-0">
                  <v-textarea
                    label="Message"
                    auto-grow
                    rows="1"
                    row-height="15"
                    counter
                  ></v-textarea>
                </v-col>
                <v-col
                  md="6"
                  sm="6"
                  cols="12"
                  class="d-flex align-center justify-center"
                >
                  <v-img
                    :src="screenShot_dataURL"
                    max-width="350"
                    max-height="350"
                    @click="zoomImage"
                    class="pointer"
                  >
                  </v-img>

                  <div class="v_icon_zoom_img">
                    <v-icon size="40" class="v_icon_zoom">
                      mdi-magnify-scan
                    </v-icon>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="bugCaptureClose">
              cancel
            </v-btn>

            <v-btn color="green darken-1" text @click="bugCaptureClose">
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

export default {
  name: "App",

  components: {},

  data: () => ({
    //
    BugCaptureDialog: false,
    displayBug: false,
    ZoomImageDialog: false,

    screenShot_dataURL: "",

    priorityTypes: ["Critical", "High", "Medium", "Low"],
    BugType: [
      "Rendering Error",
      "Functional Error",
      "Duplicate Error",
      "Invalid Data Error",
      "Suggestion",
      "Enhancement",
    ],
  }),
  methods: {
    bugCapture() {
      localStorage.removeItem("screenshot");
      this.screenShot_dataURL = "";

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
.pointer{
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
  position: fixed;
}
.v_icon_zoom:hover {
  /* background-color: green  !important; */
  /* color: green !important; */
  font-size: 50px !important;
  cursor: pointer;
}
</style>
