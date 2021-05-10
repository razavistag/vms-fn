<template>
  <div id="DashboardLayout">
    <v-app-bar :color="headerColor" dark app height="37" dense flat>
      <v-btn
        small
        icon
        class="v_menu_icon_btn"
        @click="mobileDrawer = !mobileDrawer"
      >
        <v-icon small>mdi-menu</v-icon>
      </v-btn>
      <!-- Dashboard -->
      {{ $t("dashboard.title") }}
      <v-spacer></v-spacer>

      <v-menu top close-on-click>
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="white" dark v-bind="attrs" v-on="on" icon>
            <v-icon small>mdi-translate</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item v-for="(item, index) in Languages" :key="index">
            <v-btn text @click="languageChange(item.lan)">{{ item.lan }}</v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn
        small
        icon
        @click="getFullScreen"
        v-if="!fullscreen"
        v-shortkey="['alt', '+']"
        @shortkey="getFullScreen()"
      >
        <v-icon small>mdi-arrow-expand-all</v-icon>
      </v-btn>
      <v-btn
        small
        icon
        color="white"
        dark
        @click="exitFullScreen"
        v-shortkey="['alt', '-']"
        @shortkey="exitFullScreen()"
        v-else
      >
        <v-icon>mdi-arrow-expand</v-icon>
      </v-btn>
      <v-btn
        id="logoutBtn"
        small
        icon
        @click="logout"
        v-shortkey="['alt', 'q']"
        @shortkey="logout()"
      >
        <v-icon small>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- desktop navigation on hover -->
    <v-navigation-drawer
      elevation
      app
      :color="sideBar"
      permanent
      mini-variant-width="40"
      class="navigation_drawer_desktop"
      expand-on-hover
    >
      <!-- expand-on-hover -->
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
      access_permission: false,
      Languages: [{ lan: "English" }, { lan: "spanish" }],
      items: [
        // {
        //   id: 0,
        //   title: "DASHBOARD",
        //   icon: "mdi-home",
        //   to: "/dashboard",
        // },
        // {
        //   id: 1,
        //   title: "PROJECTS",
        //   icon: "mdi-image-filter-center-focus-strong",
        //   to: "/projects",
        // },
        // {
        //   id: 2,
        //   title: "SYSTEMS",
        //   icon: "mdi-server",
        //   to: "systems",
        // },
        // {
        //   id: 3,
        //   title: "TASKS",
        //   icon: "mdi-clipboard-list",
        //   to: "tasks",
        // },
      ],
      fullscreen: false,
    };
  },
  beforeMount() {
    let permission = localStorage.getItem("token_access");
    console.log("%cACCESS_INDEX >>", "color:green", permission);

    let permission_url = JSON.parse(localStorage.getItem("token_access_url"));
    permission_url.forEach((element) => {
      console.log("%cLayout_INDEX >>", "color:blue", element);
      if (element == 0) {
        this.items.push({
          id: 0,
          // title: "DASHBOARD",
          title: this.$t("menu.dashboard"),
          icon: "mdi-home",
          to: "/dashboard",
        });
      }
      if (element == 1) {
        this.items.push({
          id: 1,
          title: this.$t("menu.projects"),
          icon: "mdi-image-filter-center-focus-strong",
          to: "/projects",
        });
      }
      if (element == 2) {
        this.items.push({
          id: 2,
          title: this.$t("menu.systems"),
          icon: "mdi-server",
          to: "systems",
        });
      }
      if (element == 3) {
        this.items.push({
          id: 3,
          title: this.$t("menu.tasks"),
          icon: "mdi-clipboard-list",
          to: "tasks",
        });
      }
      if (element == 4) {
        this.items.push({
          id: 3,
          title: this.$t("menu.users"),
          icon: "mdi-account-cog",
          to: "users",
        });
      }
    });
  },
  mounted() {
    let getToken = JSON.parse(localStorage.getItem("token"));
    console.log("get token", getToken);

    if (getToken == null) {
      this.$router
        .push({
          path: "login",
        })
        .catch((e) => {
          // console.log("catch on admin dashboard error", e);
        });
    }
    console.log(localStorage.getItem("fullScreen"));
    if (localStorage.getItem("fullScreen") == 1) {
      this.fullscreen = true;

      console.log("full screen");
    } else {
      // console.log("normal screen");
      this.fullscreen = false;
    }
  },
  methods: {
    languageChange(e) {
      console.log(e);
      localStorage.setItem("Lang", e);
      window.location.reload();
    },
    logout() {
      console.log("loggedout");
      let url = "/logout";
      this.$http
        .get(url)
        .then((response) => {
          console.log(response.data);
          console.log(response);
          localStorage.removeItem("token");
          localStorage.removeItem("token_access_url");
          localStorage.removeItem("token_access");
          this.$router.push({
            name: "Login",
          });
        })
        .catch((response) => {
          console.log("Error Fround. logout issue");
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
    bugCapture() {
      console.log("capture bug");
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
    },
  },
};
</script>
