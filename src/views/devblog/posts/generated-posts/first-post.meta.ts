import { Post } from "@/types";
import { markRaw } from "vue";
import PostContent from "./first-post.vue";

const post: Post = markRaw({
  key: "first-post",
  title: "This is a big title wow",
  subtitle:
    "a subtitle thats a bit longer but somethng we can continue tot alk about",
  mainImage: "about/python.png",
  component: PostContent,
  date: new Date("Wed Sep 28 2022 00:43:20 GMT-0400 (Eastern Daylight Time)")
});

export default post;
