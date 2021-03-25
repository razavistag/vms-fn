<template>
  <div id="Carousel">
    <v-row class="m-0">
      <v-col md="12" sm="12" cols="12" class="p-0">
        <agile
          :nav-buttons="false"
          :autoplay-speed="3500"
          :speed="2500"
          fade="fade"
          pause-on-hover="pause-on-hover"
          pause-on-dots-hover="pause-on-dots-hover"
          autoplay="autoplay"
          ><img
            class="slide"
            src="https://webthemez.com/demo/myhome-real-estate-website-template/img/slides/1.jpg"
          />
          <img
            class="slide"
            src="https://webthemez.com/demo/myhome-real-estate-website-template/img/slides/2.jpg"
          />
        </agile>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "Carousel",
};
</script>
