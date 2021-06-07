<template>
  <div id="Dashboard">
    <!-- Layout -->
    <DashboardLayout />

    <v-row>
      <v-col md="12" sm="12" cols="12" class="d-flex justify-center">
        <!-- <v-container class="d-flex"> -->
        <v-card
          color="pink lighten-1"
          dark
          max-width="150"
          class="ma-3 "
          v-for="(item, index) in cardList"
          :key="index"
        >
          <v-card-title class="pa-3 pink lighten-1">
            <v-icon left>
              {{ item.icon }}
            </v-icon>
            <v-spacer></v-spacer>
            <span class="font-weight-light"> {{ item.count }} +</span>
          </v-card-title>

          <v-card-text class="pink lighten-2 pa-0 text-center ">
            {{ item.title }}
          </v-card-text>
        </v-card>
        <!-- </v-container> -->
      </v-col>
    </v-row>
  </div>
</template>

<script>
import DashboardLayout from "../../components/DashboardLayout";

export default {
  name: "Dashboard",
  components: {
    DashboardLayout,
  },
  data() {
    return {
      cardList: [
        // {
        //   title: this.$t("menu.projects"),
        //   icon: "mdi-image-filter-center-focus-strong",
        //   count: "50",
        // },
        // {
        //   title: this.$t("menu.systems"),
        //   icon: "mdi-server",
        //   count: "50",
        // },
        // {
        //   title: this.$t("menu.tasks"),
        //   icon: "mdi-clipboard-list",
        //   count: "50",
        // },
        // {
        //   title: this.$t("menu.users"),
        //   icon: "mdi-account-cog",
        //   count: "50",
        // },
        // {
        //   title: this.$t("menu.po"),
        //   icon: "mdi-alpha-p-circle",
        //   count: "50",
        // },
        // {
        //   title: this.$t("menu.order"),
        //   icon: "mdi-checkbox-multiple-blank-circle-outline",
        //   count: "50",
        // },
        // {
        //   title: this.$t("menu.account"),
        //   icon: "mdi-table-account",
        //   count: "50",
        // },
        // {
        //   title: this.$t("menu.holiday"),
        //   icon: "mdi-calendar-check-outline",
        //   count: "50",
        // },
        // {
        //   title: this.$t("menu.location"),
        //   icon: "mdi-map-marker",
        //   count: "50",
        // },
      ],
    };
  },
  beforeMount() {
    this.displayCard();
  },
  methods: {
    displayCard() {
      try {
        let DecKey = this.$gl.DecKey(localStorage.getItem("token_access"));
        let token_access = JSON.parse(DecKey);

        if (token_access[0] != 0) {
          // console.log("dashboard");
          this.cardList.push({
            title: this.$t("menu.dashboard"),
            icon: "mdi-home",
            count: "50",
          });
        }
        if (token_access[1] != 0) {
          // console.log("project");
          this.cardList.push({
            title: this.$t("menu.projects"),
            icon: "mdi-image-filter-center-focus-strong",
            count: "50",
          });
        }
        if (token_access[2] != 0) {
          // console.log("system");
          this.cardList.push({
            title: this.$t("menu.systems"),
            icon: "mdi-server",
            count: "50",
          });
        }
        if (token_access[3] != 0) {
          // console.log("task");
          this.cardList.push({
            title: this.$t("menu.tasks"),
            icon: "mdi-clipboard-list",
            count: "50",
          });
        }
        if (token_access[4] != 0) {
          // console.log("user");
          this.cardList.push({
            title: this.$t("menu.users"),
            icon: "mdi-account-cog",
            count: "50",
          });
        }
        if (token_access[5] != 0) {
          // console.log("po");
          this.cardList.push({
            title: this.$t("menu.po"),
            icon: "mdi-alpha-p-circle",
            count: "50",
          });
        }
        if (token_access[6] != 0) {
          this.cardList.push({
            title: this.$t("menu.order"),
            icon: "mdi-checkbox-multiple-blank-circle-outline",
            count: "50",
          });
        }
        if (token_access[7] != 0) {
          this.cardList.push({
            title: this.$t("menu.account"),
            icon: "mdi-table-account",
            count: "50",
          });
        }
        if (token_access[8] != 0) {
          this.cardList.push({
            title: this.$t("menu.holiday"),
            icon: "mdi-calendar-check-outline",
            count: "50",
          });
        }
        if (token_access[9] != 0) {
          this.cardList.push({
            title: this.$t("menu.location"),
            icon: "mdi-map-marker",
            count: "50",
          });
        }
      } catch (e) {
        // console.log(0);
      }
    },
  },
};
</script>

<style></style>
