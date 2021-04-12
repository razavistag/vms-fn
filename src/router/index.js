import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login";

import AdminDashboard from "../views/Admin/Dashboard";
import Project from "../views/Admin/Project";
import System from "../views/Admin/System";
import Task from "../views/Admin/Task";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem("Remember") == 'true') {
        console.log("remember true");
        return next({
          path: "/dashboard",
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
    path: "/dashboard",
    name: "AdminDashboard",
    component: AdminDashboard,
    beforeEnter: (to, from, next) => {
      if (!localStorage.getItem("token")) {
        console.log("token not exsist");
        return next({
          path: "/login",
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
    path: "/projects",
    name: "Project",
    component: Project,
    beforeEnter: (to, from, next) => {
      if (!localStorage.getItem("token")) {
        console.log("token not exsist");
        return next({
          path: "/login",
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
    path: "/systems",
    name: "System",
    component: System,
    beforeEnter: (to, from, next) => {
      if (!localStorage.getItem("token")) {
        console.log("token not exsist");
        return next({
          path: "/login",
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
    path: "/tasks",
    name: "Task",
    component: Task,
    beforeEnter: (to, from, next) => {
      if (!localStorage.getItem("token")) {
        console.log("token not exsist");
        return next({
          path: "/login",
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
