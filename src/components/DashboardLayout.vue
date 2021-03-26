<template>
  <div id="DashboardLayout">
    <v-app-bar color="indigo lighten-4" app height="37" dense flat>
      <!-- <v-btn small icon>
        <v-icon small>mdi-menu</v-icon>
      </v-btn> -->
      Dashboard
      <v-spacer></v-spacer>
       <v-btn small icon>
        <v-icon small>mdi-arrow-expand-all</v-icon>
      </v-btn>
      <v-btn small icon>
        <v-icon small>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
    elevation
      app
      color="indigo lighten-4"
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
      items: [
        {
          title: "DASHBOARD",
          icon: "mdi-home",
          to: "",
        },
        {
          title: "PROJECTS",
          icon: "mdi-image-filter-center-focus-strong",
          to: "/usr_projects",
        },
        {
          title: "SYSTEMS",
          icon: "mdi-server",
          to: "",
        },
        {
          title: "TASKS",
          icon: "mdi-clipboard-list",
          to: "",
        },
      ],
    };
  },
};
</script>

<style></style>
