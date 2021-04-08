<template>
  <div id="DashboardLayout">
    <v-app-bar :color="headerColor" dark app height="37" dense flat>
      <v-btn small icon class="v_menu_icon_btn" @click="mobileDrawer = !mobileDrawer">
        <v-icon small>mdi-menu</v-icon>
      </v-btn>
      Dashboard
      <v-spacer></v-spacer>
      <v-btn small icon @click="bugCapture">
        <v-icon small>mdi-bug</v-icon>
      </v-btn>
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

    <!-- desktop navigation on hover -->
    <v-navigation-drawer
  
      elevation
      app
      :color="sideBar"
      :expand-on-hover="true"
      permanent
      mini-variant-width="40"
      class="navigation_drawer_desktop"
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

    <!-- mobile Navigation on menu button click -->
    <v-navigation-drawer
    data-html2canvas-ignore="true"
      elevation
      app
      :color="sideBar"
      temporary
      
      v-model="mobileDrawer"
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
import html2canvas from "html2canvas";

export default {
  name: "DashboardLayout",
  data() {
    return {
      headerColor: "primary",
      sideBar: "indigo lighten-4",
      expand_on_hover: true,
      mobileDrawer: false,
      items: [
        {
          title: "DASHBOARD",
          icon: "mdi-home",
          to: "/dashboard",
        },
        {
          title: "PROJECTS",
          icon: "mdi-image-filter-center-focus-strong",
          to: "/projects",
        },
        {
          title: "SYSTEMS",
          icon: "mdi-server",
          to: "systems",
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
      let url = "/logout";
      this.$http
        .get(url)
        .then((response) => {
          console.log(response.data);
          console.log(response);
          localStorage.removeItem("token");
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
    bugCapture(){
      console.log('capture bug')
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
        localStorage.setItem('screenshot',canvas.toDataURL("image/jpg"))
        // this.saveAs(canvas.toDataURL("image/jpg"), "FastFest.jpg");
      })

      .catch((error) => {
        console.log("ERROR SAVING BUG CAPTURE IMAGE", error);
      });
    }
  },
};
</script>
