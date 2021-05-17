import Vue from "vue";
import VueRouter from "vue-router";
import global from "../helpers/global";

import Home from "../views/Home.vue";
import Login from "../views/Login";

import AdminDashboard from "../views/Admin/Dashboard";
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
// const access = JSON.parse(localStorage.getItem("token_access"));
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
      let access = JSON.parse(localStorage.getItem("token_access"));
      if (access[1] != 0) {
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
      let access = JSON.parse(localStorage.getItem("token_access"));
      if (access[2] != 0) {
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
      let access = JSON.parse(localStorage.getItem("token_access"));
      if (access[3] != 0) {
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
      let access = JSON.parse(localStorage.getItem("token_access"));
      if (access[4] != 0) {
        console.log("users allow", true);
        next();
      } else {
        console.log("users refuse", false);
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
