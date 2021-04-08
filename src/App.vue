<template>
  <v-app>
    <v-main>
      <router-view></router-view>

      <!-- BugCapture Button -->
      <v-btn icon color="red" rounded class="fixed_button" @click="bugCapture">
        <v-icon>mdi-bug</v-icon>
      </v-btn>

      <!-- BugCapture Model -->
      <v-dialog
        v-model="BugCaptureDialog"
        max-width="690"
        content-class="Bug_CaptureDialog"
      >
        <v-card>
          <v-card-title class="blue-grey lighten-4">
            <h4 class="ma-0">Bug Capture</h4>
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
                  <v-select :items="items" label="Error Type" dense></v-select>
                </v-col>
                <v-col md="12" sm="12" cols="12" class=" pt-0 pl-2 pr-2 ma-0">
                  <v-textarea
                    label="Message"
                    auto-grow
                    rows="1"
                    row-height="15"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              color="green darken-1"
              text
              @click="BugCaptureDialog = false"
            >
              cancel
            </v-btn>

            <v-btn
              color="green darken-1"
              text
              @click="BugCaptureDialog = false"
            >
              submit
            </v-btn>
          </v-card-actions>
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
    BugCaptureDialog: true,
    displayBug: false,

    priorityTypes: ["Critical", "High", "Medium", "Low"],
  }),
  methods: {
    bugCapture() {
      this.BugCaptureDialog = true;
      console.log("BugCapture Triggered");
      html2canvas(document.getElementById("app"), {
        logging: true,
        letterRendering: true,
        allowTaint: false,
        useCORS: true,
        backgroundColor: null,
      })
        .then((canvas) => {
          console.log(canvas.toDataURL("image/jpg"));
          localStorage.setItem("screenshot", canvas.toDataURL("image/jpg"));
        })

        .catch((error) => {
          console.log("ERROR SAVING BUG CAPTURE IMAGE", error);
        });
    },
  },
};
</script>
<style lang="scss">
.fixed_button {
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

.Bug_CaptureDialog {
  align-self: flex-start;
  position: relative;
  top: 150px;
}
</style>
