import Vue from "vue";
import VueRouter from "vue-router";
import global from "../helpers/global";

import Home from "../views/Home.vue";
import Login from "../views/Login";
import Register from "../views/Register";

import AdminDashboard from "../views/Admin/Dashboard";
import po from "../views/Admin/Po.vue";
import Project from "../views/Admin/Project";
import System from "../views/Admin/System";
import Task from "../views/Admin/Task";
import User from "../views/Admin/User";

Vue.use(VueRouter);
// modules   are indexed
// 0 - dashboard
// 1 - project
// 2 - system
// 3 - task
// 4 - user
// 5 - po
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
    meta: { autoNavigate: true },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { autoNavigate: false },
  },
  {
    path: "/dashboard",
    name: "AdminDashboard",
    component: AdminDashboard,
    meta: { AuthRequired: true },
  },
  {
    path: "/projects",
    name: "Project",
    component: Project,
    meta: { AuthRequired: true },
    beforeEnter: (to, from, next) => {
      let auth = global.AccessCheck("project");
      if (auth == 1) {
        next();
      } else {
        next({
          path: "/dashboard",
        });
      }
    },
  },
  {
    path: "/systems",
    name: "System",
    component: System,
    meta: { AuthRequired: true },
    beforeEnter: (to, from, next) => {
      let auth = global.AccessCheck("systems");
      if (auth == 1) {
        next();
      } else {
        next({
          path: "/dashboard",
        });
      }
    },
  },
  {
    path: "/tasks",
    name: "Task",
    component: Task,
    meta: { AuthRequired: true },
    beforeEnter: (to, from, next) => {
      let auth = global.AccessCheck("tasks");
      if (auth == 1) {
        next();
      } else {
        next({
          path: "/dashboard",
        });
      }
    },
  },
  {
    path: "/users",
    name: "User",
    component: User,
    meta: { AuthRequired: true },
    beforeEnter: (to, from, next) => {
      let auth = global.AccessCheck("users");
      if (auth == 1) {
        next();
      } else {
        next({
          path: "/dashboard",
        });
      }
    },
  },
  {
    path: "/po",
    name: "po",
    component: po,
    meta: { AuthRequired: true },
    beforeEnter: (to, from, next) => {
      let auth = global.AccessCheck("po");
      if (auth == 1) {
        next();
      } else {
        next({
          path: "/dashboard",
        });
      }
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  // Login into DASHBOARD automatically
  if (to.meta.autoNavigate) {
    if (localStorage.getItem("token")) {
      next({
        path: "/dashboard",
      });
    } else {
      next();
    }
  }

  // if token not exsist on any route it will redirect to login
  if (to.meta.AuthRequired) {
    if (!localStorage.getItem("token")) {
      next({
        path: "/login",
      });
    } else {
      next();
    }
  } else {
    console.log("auth required", false);
    next();
  }
});

export default router;
