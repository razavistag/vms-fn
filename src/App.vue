<template>
  <v-app>
    <v-main>
      <router-view></router-view>

      <!-- BugCapture Button -->
      <v-btn
        icon
        color="red"
        rounded
        class="fixed_button"
        @click="bugCapture"
       
      >
        <v-icon>mdi-bug</v-icon>
      </v-btn>

      <!-- BugCapture Model -->
      <v-dialog v-model="BugCaptureDialog" max-width="690">
        <v-card>
          <v-card-title class="blue-grey lighten-2">
            <h4 class="ma-0">Bug Capture</h4>
          </v-card-title>

          <v-card-text>
            Let Google help apps determine location. This means sending
            anonymous location data to Google, even when no apps are running.
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              color="green darken-1"
              text
              @click="BugCaptureDialog = false"
            >
              Disagree
            </v-btn>

            <v-btn
              color="green darken-1"
              text
              @click="BugCaptureDialog = false"
            >
              Agree
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
    BugCaptureDialog: false,
    displayBug: false,
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
<style lang="scss" scoped>
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
</style>
