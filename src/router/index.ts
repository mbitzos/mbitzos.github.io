import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/home/index.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/:pathMatch(.*)",
    name: "redirect",
    redirect: { name: "home" }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
