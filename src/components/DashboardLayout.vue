<template>
  <div id="DashboardLayout">
    <v-app-bar :color="headerColor" dark app height="37" dense flat>
      <!-- <v-btn small icon>
        <v-icon small>mdi-menu</v-icon>
      </v-btn> -->
      Dashboard
      <v-spacer></v-spacer>
      <v-btn small icon @click="getFullScreen" v-if="!fullscreen">
        <v-icon small>mdi-arrow-expand-all</v-icon>
      </v-btn>
      <v-btn small icon color="white" dark @click="exitFullScreen" v-else>
        <v-icon>mdi-arrow-expand</v-icon>
      </v-btn>
      <v-btn small icon @click="logout">
        <v-icon small>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      elevation
      app
      :color="sideBar"
      :expand-on-hover="true"
      permanent
      mini-variant-width="40"
    >
      <v-list dense nav class="pa-0">
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          :to="item.to"
          class="text-decoration-none"
        >
          <v-list-item-icon>
            <v-icon class="gray--text" small>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="gray--text">
              {{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  name: "DashboardLayout",
  data() {
    return {
      headerColor: "primary",
      sideBar: "indigo lighten-4",
      items: [
        {
          title: "DASHBOARD",
          icon: "mdi-home",
          to: "/usr_dashboard",
        },
        {
          title: "PROJECTS",
          icon: "mdi-image-filter-center-focus-strong",
          to: "/usr_projects",
        },
        {
          title: "SYSTEMS",
          icon: "mdi-server",
          to: "usr_systems",
        },
        {
          title: "TASKS",
          icon: "mdi-clipboard-list",
          to: "",
        },
      ],
      fullscreen: false,
    };
  },
  mounted() {
    console.log(localStorage.getItem("fullScreen"));
    if (localStorage.getItem("fullScreen") == 1) {
      this.fullscreen = true;

      console.log("full screen");
    } else {
      console.log("normal screen");
      this.fullscreen = false;
    }
  },
  methods: {
    logout() {
      console.log("loggedout");
      let url = '/usr_logout'
      this.$http
        .get(url)
        .then((response) => {
          console.log(response.data);
         console.log(response)
         localStorage.removeItem('token')
          this.$router.push({
              name: "Login",
            });
        })
        .catch((response) => {
          console.log("Error Fround. Project Not Saved");
        });
    },
    getFullScreen() {
      document.documentElement
        .requestFullscreen()
        .then(() => {
          this.fullscreen = true;
          localStorage.setItem("fullScreen", 1);
          console.log("fullscreen activated");
        })
        .catch((e) => {
          console.log(e);
        });
    },
    exitFullScreen() {
      document
        .exitFullscreen()
        .then(() => {
          this.fullscreen = false;
          localStorage.setItem("fullScreen", 0);
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>

<style></style>
