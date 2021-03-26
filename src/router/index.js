import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login";

import AdminDashboard from "../views/Admin/Dashboard";
import Project from "../views/Admin/Project";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/system_login",
    name: "Login",
    component: Login,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem("Remember") == 'true') {
        console.log("remember true");
        return next({
          path: "/usr_dashboard",
          name: "AdminDashboard",
          component: AdminDashboard,
        });
      } else {
        console.log("remember false");

        next();
      }
    },
  },

  {
    path: "/usr_dashboard",
    name: "AdminDashboard",
    component: AdminDashboard,
    beforeEnter: (to, from, next) => {
      if (!localStorage.getItem("token")) {
        console.log("token not exsist");
        return next({
          path: "/system_login",
          name: "Login",
          component: Login,
        });
      } else {
        console.log("token exsist");

        next();
      }
    },
  }, 
  {
    path: "/usr_projects",
    name: "Project",
    component: Project,
    beforeEnter: (to, from, next) => {
      if (!localStorage.getItem("token")) {
        console.log("token not exsist");
        return next({
          path: "/system_login",
          name: "Login",
          component: Login,
        });
      } else {
        console.log("token exsist");

        next();
      }
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
