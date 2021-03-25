<template>
  <div class="home">
    <!-- App bar Component -->
    <Appbar />

    <!-- Carousel Image Component-->
    <Carousel style="margin-top:-25px;" />

    <!-- Services card -->
    <v-row class="m-0 ">
      <v-col
        md="12"
        sm="12"
        cols="12"
        class="d-flex justify-center align-center mt-3"
      >
        <h3>
          <span style="color:#46bd55;">OUR</span>
          <span> SERVICES</span>
        </h3>
      </v-col>
      <v-col
        md="2"
        sm="3"
        cols="12"
        v-for="(x, i) in services"
        :key="i"
        class="container"
      >
        <v-card class="mx-auto" max-width="300" flat>
          <v-img :src="x.img" height="200px"></v-img>

          <v-card-title class="service_title">
            {{ x.name }}
          </v-card-title>

          <!-- <v-card-subtitle>
            {{ x.description }}
          </v-card-subtitle> -->

          <!-- <v-card-actions>
            <v-btn
              color="orange lighten-2"
              text
              to="/property"
              class="text-decoration-none"
            >
              Explore
            </v-btn>
          </v-card-actions> -->
        </v-card>
      </v-col>
    </v-row>

    <!-- Contact Form Component-->
    <ContactForm class="mt-5" />

    <!-- Footer Component -->

    <Footer />
  </div>
</template>

<script>
import Appbar from "../components/Appbar";
import Carousel from "../components/Carousel";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";

export default {
  name: "Home",
  components: {
    Appbar,
    Carousel,
    ContactForm,
    Footer,
  },
  data() {
    return {
      services: [
        {
          name: "SALES MANAGMENT",
          img:
            "https://www.toolshero.com/wp-content/uploads/2019/02/sales-management-toolshero.jpg",
        },
        {
          name: "FINANCE & ACCOUNTING",
          img:
            "http://hawkscode.com.au/services/outsourcing-services/finance-accounting-outsourcing/image/1.jpg",
        },
        {
          name: "PURCHASE & INVENTORY",
          img:
            "https://kuwaitlisting.com/wp-content/uploads/Inventory-Controller.jpg",
        },

        {
          name: "SUPPLY CHAIN MANAGMENT",
          img:
            "https://www.lokad.com/public/Upload//Support/Glossary/supply-chain-management.png",
        },
        {
          name: "PRODUCT MANAGMENT",
          img:
            "https://www.productplan.com/uploads/Stages-in-Product-Management-Process.png",
        },
      ],
    };
  },
};
</script>
