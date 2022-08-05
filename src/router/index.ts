import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/home/index.vue";
import Devblog from "../views/devblog/index.vue";
import Posts from "@/views/devblog/posts/index";
import { Post } from "@/types";
import PostComponent from "../views/devblog/components/post.vue";

// Dynamically creates routes based on post keys
const devblogPaths: Array<RouteRecordRaw> = Posts.map((post: Post) => {
  return {
    path: post.key,
    name: post.key,
    component: PostComponent,
    props: { post }
  };
});
const defaultDevBlogPost = devblogPaths[0];

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/devblog",
    name: "devblog",
    redirect: `/devblog/${defaultDevBlogPost.path}`,
    component: Devblog,
    children: devblogPaths
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
