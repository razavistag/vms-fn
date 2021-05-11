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
      global.routerService(next, "dashboard");
    },
  },
  {
    path: "/dashboard",
    name: "AdminDashboard",
    component: AdminDashboard,
    beforeEnter: (to, from, next) => {
      global.routerService(next, "login", 0);
    },
  },
  {
    path: "/projects",
    name: "Project",
    component: Project,
    beforeEnter: (to, from, next) => {
      global.routerService(next, "login", 1);
    },
  },
  {
    path: "/systems",
    name: "System",
    component: System,
    beforeEnter: (to, from, next) => {
      global.routerService(next, "login", 2);
    },
  },
  {
    path: "/tasks",
    name: "Task",
    component: Task,
    beforeEnter: (to, from, next) => {
      global.routerService(next, "login", 3);
    },
  },
  {
    path: "/users",
    name: "User",
    component: User,
    beforeEnter: (to, from, next) => {
      global.routerService(next, "login", 4);
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
