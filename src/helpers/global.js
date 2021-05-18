import Vue from "vue";
import VueRouter from "vue-router";
import router from "../router/index";

Vue.use(VueRouter);
export default {
  projectURL: {
    store: "projects/",
  },

  Unauthorized(status) {
    if (status === 401) {
      localStorage.removeItem("token");
      router.push({ path: "/login" });
    }
    return status;
  },

  AccessCheck(i) {
    let access = JSON.parse(localStorage.getItem("token_access"));
    if (i == "project") {
      if (access[1] != 0) {
        return 1;
      } else {
        return 0;
      }
    }

    if (i == "systems") {
      if (access[2] != 0) {
        return 1;
      } else {
        return 0;
      }
    }

    if (i == "tasks") {
      if (access[3] != 0) {
        return 1;
      } else {
        return 0;
      }
    }

    if (i == "users") {
      if (access[4] != 0) {
        return 1;
      } else {
        return 0;
      }
    }

    return 567;
  },
};
