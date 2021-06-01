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
      <!-- {{ $t("dashboard.title") }} --  -->

      <v-icon small left class="ml-4">mdi-calendar-month</v-icon>

      {{ date }}

      <v-spacer></v-spacer>

      <v-btn small icon color="white" dark title="Choose Theme">
        <v-icon small>mdi-select-color</v-icon>
      </v-btn>

      <v-menu top close-on-click>
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="white" dark v-bind="attrs" small v-on="on" icon>
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

      <v-avatar size="22" color="white" class="pa-1 ma-1">
        <img
          :src="'http://localhost:8000/storage/' + user.profile"
          v-if="user.profile"
        />
        <v-img src="../assets/default_logo.jpeg" v-else></v-img>
      </v-avatar>
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
      dark
    >
      <!-- User Information -->

      <v-list-item class="px-2">
        <v-list-item-avatar size="30">
          <v-img
            :src="'http://localhost:8000/storage/' + user.profile"
            v-if="user.profile"
          ></v-img>

          <v-img src="../assets/default_logo.jpeg" v-else></v-img>
        </v-list-item-avatar>

        <v-list-item-title>
          {{ user.name }}
        </v-list-item-title>

        <v-btn icon @click.stop="mini = !mini">
          <v-icon small>mdi-pencil</v-icon>
        </v-btn>
      </v-list-item>

      <v-divider></v-divider>
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
            <v-icon class="gray--text pa-1" small>{{ item.icon }}</v-icon>
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
      headerColor: "blue-grey darken-1",
      sideBar: "blue-grey darken-3",

      expand_on_hover: true,
      mobileDrawer: false,
      access_permission: false,
      Languages: [{ lan: "English" }, { lan: "spanish" }],
      user: {},
      items: [],
      fullscreen: false,
      interval: null,
      time: null,
      date: null,
    };
  },
  beforeMount() {
    this.checkingRoutes();
  },
  mounted() {
    this.checkFullScreen();
    this.userInfomration();
  },
  created() {
    let current = new Date();

    this.date =
      current.getDate() +
      "/" +
      current.getMonth() +
      "/" +
      current.getFullYear();
  },

  methods: {
    userInfomration() {
      let i = JSON.parse(localStorage.getItem("user"));
      this.user = Object.assign(i);

      // console.log(this.user);
    },
    checkingRoutes() {
      // modules   are indexed
      // 0 - dashboard
      // 1 - project
      // 2 - system
      // 3 - task
      // 4 - user
      // 5 - po
      // 6 - order
      // 7 - accounts
      let token_access = JSON.parse(localStorage.getItem("token_access"));
      if (token_access[0] != 0) {
        // console.log("dashboard");
        this.items.push({
          id: 0,
          title: this.$t("menu.dashboard"),
          icon: "mdi-home",
          to: "/dashboard",
        });
      }
      if (token_access[1] != 0) {
        // console.log("project");
        this.items.push({
          id: 1,
          title: this.$t("menu.projects"),
          icon: "mdi-image-filter-center-focus-strong",
          to: "/projects",
        });
      }
      if (token_access[2] != 0) {
        // console.log("system");
        this.items.push({
          id: 2,
          title: this.$t("menu.systems"),
          icon: "mdi-server",
          to: "systems",
        });
      }
      if (token_access[3] != 0) {
        // console.log("task");
        this.items.push({
          id: 3,
          title: this.$t("menu.tasks"),
          icon: "mdi-clipboard-list",
          to: "tasks",
        });
      }
      if (token_access[4] != 0) {
        // console.log("user");
        this.items.push({
          id: 4,
          title: this.$t("menu.users"),
          icon: "mdi-account-cog",
          to: "users",
        });
      }
      if (token_access[5] != 0) {
        // console.log("po");
        this.items.push({
          id: 5,
          title: this.$t("menu.po"),
          icon: "mdi-alpha-p-circle",
          to: "/po",
        });
      }
      if (token_access[6] != 0) {
        this.items.push({
          id: 6,
          title: this.$t("menu.order"),
          icon: "mdi-checkbox-multiple-blank-circle-outline",
          to: "/order",
        });
      }
      if (token_access[7] != 0) {
        this.items.push({
          id: 7,
          title: this.$t("menu.account"),
          icon: "mdi-table-account",
          to: "/account",
        });
      }
      if (token_access[8] != 0) {
        this.items.push({
          id: 8,
          title: this.$t("menu.holiday"),
          icon: "mdi-calendar-check-outline",
          to: "/holiday",
        });
      }

      // ordering menu
      let order = [0, 5, 6, 1, 2, 3, 8, 7, 4];
      this.items.sort(function(x, y) {
        return order.indexOf(x.id) - order.indexOf(y.id);
      });
    },

    languageChange(e) {
      console.log(e);
      localStorage.setItem("Lang", e);
      window.location.reload();
    },
    removeStorage() {
      localStorage.removeItem("token");
      localStorage.removeItem("token_access");
      localStorage.removeItem("paginateKey");
      localStorage.removeItem("user_pk");
      localStorage.removeItem("fullScreen");
      localStorage.removeItem("user");
      localStorage.removeItem("user_active_columns");
    },
    logout() {
      console.log("loggedout");
      let url = "/logout";
      this.$http
        .get(url)
        .then((response) => {
          this.removeStorage();
          this.$router.go({
            path: "login",
          });
        })
        .catch((response) => {
          console.log("Error Fround. logout issue");
        });
    },
    checkFullScreen() {
      if (localStorage.getItem("fullScreen") == 1) {
        this.fullscreen = true;
        // console.log("full screen");
      } else {
        // console.log("normal screen");
        this.fullscreen = false;
      }
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
