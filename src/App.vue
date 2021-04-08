<template>
  <v-app>
    <v-main>
      <router-view></router-view>
      <v-btn icon color="red" rounded class="fixed_button" @click="bugCapture">
        <v-icon>mdi-bug</v-icon>
      </v-btn>
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
  }),
  methods: {
    bugCapture() {
      console.log("cap bug");
      setTimeout(() => {
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
      }, 4000);
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
  border-radius: 10px;
  position: fixed;
  bottom: 10px;
  right: 30px;
  cursor: pointer;
  font-size: 18px;
  line-height: 50px;
  z-index: 999;
  transition: 0.5s;
}
</style>
