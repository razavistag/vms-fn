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

  routerService(next, login, access_url_id) {
    // IF REMEMBER TRUE NAVIGATE TO DASHBOARD FROM LOGIN
    if ("dashboard") {
      if (localStorage.getItem("Remember") == "true") {
        //console.log("remember true");
        return next({
          path: "/dashboard",
          name: "AdminDashboard",
          component: AdminDashboard,
        });
      } else {
        //console.log("remember false");
        next();
      }
    }

    // IF TOKEN EXSIST NAVIGATE TO DASHBOARD IF NOT RETURN TO LOGIN
    if (login) {
      if (!localStorage.getItem("token")) {
        //console.log("Login");
        return next({
          path: "/login",
          name: "Login",
          component: Login,
        });
      } else {
        next();
      }
    }

    // CHECKING ACCESS URL
    let urlget = JSON.parse(localStorage.getItem("token_access_url"));
    if (urlget.find((i) => i == access_url_id)) {
      //console.log("%c allow >> ", "color:orange");
      next();
    } else {
      //console.log("%c NOT allow>>", "color:orange");
      next({
        path: "/dashboard",
      });
    }
  },


  expandTable(id='') {
      var elem = document.getElementById(id);
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
        //this.dataTableFullscreen = true;
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen(); /* Safari */
        //this.dataTableFullscreen = true;
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen(); /* IE11 */
        //this.dataTableFullscreen = true;
      }
    },
    exitFullScreenDataTable() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        //this.dataTableFullscreen = false;
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen(); /* Safari */
        //this.dataTableFullscreen = false;
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen(); /* IE11 */
        //this.dataTableFullscreen = false;
      }
    },
};
