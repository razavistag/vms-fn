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
        addSystems: "Add Systems",
        addUsers: "Add Users",
        addpo: "Add PO",
        addTask: "Add Task",
        addOrder: "Add Order",
        addAccounts: "Add Accounts",
        addLocation: "Add Location",
      },

      // STATUS
      status: {
        onProgress: "on progress",
        onTesting: "on testing",
        onComplete: "on complete",
      },

      // SIDEBAR NAVIGATION
      menu: {
        dashboard: "DASHBOARD",
        projects: "PROJECTS",
        systems: "SYSTEMS",
        tasks: "TASKS",
        users: "USERS",
        po: "PO",
        order: "ORDER",
        account: "ACCOUNTS",
        holiday: "HOLIDAYS",
        location: "LOCATION",
        recurring: "RECURRING",
      },

      // DASHBOARD PAGE
      dashboard: {
        title: "Dashboard",
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

      // SYSTEM PAGE
      systems: {
        title: "Systems",
        dtHeader: {
          logo: "logo",
          project: "proyecto",
          startingDate: "fecha de inicio",
          deadline: "plazo",
          duration: "duración",
          incharge: "en cargo",
          version: "versión",
          cost: "costo",
          action: "acción",
        },
      },

      //  TASK PAGE
      task: {
        title: "Tasks",
      },

      // USERS PAGE
      users: {
        title: "Users",
      },

      // PO PAGE
      po: {
        title: "PO ",
      },

      // ORDER PAGE
      order: {
        title: "ORDER ",
      },

      // ACCOUNT PAGE
      account: {
        title: "ACCOUNTS",
      },

      // HOLIDAY PAGE
      holiday: {
        title: "HOLIDAYS",
      },

      // LOCATION PAGE
      location: {
        title: "LOCATION",
      },

      // RECURRING PAGE
      recurring: {
        title: "RECURRING",
      },
    },

    spanish: {},
  },
});
