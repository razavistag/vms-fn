<template>
  <div id="ContactForm">
    <v-container>
      <v-row>
        <v-col cols="12" md="5" sm="5"
          ><iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15827.726396879207!2d80.6173336!3d7.3615645!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x4380567147222663!2sVistaG%20Consultant%20(PVT)%20LTD!5e0!3m2!1sen!2slk!4v1616326829868!5m2!1sen!2slk"
            width="100%"
            height="100%"
            style="border:0;"
            allowfullscreen="true"
            loading="lazy"
          ></iframe
        ></v-col>
        <v-col cols="12" md="7" sm="7">
          <section class="mb-4">
            <!--Section heading-->
            <h2 class="h1-responsive font-weight-bold text-center my-4">
              Contact us
            </h2>
            <!--Section description-->
            <p class="text-center w-responsive mx-auto mb-5">
              Do you have any questions? Please do not hesitate to contact us
              directly. Our team will come back to you within a matter of hours
              to help you.
            </p>

            <v-row>
              <v-col md="12" sm="12" cols="12">
                <v-text-field
                  outlined
                  background-color="white"
                  label="Your Name"
                  dense
                >
                </v-text-field>
              </v-col>

              <v-col md="12" sm="12" cols="12" class="margins-0">
                <v-text-field
                  outlined
                  background-color="white"
                  label="Your Email"
                  dense
                >
                </v-text-field>
              </v-col>

              <v-col md="12" sm="12" cols="12" class="margins-0">
                <v-text-field
                  outlined
                  background-color="white"
                  label="Subject"
                  dense
                >
                </v-text-field>
              </v-col>

              <v-col cols="12" sm="12" md="12" class="margins-0">
                <v-textarea
                  label="Message"
                  auto-grow
                  background-color="white"
                  outlined
                  rows="4"
                  row-height="50"
                ></v-textarea>
              </v-col>
              <v-col cols="12" sm="12" md="12" class="margins-0">
                <v-btn color="primary" tile>SEND MESSAGE</v-btn>
              </v-col>
            </v-row>
          </section></v-col
        >
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "ContactForm",
};
</script>
<style scoped>
#ContactForm {
  background-size: cover;

  background: linear-gradient(0deg, rgb(158 192 145), rgb(159 217 224));
}
</style>
