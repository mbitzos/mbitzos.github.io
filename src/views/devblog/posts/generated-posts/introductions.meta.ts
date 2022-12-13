import { Post } from "@/types";
import { markRaw } from "vue";
import PostContent from "./introductions.vue";

const post: Post = markRaw({
  title: "Introduction to my devblog",
  description:
    "Welcome to my blog where I will be writing tutorials and posts about my experiences creating games with my team as the main programmer.",
  tags: ["misc"],
  date: new Date("2022-10-10T16:42:08.476Z"),
  component: PostContent,
  key: "introductions"
});

export default post;
