<template>
  <div id="Appbar">
    <v-app-bar app dark flat dense color="#46bd55" height="25px">
      <span class="app-header-caption-text ml-2">
        <v-icon small>mdi-clock</v-icon>
        Mon - Fri 8.00 - 18.00
      </span>
      <v-spacer></v-spacer>
      <span class="app-header-caption-text mr-2">
        <v-icon small>mdi-phone</v-icon>
        Tel No. (+94) 777-123-456
      </span>

      <!-- 
        CHOOSE LANGUAGE FROM DROPDOWN  
        <v-menu top :close-on-click="closeOnClick">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="white"
            dark
            v-bind="attrs"
            v-on="on"
            x-small
            icon
            class=" pa-0"
          >
            <v-icon small>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item v-for="(item, index) in Languages" :key="index">
            <v-btn text @click="languageChange(item.lan)">{{ item.lan }}</v-btn>
          </v-list-item>
        </v-list>
      </v-menu> -->
    </v-app-bar>

    <v-card color="blue lighten-4" class="mt-1 mb-6  " flat height="" tile>
      <v-toolbar flat tile dens>
        <v-btn text to="/" class="text-decoration-none" small depressed>
          VISTA MANAGMENT SYSTEM
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn text class="text-decoration-none" to="system_login" small>
          Login <v-icon>mdi-login</v-icon>
        </v-btn>
      </v-toolbar>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "Appbar",

  components: {},

  data: () => ({}),
  beforeMount() {},
  mounted() {
    // console.log(data)
  },
  methods: {},
};
</script>
