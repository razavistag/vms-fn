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

    // if (access[0] != 0) {
    //   next();
    // } else {
    //   next({
    //     path: "/dashboard",
    //   });
    // }
    // if (access[1] != 0) {
    //   next();
    // }
    // else {
    //   next({
    //     path: "/dashboard",
    //   });
    // }

    // access.forEach((element) => {
    //   console.log("access from router serveice", element);
    //   if (access_id === 0) {
    //     next({
    //       path: "/dashboard",
    //     });
    //   } else {
    //     next();
    //   }
    // });
    // let urlget = JSON.parse(localStorage.getItem("token_access_url"));
    // if (urlget.find((i) => i == access_url_id)) {
    //   console.log("%c allow >> ", "color:orange");
    //   next();
    // } else {
    //   console.log("%c NOT allow>>", "color:orange");
    //   next({
    //     path: "/dashboard",
    //   });
    // }
  },
};
