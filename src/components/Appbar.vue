<template>
  <div id="Appbar">
    <v-app-bar app dark flat dense :color="headerColor" height="35px">
      <span class="app-header-caption-text ml-2">
        <v-icon small>mdi-clock</v-icon>
        Mon - Fri 8.00 - 18.00
      </span>
      <v-spacer></v-spacer>
      <span class="app-header-caption-text mr-2">
        <v-icon small>mdi-phone</v-icon>
        Tel No. (+94) 777-123-456
      </span>
    </v-app-bar>

    <v-card color="blue lighten-4" class="mt-2 mb-0  " flat height="" tile>
      <v-toolbar flat tile dens>
        <v-btn to="/" class="text-decoration-none" small depressed>
          VISTA MANAGMENT SYSTEM
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn
          text
          depressed
          class="text-decoration-none"
          to="login"
          small
          id="login_btn"
        >
          Login <v-icon small right>mdi-login</v-icon>
        </v-btn>
      </v-toolbar>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "Appbar",

  components: {},

  data: () => ({
    headerColor: "blue-grey darken-3",
  }),
  beforeMount() {},
  mounted() {
    // console.log(data)
  },
  methods: {},
};
</script>
