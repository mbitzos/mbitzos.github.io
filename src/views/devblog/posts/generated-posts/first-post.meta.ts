import { Post } from "@/types";
import { markRaw } from "vue";
import PostContent from "./first-post.vue";

const post: Post = markRaw({
  title: "This is a big title wow",
  date: new Date("2022-09-29T02:18:12.047Z"),
  tags: ["soemthing", "else", "test-sad"],
  component: PostContent,
  key: "first-post"
});

export default post;
