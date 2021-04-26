import VueI18n from "vue-i18n";
import Vue from "vue";
Vue.use(VueI18n);
export default new VueI18n({
  locale: localStorage.getItem("Lang") || "English",
  messages: {
    English: {
      // BUTTONS
      button: {
        refresh: "Refresh",
        displayColumns: "Display Columns",
        addProjects: "Add Projects",
        addUsers: "Add Users",
      },

      // STATUS
      status: {
        onProgress: "on progress",
        onTesting: "on testing",
        onComplete: "on complete",
      },

      // SIDEBAR NAVIGATION
      menu: {
        dashboard: "Dashboard ",
        projects: "Projects",
        systems: "Systems",
        tasks: "Tasks",
        users: "Users",
      },

      // DASHBOARD PAGE
      dashboard: {
        title: "dashboard",
      },

      // PROJECT PAGE
      projects: {
        title: "projects",
        dtHeader: {
          logo: "logo",
          project: "project",
          startingDate: "starting date",
          deadline: "deadline",
          duration: "duration",
          incharge: "incharge",
          version: "version",
          cost: "cost",
          action: "action",
        },
      },

      // USERS PAGE
      users: {
        title: "Users",
      },
    },
    spanish: {},
  },
});
