import Vue from "vue";
import VueRouter from "vue-router";
import { fb } from "../firebase";
import Home from "../views/Home.vue";

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
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/create",
    name: "Create Task",
    meta: { requiresAuth: true },
    component: () => import("../views/CreateTask.vue"),
  },
  {
    path: "/edit/:taskToken",
    name: "Edit Task",
    meta: { requiresAuth: true },
    props: true,
    component: () => import("../views/EditTask.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((x) => x.meta.requiresAuth);
  const currentUser = fb.auth().currentUser;

  if (requiresAuth && !currentUser) {
    next("/login");
  } else if (requiresAuth && currentUser) {
    next();
  } else {
    next();
  }
});

export default router;
