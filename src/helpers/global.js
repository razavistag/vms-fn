import Vue from "vue";
import VueRouter from "vue-router";

import Home from "../views/Home.vue";
import Login from "../views/Login";

import AdminDashboard from "../views/Admin/Dashboard";
import Project from "../views/Admin/Project";
import System from "../views/Admin/System";
import Task from "../views/Admin/Task";

Vue.use(VueRouter);
export default {
  projectURL: {
    store: "projects/",
  },

  routerService(next, login, access_id) {
    // CHECKING ACCESS URL
    let access = JSON.parse(localStorage.getItem("token_access"));
  },
};
