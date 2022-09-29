import { Post } from "@/types";
import { markRaw } from "vue";
import PostContent from "./second-post.vue";

const post: Post = markRaw({
  title: "this is a second post",
  subtitle: "asdasdsads",
  mainImage: "about/python.png",
  date: new Date("2022-09-29T02:35:24.347Z"),
  component: PostContent,
  key: "second-post"
});

export default post;
