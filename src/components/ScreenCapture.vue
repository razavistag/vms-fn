<template>
  <div id="ScreenCapture" ref="capture">
    <v-row>
      <v-col>ScreenCapture -- {{get}}</v-col>
    </v-row>
  </div>
</template>

<script>
import html2canvas from "html2canvas";
export default {
  name: "ScreenCapture",
  props: {
    get: {
      type: String,
    },
  },
  mounted() {
    // html2canvas(document.body).then(function(canvas) {
    //   let a =document.body.appendChild(canvas);
    //   console.log(a)
    // });
    console.log(this.get);

    html2canvas(document.getElementById("Projects"), {
      logging: true,
      letterRendering: true,
      allowTaint: false,
      useCORS: true,
      scale: (1920 * 2) / window.innerWidth,
    //   scale: globalThis.screen.availWidth,
      backgroundColor: null,
    })
      .then((canvas) => {
        console.log(canvas.toDataURL("image/jpg"));
        localStorage.setItem('screenshot',canvas.toDataURL("image/jpg"))
        // this.saveAs(canvas.toDataURL("image/jpg"), "FastFest.jpg");
      })

      .catch((error) => {
        console.log("ERROR SAVING FESTIVAL IMAGE", error);
      });
  },
};
</script>

<style></style>
