import { Post } from "@/types";
import { markRaw } from "vue";
import PostContent from "./second-post.vue";

const post: Post = markRaw({
  key: "second-post",
  title: "this is a second post",
  subtitle: "asdasdsads",
  mainImage: "about/python.png",
  date: new Date("Wed Sep 28 2022 22:35:24 GMT-0400 (Eastern Daylight Time)"),
  component: PostContent
});

export default post;
